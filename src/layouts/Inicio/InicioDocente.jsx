import { MdDashboard, MdSearch, MdFileDownload, MdSave } from "react-icons/md";
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
    Spinner,
    Pagination,
    Card,
    CardBody,
    CardHeader,
    Progress,
    User,
    Tooltip
} from "@nextui-org/react";
import useProgramaDocente from "../../data/Evaluacion/dataProgramaDocente";

function InicioDocente() {
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

    // Buscadores
    const [searchQuery, setSearchQuery] = useState("");
    const [searchQueryPostulante, setSearchQueryPostulante] = useState("");

    // Resetear página de programas al buscar
    useEffect(() => {
        setPageProgramas(1);
    }, [searchQuery]);

    // Ajuste responsivo del número de filas
    useEffect(() => {
        const actualizarCapacidad = () => {
            const ancho = window.innerWidth;

            // Si es una pantalla grande (Laptop/Monitor) y tiene suficiente altura
            switch (true) {
                case ancho > 1900:
                    setProgramasPorPagina(8);
                    setPostulantesPorPagina(8);
                    break;
                case ancho > 1400:
                    setProgramasPorPagina(5);
                    setPostulantesPorPagina(5);
                    break;
                default:
                    setProgramasPorPagina(5);
                    setPostulantesPorPagina(5);
                    break;
            }
        };

        actualizarCapacidad();
        window.addEventListener('resize', actualizarCapacidad);
        return () => window.removeEventListener('resize', actualizarCapacidad);
    }, []);
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
        ).sort((a, b) => {
            const nameA = `${a.ap_paterno} ${a.ap_materno} ${a.nombres}`.toLowerCase();
            const nameB = `${b.ap_paterno} ${b.ap_materno} ${b.nombres}`.toLowerCase();
            return nameA.localeCompare(nameB);
        });
    }, [postulantes, searchQueryPostulante]);

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
            setPostulantes(data.map(item => item.postulante));

            // Mapear notas y fotos
            const notasInit = {};
            const fotosInit = {};

            data.forEach(({ postulante, cv, foto }) => {
                notasInit[postulante.id] = cv ?? "";
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

    const guardarNota = async (postulante_id) => {
        try {
            await axios.post("/registrar-nota", {
                postulante_id,
                notaCv: notas[postulante_id],
            });
            fetchProgramaDocente(); // Actualizar contadores del sidebar
            toast.success("Nota guardada");
        } catch (error) {
            toast.error("No se pudo guardar");
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

    // --- RENDERIZADO ---
    return (
        <div className="w-full bg-gray-50 lg:h-[calc(100vh-6rem)] min-h-screen lg:min-h-0 flex flex-col lg:overflow-hidden">


            {/* Overlay de carga para exportación */}
            {loadingExport && (
                <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/50 z-50 backdrop-blur-sm">
                    <Spinner size="lg" color="white" />
                    <p className="text-white mt-4 font-semibold">Generando reporte...</p>
                </div>
            )}

            {/* Header General */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-6 shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <MdDashboard className="text-blue-600" /> Evaluación de Docente
                    </h1>
                    <p className="text-gray-500 text-sm">Gestiona las calificaciones de CV de tus programas asignados</p>
                </div>
                <Button
                    color="primary"
                    variant="ghost"
                    startContent={<MdFileDownload />}
                    onPress={() => {
                        const ids = programasFiltrados.map(p => p.id_programa);
                        if (ids.length) manejarExportacion("/postulantes-notasCV-multiple", { ids }, 'post');
                        else toast.error("No hay programas");
                    }}
                >
                    Reporte General
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 lg:overflow-hidden px-4 lg:px-6 pb-6 lg:pb-0">
                {/* --- SIDEBAR: LISTA DE PROGRAMAS (3 columnas) --- */}
                <div className="lg:col-span-5 xl:col-span-5 2xl:col-span-5 flex flex-col h-auto lg:h-full lg:overflow-hidden">
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
                                {loading ? <Spinner /> : programasFiltrados
                                    .slice((pageProgramas - 1) * programasPorPagina, pageProgramas * programasPorPagina)
                                    .map((prog) => {
                                        const total = prog.con_nota + prog.sin_nota;
                                        const porcentaje = total === 0 ? 0 : (prog.con_nota / total) * 100;
                                        const isSelected = programaSeleccionado === prog.id_programa;

                                        return (
                                            <div
                                                key={prog.id_programa}
                                                onClick={() => handleSeleccionarPrograma(prog.id_programa)}
                                                className={`p-2 rounded-xl cursor-pointer transition-all border-l-6 ${isSelected
                                                    ? "bg-blue-50 border-blue-600 shadow-md"
                                                    : "bg-white border-transparent hover:bg-gray-100"
                                                    }`}
                                            >
                                                <div>
                                                    <Tooltip content={prog.nombre_grado}>
                                                        <span className={`font-semibold text-md ${isSelected ? 'text-blue-700' : 'text-gray-700'}`}>
                                                            {prog.nombre_grado.charAt(0).toUpperCase() + prog.nombre_grado.slice(1).toLowerCase()}
                                                        </span>
                                                    </Tooltip>
                                                    <Tooltip content={prog.nombre_grado.charAt(0).toUpperCase() + prog.nombre_grado.slice(1).toLowerCase() + " en " + prog.nombre_programa}>
                                                        <span className="text-md text-gray-500 ml-1">
                                                            {"en " + prog.nombre_programa}
                                                        </span>
                                                    </Tooltip>
                                                </div>

                                                {/* Barra de Progreso Mini */}
                                                <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                                                    <span>Progreso</span>
                                                    <span>{prog.con_nota}/{total}</span>
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
                                    })}

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

                {/* --- MAIN: TABLA DE EVALUACIÓN (9 columnas) --- */}
                <div className="lg:col-span-7 xl:col-span-7 2xl:col-span-7 h-auto lg:h-full lg:overflow-hidden">
                    <Card className="shadow-sm border-none h-full min-h-[500px] bg-white flex flex-col">
                        <CardHeader className="flex justify-between items-center px-6 py-2 border-b border-gray-100">
                            <h3 className="font-bold text-lg text-gray-700" aria-label="Titulo de la tabla">
                                {programaSeleccionado
                                    ? "Evaluación de Postulantes"
                                    : "Seleccione un programa"}
                            </h3>
                            {programaSeleccionado && (
                                <div className="flex gap-2 w-1/2 justify-end">
                                    <Input
                                        startContent={<MdSearch className="text-gray-400" />}
                                        placeholder="Filtrar por nombre o DNI..."
                                        aria-label="Filtrar postulantes"
                                        size="sm"
                                        value={searchQueryPostulante}
                                        onValueChange={setSearchQueryPostulante}
                                        className="max-w-xs"
                                    />
                                    <Tooltip content="Exportar este programa">
                                        <Button
                                            isIconOnly
                                            size="sm"
                                            variant="flat"
                                            aria-label="Exportar este programa"
                                            color="secondary"
                                            onPress={() => manejarExportacion(`/postulantes-notasCV/${programaSeleccionado}`)}
                                        >
                                            <MdFileDownload size={20} />
                                        </Button>
                                    </Tooltip>
                                </div>
                            )}
                        </CardHeader>

                        <CardBody className="p-0 overflow-hidden flex flex-col">
                            {loadingPostulantes ? (
                                <div className="flex justify-center items-center h-full">
                                    <Spinner label="Cargando postulantes..." />
                                </div>
                            ) : !programaSeleccionado ? (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                    <MdDashboard size={48} className="mb-2 opacity-20" />
                                    <p>Selecciona un programa del menú lateral para comenzar.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="flex-1 overflow-y-auto min-h-0 overflow-x-auto">
                                        <div className="min-w-[600px]">
                                            <Table
                                                aria-label="Tabla de evaluación"
                                                shadow="none"
                                                layout="fixed"
                                                classNames={{
                                                    th: "bg-gray-50 text-gray-600 font-semibold",
                                                    td: "py-2 border-b border-gray-50"
                                                }}
                                            >
                                                <TableHeader aria-label="Encabezado de la tabla">
                                                    <TableColumn width={50}>N</TableColumn>
                                                    <TableColumn>POSTULANTE</TableColumn>
                                                    <TableColumn width={200} align="center">NOTA (0-20/30)</TableColumn>
                                                    <TableColumn width={100} align="center">ACCIÓN</TableColumn>
                                                </TableHeader>
                                                <TableBody emptyContent={"No hay postulantes encontrados."}>
                                                    {postulantesFiltrados
                                                        .slice((pagePostulantes - 1) * postulantesPorPagina, pagePostulantes * postulantesPorPagina)
                                                        .map((postulante, idx) => (
                                                            <TableRow key={postulante.id}>
                                                                <TableCell aria-label="N">{idx + 1 + (pagePostulantes - 1) * postulantesPorPagina}</TableCell>
                                                                <TableCell aria-label="Postulante">
                                                                    <User
                                                                        name={`${postulante.ap_paterno} ${postulante.ap_materno}, ${postulante.nombres}`}
                                                                        description={`DNI: ${postulante.num_iden}`}
                                                                        aria-label="Postulante"
                                                                        avatarProps={{
                                                                            src: fotos[postulante.id],
                                                                            size: "lg",
                                                                        }}
                                                                        classNames={{
                                                                            name: "text-base font-semibold",
                                                                            description: "text-sm text-gray-500"
                                                                        }}
                                                                    />
                                                                </TableCell>
                                                                <TableCell aria-label="Nota">
                                                                    <div className="flex justify-center">
                                                                        <Input
                                                                            type="number"
                                                                            size="lg"
                                                                            variant="bordered"
                                                                            placeholder="0.000"
                                                                            aria-label="Nota del postulante"
                                                                            className="max-w-[130px]"
                                                                            value={notas[postulante.id] || ""}
                                                                            onChange={(e) => handleNotaChange(postulante.id, e.target.value)}
                                                                            endContent={
                                                                                <span className="text-gray-400 text-xs">pts</span>
                                                                            }
                                                                            step={0.001}
                                                                        />
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell aria-label="Acciones">
                                                                    <Tooltip content="Guardar Nota">
                                                                        <Button
                                                                            isIconOnly
                                                                            color="primary"
                                                                            variant="light"
                                                                            onPress={() => guardarNota(postulante.id)}
                                                                        >
                                                                            <MdSave size={22} />
                                                                        </Button>
                                                                    </Tooltip>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </div>

                                    <div className="flex justify-center py-1 border-t border-gray-100 shrink-0">
                                        <Pagination
                                            total={Math.ceil(postulantesFiltrados.length / postulantesPorPagina)}
                                            page={pagePostulantes}
                                            onChange={setPagePostulantes}
                                            color="primary"
                                            aria-label="Paginación de postulantes"
                                        />
                                    </div>
                                </>
                            )}
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default InicioDocente;