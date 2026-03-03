import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import useGrado from "../../data/dataGrados";
import { Skeleton } from "@heroui/react";
import { toast } from "react-hot-toast";
import MultiSelect from "../../components/Select/SelectMultiple";
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
} from "@heroui/react";
import useDataIngresantes from "../../data/Resultados/dataIngresantes";
import Select from "../../components/Select/Select";
import useProgramasHabilitados from "../../data/Inscripcion/dataProgramasHabilitados";
import axios from "../../axios";
import { useTableFilters } from "../../hooks/useTableFilters";

export const columns = [
    { name: "ID", uid: "id", sortable: true },
    { name: "Nombres Completos", uid: "nombre_completo", sortable: true },
    { name: "Grado y Programa", uid: "grado", sortable: true },
    { name: "Doc. Identidad", uid: "num_iden", sortable: true },
    { name: "Contacto", uid: "contacto", sortable: true },
    { name: "Mérito Prog.", uid: "merito_programa", sortable: true },
    { name: "Mérito Gen.", uid: "merito_general", sortable: true },
    { name: "Puntaje", uid: "nota_final", sortable: true },
    { name: "Matrícula", uid: "matricula_pagada", sortable: true },
    { name: "Pensión", uid: "pension_pagada", sortable: true },
    // { name: "Estado", uid: "estado", sortable: true },
    // { name: "Acciones", uid: "actions" },
];

export const statusOptions = [
    { name: "Pagó", uid: "1" },
    { name: "No pagó", uid: "0" },
];

export function capitalize(s) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

import {
    VerticalDotsIcon,
    SearchIcon,
    ChevronDownIcon,
} from "./components/Icons";
import { useInscritosRenderCell } from "./components/useInscritosRenderCell";
import TablePagination from "./components/TablePagination";
import { statusColorMap } from "./utils";


const INITIAL_VISIBLE_COLUMNS = [
    "id",
    "nombre_completo",
    "grado",
    "num_iden",
    "merito_programa",
    "merito_general",
    "nota_final",
    "matricula_pagada",
    "pension_pagada",
];

