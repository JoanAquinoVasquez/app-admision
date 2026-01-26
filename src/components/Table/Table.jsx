import React from "react";
import { useState, useEffect, useMemo } from "react";
import { Progress, Spinner } from "@nextui-org/react";
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
    Pagination,
} from "@nextui-org/react";
import DashboardCard from "../../components/Cards/DashboardCard";

export const columns = [
    { name: "Grado y Programa", uid: "grado_programa", sortable: true },
    { name: "Inscritos", uid: "inscritos", sortable: true },
    { name: "Validos", uid: "validados", sortable: true },
    { name: "Aptos", uid: "aptos", sortable: true },
    { name: "Vacantes", uid: "vacantes", sortable: true },
    { name: "Cobertura", uid: "cobertura", sortable: true },
    { name: "Facultad", uid: "facultad" },
    { name: "Recaudado", uid: "recaudación", sortable: true },
];

export const statusOptions = [
    { name: "DOCTORADO", uid: "DOC" },
    { name: "MAESTRÍA", uid: "MAE" },
    { name: "SEGUNDA ESPECIALIDAD", uid: "SEG" },
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

const INITIAL_VISIBLE_COLUMNS = [
    "grado_programa",
    "inscritos",
    "validados",
    "aptos",
    "vacantes",
    "cobertura",
    "facultad",
    "recaudación",
];

export default function App({ resumenInscripcion }) {
    // ✅ Aseguramos que `resumenInscripcion` tenga datos antes de mapear
    const [loading, setLoading] = useState(true);
    const users = React.useMemo(() => {
        if (!resumenInscripcion || resumenInscripcion.length === 0) {
            return []; // Evita errores si aún no hay datos
        }
        setLoading(false);
        return resumenInscripcion.map((item) => ({
            grado_programa: item.grado_programa,
            inscritos: item.inscritos,
            validados: item.validados,
            aptos: item.aptos,
            vacantes: item.vacantes,
            cobertura: item.cobertura,
            facultad: item.facultad,
            recaudación: item.recaudacion,
        }));
    }, [resumenInscripcion]);

    const [filterValue, setFilterValue] = useState("");
    const [gradoFilter, setGradoFilter] = useState("all");
    const [selectedKeys, setSelectedKeys] = useState(new Set([]));
    const [visibleColumns, setVisibleColumns] = useState(
        new Set(INITIAL_VISIBLE_COLUMNS)
    );

    const [selectedPostulantes, setSelectedPostulantes] = useState([]);
    const [statusFilter, setStatusFilter] = useState("all");
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [sortDescriptor, setSortDescriptor] = useState({
        column: "inscritos",
        direction: "descending",
    });
    const [page, setPage] = useState(1);
    const hasSearchFilter = Boolean(filterValue);

    const headerColumns = useMemo(() => {
        if (visibleColumns === "all") return columns;

        return columns.filter((column) =>
            Array.from(visibleColumns).includes(column.uid)
        );
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
        if (gradoFilter !== "all") {
            filteredUsers = filteredUsers.filter((user) => {
                const gradoProgramUid = user.grado_programa
                    ? user.grado_programa.split(" - ")[0] // Extrae la parte antes del primer guion
                    : "";
                return gradoFilter.has(gradoProgramUid); // Verifica si el gradoProgramUid está en el Set
            });
        }

        return filteredUsers;
    }, [filterValue, statusFilter, users, gradoFilter]);

    useEffect(() => {
        if (selectedKeys === "all") {
            // Si se seleccionan todos, extraer todos los `postulante_id` de filteredItems
            setSelectedPostulantes(
                filteredItems.map((item) => item.postulante_id)
            );
        } else {
            // Si hay una selección específica, convertir el Set a Array y buscar los IDs correctos
            setSelectedPostulantes(
                Array.from(selectedKeys)
                    .map((key) => {
                        const item = filteredItems.find((i) => i.id == key);
                        return item ? item.postulante_id : null;
                    })
                    .filter(Boolean) // Filtrar cualquier `null` accidental
            );
        }
    }, [selectedKeys, filteredItems]);

    const sortedItems = React.useMemo(() => {
        return [...filteredItems].sort((a, b) => {
            const valueA = a[sortDescriptor.column];
            const valueB = b[sortDescriptor.column];

            if (valueA < valueB)
                return sortDescriptor.direction === "ascending" ? -1 : 1;
            if (valueA > valueB)
                return sortDescriptor.direction === "ascending" ? 1 : -1;
            return 0;
        });
    }, [filteredItems, sortDescriptor]);

    const pages = Math.ceil(filteredItems.length / rowsPerPage);

    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return sortedItems.slice(start, end);
    }, [page, sortedItems, rowsPerPage]);

    const renderCell = React.useCallback((user, columnKey) => {
        const cellValue = user[columnKey];

        switch (columnKey) {
            case "grado_programa":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-small">{cellValue}</p>
                    </div>
                );
            case "inscritos":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-small capitalize">
                            {cellValue}
                        </p>
                    </div>
                );
            case "validados":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-small capitalize">
                            {cellValue}
                        </p>
                    </div>
                );
            case "aptos":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-small capitalize">
                            {cellValue}
                        </p>
                    </div>
                );
            case "vacantes":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-small capitalize">
                            {cellValue}
                        </p>
                    </div>
                );
            case "cobertura":
                return (
                    <div className="flex flex-col">
                        <p className="text-sm capitalize">{cellValue}%</p>
                        <Progress
                            aria-label="Avance"
                            color="primary"
                            size="md"
                            value={cellValue}
                            className="w-full"
                            classNames={{
                                value: "text-sm m-0 leading-tight",
                                track: "m-0",
                            }}
                        />
                    </div>
                );
            case "facultad":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-small capitalize">
                            {cellValue}
                        </p>
                    </div>
                );
            case "recaudacion":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-small capitalize">
                            {cellValue}
                        </p>
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);

    const onNextPage = React.useCallback(() => {
        if (page < pages) {
            setPage(page + 1);
        }
    }, [page, pages]);

    const onPreviousPage = React.useCallback(() => {
        if (page > 1) {
            setPage(page - 1);
        }
    }, [page]);

    const onRowsPerPageChange = React.useCallback((e) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    }, []);

    const onSearchChange = React.useCallback((value) => {
        if (value) {
            setFilterValue(value);
            setPage(1);
        } else {
            setFilterValue("");
        }
    }, []);

    const onClear = React.useCallback(() => {
        setFilterValue("");
        setPage(1);
    }, []);

    const topContent = React.useMemo(() => {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex justify-between gap-3 items-end">
                    <Input
                        isClearable
                        className="w-full sm:max-w-[44%]"
                        placeholder="Buscar por nombre..."
                        startContent={<SearchIcon />}
                        value={filterValue}
                        onClear={() => onClear()}
                        onValueChange={onSearchChange}
                    />
                    <div className="flex gap-3">
                        {/* Dropdown Grado */}
                        <Dropdown>
                            <DropdownTrigger className="w-full sm:w-auto md:flex lg:flex xl:flex">
                                <Button
                                    aria-label="lista_grados"
                                    endContent={
                                        <ChevronDownIcon className="text-small" />
                                    }
                                    variant="flat"
                                    className="h-10 w-full"
                                >
                                    Grado
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={gradoFilter}
                                selectionMode="multiple"
                                onSelectionChange={setGradoFilter}
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

                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button
                                    aria-label="lista_columnas"
                                    endContent={
                                        <ChevronDownIcon className="text-small" />
                                    }
                                    variant="flat"
                                >
                                    Columnas
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
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
                    </div>
                </div>
            </div>
        );
    }, [
        filterValue,
        gradoFilter,
        statusFilter,
        visibleColumns,
        onRowsPerPageChange,
        users.length,
        onSearchChange,
        hasSearchFilter,
    ]);

    const bottomContent = React.useMemo(() => {
        return (
            <div className="py-2 px-2 flex justify-between items-center">
                <span className="w-[30%] text-small text-default-400">
                    {` ${filteredItems.length} programas filtrados`}
                </span>
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
                    <Button
                        aria-label="anterior"
                        isDisabled={pages === 1}
                        size="sm"
                        variant="flat"
                        onPress={onPreviousPage}
                    >
                        Anterior
                    </Button>
                    <Button
                        aria-label="siguiente"
                        isDisabled={pages === 1}
                        size="sm"
                        variant="flat"
                        onPress={onNextPage}
                    >
                        Siguiente
                    </Button>
                </div>
            </div>
        );
    }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

    return (
        <DashboardCard
            title="Resumen Proc. Admisión 2025 - I"
            icon={<ChevronDownIcon className="text-green-500" />}
        >
            {loading ? (
                <div className="flex items-center justify-center ml-[60px] w-full h-[400px]">
                    <Spinner color="primary" />
                </div>
            ) : (
                <Table
                    aria-label="Example table"
                    layout="fixed" // Usa fixed para que se respeten los anchos definidos
                    isHeaderSticky
                    bottomContent={bottomContent}
                    bottomContentPlacement="outside"
                    classNames={{
                        wrapper:
                            "max-h-[317px] min-h-[317px] overflow-auto w-full p-2 m-0",
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
                                    column.uid === "grado_programa"
                                        ? "start"
                                        : "center"
                                }
                                allowsSorting={column.sortable}
                                // Aplica estilos en línea para forzar el ancho y evitar el wrapping
                                style={
                                    column.uid === "grado_programa"
                                        ? { width: "310px" } // Grado y Programa
                                        : column.uid === "recaudación"
                                        ? { width: "100px" }
                                        : column.uid === "cobertura"
                                        ? { width: "62px" } // Cobertura o Recaudación
                                        : column.uid === "facultad"
                                        ? { width: "59px" }
                                        : { width: "50px" } // Otras columnas
                                }
                                className="text-xs"
                                aria-label={column.name}
                                scope="col"
                            >
                                {column.name}
                            </TableColumn>
                        )}
                    </TableHeader>
                    <TableBody
                        emptyContent={"No se encontró información"}
                        items={items}
                        className="space-y-1"
                    >
                        {(item) => (
                            <TableRow
                                key={item.grado_programa}
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
            )}
        </DashboardCard>
    );
}
