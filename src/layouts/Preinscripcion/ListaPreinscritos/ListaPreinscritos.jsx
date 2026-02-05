import { useState, useCallback, useMemo, useEffect, Suspense } from "react";
import { toast } from "react-hot-toast";
import Breadcrumb from "../../../components/Breadcrumb/Breadcrumb";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    Button,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Chip,
    Pagination,
    Spinner as NextUISpinner,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    useDisclosure,
} from "@heroui/react";
import FormularioUnificado from "../FormPreinscripcion";
import Select from "../../../components/Select/Select";
import useGrado from "../../../data/dataGrados";
import useProgramas from "../../../data/dataProgramas";
import usePreInscripcion from "../../../data/Preinscripcion/dataPreInscripcion";

export const columns = [
    { name: "ID", uid: "id", sortable: true },
    { name: "Nombres Completos", uid: "nombre_completo", sortable: true },
    { name: "Doc. Identidad", uid: "doc_iden", sortable: true },
    { name: "Celular", uid: "celular" },
    { name: "Grado y Programa", uid: "grado", sortable: true },
    { name: "Fecha Preinscripcion", uid: "fecha_preinscripcion" },
    { name: "Estado", uid: "estado", sortable: true },
    { name: "Pago", uid: "pago", sortable: true },
];

export const statusOptions = [
    { name: "Inscrito", uid: "1" },
    { name: "No inscrito", uid: "0" },
];

export const pagoOptions = [
    { name: "Pagó", uid: "1" },
    { name: "No pagó", uid: "2" },
];

export function capitalize(s) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

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

const statusColorMap = {
    1: "success",
    0: "danger",
    2: "warning",
};

const INITIAL_VISIBLE_COLUMNS = [
    "id",
    "nombre_completo",
    "grado",
    "celular",
    "doc_iden",
    "fecha_preinscripcion",
    "estado",
    "pago",
    "actions",
];

