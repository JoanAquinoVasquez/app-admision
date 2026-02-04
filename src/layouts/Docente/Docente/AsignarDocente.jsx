import { MdDashboard } from "react-icons/md";
import Breadcrumb from "../../../components/Breadcrumb/Breadcrumb";
import useProgramas from "../../../data/dataProgramas"; // Mantener esta importación
import { useState, useEffect } from "react";
import useGrados from "../../../data/dataGrados";
import axios from "../../../axios";
import { toast } from "react-hot-toast";
import {
    Spinner,
    Select,
    SelectItem,
    Card,
    CardHeader,
    CardBody,
    Divider,
    Input,
    Button,
    User,
    Badge,
    Chip,
    Pagination as NextPagination,
    Tooltip
} from "@heroui/react";
import {
    Search,
    UserPlus,
    BookOpen,
    GraduationCap,
    CheckCircle2,
    AlertCircle,
    Mail,
    CreditCard
} from "lucide-react";
import useDocentes from "../../../data/Evaluacion/dataDocentes";
import ModalDocente from "./M_NewDocente"; // Importa el modal

function DocenteEvaluador() {
    const [page, setPage] = useState(1); // Página actual
    const programasPorPagina = 8; // Número de programas por página
    const { programas, filteredProgramas, filterByGrado, fetchProgramas } =
        useProgramas();
    const [modalAbierto, setModalAbierto] = useState(false);

    const { grados, fetchGrados } = useGrados();
    const { docentes, fetchDocentes } = useDocentes();
    const [gradoSeleccionado, setGradoSeleccionado] = useState(null); // Estado para el grado seleccionado
    const [programasSeleccionados, setProgramasSeleccionados] = useState([]); // Programas seleccionados
    const [docenteSeleccionado, setDocenteSeleccionado] = useState(null); // Estado para el docente seleccionado
    const [programasFiltrados, setProgramasFiltrados] = useState([]); // Programas filtrados
    const [loading, setLoading] = useState(true); // Estado de carga inicial
    const [isSaving, setIsSaving] = useState(false); // Estado de guardado/asignación
    const [error, setError] = useState(null); // Estado de error
    const [searchQuery, setSearchQuery] = useState(""); // Estado para el buscador

    useEffect(() => {
        const cargarDocentes = async () => {
            try {
                setLoading(true);
                await fetchDocentes(); // tu hook ya debe llenar "docentes"
            } catch (err) {
                setError("Error al cargar docentes");
            } finally {
                setLoading(false);
            }
        };

        cargarDocentes();
    }, []);

    const handleAsignarDocente = () => {
        if (!docenteSeleccionado || programasSeleccionados.length === 0) {
            toast.error(
                "Por favor, selecciona un docente y al menos un programa."
            );
            return;
        }

        setIsSaving(true);
        setError(null);

        axios
            .post(`/docente-programa/${docenteSeleccionado}`, {
                programas: programasSeleccionados, // Enviar solo los programas como array
            })
            .then((response) => {
                setIsSaving(false);
                toast.success(response.data.message);
                fetchDocentes();
                fetchProgramas();
            })
            .catch((error) => {
                setIsSaving(false);
                setError("Hubo un error al asignar el docente.");
                toast.error("Hubo un error al asignar el docente.");
                console.error("Error al asignar docente:", error);
            });
    };

    // Este useEffect se ejecutará solo cuando el grado se haya cambiado.
    useEffect(() => {
        if (gradoSeleccionado !== null) {
            filterByGrado(parseInt(gradoSeleccionado)); // Aplicamos el filtro
            setPage(1);
        }
    }, [gradoSeleccionado, filterByGrado]); // Dependencia de gradoSeleccionado

    // Actualizamos los programas filtrados cuando el hook de programas cambie
    useEffect(() => {
        setProgramasFiltrados(filteredProgramas); // Actualizamos programas filtrados
    }, [filteredProgramas]); // Dependencia de filteredProgramas

    // Ordenamos los programas alfabéticamente por nombre
    const programasOrdenados = programasFiltrados.sort((a, b) =>
        a.nombre.localeCompare(b.nombre)
    );

    const handleProgramSelection = (programaId) => {
        // Agregar o quitar el programa de los seleccionados
        setProgramasSeleccionados((prevState) => {
            if (prevState.includes(programaId)) {
                return prevState.filter((id) => id !== programaId); // Eliminar el programa
            } else {
                return [...prevState, programaId]; // Agregar el programa
            }
        });
    };

    const handleDocenteChange = (docenteId) => {
        setDocenteSeleccionado(docenteId);
        setGradoSeleccionado(null); // Resetear grado seleccionado
        setSearchQuery(""); // Resetear búsqueda

        // Pre-seleccionar programas que ya tiene este docente asignados
        const yaAsignados = programas
            .filter(p => p.docente_id == docenteId)
            .map(p => p.id);

        setProgramasSeleccionados(yaAsignados);
        setProgramasFiltrados([]); // Limpiar los programas filtrados hasta que elija grado
    };

    // Filtrar programas por el texto de búsqueda
    const programasFiltradosPorBusqueda = programasOrdenados.filter(
        (programa) =>
            programa.nombre.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Lógica para filtrar los programas según la página
    const programasAMostrar = programasFiltradosPorBusqueda.slice(
        (page - 1) * programasPorPagina,
        page * programasPorPagina
    );

    // Función para manejar la selección de página
    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handleGuardarDocente = async (datos) => {
        try {
            setIsSaving(true);
            const response = await axios.post("/docentes", datos, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.data.success) {
                toast.success(response.data.message || "Docente agregado correctamente");
                fetchDocentes();
            } else {
                toast.error(`Error: ${response.data.message}`);
            }
        } catch (error) {
            if (error.response) {
                // Laravel retorna errores de validación con código 422
                if (error.response.status === 422) {
                    const errores = error.response.data.errors;
                    const mensajes = Object.values(errores).flat();

                    // Agrupar los mensajes de error en una sola cadena
                    const mensajeErrores = mensajes.join(" ");
                    toast.error(`Errores de validación: ${mensajeErrores}`);
                } else if (error.response.data.message) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error(
                        "Error inesperado en la respuesta del servidor"
                    );
                }
            } else {
                toast.error("Error al conectar con el servidor");
            }
            console.error("Error al guardar:", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-8xl animate-in fade-in duration-500">
            <div className="mb-6">
                <Breadcrumb
                    paths={[
                        {
                            name: "Gestión de Docentes",
                            href: "/asignar-docentes",
                        },
                    ]}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Columna de Docentes */}
                <Card className="lg:col-span-4 shadow-xl border-none bg-white/80 backdrop-blur-md">
                    <CardHeader className="flex flex-col items-start px-6 pt-2 pb-2">
                        <div className="flex justify-between items-center w-full mb-4">
                            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <UserPlus className="text-blue-500 w-6 h-6" />
                                Docentes
                            </h2>
                            <Button
                                color="success"
                                variant="flat"
                                startContent={<UserPlus size={18} />}
                                onPress={() => setModalAbierto(true)}
                                size="md"
                                className="font-semibold"
                            >
                                Nuevo
                            </Button>
                        </div>
                        <p className="text-slate-500 text-sm mb-2">Selecciona un docente para gestionar sus programas</p>
                    </CardHeader>
                    <Divider />
                    <CardBody className="px-4 py-4 max-h-[700px] overflow-y-auto custom-scrollbar">
                        <div className="flex flex-col gap-3">
                            {loading && (
                                <div className="flex flex-col items-center justify-center py-12 gap-3">
                                    <Spinner color="primary" labelColor="primary" />
                                    <span className="text-sm font-medium text-blue-500">Sincronizando docentes...</span>
                                </div>
                            )}

                            {!loading && error && (
                                <div className="flex flex-col items-center py-8 text-center text-red-500 border border-red-100 rounded-xl bg-red-50/50">
                                    <AlertCircle className="mb-2" />
                                    <p className="font-medium">{error}</p>
                                </div>
                            )}

                            {!loading && !error && docentes.length === 0 && (
                                <div className="flex flex-col items-center py-12 text-slate-400 border-2 border-dashed border-slate-100 rounded-xl">
                                    <UserPlus className="w-12 h-12 mb-3 opacity-20" />
                                    <p>No hay docentes registrados</p>
                                </div>
                            )}

                            {!loading && !error && docentes.map((docente) => (
                                <Card
                                    key={docente.id}
                                    isPressable
                                    onPress={() => handleDocenteChange(docente.id)}
                                    className={`border-2 transition-all duration-300 relative overflow-hidden ${docenteSeleccionado == docente.id
                                        ? "border-blue-600 bg-blue-50/30 shadow-blue-100 shadow-md translate-x-1"
                                        : "border-slate-100 bg-white hover:border-slate-300"
                                        }`}
                                >
                                    <CardBody className="p-3">
                                        <div className="flex items-center justify-between gap-3">
                                            <User
                                                name={`${docente.nombres} ${docente.ap_paterno} ${docente.ap_materno}`}
                                                className="text-lg"
                                                description={
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="flex items-center gap-1 text-sm text-slate-500">
                                                            <CreditCard size={10} /> {docente.dni}
                                                        </span>
                                                        <span className="flex items-center gap-1 text-sm text-slate-500">
                                                            <Mail size={10} /> {docente.email}
                                                        </span>
                                                    </div>
                                                }
                                                avatarProps={{
                                                    radius: "full",
                                                    size: "sm",
                                                    className: `font-bold transition-colors ${docenteSeleccionado == docente.id
                                                        ? "bg-blue-600 text-white"
                                                        : "bg-slate-200 text-slate-600"
                                                        }`,
                                                    name: docente.nombres.charAt(0)
                                                }}
                                                classNames={{
                                                    name: `text-md font-bold transition-colors ${docenteSeleccionado == docente.id ? "text-blue-800" : "text-slate-700"
                                                        }`,
                                                    description: "mt-0.5"
                                                }}
                                            />
                                            {docenteSeleccionado == docente.id && (
                                                <div className="flex-shrink-0 bg-blue-600 text-white p-1 rounded-full animate-in zoom-in duration-300">
                                                    <CheckCircle2 size={14} />
                                                </div>
                                            )}
                                        </div>
                                    </CardBody>
                                </Card>
                            ))}
                        </div>
                    </CardBody>
                </Card>

                {/* Columna de Selección de Grado y Programas */}
                <Card className="lg:col-span-8 shadow-xl border-none bg-white/80 backdrop-blur-md">
                    <CardHeader className="flex flex-col items-start px-6 pt-6">
                        <div className="flex justify-between items-center w-full mb-2">
                            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <GraduationCap className="text-blue-500 w-6 h-6" />
                                Asignación de Programas
                            </h2>
                            {programasSeleccionados.length > 0 && (
                                <Chip
                                    color="primary"
                                    variant="shadow"
                                    className="font-bold px-3"
                                    size="sm"
                                >
                                    {programasSeleccionados.length} seleccionados
                                </Chip>
                            )}
                        </div>
                        <p className="text-slate-500 text-sm">Gestiona la carga académica del docente seleccionado</p>
                    </CardHeader>
                    <Divider className="my-2" />
                    <CardBody className="px-6 py-4 overflow-visible">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <Select
                                label="Grado Académico"
                                placeholder="Filtrar por grado"
                                size="sm"
                                variant="bordered"
                                selectedKeys={gradoSeleccionado ? [String(gradoSeleccionado)] : []}
                                onChange={(e) => setGradoSeleccionado(e.target.value)}
                                startContent={<GraduationCap className="text-slate-400" size={18} />}
                                classNames={{
                                    trigger: "border-slate-200 shadow-sm hover:border-blue-300 transition-colors",
                                }}
                            >
                                {grados.map((grado) => (
                                    <SelectItem key={grado.id} textValue={grado.nombre}>
                                        {grado.nombre}
                                    </SelectItem>
                                ))}
                            </Select>

                            <Input
                                type="text"
                                aria-label="Buscador"
                                placeholder="Nombre de programa..."
                                size="lg"
                                variant="bordered"
                                value={searchQuery}
                                onValueChange={setSearchQuery}
                                startContent={<Search className="text-slate-400" size={18} />}
                                className="w-full"
                                classNames={{
                                    inputWrapper: "border-slate-200 shadow-sm hover:border-blue-300 transition-colors",
                                }}
                            />
                        </div>

                        {!gradoSeleccionado ? (
                            <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-100">
                                <BookOpen className="w-16 h-16 text-slate-200 mb-4" />
                                <h3 className="text-lg font-semibold text-slate-400">Selecciona un grado</h3>
                                <p className="text-slate-400 text-sm">Debes elegir un grado para listar sus programas</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-0">
                                <div className="grid grid-cols-1 gap-0">
                                    {programasAMostrar.map((programa) => {
                                        const estaSeleccionado = programasSeleccionados.includes(programa.id);
                                        const estaAsignado = programa.docente_id !== null;
                                        const docenteAsignado = docentes.find(d => d.id == programa.docente_id);

                                        return (
                                            <div
                                                key={programa.id}
                                                onClick={() => !estaAsignado && handleProgramSelection(programa.id)}
                                                className={`group relative flex items-center justify-between py-2.5 px-4 border-l-4 transition-all duration-200 mb-1 rounded-r-xl ${estaSeleccionado
                                                    ? "bg-blue-100/50 border-blue-600 shadow-sm translate-x-1"
                                                    : "bg-white border-slate-100 hover:border-slate-400 hover:bg-slate-50 shadow-sm"
                                                    } ${estaAsignado ? "opacity-60 cursor-not-allowed bg-slate-50/50" : "cursor-pointer"}`}
                                            >
                                                <div className="flex items-center gap-4 flex-1 overflow-hidden">
                                                    <div className={`p-2 rounded-lg flex-shrink-0 transition-all ${estaSeleccionado
                                                        ? "bg-blue-600 text-white shadow-md shadow-blue-200 scale-105"
                                                        : "bg-slate-100 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 group-hover:scale-105"
                                                        }`}>
                                                        {estaSeleccionado ? <CheckCircle2 size={18} /> : <BookOpen size={18} />}
                                                    </div>
                                                    <div className="flex items-center justify-between w-full gap-4 overflow-hidden">
                                                        <span className={`text-[13px] font-bold truncate transition-colors ${estaSeleccionado ? "text-blue-800" : "text-slate-700"
                                                            }`}>
                                                            {programa.nombre}
                                                        </span>

                                                        {estaAsignado && (
                                                            <div className="flex items-center gap-2 flex-shrink-0 animate-in fade-in slide-in-from-right-3">
                                                                <Chip size="sm" color="warning" variant="shadow" className="h-6 text-[10px] px-2 font-bold capitalize">Ocupado</Chip>
                                                                <span className="text-[11px] text-slate-500 font-semibold italic hidden sm:inline truncate max-w-[140px]">
                                                                    {docenteAsignado?.nombres} {docenteAsignado?.ap_paterno}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex items-center ml-4">
                                                    <input
                                                        type="checkbox"
                                                        checked={estaSeleccionado}
                                                        disabled={estaAsignado}
                                                        onChange={() => handleProgramSelection(programa.id)}
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="h-6 w-6 rounded-md border-2 border-slate-300 text-blue-600 focus:ring-blue-600 transition-all cursor-pointer accent-blue-600 hover:border-blue-500 shadow-sm"
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Paginación Mejorada */}
                                {programasFiltradosPorBusqueda.length > programasPorPagina && (
                                    <div className="flex justify-center mt-4">
                                        <NextPagination
                                            total={Math.ceil(programasFiltradosPorBusqueda.length / programasPorPagina)}
                                            page={page}
                                            onChange={handlePageChange}
                                            color="primary"
                                            variant="shadow"
                                            showControls
                                            classNames={{
                                                cursor: "bg-blue-600",
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </CardBody>
                    <Divider />
                    <CardBody className="px-6 py-2">
                        <Button
                            color="primary"
                            size="lg"
                            className="w-full font-bold shadow-lg shadow-blue-200 text-lg py-7"
                            onPress={handleAsignarDocente}
                            isLoading={isSaving}
                            isDisabled={!docenteSeleccionado || isSaving}
                            startContent={!isSaving && <CheckCircle2 size={20} />}
                        >
                            {isSaving ? "Guardando Cambios..." : "Guardar Asignación Docente"}
                        </Button>
                    </CardBody>
                </Card>
            </div>

            <ModalDocente
                isOpen={modalAbierto}
                onClose={() => setModalAbierto(false)}
                onSave={handleGuardarDocente}
            />
        </div>
    );
}

export default DocenteEvaluador;
