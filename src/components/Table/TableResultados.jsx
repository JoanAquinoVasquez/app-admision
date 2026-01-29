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
    { name: "Ingresantes", uid: "ingresantes_total", sortable: true },
    { name: "Inscritos", uid: "inscritos_total", sortable: true },
    { name: "Nota Prom.", uid: "promedio_nota", sortable: true },
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
    "ingresantes_total",
    "inscritos_total",
    "promedio_nota",
];

export default function TableResultados({ ingresantesPrograma, grados, loading }) {
    // ✅ Aseguramos que `ingresantesPrograma` tenga datos antes de mapear
    const users = React.useMemo(() => {
        if (!ingresantesPrograma || ingresantesPrograma.length === 0) {
            return []; // Evita errores si aún no hay datos
        }
        return ingresantesPrograma.map((item) => ({
            grado_programa: item.grado_programa,
            ingresantes_total: item.ingresantes_total,
            ingresantes_hombres: item.ingresantes_hombres,
            ingresantes_mujeres: item.ingresantes_mujeres,
            inscritos_total: item.inscritos_total,
            inscritos_hombres: item.inscritos_hombres,
            inscritos_mujeres: item.inscritos_mujeres,
            promedio_nota: item.promedio_nota,
        }));
    }, [ingresantesPrograma]);

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
        column: "ingresantes_total",
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

    const pages = Math.max(1, Math.ceil(filteredItems.length / rowsPerPage));

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
            case "ingresantes_total":
                return (
                    <div className="flex flex-col">
                        <p className="font-medium capitalize text-sm text-default-500">
                            {cellValue}
                        </p>
                        <p className="text-sm text-default-400">
                            {user.ingresantes_hombres}H/{""}
                            {user.ingresantes_mujeres}M
                        </p>
                    </div>
                );
            case "inscritos_hombres":
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
            case "inscritos_total":
                return (
                    <div className="flex flex-col">
                        <p className="font-medium capitalize text-sm text-default-500">
                            {cellValue}
                        </p>
                        <p className="text-sm text-default-400">
                            {user.inscritos_hombres}H/{""}
                            {user.inscritos_mujeres}M
                        </p>
                    </div>
                );
            case "promedio_nota":
                return (
                    <div className="flex flex-col">
                        <p className="font-medium capitalize text-sm text-default-500">
                            {cellValue}
                        </p>
                        {/* <p className="text-sm text-default-400">
                            {user.promedio_nota}
                        </p> */}
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
            <div className="flex justify-between items-center">
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
                        isDisabled={pages === 1}
                        size="sm"
                        variant="flat"
                        onPress={onPreviousPage}
                    >
                        Anterior
                    </Button>
                    <Button
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
        <div>
            <div>
                <strong>Resumen Resultados Proc. Admisión 2025 - I</strong>
                <Table
                    aria-label="Example table"
                    layout="fixed" // Usa fixed para que se respeten los anchos definidos
                    isHeaderSticky
                    bottomContent={bottomContent}
                    bottomContentPlacement="outside"
                    classNames={{
                        wrapper:
                            "max-h-[280px] min-h-[260px] overflow-auto w-full p-2 m-0",
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
                                        ? { width: "230px" } // Grado y Programa
                                        : column.uid === "promedio_nota"
                                            ? { width: "40px" }
                                            : column.uid === "inscritos_total"
                                                ? { width: "40px" } // inscritos_total o promedio_nota
                                                : column.uid === "ingresantes_total"
                                                    ? { width: "40px" }
                                                    : { width: "10px" } // Otras columnas
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
                        isLoading={loading}
                        loadingContent={<Spinner label="Cargando..." />}
                    >
                        {(item) => (
                            <TableRow
                                key={item.grado_programa}
                                className="p-1 text-sm leading-tight"
                            >
                                {(columnKey) => (
                                    <TableCell className="p-0 text-sm">
                                        {renderCell(item, columnKey)}
                                    </TableCell>
                                )}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
