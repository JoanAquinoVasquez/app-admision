import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import useGrado from "../../data/dataGrados";
// import Spinner from "../../components/Spinner/Spinner"; // Spinner
import { toast } from "react-hot-toast";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    Button,
    Checkbox,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Chip,
    Pagination,
    Spinner,
    user,
} from "@heroui/react";
import useInscripcionInhabilitada from "../../data/Inscripcion/dataInscripcionesInhabilitadas";
import Select from "../../components/Select/Select";
import axios from "../../axios";
import ModalConfirm from "../Modal/Confirmation/ModalConfirm";
import useProgramasHabilitados from "../../data/Inscripcion/dataProgramasHabilitados";
import useProgramasInhabilitados from "../../data/Inscripcion/dataProgramasInhabilitados";
import SelectGradoPrograma from "../Select/SelectGradoPrograma";
import CambiarProgramaModal from "../Modals/CambiarProgramaModal";
import useProgramasPosibles from "../../data/Inscripcion/dataProgramasPosibles";

export function capitalize(s) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

export const VerticalDotsIcon = ({ size = 24, width, height, ...props }) => {
    return (
        <svg
            aria-hidden="true"
            fill="none"
            focusable="false"
            height={size || height}
            role="presentation"
            viewBox="0 0 24 24"
            width={size || width}
            {...props}
        >
            <path
                d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 12c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
                fill="currentColor"
            />
        </svg>
    );
};

export const SearchIcon = (props) => {
    return (
        <svg
            aria-hidden="true"
            fill="none"
            focusable="false"
            height="1em"
            role="presentation"
            viewBox="0 0 24 24"
            width="1em"
            {...props}
        >
            <path
                d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
            />
            <path
                d="M22 22L20 20"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
            />
        </svg>
    );
};

export const ChevronDownIcon = ({ strokeWidth = 1.5, ...otherProps }) => {
    return (
        <svg
            aria-hidden="true"
            fill="none"
            focusable="false"
            height="1em"
            role="presentation"
            viewBox="0 0 24 24"
            width="1em"
            {...otherProps}
        >
            <path
                d="m19.92 8.95-6.52 6.52c-.77.77-2.03.77-2.8 0L4.08 8.95"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeMiterlimit={10}
                strokeWidth={strokeWidth}
            />
        </svg>
    );
};

export const columns = [
    { name: "ID", uid: "id", sortable: true },
    { name: "Nombres Completos", uid: "nombre_completo", sortable: true },
    { name: "Grado y Programa", uid: "grado", sortable: true },
    { name: "Celular", uid: "celular" },
    { name: "Doc. Identidad", uid: "doc_iden", sortable: true },
    { name: "DNI", uid: "ruta_dni" },
    { name: "CV", uid: "ruta_cv" },
    { name: "Foto Carnet", uid: "ruta_foto" },
    { name: "Núm. Voucher", uid: "voucher" },
    { name: "Voucher", uid: "ruta_voucher" },
    { name: "Fecha Inscripción", uid: "fecha_inscripcion" },
    { name: "Estado", uid: "estado", sortable: true },
    { name: "Acciones", uid: "actions" },
];

export const statusOptions = [
    { name: "Reservado", uid: "2" },
    { name: "Pendiente", uid: "0" },
    { name: "Devolución", uid: "3" },
];

const statusColorMap = {
    2: "success",
    0: "danger",
    3: "warning",
};

const INITIAL_VISIBLE_COLUMNS = [
    "id",
    "nombre_completo",
    "grado",
    "celular",
    "doc_iden",
    "fecha_inscripcion",
    "estado",
    "actions",
];

