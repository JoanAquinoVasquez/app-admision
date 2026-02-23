import { useState, useEffect, useMemo, useCallback } from "react";
import { useTableFilters } from "../../hooks/useTableFilters";
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
    Skeleton,
} from "@heroui/react";
import DashboardCard from "../Cards/DashboardCard";
import axios from "../../axios";
import { toast } from "react-hot-toast";
import { FileDown } from "lucide-react";

export const columns = [
    { name: "Grado y Programa", uid: "grado_programa", sortable: true },
    { name: "Pre Inscritos", uid: "preinscritos", sortable: true },
    { name: "Vacantes", uid: "vacantes", sortable: true },
    { name: "Cobertura", uid: "cobertura", sortable: true },
    { name: "Facultad", uid: "facultad" },
];

export const statusOptions = [
    { name: "DOCTORADO", uid: "DOC" },
    { name: "MAESTRÍA", uid: "MAE" },
    { name: "SEGUNDA ESPECIALIDAD", uid: "SEG" },
];

export function capitalize(s) {
    return s || ""; // No forzar minúsculas, respetar nombres de DB
}

import { SearchIcon, ChevronDownIcon } from "../../components/Table/components/Icons";
import TablePagination from "./components/TablePagination";

const INITIAL_VISIBLE_COLUMNS = [
    "grado_programa",
    "preinscritos",
    "validados",
    "aptos",
    "vacantes",
    "cobertura",
    "facultad",
    "recaudación",
];

const customPreInscritosFilter = (data, { gradoFilter }) => {
    if (gradoFilter && gradoFilter !== "all" && gradoFilter.size > 0) {
        return data.filter((user) => {
            return Array.from(gradoFilter).some(gradoNombre =>
                user.grado_programa.toLowerCase().includes(gradoNombre.toLowerCase())
            );
        });
    }
    return data;
};

export default function App({ resumenPreInscripcion, loading: dataLoading, grados = [] }) {
    const [isExporting, setIsExporting] = useState(false);
    // ✅ Aseguramos que `resumenPreInscripcion` tenga datos antes de mapear
    const users = useMemo(() => {
        if (!resumenPreInscripcion || resumenPreInscripcion.length === 0) {
            return []; // Evita errores si aún no hay datos
        }
        return resumenPreInscripcion.map((item) => ({
            id: item.grado_programa, // Usamos el nombre como ID único temporalmente
            grado_programa: item.grado_programa,
            preinscritos: item.preinscritos,
            vacantes: item.vacantes,
            cobertura: item.cobertura,
            facultad: item.facultad,
            // Agregamos info de grado si es posible parsear, sino string match
        }));
    }, [resumenPreInscripcion]);

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
        initialRowsPerPage: 5,
        initialSortColumn: "preinscritos",
        initialSortDirection: "descending",
        customFilter: customPreInscritosFilter
    });

    const handleExport = async () => {
        setIsExporting(true);
        const exportPromise = axios.get("/reporte-preinscripcion", {
            responseType: "blob",
        });

        toast.promise(exportPromise, {
            loading: "Generando reporte de preinscritos...",
            success: "Reporte generado con éxito",
            error: "Error al exportar reporte",
        });

        try {
            const response = await exportPromise;
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;

            const contentDisposition = response.headers["content-disposition"];
            let fileName = `reporte_preinscritos_${new Date().toLocaleDateString('es-PE').replace(/\//g, '-')}.xlsx`;

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
            case "preinscritos":
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
                    <div className="flex flex-col w-full">
                        <p className="text-bold text-small capitalize">
                            {cellValue}%
                        </p>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                                className="bg-blue-600 h-2.5 rounded-full"
                                style={{
                                    width: `${Math.min(cellValue, 100)}%`,
                                }}
                            ></div>
                        </div>
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
            default:
                return cellValue;
        }
    }, []);



    const topContent = useMemo(() => {
        return (
            <div
                className="flex flex-col gap-4"
                id="tabla_resumen_preinscripcion"
            >
                <div className="flex justify-between gap-3 items-end">
                    <Input
                        isClearable
                        className="w-full sm:max-w-[44%]"
                        placeholder="Buscar ..."
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
                                    id="grado"
                                    variant="flat"
                                    className="h-10 w-full"
                                >
                                    Grado
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Filtro de Grados"
                                closeOnSelect={false}
                                selectedKeys={gradoFilter}
                                selectionMode="multiple"
                                onSelectionChange={setGradoFilter}
                            >
                                {grados.map((item) => {
                                    const nombre = item.nombre;
                                    const uid = item.nombre;
                                    return (
                                        <DropdownItem
                                            key={uid}
                                            textValue={nombre}
                                            className="capitalize"
                                        >
                                            {capitalize(nombre)}
                                        </DropdownItem>
                                    );
                                })}
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
        onSearchChange,
        onClear,
        grados, // ✅ IMPORTANTE: Re-generar barra de herramientas cuando carguen los grados
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
            title="Resumen Preinscripción"
        >
            <Table
                aria-label="preinscritos_resumen_table"
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
