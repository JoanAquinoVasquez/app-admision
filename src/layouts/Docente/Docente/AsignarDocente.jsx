import { MdDashboard } from "react-icons/md";
import Breadcrumb from "../../../components/Breadcrumb/Breadcrumb";
import useProgramas from "../../../data/dataProgramas"; // Mantener esta importación
import { useState, useEffect } from "react";
import useGrados from "../../../data/dataGrados";
import axios from "../../../axios";
import { toast, Toaster } from "react-hot-toast";
import { Spinner, Select, SelectItem } from "@nextui-org/react";
import useDocentes from "../../../data/Evaluacion/dataDocentes";
import ModalDocente from "./M_NewDocente"; // Importa el modal

function DocenteEvaluador() {
    const [page, setPage] = useState(1); // Página actual
    const programasPorPagina = 10; // Número de programas por página
    const { programas, filteredProgramas, filterByGrado, fetchProgramas } =
        useProgramas();
    const [modalAbierto, setModalAbierto] = useState(false);

    const { grados, fetchGrados } = useGrados();
    const { docentes, fetchDocentes } = useDocentes();
    const [gradoSeleccionado, setGradoSeleccionado] = useState(null); // Estado para el grado seleccionado
    const [programasSeleccionados, setProgramasSeleccionados] = useState([]); // Programas seleccionados
    const [docenteSeleccionado, setDocenteSeleccionado] = useState(null); // Estado para el docente seleccionado
    const [programasFiltrados, setProgramasFiltrados] = useState([]); // Programas filtrados
    const [loading, setLoading] = useState(true); // Estado de carga
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

        setLoading(true);
        setError(null);

        axios
            .post(`/docente-programa/${docenteSeleccionado}`, {
                programas: programasSeleccionados, // Enviar solo los programas como array
            })
            .then((response) => {
                setLoading(false);
                toast.success(response.data.message);
                fetchDocentes();
            })
            .catch((error) => {
                setLoading(false);
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
        setProgramasSeleccionados([]); // Resetear programas seleccionados
        setProgramasFiltrados([]); // Limpiar los programas filtrados
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
            setLoading(true);
            const response = await axios.post("/docentes", datos, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 200) {
                toast.success("Docente agregado correctamente");
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
            setLoading(false);
        }
    };

    return (
        <div className="container p-4 max-w-full">
            <Toaster position="top-right" />
            {/* Overlay de carga (solo se renderiza si loading es true) */}
            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                    <Spinner label={"Cargando..."} />
                </div>
            )}
            <div>
                <Breadcrumb
                    paths={[
                        {
                            name: "Gestión de Docentes",
                            href: "/asignar-docentes",
                        },
                    ]}
                />
            </div>
            <div className="flex flex-col md:flex-row justify-between gap-4">
                {/* Columna de Docentes */}
                <div className="w-full md:w-1/3 bg-white rounded-lg p-4 shadow-md mb-3">
                    <p className="flex items-center text-xl font-medium text-gray-800 mb-3">
                        <MdDashboard className="mr-2" />
                        Docentes Disponibles
                    </p>
                    <button
                        data-testid="btn-nuevo-docente"
                        aria-label="Nuevo docente"
                        onClick={() => setModalAbierto(true)}
                        className="bg-green-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-600 transition mb-3"
                    >
                        + Nuevo
                    </button>

                    <ModalDocente
                        isOpen={modalAbierto}
                        onClose={() => setModalAbierto(false)}
                        onSave={handleGuardarDocente}
                    />

                    <div className="space-y-3">
                        {/* Estado cargando */}
                        {loading && (
                            <div className="flex justify-center py-6">
                                <Spinner label="Cargando docentes..." />
                            </div>
                        )}

                        {/* Estado error */}
                        {!loading && error && (
                            <p className="text-red-500 text-center">{error}</p>
                        )}

                        {/* Estado vacío */}
                        {!loading && !error && docentes.length === 0 && (
                            <p className="text-gray-500 text-center">
                                No hay docentes registrados.
                            </p>
                        )}

                        {/* Estado con docentes */}
                        {!loading &&
                            !error &&
                            docentes.length > 0 &&
                            docentes.map((docente) => (
                                <div
                                    data-testid="card-docente"
                                    aria-label={`card-docente-${docente.id}`}
                                    key={docente.id}
                                    onClick={() =>
                                        handleDocenteChange(docente.id)
                                    }
                                    className={`p-3 cursor-pointer border rounded-lg shadow-sm transition-all ${
                                        docenteSeleccionado == docente.id
                                            ? "bg-blue-100 border-blue-500"
                                            : "bg-gray-100 border-gray-300"
                                    } hover:shadow-md`}
                                >
                                    <p className="font-medium text-gray-800">
                                        {`${docente.nombres} ${docente.ap_paterno} ${docente.ap_materno}`}
                                    </p>
                                    <p className="text-sm text-gray-600">{`DNI: ${docente.dni}`}</p>
                                    <p className="text-sm text-gray-600">{`Correo: ${docente.email}`}</p>
                                </div>
                            ))}
                    </div>
                </div>

                {/* Columna de Selección de Grado y Programas */}
                <div className="w-full md:w-2/3 bg-white rounded-lg p-4 shadow-md mb-3">
                    <p className="flex items-center text-xl font-medium text-gray-800 mb-3">
                        <MdDashboard className="mr-2" />
                        Asignar Docente
                    </p>

                    {/* Selección de Grado */}
                    <div className="mb-4">
                        <label
                            htmlFor="grado"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Selecciona el Grado
                        </label>
                        <Select
                            id="grado"
                            name="grado"
                            aria-label="Selecciona un grado"
                            placeholder="Selecciona un grado"
                            className="w-full"
                            selectedKeys={
                                gradoSeleccionado
                                    ? [String(gradoSeleccionado)]
                                    : []
                            }
                            onChange={(e) =>
                                setGradoSeleccionado(e.target.value)
                            }
                        >
                            {grados.map((grado) => (
                                <SelectItem key={grado.id} value={grado.id}>
                                    {grado.nombre}
                                </SelectItem>
                            ))}
                        </Select>
                    </div>

                    {/* Listado de Programas dependiendo del grado */}
                    {gradoSeleccionado && (
                        <div className="mb-4">
                            {/* Buscador de Programas */}
                            <div className="mb-4">
                                <label
                                    htmlFor="buscar"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Buscar Programas
                                </label>
                                <input
                                    type="text"
                                    id="buscar"
                                    placeholder="Buscar programas..."
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                />
                            </div>
                            <label
                                htmlFor="programas"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Selecciona los Programas
                            </label>
                            {/* Mostrar programas por página */}
                            <div className="mt-3 space-y-2">
                                {programasAMostrar.map((programa) => {
                                    const estaSeleccionado =
                                        programasSeleccionados.includes(
                                            programa.id
                                        );
                                    const estaAsignado =
                                        programa.docente_id !== null;

                                    // Buscar el docente asignado al programa
                                    const docenteAsignado = docentes.find(
                                        (docente) =>
                                            docente.id == programa.docente_id
                                    );

                                    return (
                                        <div
                                            data-testid="programa-item"
                                            key={programa.id}
                                            className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition transform hover:scale-105 ${
                                                estaSeleccionado
                                                    ? "bg-blue-100 border-blue-500"
                                                    : "bg-gray-100 border-gray-300"
                                            } ${
                                                estaAsignado
                                                    ? "opacity-50 cursor-not-allowed"
                                                    : ""
                                            }`}
                                            onClick={() => {
                                                if (!estaAsignado) {
                                                    handleProgramSelection(
                                                        programa.id
                                                    );
                                                }
                                            }}
                                        >
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id={`programa-${programa.id}`}
                                                    value={programa.id}
                                                    checked={estaSeleccionado}
                                                    disabled={estaAsignado}
                                                    onChange={() =>
                                                        handleProgramSelection(
                                                            programa.id
                                                        )
                                                    }
                                                    // 👇 Esto evita que al hacer clic en el checkbox
                                                    // también se dispare el onClick del div (doble toggle)
                                                    onClick={(e) =>
                                                        e.stopPropagation()
                                                    }
                                                    className="h-4 w-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                                                />
                                                <label
                                                    htmlFor={`programa-${programa.id}`}
                                                    className="ml-3 text-sm text-gray-700 cursor-pointer"
                                                >
                                                    {programa.nombre}
                                                </label>
                                            </div>

                                            {/* Mostrar el docente asignado si existe */}
                                            {docenteAsignado && (
                                                <span className="text-sm text-gray-600">
                                                    Asignado a:{" "}
                                                    <span className="font-medium text-gray-800">
                                                        {
                                                            docenteAsignado.nombres
                                                        }{" "}
                                                        {
                                                            docenteAsignado.ap_paterno
                                                        }{" "}
                                                        {
                                                            docenteAsignado.ap_materno
                                                        }
                                                    </span>
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                            {/* Paginación */}
                            <div className="mt-4 flex justify-center items-center space-x-2">
                                <button
                                    onClick={() => handlePageChange(page - 1)}
                                    disabled={page === 1}
                                    className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none disabled:bg-gray-300 disabled:text-gray-500 transition text-sm"
                                >
                                    Anterior
                                </button>

                                <button
                                    onClick={() => handlePageChange(page + 1)}
                                    disabled={
                                        page * programasPorPagina >=
                                        programasFiltradosPorBusqueda.length
                                    }
                                    className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none disabled:bg-gray-300 disabled:text-gray-500 transition text-sm"
                                >
                                    Siguiente
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Botón de Asignar */}
                    <div className="mb-4">
                        <button
                            onClick={handleAsignarDocente}
                            className="w-full bg-blue-500 text-white py-2 rounded-md shadow-sm hover:bg-blue-600 transition"
                        >
                            Asignar Docente
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DocenteEvaluador;