export default function App() {
    const { preInscripciones, loading: dataLoading } = usePreInscripcion();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const { grados } = useGrado();

    // Obtener todos los programas (se filtrará más abajo, después de definir los estados)
    const { programas } = useProgramas();



    // ✅ Aseguramos que `preInscripciones` tenga datos antes de mapear
    const users = useMemo(() => {
        if (!preInscripciones || preInscripciones.length === 0) {
            return []; // Evita errores si aún no hay datos
        }
        return preInscripciones.map((item) => {
            const formatoFechaHora = (fechaHora) => {
                if (!fechaHora)
                    return {
                        fecha: "No disponible",
                        hora: "No disponible",
                        dateObj: new Date(0), // Fecha inválida por defecto
                    };

                // Crear un objeto Date directamente usando el formato ISO completo
                const dateObj = new Date(fechaHora);

                if (isNaN(dateObj)) {
                    return {
                        fecha: "No disponible",
                        hora: "No disponible",
                        dateObj: new Date(0), // Fecha inválida si no es un valor válido
                    };
                }

                // Obtener la fecha en formato "dd-MM-yyyy"
                const fecha = dateObj.toLocaleDateString("es-PE", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                });

                // Obtener la hora en formato "HH:mm:ss" sin milisegundos
                const hora = dateObj.toISOString().split("T")[1].split(".")[0]; // 'HH:mm:ss'

                return { fecha, hora, dateObj };
            };

            const { fecha, hora, dateObj } = formatoFechaHora(item.created_at);
            return {
                id: item.id,
                postulante_id: item.postulante_id ? item.postulante_id : null,
                nombre_completo: [
                    item.ap_paterno,
                    item.ap_materno,
                    item.nombres,
                ].join(" "),
                grado: item.programa.grado.nombre,
                grado_id: parseInt(item.programa.grado.id),
                programa: item.programa.nombre,
                programa_id: parseInt(item.programa.id),
                celular: item.celular,
                doc_iden: item.num_iden,
                observacion: item.observacion,
                tipo_doc: item.tipo_doc,
                fecha_preinscripcion: { fecha, hora, dateObj }, // Agregamos `dateObj` para ordenamiento
                pago: item.pago,
                estado: item.postulante_id ? 1 : 0,
            };
        });
    }, [preInscripciones]);

    const [filterValue, setFilterValue] = useState("");
    const [selectedKeys, setSelectedKeys] = useState(new Set([]));
    const [visibleColumns, setVisibleColumns] = useState(
        new Set(INITIAL_VISIBLE_COLUMNS)
    );
    const [statusFilter, setStatusFilter] = useState("all");
    const [pagoFilter, setPagoFilter] = useState("all");
    const [gradoFilter, setGradoFilter] = useState("all");
    const [programaFilter, setProgramaFilter] = useState("all");
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [sortDescriptor, setSortDescriptor] = useState({
        column: "id",
        direction: "ascending",
    });
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false); // Estado para controlar cargas de exportación

    // --- LÓGICA SIMPLIFICADA DE FILTROS ---
    const listaGrados = Array.isArray(grados) ? grados : [];

    const listaProgramasFiltrados = useMemo(() => {
        if (gradoFilter === "all" || !programas || !Array.isArray(programas)) return [];
        return programas.filter(p => String(p.grado_id) === String(gradoFilter));
    }, [programas, gradoFilter]);
    // --------------------------------------

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

        if (pagoFilter !== "all") {
            filteredUsers = filteredUsers.filter((user) =>
                pagoFilter.has(user.pago.toString())
            );
        }
        if (gradoFilter !== "all") {
            filteredUsers = filteredUsers.filter(
                (user) => user.grado_id == gradoFilter
            );
        }

        if (programaFilter !== "all") {
            filteredUsers = filteredUsers.filter(
                (user) => user.programa_id == programaFilter
            );
        }

        return filteredUsers;
    }, [
        filterValue,
        statusFilter,
        pagoFilter,
        users,
        gradoFilter,
        programaFilter,
    ]);

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
    }, [filterValue, statusFilter, pagoFilter, sortedItems, gradoFilter]);

    const handleExportMultiple = async (type) => {
        setLoading(true);
        try {
            let response;
            switch (type) {
                case "Excel":
                    const params = new URLSearchParams();
                    if (gradoFilter !== "all" && gradoFilter) {
                        params.append("grado", gradoFilter);
                    }
                    if (programaFilter !== "all" && programaFilter) {
                        params.append("programa", programaFilter);
                    }

                    response = await axios.get(
                        `/reporte-preinscripcion?${params.toString()}`,
                        { responseType: "blob" }
                    );
                    setLoading(false);
                    break;
                case "Reporte Diario":
                    response = await axios.get(
                        "/reporte-preinscripcion-diario",
                        {
                            responseType: "blob",
                        }
                    );
                    setLoading(false);
                    break;
                case "Facultad Excel":
                    response = await axios.get(
                        "/reporte-preinscripcion-facultad-diario",
                        { responseType: "blob" }
                    );
                    setLoading(false);
                    break;
                default:
                    setLoading(false);
                    return;
            }

            const disposition = response.headers["content-disposition"];
            let fileName = `reporte_preinscripcion_${new Date().toLocaleDateString('es-PE').replace(/\//g, '-')}.xlsx`;

            if (disposition) {
                const match = disposition.match(/filename="?([^"]+)"?/);
                if (match?.[1]) fileName = match[1];
            }

            const fileURL = window.URL.createObjectURL(
                new Blob([response.data])
            );
            const link = document.createElement("a");
            link.href = fileURL;
            link.setAttribute("download", fileName);
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
                    </div>
                );

            case "nombre_completo":
                return (
                    <div className="flex flex-col">
                        <p className="capitalize text-sm text-default-500">
                            {cellValue}
                        </p>
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

            case "fecha_preinscripcion":
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
                        {cellValue ? "Inscrito" : "No inscrito"}
                    </Chip>
                );

            case "pago":
                return (
                    <Chip
                        className="capitalize"
                        color={statusColorMap[user.pago]}
                        size="sm"
                        variant="flat"
                    >
                        {cellValue == 1 ? "Pagó" : "No Pagó"}
                    </Chip>
                );

            default:
                return cellValue;
        }
    }, []);

    // Efecto de filtrado eliminado: ahora se usa useMemo (filteredProgramasLocal)

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

    const topContent = useMemo(() => {
        return (
            <>

                <div>
                    <Breadcrumb
                        paths={[
                            {
                                name: "Lista de preinscritos",
                                href: "/preinscripciones",
                            },
                        ]}
                    />
                </div>
                <div className="flex flex-col gap-4">
                    {/* Fila 1: Buscador, Grado Académico, Programa */}
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 w-full">
                        {/* Buscador */}
                        <div className="md:col-span-2">
                            <Input
                                isClearable
                                id="buscar"
                                className="w-full h-12"
                                placeholder="Buscar ..."
                                startContent={<SearchIcon />}
                                value={filterValue}
                                onClear={onClear}
                                onValueChange={onSearchChange}
                            />
                        </div>

                        {/* Select Grado Académico */}
                        <div className="md:col-span-1">
                            <Select
                                idPrefix="filter-"
                                label="Grado Académico"
                                variant="flat"
                                className="w-full h-12 text-sm"
                                defaultItems={listaGrados.map((item) => ({
                                    key: String(item.id),
                                    textValue: item.nombre,
                                    ...item,
                                }))}
                                selectedKey={gradoFilter !== "all" ? String(gradoFilter) : null}
                                onSelectionChange={(key) => {
                                    const val = key ? String(key) : "all";
                                    setGradoFilter(val);
                                    setProgramaFilter("all"); // Reset programa
                                }}
                            />
                        </div>

                        {/* Select Programa */}
                        <div className="md:col-span-3">
                            <Select
                                idPrefix="filter-"
                                label="Programa"
                                className="w-full h-12 text-sm"
                                disabled={listaProgramasFiltrados.length === 0}
                                defaultItems={listaProgramasFiltrados.map((item) => ({
                                    key: String(item.id),
                                    textValue: item.nombre,
                                    ...item,
                                }))}
                                selectedKey={programaFilter !== "all" ? String(programaFilter) : null}
                                onSelectionChange={(key) => {
                                    setProgramaFilter(key ? String(key) : "all");
                                }}
                            />
                        </div>
                    </div>

                    {/* Fila 2: Filtros y Exportar */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-center w-full">
                        {/* Estado */}
                        <Dropdown>
                            <DropdownTrigger>
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

                        {/* Pago */}
                        <Dropdown>
                            <DropdownTrigger>
                                <Button
                                    endContent={
                                        <ChevronDownIcon className="text-small" />
                                    }
                                    id="pago"
                                    name="pago"
                                    variant="flat"
                                    className="h-10"
                                >
                                    Pago
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                closeOnSelect={false}
                                selectedKeys={pagoFilter}
                                selectionMode="multiple"
                                onSelectionChange={setPagoFilter}
                            >
                                {pagoOptions.map((status) => (
                                    <DropdownItem
                                        key={status.uid}
                                        id={status.name}
                                        name={status.name}
                                        textValue={status.name}
                                        className="capitalize"
                                    >
                                        {capitalize(status.name)}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>

                        {/* Columnas */}
                        <Dropdown>
                            <DropdownTrigger>
                                <Button
                                    endContent={
                                        <ChevronDownIcon className="text-small" />
                                    }
                                    variant="flat"
                                    className="h-12 w-full"
                                >
                                    Columnas
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                closeOnSelect={false}
                                selectedKeys={visibleColumns}
                                selectionMode="multiple"
                                onSelectionChange={setVisibleColumns}
                            >
                                {columns.map((column) => (
                                    <DropdownItem
                                        key={column.uid}
                                        textValue={column.name}
                                        className="capitalize"
                                    >
                                        {capitalize(column.name)}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>

                        {/* Nueva Preinscripción */}
                        <Button
                            color="success"
                            variant="solid"
                            className="h-12 w-full text-white font-medium"
                            onPress={onOpen}
                        >
                            Nueva Preinscripción
                        </Button>

                        {/* Exportar */}
                        <div className="flex justify-end">
                            <Dropdown>
                                <DropdownTrigger asChild>
                                    <Button
                                        endContent={
                                            <ChevronDownIcon className="text-small" />
                                        }
                                        id="exportar"
                                        name="exportar"
                                        color="primary"
                                        className="h-12 w-full"
                                    >
                                        Exportar
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu>
                                    <DropdownItem
                                        textValue="Excel"
                                        onPress={() =>
                                            handleExportMultiple("Excel")
                                        }
                                    >
                                        Reporte General en Excel
                                    </DropdownItem>
                                    <DropdownItem
                                        textValue="Reporte Diario"
                                        onPress={() =>
                                            handleExportMultiple(
                                                "Reporte Diario"
                                            )
                                        }
                                    >
                                        Reporte Diario en Excel
                                    </DropdownItem>
                                    <DropdownItem
                                        textValue="Facultad Excel"
                                        onPress={() =>
                                            handleExportMultiple(
                                                "Facultad Excel"
                                            )
                                        }
                                    >
                                        Reporte Diario por Facultad en Excel
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                    </div>
                    {/* Total y filas por página */}
                    <div className="flex flex-wrap justify-between items-center">
                        <span className="w-[30%] text-small text-default-400">
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
        pagoFilter,
        visibleColumns,
        onRowsPerPageChange,
        onClear,
        users.length,
        onOpen,
        listaGrados, // Necesario para re-renderizar select de grados cuando cargan
        listaProgramasFiltrados, // Necesario para re-renderizar select de programas
        gradoFilter, // Necesario para visual update
        programaFilter,
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
                <div className="hidden sm:flex w-[30%] justify-end gap-2">
                    {/* <Button
                        isDisabled={page === 1}
                        size="sm"
                        variant="flat"
                        onPress={() => setPage((prev) => Math.max(prev - 1, 1))}
                    >
                        Anterior
                    </Button>
                    <Button
                        isDisabled={page === pages}
                        size="sm"
                        variant="flat"
                        onPress={() =>
                            setPage((prev) => Math.min(prev + 1, pages))
                        }
                    >
                        Siguiente
                    </Button> */}
                </div>
            </div>
        ),
        [selectedKeys, filteredItems.length, page, pages]
    );

    return (
        <>
            <Table
                aria-label="Tabla de Preinscritos"
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
                    emptyContent={dataLoading || loading ? <NextUISpinner label="Cargando..." /> : "No se encontró postulantes registrados"}
                    items={loading ? [] : items} // Ocultar filas al exportar
                    className="space-y-1"
                    isLoading={dataLoading || loading}
                    loadingContent={<NextUISpinner label="Cargando..." />}
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

            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="5xl" scrollBehavior="inside" isDismissable={false}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Registrar Nueva Preinscripción</ModalHeader>
                            <ModalBody className="p-0 h-[80vh]">
                                <Suspense fallback={<NextUISpinner label="Cargando formulario..." className="flex justify-center p-10" />}>
                                    <FormularioUnificado isAdmin={true} isModal={true} />
                                </Suspense>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