export default function App() {
    const { ingresantes, refetch, loading: dataLoading } = useDataIngresantes();

    const { grados } = useGrado();
    const { filteredProgramasHabilitados, filterByGrado } =
        useProgramasHabilitados();

    const [loading, setLoading] = useState(false); // local loading for actions
    const [isExporting, setIsExporting] = useState(false);


    // ✅ Aseguramos que `ingresantes` tenga datos antes de mapear
    const users = useMemo(() => {
        if (!ingresantes || ingresantes.length === 0) {
            return []; // Evita errores si aún no hay datos
        }
        return ingresantes.map((item) => {
            return {
                id: item.inscripcion_id,
                programa_id: item.programa_id,
                programa: item.programa,
                nombre_completo: [item.apellidos, item.nombres].join(" "),
                grado: item.grado,
                grado_id: item.grado_id,
                nota_final: item.nota_final,
                merito_programa: item.merito_programa,
                merito_general: item.merito_general,
                tipo_doc: item.tipo_doc,
                num_iden: item.num_iden,
                celular: item.celular,
                email: item.email,
                matricula_pagada: item.matricula_pagada,
                pension_pagada: item.pension_pagada,
            };
        });
    }, [ingresantes]);

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
        initialSortColumn: "nota_final",
        initialSortDirection: "descending",
    });

    useEffect(() => {
        if (gradoFilter !== "all" && gradoFilter !== null && gradoFilter !== undefined) {
            filterByGrado(gradoFilter);
        }
    }, [gradoFilter, filterByGrado]);

    const handleExportMultiple = async (type) => {
        setLoading(true);

        const endpointMap = {
            "Ingresantes por Programa PDF": "reporte-ingresantes-programa",
            "Reporte Ingresantes PDF": "reporte-final-notas",
            "Reporte Resultados Excel": "reporte-notas-final-excel",
            "Reporte Programas Aperturados": "programas-aperturados-pdf",
            "Reporte Programas No Aperturados": "programas-no-aperturados-pdf",
        };

        const fileExtensionMap = {
            "Ingresantes por Programa PDF": "pdf",
            "Reporte Ingresantes PDF": "pdf",
            "Reporte Resultados Excel": "xlsx",
            "Reporte Programas Aperturados": "pdf",
            "Reporte Programas No Aperturados": "pdf",
        };

        const url = endpointMap[type];
        const fileExt = fileExtensionMap[type];

        if (!url) {
            toast.error("Tipo de reporte no válido");
            setLoading(false);
            return;
        }

        setIsExporting(true);
        const exportPromise = axios.get(url, {
            responseType: "blob",
        });

        toast.promise(exportPromise, {
            loading: `Generando ${type.toLowerCase()}...`,
            success: "Archivo generado con éxito",
            error: "Error al generar el archivo",
        });

        try {
            const response = await exportPromise;

            // Obtener el nombre de archivo desde los headers si existe
            const disposition = response.headers["content-disposition"];
            let fileName = `${type.replace(/\s+/g, "_").toLowerCase()}_${new Date().toLocaleDateString('es-PE').replace(/\//g, '-')}.${fileExt}`;

            if (disposition) {
                const match = disposition.match(/filename="?([^"]+)"?/);
                if (match?.[1]) fileName = match[1];
            }

            const urlBlob = window.URL.createObjectURL(
                new Blob([response.data])
            );
            const link = document.createElement("a");
            link.href = urlBlob;
            link.setAttribute("download", fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(urlBlob);
        } catch (error) {
            // Error managed by toast.promise
        } finally {
            setIsExporting(false);
        }
    };

    const [selectedKeys, setSelectedKeys] = useState(new Set([]));
    const [visibleColumns, setVisibleColumns] = useState(
        new Set(INITIAL_VISIBLE_COLUMNS)
    );

    const headerColumns = useMemo(() => {
        return visibleColumns === "all"
            ? columns
            : columns.filter((column) => visibleColumns.has(column.uid));
    }, [visibleColumns]);

    const baseRenderCell = useInscritosRenderCell({});

    const renderCell = useCallback((user, columnKey) => {
        const cellValue = user[columnKey];

        // Map num_iden to doc_iden for base renderer
        if (columnKey === "num_iden") {
            // Create a proxy user object for baseRenderCell that has doc_iden
            const proxyUser = { ...user, doc_iden: user.num_iden };
            return baseRenderCell(proxyUser, "doc_iden");
        }

        if (columnKey === "id") {
            return (
                <div className="flex flex-col">
                    <p className="text-sm text-default-400 text-center">
                        {cellValue}
                    </p>
                </div>
            );
        }

        if (["merito_programa", "merito_general", "nota_final"].includes(columnKey)) {
            return (
                <div className="flex flex-col">
                    <p className="font-medium capitalize text-sm text-default-500">
                        {cellValue}
                    </p>
                </div>
            );
        }

        if (columnKey === "contacto") {
            return (
                <div className="flex flex-col">
                    <p className="text-sm text-default-400">{user.email}</p>
                    <p className="font-medium capitalize text-sm text-default-500">
                        {user.celular}
                    </p>
                </div>
            );
        }

        if (columnKey === "matricula_pagada" || columnKey === "pension_pagada") {
            return (
                <Chip
                    className="capitalize text-sm font-medium"
                    color={statusColorMap[cellValue === 0 ? 0 : 1]}
                    size="sm"
                    variant="flat"
                >
                    {cellValue === 0 ? "No pagó" : columnKey === "pension_pagada" ? `Pagó (${cellValue})` : "Pagó"}
                </Chip>
            );
        }

        return baseRenderCell(user, columnKey);
    }, [baseRenderCell]);


    const formDataRef = useRef(new FormData());
    const handleFileUpload = (inputId, file) => {
        formDataRef.current.set(inputId, file);
    };

    const topContent = useMemo(() => {
        return (
            <div className="flex flex-col gap-2 mb-4">
                {/* 1) Fila de Búsqueda y Columnas */}
                <div className="flex flex-col md:flex-row gap-4 w-full">
                    <div className="w-full md:flex-1">
                        {dataLoading ? (
                            <Skeleton className="w-full h-12 rounded-lg" />
                        ) : (
                            <Input
                                isClearable
                                className="w-full h-12 focus:outline-none"
                                classNames={{
                                    input: "placeholder:text-gray-800 placeholder:opacity-100 text-gray-900",
                                }}
                                placeholder="Buscar al postulante"
                                startContent={<SearchIcon />}
                                value={filterValue}
                                onClear={onClear}
                                onValueChange={onSearchChange}
                            />
                        )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto shrink-0 justify-end">
                        {dataLoading ? (
                            <Skeleton className="h-12 w-full sm:w-24 rounded-lg" />
                        ) : (
                            <Dropdown shouldBlockScroll={false}>
                                <DropdownTrigger className="w-full sm:w-auto">
                                    <Button
                                        aria-label="columnas"
                                        endContent={<ChevronDownIcon className="text-small" />}
                                        variant="flat"
                                        className="h-12 w-full sm:w-auto"
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
                        )}
                    </div>
                </div>

                {/* 2) Fila de Filtros Avanzados y Exportación */}
                <div className="w-full flex flex-col md:flex-row md:items-end gap-4">
                    <div className="w-full md:w-1/4">
                        {dataLoading ? (
                            <Skeleton className="w-full h-12 rounded-lg" />
                        ) : (
                            <Select
                                label="Grado Académico"
                                variant="flat"
                                className="w-full h-12 text-sm"
                                defaultItems={grados.map((item) => ({
                                    key: item.id.toString(),
                                    textValue: item.nombre,
                                    ...item,
                                }))}
                                selectedKey={gradoFilter !== "all" ? gradoFilter?.toString() : null}
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
                        )}
                    </div>

                    <div className="w-full md:flex-1">
                        {dataLoading ? (
                            <Skeleton className="w-full h-12 rounded-lg" />
                        ) : (
                            <Select
                                label="Programa"
                                className="w-full h-12 text-sm"
                                defaultItems={
                                    gradoFilter !== "all"
                                        ? filteredProgramasHabilitados.map((item) => ({
                                            key: item.id.toString(),
                                            textValue: item.nombre,
                                            ...item,
                                        }))
                                        : []
                                }
                                selectedKey={
                                    programaFilter !== "all" && programaFilter
                                        ? programaFilter?.toString()
                                        : null
                                }
                                onSelectionChange={(programa_id) => {
                                    if (programa_id === null) {
                                        setProgramaFilter("all");
                                    } else {
                                        setProgramaFilter(programa_id);
                                    }
                                }}
                                disabled={gradoFilter === "all"}
                            />
                        )}
                    </div>

                    <div className="w-full md:w-auto md:ml-auto">
                        {dataLoading ? (
                            <Skeleton className="w-full sm:w-[180px] h-12 rounded-lg" />
                        ) : (
                            <Dropdown shouldBlockScroll={false}>
                                <DropdownTrigger className="w-full sm:w-auto">
                                    <Button
                                        aria-label="exportar reportes"
                                        endContent={<ChevronDownIcon className="text-small" />}
                                        color="primary"
                                        className="h-12 w-full sm:w-auto"
                                        isLoading={isExporting}
                                    >
                                        Exportar Reportes
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu>
                                    <DropdownItem textValue="Ingresantes por Programa PDF" onPress={() => handleExportMultiple("Ingresantes por Programa PDF")}>N° Ingresantes por Programa PDF</DropdownItem>
                                    <DropdownItem textValue="Reporte Ingresantes PDF" onPress={() => handleExportMultiple("Reporte Ingresantes PDF")}>Reporte Ingresantes PDF</DropdownItem>
                                    <DropdownItem textValue="Reporte Resultados Excel" onPress={() => handleExportMultiple("Reporte Resultados Excel")}>Reporte Resultados Excel</DropdownItem>
                                    <DropdownItem textValue="Reporte Programas Aperturados" onPress={() => handleExportMultiple("Reporte Programas Aperturados")}>Reporte Programas Aperturados</DropdownItem>
                                    <DropdownItem textValue="Reporte Programas No Aperturados" onPress={() => handleExportMultiple("Reporte Programas No Aperturados")}>Reporte Programas No Aperturados</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        )}
                    </div>
                </div>

                {/* 3) Info de resultados y paginación en el mismo layout de TableInscritos */}
                <div className="flex justify-between items-center w-full mt-2">
                    <div className="flex items-center">
                        <span className="text-default-400 text-small">
                            {`${filteredItems.length} resultados`}
                        </span>
                    </div>

                    <div className="flex items-center">
                        <label className="flex items-center text-default-400 text-small">
                            Filas por página:
                            <select
                                className="bg-transparent outline-none text-default-400 text-small ml-2"
                                value={rowsPerPage}
                                onChange={(e) => {
                                    setRowsPerPage(Number(e.target.value));
                                    setPage(1);
                                }}
                            >
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="30">30</option>
                            </select>
                        </label>
                    </div>
                </div>
            </div>
        );
    }, [
        filterValue,
        onSearchChange,
        statusFilter,
        visibleColumns,
        onRowsPerPageChange,
        onClear,
        users.length,
        grados,
        gradoFilter,
        filteredProgramasHabilitados,
        programaFilter,
        dataLoading,
        isExporting,
        filteredItems.length,
        rowsPerPage,
        setGradoFilter,
        setProgramaFilter,
        setRowsPerPage,
        setPage
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
        [page, pages, filteredItems.length, setPage, selectedKeys]
    );

    return (
        <Table
            aria-label="Example table"
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
                emptyContent={dataLoading ? (
                    <div className="flex flex-col gap-2 w-full p-2">
                        <Skeleton className="h-10 w-full rounded-lg" />
                        <Skeleton className="h-10 w-full rounded-lg" />
                        <Skeleton className="h-10 w-full rounded-lg" />
                    </div>
                ) : "No se encontró información"}
                items={items}
                className="space-y-1" // Reducir espacio entre filas
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
    );
}