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
import { FileDown, UsersIcon } from "lucide-react";

export const columns = [
    { name: "Grado y Programa", uid: "grado_programa", sortable: true },
    { name: "Pre Inscritos", uid: "preinscritos", sortable: true },
    { name: "Vacantes", uid: "vacantes", sortable: true },
    { name: "Cobertura", uid: "cobertura", sortable: true },
    { name: "Facultad", uid: "facultad" },
];

export const statusOptions = [
    { name: "Doctorado", uid: "Doctorado" },
    { name: "Maestria", uid: "Maestria" },
    { name: "Segunda Especialidad Profesional", uid: "Segunda Especialidad Profesional" },
];

export function capitalize(s) {
    if (!s) return "";
    // Title Case: primera letra de cada palabra en mayúscula, resto en minúscula
    return s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
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



export default function App({ resumenPreInscripcion, loading: dataLoading, grados = [] }) {
    const [isExporting, setIsExporting] = useState(false);

    // gradoFilter: estado LOCAL (igual que Table.jsx)
    // Se inicializa vacío y se sincroniza cuando los grados dinámicos del API carguen
    const [gradoFilter, setGradoFilter] = useState(new Set());

    // Cuando los grados cargan desde el API, activar todos por defecto
    useEffect(() => {
        if (grados && grados.length > 0) {
            setGradoFilter(new Set(grados.map((g) => g.nombre)));
        }
    }, [grados]);

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
        }));
    }, [resumenPreInscripcion]);

    // useCallback: referencia estable para evitar bucle infinito
    // (customFilter nuevo en cada render → filteredItems nuevo → useEffect → setState → bucle)
    const gradoCustomFilter = useCallback((data) => {
        if (
            gradoFilter instanceof Set &&
            gradoFilter.size > 0 &&
            gradoFilter.size < grados.length
        ) {
            return data.filter((item) => {
                const gp = item.grado_programa?.toLowerCase() ?? "";
                return Array.from(gradoFilter).some((uid) =>
                    gp.startsWith(uid.toLowerCase())
                );
            });
        }
        return data;
    }, [gradoFilter, grados.length]);

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
        initialSortColumn: "preinscritos",
        initialSortDirection: "descending",
        customFilter: gradoCustomFilter,
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
                    {dataLoading ? (
                        <Skeleton className="w-full sm:max-w-[44%] h-12 rounded-lg" />
                    ) : (
                        <Input
                            isClearable
                            className="w-full sm:max-w-[44%] h-12"
                            placeholder="Buscar ..."
                            startContent={<SearchIcon />}
                            value={filterValue}
                            onClear={onClear}
                            onValueChange={onSearchChange}
                        />
                    )}
                    <div className="flex gap-3">
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
                                    className="flex items-center gap-2 rounded-xl h-10 w-full sm:w-auto"
                                >
                                    Exportar
                                </Button>
                                {/* Dropdown Grado */}
                                <Dropdown shouldBlockScroll={false}>
                                    <DropdownTrigger className="w-full sm:w-auto md:flex lg:flex xl:flex">
                                        <Button
                                            endContent={<ChevronDownIcon className="text-small" />}
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

                                <Dropdown shouldBlockScroll={false}>
                                    <DropdownTrigger className="hidden sm:flex">
                                        <Button
                                            endContent={<ChevronDownIcon className="text-small" />}
                                            variant="flat"
                                            className="h-10"
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
        onSearchChange,
        onClear,
        grados, // ✅ IMPORTANTE: Re-generar barra de herramientas cuando carguen los grados
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
            title="Resumen Preinscripción"
            icon={<UsersIcon className="w-4 h-4" />}
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
