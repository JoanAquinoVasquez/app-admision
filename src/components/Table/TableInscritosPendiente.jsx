import { useState, useMemo, useCallback, useEffect, useRef } from "react";
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
    Skeleton,
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

import {
    VerticalDotsIcon,
    SearchIcon,
    ChevronDownIcon,
} from "./components/Icons";
import { useInscritosData } from "../../hooks/useInscritosData";
import { useInscritosRenderCell } from "./components/useInscritosRenderCell";
import { useTableFilters } from "../../hooks/useTableFilters";
import TablePagination from "./components/TablePagination";
import { capitalize } from "./utils";

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
    const [isExporting, setIsExporting] = useState(false);
    const { gradosPosibles, programasPosibles, fetchProgramasPosibles } =
        useProgramasPosibles(validarId || null);

    // Estados para filtrado por grado y programa
    const [grado_id, setGrado_id] = useState(null);
    const [programa_id, setPrograma_id] = useState(null);
    const { programasInhabilitados, refetch: refetchProgramas } = useProgramasInhabilitados();

    // Fetch programas posibles when modal opens
    useEffect(() => {
        if (isCambioOpen && validarId) {
            fetchProgramasPosibles();
        }
    }, [isCambioOpen, validarId, fetchProgramasPosibles]);

    // ✅ Aseguramos que `inscripcionesInhabilitadas` tenga datos antes de mapear
    const users = useInscritosData(
        inscripcionesInhabilitadas || [],
        "estado",
        (item) => true // No filtering by val_digital, just pass all
    );

    const {
        filterValue,
        statusFilter,
        gradoFilter,
        programaFilter,
        page,
        rowsPerPage,
        sortDescriptor,
        setFilterValue,
        setStatusFilter,
        setGradoFilter,
        setProgramaFilter,
        setPage,
        setRowsPerPage,
        setSortDescriptor,
        sortedItems,
        items,
        pages,
        onSearchChange,
        onClear,
        onRowsPerPageChange,
        filteredItems,
    } = useTableFilters(users, {
        initialRowsPerPage: 10,
        initialSortColumn: "id",
    });

    const [selectedKeys, setSelectedKeys] = useState(new Set([]));
    const [visibleColumns, setVisibleColumns] = useState(
        new Set(INITIAL_VISIBLE_COLUMNS)
    );

    const headerColumns = useMemo(() => {
        return visibleColumns === "all"
            ? columns
            : columns.filter((column) => visibleColumns.has(column.uid));
    }, [visibleColumns]);

    // Filtrar programas en la tabla cuando cambia el grado seleccionado
    useEffect(() => {
        if (gradoFilter !== "all") {
            filterByGrado(gradoFilter);
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

    const handleExportMultiple = async (type) => {
        setIsExporting(true);
        const exportPromise = (async () => {
            let res;
            switch (type) {
                case "Devolucion":
                    res = await axios.get("/devolucion/reporte", { responseType: "blob" });
                    break;
                case "Reserva":
                    res = await axios.get("/reservas/reporte", { responseType: "blob" });
                    break;
                case "Voucher":
                    res = await axios.get("/reservas/vouchers", { responseType: "blob" });
                    break;
                default:
                    throw new Error("Tipo de reporte no válido");
            }
            return res;
        })();

        toast.promise(exportPromise, {
            loading: `Generando reporte de ${type.toLowerCase()}...`,
            success: "Reporte generado con éxito",
            error: "Error durante la exportación",
        });

        try {
            const response = await exportPromise;
            const disposition = response.headers["content-disposition"];
            const filename =
                disposition &&
                disposition.split("filename=")[1]?.replace(/"/g, "");

            const fileURL = window.URL.createObjectURL(
                new Blob([response.data])
            );
            const link = document.createElement("a");
            link.href = fileURL;
            link.setAttribute("download", filename || `reporte_${type.toLowerCase()}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            // Error managed by toast.promise
        } finally {
            setIsExporting(false);
        }
    };
    const renderStatus = (user) => (
        <Chip
            className="capitalize"
            color={statusColorMap[user.estado]}
            size="sm"
            variant="flat"
        >
            {user.estado == 0
                ? "Pendiente"
                : user.estado == 3
                    ? "Devolución"
                    : "Reservado"}
        </Chip>
    );

    const renderActions = (user) => (
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
                    {user.estado == 0 && (
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
                                        setIsValidarOpen(key === "reserva");
                                        setIsDevolucionOpen(key === "devolucion");
                                        setIsCambioOpen(key === "cambio");
                                    }}
                                >
                                    {label}
                                </DropdownItem>
                            ))}
                        </>
                    )}

                    {user.estado == 2 && (
                        <DropdownItem
                            textValue="Cancelar Reserva"
                            onPress={() => {
                                setValidarId(user.id);
                                setMessage("¿Desea cancelar la reserva?");
                                setIsValidarOpen(true);
                            }}
                        >
                            Cancelar Reserva
                        </DropdownItem>
                    )}

                    {user.estado == 3 && (
                        <DropdownItem
                            textValue="Cancelar Devolución"
                            onPress={() => {
                                setValidarId(user.id);
                                setMessage("¿Desea cancelar la devolución?");
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

    const renderCell = useInscritosRenderCell({
        renderStatus,
        renderActions,
    });



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
                refetchProgramas();
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
                                        isLoading={isExporting}
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
                                onChangeGrado={(val) => {
                                    setGrado_id(val);
                                    setGradoFilter(val || "all");
                                }}
                                onChangePrograma={(val) => {
                                    setPrograma_id(val);
                                    setProgramaFilter(val || "all");
                                }}
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
            <TablePagination
                page={page}
                pages={pages}
                setPage={setPage}
                filteredItemsLength={filteredItems.length}
                selectedKeys={selectedKeys}
                hasSelection={false}
            />
        ),
        [page, pages, setPage, filteredItems.length, selectedKeys]
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
                    emptyContent={(dataLoading || loading) ? <Skeleton className="h-20 w-full rounded-lg" /> : "No se encontró inscripciones pendientes"}
                    items={items}
                    className="space-y-1" // Reducir espacio entre filas
                    isLoading={dataLoading || loading}
                    loadingContent={
                        <div className="w-full h-full flex flex-col gap-2 p-4 bg-white/50 backdrop-blur-sm z-50">
                            <Skeleton className="h-10 w-full rounded-lg" />
                            <Skeleton className="h-10 w-full rounded-lg" />
                            <Skeleton className="h-10 w-full rounded-lg" />
                            <Skeleton className="h-10 w-full rounded-lg" />
                            <Skeleton className="h-10 w-full rounded-lg" />
                        </div>
                    }
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
