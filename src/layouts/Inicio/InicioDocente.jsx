import { MdDashboard, MdSearch, MdFileDownload, MdSave, MdCalculate, MdCheckCircle, MdAssignmentInd, MdShowChart, MdPeople } from "react-icons/md";


import { useState, useEffect, useMemo } from "react";
import axios from "../../axios";
import { toast } from "react-hot-toast";
import {
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    Input,
    Button,
    Skeleton,
    Spinner,
    Pagination,
    Card,
    CardBody,
    CardHeader,
    Progress,
    User,
    Tooltip,
    useDisclosure
} from "@heroui/react";
import CVScoreCalculatorModal from "../../components/Modals/CVScoreCalculatorModal";
import useProgramaDocente from "../../data/Evaluacion/dataProgramaDocente";
import { useDocente } from "../../services/UserContextDocente";
import { admissionConfig } from "../../config/admission";


function InicioDocente() {
    const { docenteData } = useDocente();
    const docenteType = docenteData?.tipo || 'cv';
    const isEntrevista = docenteType === 'entrevista';
    // Estados de Paginación y Datos
    const [pageProgramas, setPageProgramas] = useState(1);
    const [pagePostulantes, setPagePostulantes] = useState(1);
    // Cambiar las constantes fijas por estados
    const [programasPorPagina, setProgramasPorPagina] = useState(5);
    const [postulantesPorPagina, setPostulantesPorPagina] = useState(5);

    // Estados de Lógica
    const [notas, setNotas] = useState({});
    const { programaDocente, loading, fetchProgramaDocente } = useProgramaDocente();
    const [fotos, setFotos] = useState({});
    const [loadingExport, setLoadingExport] = useState(false);
    const [postulantes, setPostulantes] = useState([]);
    const [programaSeleccionado, setProgramaSeleccionado] = useState(null);
    const [loadingPostulantes, setLoadingPostulantes] = useState(false);

    // Estado paraCalculadora de CV
    const { isOpen: isCalcOpen, onOpen: onCalcOpen, onClose: onCalcClose } = useDisclosure();
    const [currentCalcId, setCurrentCalcId] = useState(null);

    const handleOpenCalc = (id) => {
        setCurrentCalcId(id);
        onCalcOpen();
    };

    const handleApplyCalc = async (total) => {
        if (currentCalcId) {
            // Asegurar 1 decimal y punto decimal
            const notaFormateada = total.toFixed(1);
            handleNotaChange(currentCalcId, notaFormateada);
            // Guardado automático directo
            await guardarNota(currentCalcId, notaFormateada);
        }
    };






    // Buscadores
    const [searchQuery, setSearchQuery] = useState("");
    const [searchQueryPostulante, setSearchQueryPostulante] = useState("");

    // Resetear página de programas al buscar
    useEffect(() => {
        setPageProgramas(1);
    }, [searchQuery]);

    // Resetear página de postulantes al buscar
    useEffect(() => {
        setPagePostulantes(1);
    }, [searchQueryPostulante]);

    // Ajuste responsivo del número de filas
    useEffect(() => {
        const actualizarCapacidad = () => {
            // Ajustes dinámicos de densidad según el total de la pantalla
            const alto = window.innerHeight;

            // Lógica basada en resolución real para evitar scroll innecesario
            if (alto > 1000) {
                setPostulantesPorPagina(15); // Monitor grande (2xl)
            } else if (alto > 850) {
                setPostulantesPorPagina(10); // Laptop amplia
            } else if (alto > 700) {
                setPostulantesPorPagina(7); // Laptop estándar
            } else {
                setPostulantesPorPagina(5);  // Pantallas compactas
            }

            if (alto > 850) {
                setProgramasPorPagina(8); // Monitor grande
            } else {
                setProgramasPorPagina(5); // Laptop
            }
        };

        actualizarCapacidad();
        window.addEventListener('resize', actualizarCapacidad);
        return () => window.removeEventListener('resize', actualizarCapacidad);
    }, [isEntrevista]);

    // --- LÓGICA DE FILTRADO (Optimizada) ---
    const programasFiltrados = useMemo(() => {
        return programaDocente.filter(p =>
            p.nombre_grado.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.nombre_programa.toLowerCase().includes(searchQuery.toLowerCase())
        ).sort((a, b) => {
            const gradoCompare = a.nombre_grado.localeCompare(b.nombre_grado);
            if (gradoCompare !== 0) return gradoCompare;
            return a.nombre_programa.localeCompare(b.nombre_programa);
        });
    }, [programaDocente, searchQuery]);

    const postulantesFiltrados = useMemo(() => {
        return postulantes.filter(p =>
            `${p.nombres} ${p.ap_paterno} ${p.ap_materno}`.toLowerCase().includes(searchQueryPostulante.toLowerCase()) ||
            p.num_iden.includes(searchQueryPostulante)
        );
    }, [postulantes, searchQueryPostulante]);

    const programaActual = useMemo(() => {
        return programaDocente.find(p => p.id_programa === programaSeleccionado);
    }, [programaDocente, programaSeleccionado]);


    // --- ESTADÍSTICAS DEL PROGRAMA (Para modo Entrevista) ---
    const stats = useMemo(() => {
        if (!programaActual) return { total: 0, conNota: 0, sinNota: 0, porcentaje: 0 };
        const total = (programaActual.con_nota || 0) + (programaActual.sin_nota || 0);
        return {
            total,
            conNota: programaActual.con_nota || 0,
            sinNota: programaActual.sin_nota || 0,
            porcentaje: total === 0 ? 0 : Math.round((programaActual.con_nota / total) * 100)
        };
    }, [programaActual]);

    const maxNota = isEntrevista ? 35 : 20;

    // --- EFECTOS ---
    useEffect(() => {
        if (programasFiltrados.length > 0 && !programaSeleccionado) {
            handleSeleccionarPrograma(programasFiltrados[0].id_programa);
        }
    }, [programasFiltrados, programaSeleccionado]);

    // --- FUNCIONES ---
    const handleSeleccionarPrograma = (programa_id) => {
        setProgramaSeleccionado(programa_id);
        setPagePostulantes(1);
        obtenerPostulantes(programa_id);
    };

    const obtenerPostulantes = async (id) => {
        setLoadingPostulantes(true);
        if (!id) return;
        try {
            const res = await axios.get(`/postulantes-programa/${id}`);
            const data = res.data.data;
            const postulantesMapeados = data.map(item => item.postulante);

            // Ordenar alfabéticamente de forma estricta por Apellidos y Nombres (limpiando espacios)
            postulantesMapeados.sort((a, b) => {
                const cleanName = (p) => `${p.ap_paterno || ''} ${p.ap_materno || ''} ${p.nombres || ''}`.replace(/\s+/g, ' ').trim().toLowerCase();
                return cleanName(a).localeCompare(cleanName(b), 'es', { sensitivity: 'base' });
            });

            setPostulantes(postulantesMapeados);

            // Mapear notas y fotos
            const notasInit = {};
            const fotosInit = {};

            data.forEach(({ postulante, notaValue, foto }) => {
                // Formatear a 1 decimal al cargar si existe valor
                const notaNum = parseFloat(notaValue);
                notasInit[postulante.id] = (!isNaN(notaNum)) ? notaNum.toFixed(1) : "";
                fotosInit[postulante.id] = foto ?? "";
            });


            setNotas(notasInit);
            setFotos(fotosInit);
        } catch (error) {
            toast.error("Error al cargar postulantes");
        } finally {
            setLoadingPostulantes(false);
        }
    };

    const handleNotaChange = (id, valor) => {
        setNotas(prev => ({ ...prev, [id]: valor }));
    };

    const guardarNota = async (postulante_id, valor_manual = null) => {
        // Si viene de la calculadora (valor_manual), usamos ese. Si no, del estado.
        const notaRaw = valor_manual !== null ? valor_manual : notas[postulante_id];
        const nota = parseFloat(notaRaw);

        if (isNaN(nota)) {
            return toast.error("Ingresa una nota válida");
        }


        if (nota < 0 || nota > maxNota) {
            return toast.error(`La nota debe estar entre 0 y ${maxNota}`);
        }
        try {
            // Asegurar 1 decimal y punto decimal
            const notaFinal = nota.toFixed(1);
            await axios.post("/registrar-nota", {
                postulante_id,
                notaValue: notaFinal,
            });
            // Actualizamos el estado local con el formato correcto también
            handleNotaChange(postulante_id, notaFinal);


            fetchProgramaDocente(); // Actualizar contadores del sidebar
            toast.success("Nota guardada");


            // Quitar el foco de cualquier input activo para una experiencia más limpia
            if (document.activeElement instanceof HTMLElement) {
                document.activeElement.blur();
            }
        } catch (error) {
            const message = error.response?.data?.message || "No se pudo guardar";
            toast.error(message);
        }


    };

    // Función genérica para exportar
    const manejarExportacion = async (url, payload = null, metodo = 'get') => {
        setLoadingExport(true);
        try {
            const config = { responseType: "blob", withCredentials: true };
            const res = metodo === 'post'
                ? await axios.post(url, payload, config)
                : await axios.get(url, config);

            if (res.status === 200) {
                const link = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
                window.open(link, "_blank");
            }
        } catch (error) {
            toast.error("Error al generar reporte");
        } finally {
            setLoadingExport(false);
        }
    };

    return (
        <div className="w-full bg-gray-50 h-full flex flex-col lg:overflow-hidden overflow-x-hidden">


            {/* Overlay de carga para exportación */}
            {loadingExport && (
                <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/50 z-50 backdrop-blur-sm">
                    <Spinner size="lg" color="white" aria-label="Generando reporte" />
                    <p className="text-white mt-4 font-semibold">Generando reporte...</p>
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-center gap-1 px-4 lg:px-6 mb-1 shrink-0">
                <div className="animate-in fade-in slide-in-from-left duration-700 flex items-center gap-3">
                    <div className="p-1.5 lg:p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-200">
                        <MdDashboard size={20} className="text-white lg:size-[22px]" />
                    </div>
                    <div>
                        <h1 className="text-lg lg:text-2xl font-black text-slate-800 tracking-tight leading-none select-text">
                            Evaluación de {isEntrevista ? 'Entrevista' : 'Expediente'}  |  Admisión {admissionConfig.cronograma.periodo}
                        </h1>

                    </div>
                </div>

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 lg:overflow-hidden px-4 pb-2 mt-0">
                {/* Dashboard Lateral de Estadísticas (Perfect Fit Architecture) */}
                {isEntrevista && (
                    <div className="lg:col-span-3 h-full flex flex-col gap-3 shrink-0 animate-in fade-in slide-in-from-left duration-700 pr-1 pb-2">

                        {/* Selector Móvil de Programa */}
                        <div className="lg:hidden w-full mb-2">
                            <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Programa Evaluado</p>
                                <p className="font-extrabold text-blue-700 text-sm">
                                    {programaActual?.nombre_grado} <span className="text-slate-500 font-medium">en {programaActual?.nombre_programa}</span>
                                </p>
                            </div>
                        </div>

                        {loading || !programaSeleccionado ? (
                            <div className="flex flex-col h-full bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
                                {/* Skeleton Cabecera */}
                                <div className="shrink-0 bg-slate-50 px-6 py-5 lg:px-8 lg:py-6 relative overflow-hidden border-b border-slate-100">
                                    <div className="flex flex-col gap-3">
                                        <Skeleton className="h-3 w-1/4 rounded-full" />
                                        <Skeleton className="h-8 lg:h-10 w-3/4 rounded-lg" />
                                        <Skeleton className="h-4 w-1/2 rounded-md mt-1" />
                                    </div>
                                </div>

                                {/* Skeleton Métricas */}
                                <div className="flex-1 px-6 py-6 lg:px-8 bg-slate-50 border-t border-slate-100 flex flex-col justify-center gap-4">
                                    <Skeleton className="h-20 lg:h-24 w-full rounded-2xl" />
                                    <Skeleton className="h-20 lg:h-24 w-full rounded-2xl" />
                                </div>

                                {/* Skeleton Footer */}
                                <div className="shrink-0 px-6 py-5 lg:px-8 bg-white border-t border-slate-200">
                                    <div className="flex justify-between items-end mb-3">
                                        <div className="flex flex-col gap-2 w-1/3">
                                            <Skeleton className="h-4 w-full rounded-md" />
                                            <Skeleton className="h-3 w-2/3 rounded-md" />
                                        </div>
                                        <Skeleton className="h-8 w-16 rounded-lg" />
                                    </div>
                                    <Skeleton className="h-3 w-full rounded-full" />
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col h-full bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
                                {/* CABECERA PROGRAMA */}
                                <div className="shrink-0 bg-slate-900 px-6 py-5 lg:px-8 lg:py-6 relative overflow-hidden">
                                    <div className="relative z-10 flex flex-col gap-1">
                                        <h2 className="text-xl lg:text-3xl font-black text-white leading-tight uppercase select-text">
                                            {programaActual?.nombre_grado}
                                        </h2>
                                        <p className="text-xs lg:text-sm font-semibold text-slate-300 uppercase tracking-wide mt-1 select-text">
                                            {programaActual?.nombre_programa}
                                        </p>
                                    </div>
                                </div>

                                {/* MÉTRICAS CENTRALES */}
                                <div className="flex-1 overflow-y-auto px-6 py-6 lg:px-8 bg-slate-50 flex border-t border-slate-100 flex-col justify-center">
                                    <div className="flex flex-col gap-4 w-full">
                                        {[
                                            {
                                                label: 'EVALUADOS',
                                                value: stats.conNota,
                                                icon: MdCheckCircle,
                                                color: 'emerald'
                                            },
                                            {
                                                label: 'PENDIENTES',
                                                value: stats.sinNota,
                                                icon: MdAssignmentInd,
                                                color: 'amber'
                                            }
                                        ].map((stat, i) => (
                                            <div
                                                key={i}
                                                className="flex items-center justify-between p-4 lg:p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`p-3 rounded-xl bg-${stat.color}-100 text-${stat.color}-600 group-hover:scale-105 transition-transform`}>
                                                        <stat.icon className="text-2xl" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className={`text-xs lg:text-sm font-bold text-${stat.color}-700 tracking-wide uppercase`}>
                                                            {stat.label}
                                                        </span>
                                                        <span className="text-[10px] font-medium text-slate-400 uppercase">
                                                            Postulantes
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="text-right">
                                                    <span className="text-3xl lg:text-4xl 2xl:text-5xl font-black text-slate-800 tabular-nums tracking-tight">
                                                        {stat.value}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* FOOTER DE AVANCE */}
                                <div className="shrink-0 px-6 py-5 lg:px-8 bg-white border-t border-slate-200">
                                    <div className="flex justify-between items-end mb-3">
                                        <div>
                                            <span className="block text-xs font-bold text-blue-600 uppercase tracking-wider">Avance Global</span>
                                            <span className="text-[10px] font-medium text-slate-500 uppercase">Progreso Total</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-3xl font-black text-blue-700 tracking-tight leading-none">
                                                {stats.porcentaje}<span className="text-base text-blue-400 ml-0.5">%</span>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                                        <div
                                            style={{ width: `${stats.porcentaje}%` }}
                                            className={`h-full transition-all duration-700 ease-out flex items-center justify-end ${stats.porcentaje === 100 ? 'bg-emerald-500' : 'bg-blue-600'
                                                }`}
                                        />
                                    </div>
                                </div>
                            </div>

                        )}
                    </div>
                )}





                {/* --- SIDEBAR: LISTA DE PROGRAMAS (Solo si NO es entrevista) --- */}
                {!isEntrevista && (
                    <div className="lg:col-span-4 xl:col-span-4 2xl:col-span-4 flex flex-col h-auto lg:h-full lg:overflow-hidden">

                        <Card className="shadow-sm border-none bg-white flex-1 flex flex-col">
                            <CardBody className="p-4 flex-1 overflow-y-auto flex flex-col">
                                <div className="shrink-0">
                                    <Input
                                        startContent={<MdSearch className="text-gray-400" />}
                                        placeholder="Buscar programa..."
                                        aria-label="Buscar programa"
                                        size="sm"
                                        value={searchQuery}
                                        onValueChange={setSearchQuery}
                                        isClearable
                                        className="mb-4"
                                    />
                                </div>

                                <div className="flex flex-col gap-3 flex-1 overflow-y-auto min-h-0">
                                    {loading ? (
                                        <>
                                            <Skeleton className="h-24 w-full rounded-xl" />
                                            <Skeleton className="h-24 w-full rounded-xl" />
                                            <Skeleton className="h-24 w-full rounded-xl" />
                                            <Skeleton className="h-24 w-full rounded-xl" />
                                            <Skeleton className="h-24 w-full rounded-xl" />
                                        </>
                                    ) : (
                                        programasFiltrados
                                            .slice((pageProgramas - 1) * programasPorPagina, pageProgramas * programasPorPagina)
                                            .map((prog) => {
                                                const total = prog.con_nota + prog.sin_nota;
                                                const porcentaje = total === 0 ? 0 : (prog.con_nota / total) * 100;
                                                const isSelected = programaSeleccionado === prog.id_programa;

                                                return (
                                                    <div
                                                        key={prog.id_programa}
                                                        onClick={() => handleSeleccionarPrograma(prog.id_programa)}
                                                        className={`p-3 rounded-lg cursor-pointer transition-all border-l-4 ${isSelected
                                                            ? "bg-blue-50 border-blue-600 shadow-sm"
                                                            : "bg-white border-transparent hover:bg-gray-50"
                                                            }`}
                                                    >
                                                        <div className="mb-2">
                                                            <Tooltip content={`${prog.nombre_grado.charAt(0).toUpperCase() + prog.nombre_grado.slice(1).toLowerCase()} en ${prog.nombre_programa}`}>
                                                                <div className="line-clamp-1">
                                                                    <span className={`text-md font-semibold ${isSelected ? 'text-blue-800' : 'text-gray-800'}`}>
                                                                        {prog.nombre_grado.charAt(0).toUpperCase() + prog.nombre_grado.slice(1).toLowerCase()}
                                                                    </span>
                                                                    <span className="text-md text-gray-500 ml-1">
                                                                        en {prog.nombre_programa}
                                                                    </span>
                                                                </div>
                                                            </Tooltip>
                                                        </div>

                                                        {/* Barra de Progreso Mini (Comprimida) */}
                                                        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                                                            <span className="font-medium">Progreso</span>
                                                            <span>{prog.con_nota}/{total} ({Math.round(porcentaje)}%)</span>
                                                        </div>
                                                        <Progress
                                                            size="sm"
                                                            aria-label="Barra de progreso"
                                                            value={porcentaje}
                                                            color={porcentaje === 100 ? "success" : "primary"}
                                                            className="max-w-full"
                                                        />
                                                    </div>
                                                );
                                            })
                                    )}

                                    {!loading && programasFiltrados.length === 0 && (
                                        <p className="text-center text-gray-400 text-sm py-4">No se encontraron programas</p>
                                    )}
                                </div>

                                <div className="pt-2 flex justify-center shrink-0">
                                    <Pagination
                                        total={Math.max(1, Math.ceil(programasFiltrados.length / programasPorPagina))}
                                        page={pageProgramas}
                                        onChange={setPageProgramas}
                                        color="primary"
                                        aria-label="Paginación de programas"
                                    />
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                )}

                <div className={`${isEntrevista ? 'lg:col-span-9' : 'lg:col-span-8 xl:col-span-8 2xl:col-span-8'} h-auto lg:h-full lg:overflow-hidden flex flex-col animate-in fade-in slide-in-from-right duration-1000`}>

                    <Card className="shadow-2xl shadow-slate-200/50 border-none flex-1 bg-white flex flex-col overflow-hidden rounded-[2.5rem]">
                        <CardBody className="p-0 flex flex-col h-full overflow-hidden">
                            {/* Header del Panel - OPACO Y COMPACTO */}
                            <div className="p-3 border-b border-slate-100 bg-white sticky top-0 z-30">
                                <div className="flex items-center justify-start">

                                    {programaSeleccionado && (
                                        <div className="flex items-center justify-between w-full gap-4">
                                            <div className="relative group flex-1 max-w-md">
                                                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors z-10">
                                                    <MdSearch size={22} />
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="Buscar postulante..."
                                                    className="pl-12 pr-4 py-2 bg-slate-50 border-2 border-transparent rounded-xl text-sm focus:bg-white focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/10 w-full transition-all outline-none font-semibold text-slate-600 placeholder:text-slate-400/70"
                                                    value={searchQueryPostulante}
                                                    onChange={(e) => setSearchQueryPostulante(e.target.value)}
                                                />
                                            </div>

                                            <div className="flex items-center gap-2">
                                                {!isEntrevista && (
                                                    <Tooltip content="Descargar Formato de Notas" placement="bottom">
                                                        <Button
                                                            isIconOnly
                                                            radius="xl"
                                                            variant="flat"
                                                            size="md"
                                                            className="bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm"
                                                            onPress={() => {
                                                                const url = isEntrevista ? `/postulantes-notasEntrevista/${programaSeleccionado}` : `/postulantes-notasCV/${programaSeleccionado}`;
                                                                manejarExportacion(url);
                                                            }}
                                                        >
                                                            <MdFileDownload size={20} />
                                                        </Button>
                                                    </Tooltip>
                                                )}

                                                <Button
                                                    color="primary"
                                                    variant="flat"
                                                    size="md"
                                                    className="h-10 px-6 rounded-xl font-black bg-blue-600 text-white shadow-lg shadow-blue-200 border-none text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
                                                    startContent={<MdFileDownload size={18} />}
                                                    onPress={() => {
                                                        const ids = programasFiltrados.map(p => p.id_programa);
                                                        if (ids.length) {
                                                            const url = isEntrevista ? "/postulantes-notasEntrevista-multiple" : "/postulantes-notasCV-multiple";
                                                            manejarExportacion(url, { ids }, 'post');
                                                        } else {
                                                            toast.error("No hay programas disponibles");
                                                        }
                                                    }}
                                                >
                                                    Reporte General
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                </div>
                            </div>


                            {/* Área de Tabla - MAXIMIZADA */}
                            <div className={`flex-1 min-h-0 w-full overflow-hidden flex flex-col bg-white rounded-3xl border border-slate-100 shadow-sm transition-all duration-500 ${isEntrevista ? 'lg:col-span-9' : 'lg:col-span-8'}`}>


                                {loading || loadingPostulantes ? (
                                    <div className="flex flex-col h-full overflow-hidden">
                                        {/* Header del Skeleton Fijo */}
                                        <div className="grid grid-cols-[50px_1fr_100px_80px] lg:grid-cols-[70px_2fr_1fr_100px] gap-2 lg:gap-4 px-4 lg:px-6 h-12 items-center bg-slate-50 border-b border-slate-100 shrink-0">
                                            <Skeleton className="h-3 w-6 lg:w-8 rounded-lg opacity-40 mx-auto" />
                                            <Skeleton className="h-3 w-32 rounded-lg opacity-40" />
                                            <Skeleton className="h-3 w-24 lg:w-40 rounded-lg opacity-40 mx-auto" />
                                            <Skeleton className="h-3 w-12 lg:w-16 rounded-lg opacity-40 mx-auto" />
                                        </div>

                                        {/* Filas del Skeleton */}
                                        <div className="flex-1 overflow-hidden">
                                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                                                <div key={i} className="grid grid-cols-[50px_1fr_100px_80px] lg:grid-cols-[70px_2fr_1fr_100px] gap-2 lg:gap-4 px-4 lg:px-6 h-[64px] items-center border-b border-slate-50">
                                                    <div className="flex justify-center"><Skeleton className="h-4 w-4 rounded" /></div>
                                                    <div className="flex gap-3 lg:gap-4 items-center min-w-0">
                                                        <Skeleton className="h-8 w-8 lg:h-10 lg:w-10 rounded-xl shrink-0" />
                                                        <div className="space-y-2 w-full min-w-0">
                                                            <Skeleton className="h-2.5 lg:h-3 w-3/4 rounded-lg" />
                                                            <Skeleton className="h-2 w-1/3 rounded-lg opacity-60" />
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-center">
                                                        <Skeleton className="h-6 w-16 lg:h-8 lg:w-24 rounded-xl" />
                                                    </div>
                                                    <div className="flex justify-center">
                                                        <Skeleton className="h-8 w-8 rounded-xl" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>


                                ) : !programaSeleccionado ? (
                                    <div className="flex flex-col items-center justify-center h-full text-slate-300 p-10 bg-slate-50/30">
                                        <div className="p-6 bg-white rounded-full shadow-xl shadow-slate-200/50 mb-4">
                                            <MdDashboard size={48} className="opacity-40 text-blue-500" />
                                        </div>
                                        <p className="font-black uppercase tracking-widest text-[11px]">Selecciona un programa para comenzar</p>
                                    </div>
                                ) : (
                                    <div className="flex-1 overflow-y-auto custom-scrollbar-thin bg-white relative [scrollbar-gutter:stable] min-h-0">
                                        <table className="w-full text-left border-separate border-spacing-0 min-w-full">
                                            <thead className="sticky top-0 z-20 shadow-sm bg-slate-50">
                                                <tr>
                                                    <th className="px-4 align-middle text-center text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] h-12 border-b border-slate-200 w-16 hidden sm:table-cell first:rounded-tl-[2rem]">N°</th>
                                                    <th className="px-4 align-middle text-left text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] h-12 border-b border-slate-200">POSTULANTE</th>
                                                    <th className="px-4 align-middle text-center text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] h-12 border-b border-slate-200 w-48 lg:w-64">{isEntrevista ? "NOTA ENTREVISTA" : "NOTA CV (máx " + maxNota + ")"}</th>
                                                    <th className="px-4 align-middle text-center text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] h-12 border-b border-slate-200 w-24 last:rounded-tr-[2rem]">ACCIONES</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {postulantesFiltrados.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={4} className="h-32 text-center text-slate-500 font-medium text-sm">
                                                            No hay postulantes encontrados.
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    postulantesFiltrados
                                                        .slice((pagePostulantes - 1) * postulantesPorPagina, pagePostulantes * postulantesPorPagina)
                                                        .map((postulante) => (
                                                            <tr key={postulante.id} className="group hover:bg-blue-50 transition-all duration-300 h-[64px]">
                                                                <td className="px-4 align-middle text-center hidden sm:table-cell font-bold text-slate-400 tabular-nums border-b border-slate-100/50 border-l-4 border-l-transparent group-hover:border-l-blue-600">
                                                                    {postulantes.findIndex(p => p.id === postulante.id) + 1}
                                                                </td>
                                                                <td className="px-4 py-2 align-middle border-b border-slate-100/50">
                                                                    <User
                                                                        name={
                                                                            <span className="font-black text-slate-800 text-xs lg:text-sm tracking-tight uppercase block truncate max-w-[150px] sm:max-w-[320px] group-hover:text-blue-700 transition-colors">
                                                                                {`${postulante.ap_paterno} ${postulante.ap_materno}, ${postulante.nombres}`}
                                                                            </span>
                                                                        }
                                                                        description={
                                                                            <span className="text-blue-600/60 text-[9px] lg:text-[10px] font-black uppercase tracking-widest">
                                                                                {`DNI: ${postulante.num_iden}`}
                                                                            </span>
                                                                        }
                                                                        avatarProps={{
                                                                            src: fotos[postulante.id] || `https://ui-avatars.com/api/?name=${postulante.nombres}+${postulante.ap_paterno}&background=3B82F6&color=FFFFFF&bold=true`,
                                                                            className: "shadow-md border-2 border-white ring-1 ring-blue-100 w-10 h-10 lg:w-12 lg:h-12 text-large shrink-0 bg-blue-50",
                                                                            style: { width: 60, height: 60 }
                                                                        }}
                                                                    />
                                                                </td>
                                                                <td className="px-4 align-middle border-b border-slate-100/50">
                                                                    <div className="flex items-center gap-1.5 lg:gap-2 justify-center">
                                                                        <div className="relative w-20 lg:w-32">
                                                                            <Input
                                                                                type="text"
                                                                                inputMode="decimal"
                                                                                placeholder="-"
                                                                                value={notas[postulante.id] || ""}
                                                                                onChange={(e) => {
                                                                                    const valInput = e.target.value.replace(',', '.');
                                                                                    if (/^[0-9]*\.?[0-9]{0,1}$/.test(valInput) || valInput === "") {
                                                                                        const numVal = parseFloat(valInput);
                                                                                        if (isNaN(numVal) || numVal <= maxNota) {
                                                                                            handleNotaChange(postulante.id, valInput);
                                                                                        }
                                                                                    }
                                                                                }}
                                                                                classNames={{
                                                                                    input: "text-right font-black text-sm lg:text-base text-slate-800",
                                                                                    inputWrapper: "bg-slate-100 border-2 border-slate-200 group-hover:border-blue-400 group-hover:bg-white transition-all rounded-lg lg:rounded-xl h-9 lg:h-11 shadow-sm"
                                                                                }}
                                                                                endContent={<span className="hidden sm:inline text-[9px] font-black text-blue-500/50 uppercase">pts</span>}
                                                                            />
                                                                        </div>
                                                                        {!isEntrevista && (
                                                                            <Button
                                                                                isIconOnly size="sm" variant="flat"
                                                                                onPress={() => handleOpenCalc(postulante.id)}
                                                                                className="rounded-lg lg:rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white h-9 w-9 lg:h-11 lg:w-11 shrink-0 transition-all shadow-sm"
                                                                            >
                                                                                <MdCalculate size={18} />
                                                                            </Button>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                                <td className="px-4 align-middle border-b border-slate-100/50">
                                                                    <div className="flex justify-center">
                                                                        <Tooltip content="Guardar Nota" showArrow placement="left" color="primary">
                                                                            <Button
                                                                                isIconOnly color="primary"
                                                                                size="md"
                                                                                className={`rounded-lg lg:rounded-xl bg-gradient-to-tr ${notas[postulante.id] ? 'from-blue-600 to-indigo-600 shadow-blue-200' : 'from-slate-400 to-slate-500 opacity-50 cursor-not-allowed shadow-none'} shadow-lg h-9 w-9 lg:h-11 lg:w-11 shrink-0 hover:scale-110 active:scale-90 transition-all`}
                                                                                onPress={() => guardarNota(postulante.id)}
                                                                                isDisabled={!notas[postulante.id]}
                                                                            >
                                                                                <MdSave size={20} className="text-white" />
                                                                            </Button>
                                                                        </Tooltip>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                            {/* Footer Reducido */}
                            <div className="flex justify-center py-2 border-t border-slate-100 shrink-0 bg-slate-50/40 h-14 items-center">
                                {programaSeleccionado && !loadingPostulantes && postulantesFiltrados.length > 0 && (
                                    <div className="flex items-center gap-6">
                                        <Pagination
                                            total={Math.ceil(postulantesFiltrados.length / postulantesPorPagina)}
                                            page={pagePostulantes}
                                            onChange={setPagePostulantes}
                                            showControls color="primary" variant="flat" size="sm"
                                            classNames={{
                                                wrapper: "gap-1 shadow-none",
                                                item: "text-[10px] lg:text-xs font-bold text-slate-500 bg-transparent rounded-lg",
                                                cursor: "bg-blue-600 text-white shadow-sm"
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        </CardBody>
                    </Card>
                </div>

            </div>

            <CVScoreCalculatorModal
                isOpen={isCalcOpen}
                onClose={onCalcClose}
                onApply={handleApplyCalc}
                initialScore={currentCalcId ? notas[currentCalcId] : 0}
                isSegundaEspecialidad={
                    programaActual?.id_grado === 3 ||
                    programaActual?.nombre_grado?.toLowerCase().includes('segunda especialidad')
                }
            />
        </div>

    );
}

export default InicioDocente;