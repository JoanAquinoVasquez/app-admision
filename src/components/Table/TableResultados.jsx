import { useState, useMemo, useCallback, useEffect } from "react";
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
    DropdownItem,
    DropdownMenu,
} from "@heroui/react";
import DashboardCard from "../../components/Cards/DashboardCard";
import { SearchIcon, ChevronDownIcon } from "../../components/Table/components/Icons";
import TablePagination from "./components/TablePagination";
import MultiSelect from "../../components/Select/SelectMultiple";
import axios from "../../axios";
import { toast } from "react-hot-toast";
import { FileDown } from "lucide-react";

export const columns = [
    { name: "Grado y Programa", uid: "grado_programa", sortable: true },
    { name: "Ingresantes", uid: "ingresantes_total", sortable: true },
    { name: "Inscritos", uid: "inscritos_total", sortable: true },
    { name: "Nota Prom.", uid: "promedio_nota", sortable: true },
];

export const statusOptions = [
    { name: "Doctorado", uid: "Doctorado" },
    { name: "Maestria", uid: "Maestria" },
    { name: "Segunda Especialidad Profesional", uid: "Segunda Especialidad Profesional" },
];

export function capitalize(s) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

const INITIAL_VISIBLE_COLUMNS = [
    "grado_programa",
    "ingresantes_total",
    "inscritos_total",
    "promedio_nota",
];

