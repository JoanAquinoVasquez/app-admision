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
    { name: "DOCTORADO", uid: "DOC" },
    { name: "MAESTRÍA", uid: "MAE" },
    { name: "SEGUNDA ESPECIALIDAD", uid: "SEG" },
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
                <div className="flex justify-between gap-3 items-end">
                    <Input
                        isClearable
                        className="w-full sm:max-w-[44%]"
                        placeholder="Buscar por nombre..."
                        startContent={<SearchIcon />}
                        value={filterValue}
                        onClear={onClear}
                        onValueChange={onSearchChange}
                    />
                    <div className="flex gap-3">
                        <Button
                            onPress={handleExport}
                            color="primary"
                            size="md"
                            variant="flat"
                            isLoading={isExporting}
                            startContent={!isExporting && <FileDown className="h-5 w-5" />}
                            className="flex items-center gap-2 rounded-xl"
                        >
                            Exportar
                        </Button>
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
        visibleColumns,
        onSearchChange,
        onClear,
        setGradoFilter,
        setVisibleColumns
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
            title={`Resumen Resultados Proc. Admisión ${admissionConfig.cronograma.periodo}`}
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
                    emptyContent={dataLoading ? (
                        <div className="flex flex-col gap-2 w-full p-2">
                            <Skeleton className="h-10 w-full rounded-lg" />
                            <Skeleton className="h-10 w-full rounded-lg" />
                            <Skeleton className="h-10 w-full rounded-lg" />
                        </div>
                    ) : "No se encontró información"}
                    items={items}
                    isLoading={dataLoading}
                    loadingContent={
                        <div className="w-full h-full flex flex-col gap-2 p-4 bg-white/50 backdrop-blur-sm z-50">
                            <Skeleton className="h-10 w-full rounded-lg" />
                            <Skeleton className="h-10 w-full rounded-lg" />
                            <Skeleton className="h-10 w-full rounded-lg" />
                            <Skeleton className="h-10 w-full rounded-lg" />
                            <Skeleton className="h-10 w-full rounded-lg" />
                        </div>
                    }
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
