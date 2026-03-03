import { useState, useEffect, useMemo, useCallback } from "react";
import { admissionConfig } from "../../config/admission";
import { useTableFilters } from "../../hooks/useTableFilters";
import { Progress, Skeleton } from "@heroui/react";
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
} from "@heroui/react";
import DashboardCard from "../../components/Cards/DashboardCard";

export const columns = [
    { name: "Grado y Programa", uid: "grado_programa", sortable: true },
    { name: "Inscritos", uid: "inscritos", sortable: true },
    { name: "Aptos", uid: "aptos", sortable: true },
    { name: "Evaluados", uid: "evaluados", sortable: true },
    { name: "Cobertura", uid: "cobertura", sortable: true },
    { name: "Facultad", uid: "facultad" },
    { name: "Docente", uid: "docente", sortable: true },
];

export const statusOptions = [
    { name: "Doctorado", uid: "Doctorado" },
    { name: "Maestria", uid: "Maestria" },
    { name: "Segunda Especialidad Profesional", uid: "Segunda Especialidad Profesional" },
];

export function capitalize(s) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

import { SearchIcon, ChevronDownIcon } from "../../components/Table/components/Icons";
import TablePagination from "./components/TablePagination";

const INITIAL_VISIBLE_COLUMNS = [
    "grado_programa",
    "inscritos",
    "aptos",
    "evaluados",
    "cobertura",
    "facultad",
    "docente",
];