export default function TableResultados({ ingresantesPrograma, grados, loading: dataLoading }) {
    const [isExporting, setIsExporting] = useState(false);
    // ✅ Aseguramos que `ingresantesPrograma` tenga datos antes de mapear
    const users = useMemo(() => {
        if (!ingresantesPrograma || ingresantesPrograma.length === 0) {
            return []; // Evita errores si aún no hay datos
        }
        return ingresantesPrograma.map((item) => ({
            id: item.grado_programa, // use unique id
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

    const {
        filterValue,
        gradoFilter,
        page,
        rowsPerPage,
        sortDescriptor,
        setFilterValue,
        setGradoFilter,
        setPage,
        setRowsPerPage,
        setSortDescriptor,
        items,
        pages,
        onSearchChange,
        onClear,
        filteredItems,
    } = useTableFilters(users, {
        initialRowsPerPage: 5,
        initialSortColumn: "ingresantes_total",
        initialSortDirection: "descending",
        // Los 3 grados activos por defecto; desmarcar uno filtra la tabla
        initialGradoFilter: new Set(["Doctorado", "Maestria", "Segunda Especialidad Profesional"]),
        totalGradoOptions: statusOptions.length,
    });

    const handleExport = async () => {
        setIsExporting(true);
        const exportPromise = axios.get("/reporte-ingresantes-programa", {
            responseType: "blob",
        });

        toast.promise(exportPromise, {
            loading: "Generando reporte de resultados...",
            success: "Reporte generado con éxito",
            error: "Error al exportar reporte",
        });

        try {
            const response = await exportPromise;
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;

            const contentDisposition = response.headers["content-disposition"];
            let fileName = `reporte_resultados_${new Date().toLocaleDateString('es-PE').replace(/\//g, '-')}.xlsx`;

            if (contentDisposition) {
                const match = contentDisposition.match(/filename="?([^"]+)"?/);
                if (match?.[1]) fileName = match[1];
            }

            link.setAttribute("download", fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            // Managed by toast.promise
        } finally {
            setIsExporting(false);
        }
    };

    const [selectedKeys, setSelectedKeys] = useState(new Set([]));
    const [visibleColumns, setVisibleColumns] = useState(
        new Set(INITIAL_VISIBLE_COLUMNS)
    );

    const headerColumns = useMemo(() => {
        if (visibleColumns === "all") return columns;

        return columns.filter((column) =>
            Array.from(visibleColumns).includes(column.uid)
        );
    }, [visibleColumns]);

    const renderCell = useCallback((user, columnKey) => {
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
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);

    const topContent = useMemo(() => {
        return (
            <div className="flex flex-col gap-4">
                {/* Top Row: Actions Only */}
                <div className="flex justify-end items-center gap-2 w-full px-1">
                    {dataLoading ? (
                        <>
                            <Skeleton className="w-full sm:w-28 h-10 rounded-lg" />
                            <Skeleton className="w-full sm:w-24 h-10 rounded-lg" />
                            <Skeleton className="hidden sm:flex w-24 h-10 rounded-lg" />
                        </>
                    ) : (
                        <>
                            <Button
                                onPress={handleExport}
                                color="primary"
                                size="md"
                                variant="flat"
                                isLoading={isExporting}
                                startContent={!isExporting && <FileDown className="h-5 w-5" />}
                                className="flex items-center gap-2 rounded-xl h-10 px-4 font-semibold"
                            >
                                Exportar
                            </Button>

                            <Dropdown shouldBlockScroll={false}>
                                <DropdownTrigger className="hidden sm:flex">
                                    <Button
                                        endContent={
                                            <ChevronDownIcon className="text-small" />
                                        }
                                        variant="flat"
                                        className="h-10 px-4 font-semibold"
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

                {/* Filter Section: Optimized Distribution */}
                <div className="flex flex-col gap-3 bg-slate-50/50 p-4 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-start">
                        {dataLoading ? (
                            <>
                                <Skeleton className="w-full h-14 rounded-lg" />
                                <Skeleton className="w-full h-14 rounded-lg" />
                            </>
                        ) : (
                            <>
                                {/* Search Field */}
                                <Input
                                    isClearable
                                    variant="bordered"
                                    label="Buscar programa"
                                    placeholder="Nombre..."
                                    startContent={<SearchIcon className="text-slate-400" />}
                                    value={filterValue}
                                    onClear={onClear}
                                    onValueChange={onSearchChange}
                                    classNames={{
                                        inputWrapper: "bg-white border-slate-200 hover:border-blue-400 focus-within:border-blue-500 transition-colors shadow-sm",
                                    }}
                                />

                                {/* MultiSelect Degree */}
                                <MultiSelect
                                    label="Filtrar por Grado"
                                    placeholder="Seleccione uno o varios"
                                    defaultItems={statusOptions.map((item) => ({
                                        key: item.uid,
                                        textValue: item.name,
                                        ...item,
                                    }))}
                                    selectedKeys={gradoFilter}
                                    onSelectionChange={setGradoFilter}
                                />
                            </>
                        )}
                    </div>
                </div>

                {/* Stats and Results Info */}
                <div className="flex justify-between items-center px-2 py-1 bg-blue-50/50 rounded-lg">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        <span className="text-blue-700 text-[11px] font-bold uppercase tracking-wider">
                            {`${filteredItems.length} programas`}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-slate-500 text-[11px] font-medium">Filas:</span>
                        <select
                            value={rowsPerPage}
                            onChange={(e) => {
                                setRowsPerPage(Number(e.target.value));
                                setPage(1);
                            }}
                            className="bg-white border border-slate-200 rounded px-1.5 py-0.5 text-[11px] text-slate-600 outline-none hover:border-blue-300 transition-colors shadow-sm"
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="30">30</option>
                            <option value="50">50</option>
                        </select>
                    </div>
                </div>
            </div>
        );
    }, [
        filterValue,
        gradoFilter,
        visibleColumns,
        onSearchChange,
        onClear,
        setGradoFilter,
        setVisibleColumns,
        dataLoading,
        isExporting,
        filteredItems.length,
        rowsPerPage,
        setRowsPerPage,
        setPage,
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
            title={`Resumen Resultados`}
        >
            <Table
                aria-label="Example table"
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
                                    : { width: "40px" } // Otras columnas
                            }
                            className="text-xs"
                            aria-label={column.name}
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
        </DashboardCard>
    );
}