export default function App() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [message, setMessage] = useState("");
    const { inscripcionesInhabilitadas, fetchInscripcionesInhabilitadas, loading: dataLoading } =
        useInscripcionInhabilitada();
    const [isValidarOpen, setIsValidarOpen] = useState(false);
    const [validarId, setValidarId] = useState(null);
    const [isDevolucionOpen, setIsDevolucionOpen] = useState(false);
    const [isCambioOpen, setIsCambioOpen] = useState(false);
    const {
        programasHabilitados,
        filteredProgramasHabilitados,
        filterByGrado,
    } = useProgramasHabilitados();

    const { grados, fetchGrados } = useGrado();
    const [loading, setLoading] = useState(false); // local loading for actions
    const { gradosPosibles, programasPosibles, fetchProgramasPosibles } =
        useProgramasPosibles(validarId || null);
    const [selectedGrado, setSelectedGrado] = useState(null);
    const [selectedPrograma, setSelectedPrograma] = useState(null);

    // Fetch programas posibles when modal opens
    useEffect(() => {
        if (isCambioOpen && validarId) {
            fetchProgramasPosibles();
        }
    }, [isCambioOpen, validarId, fetchProgramasPosibles]);

    // ✅ Aseguramos que `inscripcionesInhabilitadas` tenga datos antes de mapear
    const users = useMemo(() => {
        if (
            !Array.isArray(inscripcionesInhabilitadas) ||
            inscripcionesInhabilitadas.length === 0
        ) {
            return []; // Retorna un array vacío si no hay datos
        }

        return inscripcionesInhabilitadas.map((item) => {
            const formatoFechaHora = (fechaHora) => {
                if (!fechaHora)
                    return { fecha: "No disponible", hora: "No disponible" };

                const dateObj = new Date(fechaHora);
                if (isNaN(dateObj.getTime())) {
                    return { fecha: "Inválida", hora: "Inválida" };
                }
                const fecha = dateObj.toLocaleDateString('es-PE', { year: 'numeric', month: '2-digit', day: '2-digit' });
                const hora = dateObj.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                return { fecha, hora };
            };

            const { fecha, hora } = formatoFechaHora(item.created_at);

            return {
                id: item.id,
                postulante_id: item.postulante?.id ?? "No disponible",
                nombre_completo: [
                    item.postulante?.ap_paterno ?? "",
                    item.postulante?.ap_materno ?? "",
                    item.postulante?.nombres ?? "",
                ]
                    .join(" ")
                    .trim(),
                grado: item.programa?.grado?.nombre ?? "No disponible",
                grado_id: item.programa?.grado_id ?? "No disponible",
                programa_id: item.programa_id ?? "No disponible",
                celular: item.postulante?.celular ?? "No disponible",
                programa: item.programa?.nombre ?? "No disponible",
                doc_iden: item.postulante?.num_iden ?? "No disponible",
                observacion: item.observacion ?? "No disponible",
                tipo_doc: item.postulante?.tipo_doc ?? "No disponible",
                fecha_inscripcion: { fecha, hora },
                voucher: item.codigo ?? "No disponible",
                estado: parseInt(item.estado) ?? "No disponible",
            };
        });
    }, [inscripcionesInhabilitadas]);

    const [programa_id, setPrograma_id] = useState(null);
    const [grado_id, setGrado_id] = useState(null);

    const [filterValue, setFilterValue] = useState("");
    const [selectedKeys, setSelectedKeys] = useState(new Set([]));
    const [visibleColumns, setVisibleColumns] = useState(
        new Set(INITIAL_VISIBLE_COLUMNS)
    );
    const [statusFilter, setStatusFilter] = useState("all");
    const [gradoFilter, setGradoFilter] = useState("all");
    const [programaFilter, setProgramaFilter] = useState("all");
    const { programasInhabilitados, refetch } = useProgramasInhabilitados();
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [sortDescriptor, setSortDescriptor] = useState({
        column: "id",
        direction: "ascending",
    });
    const [page, setPage] = useState(1);

    // Filtrar programas en la tabla cuando cambia el grado seleccionado
    useEffect(() => {
        if (gradoFilter !== "all") {
            filterByGrado(gradoFilter);
            setCurrentPage(1); // Reiniciar a la primera página cuando se aplica un filtro
        }
    }, [gradoFilter, filterByGrado]);

    const [currentPage, setCurrentPage] = useState(1);
    const [programSearchValue, setProgramSearchValue] = useState("");
    const programasPerPage = 7;

    // Filtrar programas por búsqueda
    const searchFilteredProgramas = useMemo(() => {
        if (!programSearchValue) return filteredProgramasHabilitados;
        return filteredProgramasHabilitados.filter(programa =>
            programa.nombre.toLowerCase().includes(programSearchValue.toLowerCase())
        );
    }, [filteredProgramasHabilitados, programSearchValue]);

    // Usamos los programas filtrados para calcular las páginas
    const totalProgramas = searchFilteredProgramas.length;
    const totalPages =
        totalProgramas > 0 ? Math.ceil(totalProgramas / programasPerPage) : 1;

    // Calcular el índice de los programas en la página actual
    const indexOfLastProgram = currentPage * programasPerPage;
    const indexOfFirstProgram = indexOfLastProgram - programasPerPage;
    const currentProgramas = searchFilteredProgramas.slice(
        indexOfFirstProgram,
        indexOfLastProgram
    );

    // Resetear página cuando cambia la búsqueda
    useEffect(() => {
        setCurrentPage(1);
    }, [programSearchValue]);

    const headerColumns = useMemo(() => {
        return visibleColumns === "all"
            ? columns
            : columns.filter((column) => visibleColumns.has(column.uid));
    }, [visibleColumns]);

    const filteredItems = useMemo(() => {
        let filteredUsers = [...users];
        if (filterValue) {
            const lowerCaseFilter = filterValue.toLowerCase();
            filteredUsers = filteredUsers.filter((user) =>
                Object.values(user).some((value) =>
                    value?.toString().toLowerCase().includes(lowerCaseFilter)
                )
            );
        }
        if (statusFilter !== "all") {
            filteredUsers = filteredUsers.filter((user) =>
                statusFilter.has(user.estado.toString())
            );
        }
        if (grado_id !== null) {
            filteredUsers = filteredUsers.filter(
                (user) => user.grado_id == grado_id
            );
        }

        if (programa_id !== null) {
            filteredUsers = filteredUsers.filter(
                (user) => user.programa_id == programa_id
            );
        }

        return filteredUsers;
    }, [filterValue, statusFilter, users, grado_id, programa_id]);

    const sortedItems = useMemo(() => {
        return [...filteredItems].sort((a, b) => {
            const first = a[sortDescriptor.column];
            const second = b[sortDescriptor.column];
            const cmp = first < second ? -1 : first > second ? 1 : 0;
            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, filteredItems]);
    const pages = Math.ceil(filteredItems.length / rowsPerPage);
    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        return sortedItems.slice(start, start + rowsPerPage);
    }, [page, sortedItems, rowsPerPage]);
    useEffect(() => {
        setPage(1); // Reiniciar a la primera página cuando se aplica un filtro
    }, [filterValue, statusFilter, sortedItems, grado_id, programa_id]);

    const handleExportMultiple = async (type) => {
        setLoading(true);
        try {
            let response;
            switch (type) {
                case "Devolucion":
                    response = await axios.get("/devolucion/reporte", {
                        responseType: "blob",
                    });
                    setLoading(false);
                    break;
                case "Reserva":
                    response = await axios.get("/reservas/reporte", {
                        responseType: "blob",
                    });
                    setLoading(false);
                    break;
                case "Voucher":
                    response = await axios.get("/reservas/vouchers", {
                        responseType: "blob",
                    });
                    setLoading(false);
                    break;
                default:
                    setLoading(false);
                    return;
            }

            const disposition = response.headers["content-disposition"];
            const filename =
                disposition &&
                disposition.split("filename=")[1]?.replace(/"/g, "");

            const fileURL = window.URL.createObjectURL(
                new Blob([response.data])
            );
            const link = document.createElement("a");
            link.href = fileURL;
            link.setAttribute("download", filename || defaultFilename);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            toast.error("Error durante la exportación");
        }
    };
    const renderCell = useCallback((user, columnKey) => {
        const cellValue = user[columnKey];

        switch (columnKey) {
            case "id":
                return (
                    <div className="flex flex-col">
                        <p className="text-sm text-default-400">{cellValue}</p>
                        {/* <p className="text-bold text-tiny capitalize text-default-400">
                            {user.nombre_completo}
                        </p> */}
                    </div>
                );

            case "nombre_completo":
                return (
                    <div className="flex flex-col">
                        <p className="capitalize text-sm text-default-500">
                            {cellValue}
                        </p>
                        {/* <p className="text-bold text-tiny capitalize text-default-400">
                            {user.nombre_completo}
                        </p> */}
                    </div>
                );
            case "grado":
                return (
                    <div className="flex flex-col">
                        <p className="text-sm text-default-400">{cellValue}</p>
                        <p className="font-medium text-sm text-default-500">
                            {user.programa}
                        </p>
                    </div>
                );

            case "fecha_inscripcion":
                return (
                    <div className="flex flex-col">
                        <p className="font-medium capitalize text-sm text-default-500">
                            {cellValue.hora}
                        </p>
                        <p className="text-sm text-default-400">
                            {cellValue.fecha}
                        </p>
                    </div>
                );
            case "doc_iden":
                return (
                    <div className="flex flex-col">
                        <p className="text-sm text-default-400">
                            {user.tipo_doc}
                        </p>
                        <p className="font-medium capitalize text-sm text-default-500">
                            {cellValue}
                        </p>
                    </div>
                );

            case "estado":
                return (
                    <Chip
                        className="capitalize"
                        color={statusColorMap[user.estado]}
                        size="sm"
                        variant="flat"
                    >
                        {user.estado === 0
                            ? "Pendiente"
                            : user.estado === 3
                                ? "Devolución"
                                : "Reservado"}
                    </Chip>
                );

            case "actions":
                return (
                    <div className="relative flex justify-end items-center gap-2">
                        <Dropdown>
                            <DropdownTrigger>
                                <Button
                                    isIconOnly
                                    size="sm"
                                    variant="light"
                                    aria-label="accion"
                                >
                                    <VerticalDotsIcon className="text-default-300" />
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu>
                                {user.estado === 0 && (
                                    <>
                                        {[
                                            {
                                                key: "reserva",
                                                label: "Reserva",
                                                message:
                                                    "¿Confirma la reserva? Esta acción es irreversible.",
                                            },
                                            {
                                                key: "devolucion",
                                                label: "Devolución",
                                                message:
                                                    "¿Confirma la devolución? Esta acción es irreversible.",
                                            },
                                            {
                                                key: "cambio",
                                                label: "Cambio de Programa",
                                                message:
                                                    "¿Confirma el cambio de programa? Esta acción es irreversible.",
                                            },
                                        ].map(({ key, label, message }) => (
                                            <DropdownItem
                                                key={key}
                                                textValue={label}
                                                onPress={() => {
                                                    setValidarId(user.id);
                                                    setMessage(message);
                                                    setIsValidarOpen(
                                                        key === "reserva"
                                                    );
                                                    setIsDevolucionOpen(
                                                        key === "devolucion"
                                                    );
                                                    setIsCambioOpen(
                                                        key === "cambio"
                                                    );
                                                }}
                                            >
                                                {label}
                                            </DropdownItem>
                                        ))}
                                    </>
                                )}

                                {user.estado === 2 && (
                                    <DropdownItem
                                        textValue="Cancelar Reserva"
                                        onPress={() => {
                                            setValidarId(user.id);
                                            setMessage(
                                                "¿Desea cancelar la reserva?"
                                            );
                                            setIsValidarOpen(true);
                                        }}
                                    >
                                        Cancelar Reserva
                                    </DropdownItem>
                                )}

                                {user.estado === 3 && (
                                    <DropdownItem
                                        textValue="Cancelar Devolución"
                                        onPress={() => {
                                            setValidarId(user.id);
                                            setMessage(
                                                "¿Desea cancelar la devolución?"
                                            );
                                            setIsDevolucionOpen(true);
                                        }}
                                    >
                                        Cancelar Devolución
                                    </DropdownItem>
                                )}
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                );

            default:
                return cellValue;
        }
    }, []);

    const onRowsPerPageChange = useCallback((e) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    }, []);

    const onSearchChange = useCallback((value) => {
        setFilterValue(value || "");
        setPage(1);
    }, []);

    const onClear = useCallback(() => {
        setFilterValue("");
        setPage(1);
    }, []);

    useEffect(() => {
        if (grado_id === null) {
            setPrograma_id(null);
        }
    }, [grado_id]);

    const [selectedProgramas, setSelectedProgramas] = useState([]);

    // Manejar la selección y deselección de programas
    const handleProgramSelection = (id) => {
        setSelectedProgramas((prev) =>
            prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
        );
    };

    const inhabilitarProgramas = async (programasSeleccionados) => {
        if (programasSeleccionados.length === 0) {
            toast.error("No hay programas seleccionados.");
            return;
        }

        try {
            const response = await axios.post(
                "/inhabilitar-inscripciones",
                { ids: programasSeleccionados },
                { headers: { "Content-Type": "application/json" } }
            );

            // Verificar si la respuesta fue exitosa antes de mostrar el éxito
            if (response.data.success) {
                toast.success(response.data.message);
                setIsModalOpen(false);
                fetchProgramasPosibles();
                refetch();
                fetchInscripcionesInhabilitadas();
            } else {
                throw new Error("Respuesta inesperada del servidor.");
            }
        } catch (error) {
            const errorMessage =
                error.response?.data?.message ||
                error.message ||
                "Ocurrió un error inesperado.";
            toast.error(errorMessage);
        }
    };

    const handleValidarReserva = async (id) => {
        setLoading(true);
        try {
            const response = await axios.get(`/reservas/inscripcion/${id}`, {
                headers: { "Content-Type": "application/json" },
            });
            if (response.data.success) {
                toast.success(response.data.message);
                setIsValidarOpen(false);
                fetchInscripcionesInhabilitadas();
            } else {
                toast.error("Error al validar la reserva.");
            }
        } catch (error) {
            const errorMessage =
                error.response?.data?.message ||
                error.message ||
                "Ocurrió un error inesperado.";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleValidarDevolucion = async (id) => {
        setLoading(true);
        try {
            const response = await axios.get(`/devolucion/inscripcion/${id}`, {
                headers: { "Content-Type": "application/json" },
            });
            if (response.data.success) {
                toast.success(response.data.message);
                setIsDevolucionOpen(false);
                fetchInscripcionesInhabilitadas();
            } else {
                toast.error("Error al validar la devolución.");
            }
        } catch (error) {
            const errorMessage =
                error.response?.data?.message ||
                error.message ||
                "Ocurrió un error inesperado.";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleObservarCambio = async (id, programaId) => {
        setLoading(true);

        try {
            const payload = { programa_id: parseInt(programaId) };

            const response = await axios.post(
                `/programa-cambio/${id}`,
                payload,
                {
                    headers: { "Content-Type": "application/json" },
                }
            );

            if (response.data.success) {
                toast.success(response.data.message);
                setIsCambioOpen(false);
                fetchInscripcionesInhabilitadas();
            } else {
                toast.error("Error al observar el cambio de programa.");
            }
        } catch (error) {
            console.error("❌ Error completo:", error);
            console.error("❌ Error response:", error.response?.data);
            const errorMessage =
                error.response?.data?.message ||
                error.message ||
                "Ocurrió un error inesperado.";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelarReserva = async (id) => {
        setLoading(true);
        try {
            const response = await axios.get(
                `/reservas/inscripcion/${id}/cancelar`,
                {
                    headers: { "Content-Type": "application/json" },
                }
            );
            if (response.data.success) {
                toast.success(response.data.message);
                setIsValidarOpen(false);
                fetchInscripcionesInhabilitadas();
            } else {
                toast.error("Error al cancelar la reserva.");
            }
        } catch (error) {
            const errorMessage =
                error.response?.data?.message ||
                error.message ||
                "Ocurrió un error inesperado.";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelarDevolucion = async (id) => {
        setLoading(true);
        try {
            const response = await axios.get(
                `/devolucion/inscripcion/${id}/cancelar`,
                {
                    headers: { "Content-Type": "application/json" },
                }
            );
            if (response.data.success) {
                toast.success(response.data.message);
                setIsDevolucionOpen(false);
                fetchInscripcionesInhabilitadas();
            } else {
                toast.error("Error al cancelar la devolución.");
            }
        } catch (error) {
            const errorMessage =
                error.response?.data?.message ||
                error.message ||
                "Ocurrió un error inesperado.";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const topContent = useMemo(() => {
        return (
            <>
                <div className="flex flex-col">
                    {/* Botón inhabilitar */}

                    {/* Fila de filtros y búsqueda */}
                    <div className="flex flex-col md:flex-row flex-wrap items-start md:items-center gap-2 w-full">
                        {/* Input de búsqueda */}
                        <Input
                            isClearable
                            className="w-full md:w-2/3 h-12 min-w-0 focus:outline-none"
                            classNames={{
                                input: "placeholder:text-gray-800 placeholder:opacity-100 text-gray-900",
                            }}
                            placeholder="Buscar al postulante"
                            startContent={<SearchIcon />}
                            value={filterValue}
                            onClear={onClear}
                            onValueChange={onSearchChange}
                        />

                        {/* Dropdowns de exportar y estado */}
                        <div className="flex flex-col sm:flex-row gap-2 md:ml-auto w-full md:w-auto">
                            {/* Exportar */}
                            <Button
                                color="danger"
                                name="inhabilitarPrograma"
                                onPress={() => setIsModalOpen(true)}
                                className="w-full md:w-auto h-12"
                            >
                                Inhabilitar Programa
                            </Button>
                            <Dropdown>
                                <DropdownTrigger asChild>
                                    <Button
                                        endContent={
                                            <ChevronDownIcon className="text-small" />
                                        }
                                        color="primary"
                                        className="h-12 w-full sm:w-auto"
                                    >
                                        Exportar
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu>
                                    <DropdownItem
                                        textValue="Reporte Devolución"
                                        onPress={() =>
                                            handleExportMultiple("Devolucion")
                                        }
                                    >
                                        Reporte Devolución
                                    </DropdownItem>
                                    <DropdownItem
                                        textValue="Reporte Reserva"
                                        onPress={() =>
                                            handleExportMultiple("Reserva")
                                        }
                                    >
                                        Reporte Reserva
                                    </DropdownItem>
                                    <DropdownItem
                                        textValue="Reporte Vouchers Reservados"
                                        onPress={() =>
                                            handleExportMultiple("Voucher")
                                        }
                                    >
                                        Reporte Vouchers Reservados
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>

                            {/* Estado */}
                            <Dropdown>
                                <DropdownTrigger className="w-full sm:w-auto">
                                    <Button
                                        endContent={
                                            <ChevronDownIcon className="text-small" />
                                        }
                                        variant="flat"
                                        className="h-12 w-full"
                                    >
                                        Estado
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu
                                    disallowEmptySelection
                                    closeOnSelect={false}
                                    selectedKeys={statusFilter}
                                    selectionMode="multiple"
                                    onSelectionChange={setStatusFilter}
                                >
                                    {statusOptions.map((status) => (
                                        <DropdownItem
                                            key={status.uid}
                                            textValue={status.name}
                                            className="capitalize"
                                        >
                                            {capitalize(status.name)}
                                        </DropdownItem>
                                    ))}
                                </DropdownMenu>
                            </Dropdown>
                        </div>

                        {/* Selector Grado/Programa */}
                        <div className="w-full">
                            <SelectGradoPrograma
                                grados={grados ?? []}
                                programas={programasInhabilitados ?? []}
                                onChangeGrado={setGrado_id}
                                onChangePrograma={setPrograma_id}
                            />
                        </div>
                    </div>

                    {/* Total y filas por página */}
                    <div className="flex flex-wrap justify-between items-center">
                        <span className="w-full md:w-[30%] text-small text-default-400">
                            {`${filteredItems.length} postulantes`}
                        </span>
                    </div>
                </div>
            </>
        );
    }, [
        filterValue,
        onSearchChange,
        statusFilter,
        visibleColumns,
        onRowsPerPageChange,
        onClear,
        users.length,
        grado_id,
        programa_id,
        grados,
        programasInhabilitados,
        gradoFilter,
        currentProgramas,
        currentPage,
        totalPages,
    ]);

    const bottomContent = useMemo(
        () => (
            <div className="py-2 px-2 flex justify-between items-center">
                <span className="w-[30%] text-small text-default-400"></span>
                <Pagination
                    isCompact
                    showControls
                    showShadow
                    color="primary"
                    page={page}
                    total={pages}
                    onChange={setPage}
                />
                <div className="hidden sm:flex w-[30%] justify-end gap-2"></div>
            </div>
        ),
        [selectedKeys, filteredItems.length, page, pages]
    );

    return (
        <>
            <ModalConfirm
                isOpen={isValidarOpen || isDevolucionOpen}
                onClose={() => {
                    setIsValidarOpen(false);
                    setIsDevolucionOpen(false);
                }}
                isDismissable={false}
                onConfirm={() => {
                    if (message.includes("Confirma la reserva")) {
                        handleValidarReserva(validarId);
                    } else if (message.includes("Confirma la devolución")) {
                        handleValidarDevolucion(validarId);
                    } else if (message.includes("cancelar la reserva")) {
                        handleCancelarReserva(validarId);
                    } else if (message.includes("cancelar la devolución")) {
                        handleCancelarDevolucion(validarId);
                    }
                }}
                message={message}
            ></ModalConfirm>


            <CambiarProgramaModal
                isOpen={isCambioOpen}
                onClose={() => setIsCambioOpen(false)}
                onConfirm={(id, gradoId, programaId) => {
                    setSelectedGrado(gradoId);
                    setSelectedPrograma(programaId);
                    handleObservarCambio(id, programaId);
                }}
                grados={grados ?? []}
                programas={programasPosibles ?? []}
                inscripcionId={validarId}
                isLoading={loading}
            />

            <Modal
                size="2xl"
                isOpen={isModalOpen}
                onOpenChange={setIsModalOpen}
                isDismissable={false}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <svg className="w-6 h-6 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    <span className="text-lg font-semibold">Inhabilitar Programas</span>
                                </div>
                                <p className="text-sm text-default-500 font-normal">
                                    Seleccione los programas que desea inhabilitar. <span className="font-semibold text-warning">Esta acción es irreversible.</span>
                                </p>
                            </ModalHeader>
                            <ModalBody>
                                <Select
                                    label="Grado Académico"
                                    variant="flat"
                                    className="w-full h-12 text-sm"
                                    defaultItems={grados.map((item) => ({
                                        key: item.id,
                                        textValue: item.nombre,
                                        ...item,
                                    }))}
                                    selectedKey={
                                        gradoFilter !== "all"
                                            ? gradoFilter
                                            : null
                                    }
                                    onSelectionChange={(grado_id) => {
                                        if (grado_id === null) {
                                            setGradoFilter("all");
                                            setProgramaFilter("all");
                                        } else {
                                            setGradoFilter(grado_id);
                                            setProgramaFilter("all");
                                        }
                                    }}
                                />

                                <div className="flex flex-col gap-3 mt-2">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center justify-between">
                                            <p className="font-semibold text-default-700">
                                                Programas Disponibles
                                            </p>
                                            {selectedProgramas.length > 0 && (
                                                <Chip size="sm" color="warning" variant="flat">
                                                    {selectedProgramas.length} seleccionado{selectedProgramas.length !== 1 ? 's' : ''}
                                                </Chip>
                                            )}
                                        </div>
                                        {gradoFilter !== "all" && (
                                            <Input
                                                isClearable
                                                className="w-full"
                                                placeholder="Buscar programa..."
                                                startContent={<SearchIcon />}
                                                value={programSearchValue}
                                                onClear={() => setProgramSearchValue("")}
                                                onValueChange={setProgramSearchValue}
                                                size="sm"
                                            />
                                        )}
                                    </div>

                                    {gradoFilter === "all" ? (
                                        <div className="flex flex-col items-center justify-center py-8 text-center">
                                            <svg className="w-16 h-16 text-default-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                            <p className="text-default-400 font-medium">
                                                Seleccione un grado académico para ver los programas disponibles
                                            </p>
                                        </div>
                                    ) : currentProgramas.length > 0 ? (
                                        <>
                                            <div className="space-y-2">
                                                {currentProgramas.map(
                                                    (item) => (
                                                        <div
                                                            key={item.id}
                                                            className={`p-3 rounded-lg border-2 transition-all cursor-pointer hover:shadow-md ${selectedProgramas.includes(item.id)
                                                                ? 'border-warning bg-warning-50 shadow-sm'
                                                                : 'border-default-200 hover:border-default-300'
                                                                }`}
                                                            onClick={() => handleProgramSelection(item.id)}
                                                        >
                                                            <div className="flex items-start gap-3">
                                                                <Checkbox
                                                                    id={`programa-${item.id}`}
                                                                    name={`programa-${item.id}`}
                                                                    isSelected={selectedProgramas.includes(item.id)}
                                                                    onChange={() => handleProgramSelection(item.id)}
                                                                    color="warning"
                                                                />
                                                                <div className="flex-1">
                                                                    <p className="font-medium text-default-700">
                                                                        {item.nombre}
                                                                    </p>
                                                                    <p className="text-xs text-default-500 mt-1">
                                                                        {item.inscripciones_count} {item.inscripciones_count === 1 ? 'inscrito' : 'inscritos'}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </div>

                                            {totalPages > 1 && (
                                                <div className="flex items-center justify-center mt-2 space-x-2">
                                                    <Button
                                                        isDisabled={
                                                            currentPage ===
                                                            1
                                                        }
                                                        onPress={() =>
                                                            setCurrentPage(
                                                                (prev) =>
                                                                    prev - 1
                                                            )
                                                        }
                                                        className="px-3 py-1 text-sm"
                                                    >
                                                        Anterior
                                                    </Button>

                                                    <span className="text-sm font-medium">
                                                        Página {currentPage}{" "}
                                                        de {totalPages}
                                                    </span>

                                                    <Button
                                                        isDisabled={
                                                            currentPage >=
                                                            totalPages
                                                        }
                                                        onPress={() =>
                                                            setCurrentPage(
                                                                (prev) =>
                                                                    prev + 1
                                                            )
                                                        }
                                                        className="px-3 py-1 text-sm"
                                                    >
                                                        Siguiente
                                                    </Button>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-8 text-center">
                                            <svg className="w-16 h-16 text-default-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <p className="text-default-400 font-medium">
                                                No hay programas disponibles para este grado
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </ModalBody>
                            <ModalFooter className="gap-2">
                                <Button
                                    color="default"
                                    variant="light"
                                    onPress={onClose}
                                    startContent={
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    }
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    color="warning"
                                    name="inhabilitar"
                                    isDisabled={!selectedProgramas.length}
                                    onPress={() =>
                                        inhabilitarProgramas(
                                            selectedProgramas
                                        )
                                    }
                                    startContent={
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                        </svg>
                                    }
                                >
                                    Inhabilitar {selectedProgramas.length > 0 && `(${selectedProgramas.length})`}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            <Table
                aria-label="Tabla de postulantes con inscripciones pendientes"
                layout="auto"
                isHeaderSticky
                bottomContent={bottomContent}
                bottomContentPlacement="outside"
                classNames={{
                    wrapper: "max-h-auto overflow-auto w-full p-4", // Ajustar tamaño y eliminar márgenes
                }}
                selectedKeys={selectedKeys}
                sortDescriptor={sortDescriptor}
                topContent={topContent}
                topContentPlacement="outside"
                onSelectionChange={setSelectedKeys}
                onSortChange={setSortDescriptor}
            >
                <TableHeader columns={headerColumns}>
                    {(column) => (
                        <TableColumn
                            key={column.uid}
                            align={
                                column.uid === "nombre_completo" ||
                                    column.uid === "grado"
                                    ? "start"
                                    : "center"
                            }
                            allowsSorting={column.sortable}
                            className="p-1 text-sm" // Reducir padding y tamaño de fuente
                            aria-label={column.name}
                            scope="col"
                        >
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody
                    emptyContent={(dataLoading || loading) ? <Spinner label="Cargando..." /> : "No se encontró inscripciones pendientes"}
                    items={items}
                    className="space-y-1" // Reducir espacio entre filas
                    isLoading={dataLoading || loading}
                    loadingContent={<div className="w-full h-full flex justify-center items-center z-50 bg-content1/50 backdrop-blur-sm top-0 left-0 absolute"><Spinner label="Cargando..." /></div>}
                >
                    {(item) => (
                        <TableRow
                            key={`${item.id}`}
                            className="p-1 text-sm leading-tight"
                        >
                            {(columnKey) => (
                                <TableCell className="p-1 text-sm">
                                    {renderCell(item, columnKey)}
                                </TableCell>
                            )}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </>
    );
}