export default function App({ resumenEvaluacion, grados, loading: dataLoading }) {
    // ✅ Aseguramos que `resumenEvaluacion` tenga datos antes de mapear
    const users = useMemo(() => {
        if (!resumenEvaluacion || resumenEvaluacion.length === 0) {
            return []; // Evita errores si aún no hay datos
        }
        return resumenEvaluacion.map((item) => ({
            grado_programa: item.grado_programa,
            inscritos: item.inscritos,
            aptos: item.aptos,
            evaluados: item.evaluados,
            cobertura: item.cobertura,
            facultad: item.facultad,
            grado_id: item.grado_id,
            docente: item.docente,
            docente_apellidos: item.docente_apellidos,
            docente_id: item.docente_id,
        }));
    }, [resumenEvaluacion]);

    // gradoFilter: estado LOCAL (igual que Table.jsx) — los 3 activos por defecto
    const [gradoFilter, setGradoFilter] = useState(
        new Set(["Doctorado", "Maestria", "Segunda Especialidad Profesional"])
    );

    // useCallback: la referencia de gradoCustomFilter solo cambia cuando gradoFilter cambia.
    // Esto evita el bucle infinito: customFilter nuevo → filteredItems nuevo → useEffect → setState → render → …
    const gradoCustomFilter = useCallback((data) => {
        if (
            gradoFilter instanceof Set &&
            gradoFilter.size > 0 &&
            gradoFilter.size < statusOptions.length
        ) {
            return data.filter((item) => {
                const gp = item.grado_programa?.toLowerCase() ?? "";
                return Array.from(gradoFilter).some((uid) =>
                    gp.startsWith(uid.toLowerCase())
                );
            });
        }
        return data;
    }, [gradoFilter]);

    const {
        filterValue,
        statusFilter,
        programaFilter,
        page,
        rowsPerPage,
        sortDescriptor,
        setFilterValue,
        setStatusFilter,
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
        initialRowsPerPage: 5,
        initialSortColumn: "inscritos",
        initialSortDirection: "descending",
        customFilter: gradoCustomFilter,
    });

    const [selectedKeys, setSelectedKeys] = useState(new Set([]));
    const [visibleColumns, setVisibleColumns] = useState(
        new Set(INITIAL_VISIBLE_COLUMNS)
    );

    const [selectedPostulantes, setSelectedPostulantes] = useState([]);

    const headerColumns = useMemo(() => {
        if (visibleColumns === "all") return columns;

        return columns.filter((column) =>
            Array.from(visibleColumns).includes(column.uid)
        );
    }, [visibleColumns]);

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

    const renderCell = useCallback((user, columnKey) => {
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
            case "evaluados":
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
            case "docente":
                return (
                    <div className="flex flex-col">
                        <p className="text-sm text-default-400">
                            {user.docente_apellidos}
                        </p>
                        <p className="font-medium capitalize text-sm text-default-500">
                            {cellValue}
                        </p>
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);



    const topContent = useMemo(() => {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex justify-between gap-3 items-end">
                    {dataLoading ? (
                        <Skeleton className="w-full sm:max-w-[44%] h-10 rounded-lg" />
                    ) : (
                        <Input
                            isClearable
                            className="w-full sm:max-w-[44%]"
                            placeholder="Buscar por nombre..."
                            startContent={<SearchIcon />}
                            value={filterValue}
                            onClear={() => onClear()}
                            onValueChange={onSearchChange}
                        />
                    )}
                    <div className="flex gap-3 text-small text-default-400 items-center">
                        {dataLoading ? (
                            <>
                                <Skeleton className="w-full sm:w-28 h-10 rounded-lg" />
                                <Skeleton className="hidden sm:flex w-24 h-10 rounded-lg" />
                            </>
                        ) : (
                            <>
                                {/* No hay export configurado aún para esta tabla específica */}
                                {/* Dropdown Grado */}
                                <Dropdown shouldBlockScroll={false}>
                                    <DropdownTrigger className="w-full sm:w-auto md:flex lg:flex xl:flex">
                                        <Button
                                            aria-label="lista_grados"
                                            endContent={<ChevronDownIcon className="text-small" />}
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

                                <Dropdown shouldBlockScroll={false}>
                                    <DropdownTrigger className="hidden sm:flex">
                                        <Button
                                            aria-label="lista_columnas"
                                            endContent={<ChevronDownIcon className="text-small" />}
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
                            </>
                        )}
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
        dataLoading,
    ]);

    const bottomContent = useMemo(() => {
        return (
            <TablePagination
                page={page}
                pages={pages}
                setPage={setPage}
                filteredItemsLength={filteredItems.length}
                selectedKeys={selectedKeys}
                hasSelection={false}
            />
        );
    }, [page, pages, filteredItems.length, setPage, selectedKeys]);

    return (
        <DashboardCard
            title={`Resumen Evaluación Proc. Admisión ${admissionConfig.cronograma.periodo}`}
            icon={<ChevronDownIcon className="text-green-500" />}
        >
            <Table
                aria-label="Tabla de resumen de evaluación"
                layout="fixed" // Usa fixed para que se respeten los anchos definidos

                isHeaderSticky
                bottomContent={bottomContent}
                bottomContentPlacement="outside"
                classNames={{
                    wrapper:
                        "flex-1 overflow-auto w-full p-2 m-0",
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
                            aria-label={column.uid}
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
                                    : column.uid === "docente"
                                        ? { width: "150px" }
                                        : column.uid === "cobertura"
                                            ? { width: "62px" } // Cobertura o docente
                                            : column.uid === "facultad"
                                                ? { width: "59px" }
                                                : { width: "50px" } // Otras columnas
                            }
                            className="text-xs"
                            scope="col"
                        >
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody
                    emptyContent={
                        dataLoading ? (
                            <div className="flex flex-col gap-2 w-full p-2">
                                <Skeleton className="h-10 w-full rounded-lg" />
                                <Skeleton className="h-10 w-full rounded-lg" />
                                <Skeleton className="h-10 w-full rounded-lg" />
                                <Skeleton className="h-10 w-full rounded-lg" />
                                <Skeleton className="h-10 w-full rounded-lg" />
                            </div>
                        ) : "No se encontró información"
                    }
                    items={dataLoading ? [] : items}
                    className="space-y-1"
                    aria-label="Cuerpo de la tabla"
                >
                    {(item) => (
                        <TableRow
                            key={item.grado_programa}
                            aria-label={item.grado_programa}
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
        </DashboardCard>
    );
}
