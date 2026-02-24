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
    const [selectedKeysPrograma, setSelectedKeysPrograma] = useState([]);

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
            <>
                {/* Overlay de carga (solo se renderiza si loading es true) */}
                <div className="flex flex-wrap gap-4 w-full">
                    {/* Input de búsqueda */}
                    <div className="w-full sm:w-[60%] md:w-[18%]">
                        <Input
                            isClearable
                            className="w-full h-10 focus:outline-none"
                            classNames={{
                                input: "placeholder:text-gray-800 placeholder:opacity-100 text-gray-900",
                            }}
                            placeholder="Buscar al postulante"
                            startContent={<SearchIcon />}
                            value={filterValue}
                            onClear={onClear}
                            onValueChange={onSearchChange}
                        />
                    </div>

                    {/* Select Grado Académico */}
                    <div className="w-full sm:w-[40%] md:w-[15%]">
                        <Select
                            label="Grado Académico"
                            variant="flat"
                            defaultItems={grados.map((item) => ({
                                key: item.id.toString(),
                                textValue: item.nombre,
                                ...item,
                            }))}
                            onSelectionChange={(grado_id) => {
                                if (!grado_id) {
                                    setGradoFilter("all");
                                    setProgramaFilter([]); // Vaciar programas
                                    setSelectedKeysPrograma([]); // Vaciar selección de programas
                                } else {
                                    setGradoFilter(parseInt(grado_id));
                                    setProgramaFilter([]); // Reiniciar programas cuando se cambia de grado
                                    setSelectedKeysPrograma([]);
                                }
                            }}
                        />
                    </div>

                    {/* Select Programa */}
                    <div className="w-full sm:w-[60%] md:w-[30%] lg:w-[45%]">
                        <MultiSelect
                            label="Selecciona Programas"
                            defaultItems={
                                gradoFilter !== "all"
                                    ? filteredProgramasHabilitados.map(
                                        (item) => ({
                                            key: item.id.toString(),
                                            textValue: item.nombre,
                                            ...item,
                                        })
                                    )
                                    : [] // Si no hay grado seleccionado, no mostrar opciones
                            }
                            className="w-full min-h-[50px]"
                            selectedKeys={selectedKeysPrograma}
                            onSelectionChange={(keys) => {
                                setSelectedKeysPrograma(keys);
                                setProgramaFilter(
                                    Array.from(keys).map((key) => parseInt(key))
                                ); // Convertir a números
                            }}
                            isRequired={true}
                            disabled={gradoFilter === "all"}
                            closeOnSelect={false} // Mantener el dropdown abierto al seleccionar
                        />
                    </div>

                    {/* Botón de PDF */}
                    <div className="w-full sm:w-auto md:w-[10%] mb-3 flex items-end gap-2">
                        <Dropdown>
                            <DropdownTrigger>
                                <Button
                                    color="primary"
                                    className="h-10"
                                    aria-label="reportes"
                                    isLoading={isExporting}
                                >
                                    Exportar
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu>
                                <DropdownItem
                                    textValue="Ingresantes por Programa PDF"
                                    onPress={() =>
                                        handleExportMultiple(
                                            "Ingresantes por Programa PDF"
                                        )
                                    }
                                >
                                    N° Ingresantes por Programa PDF
                                </DropdownItem>

                                <DropdownItem
                                    textValue="Reporte Ingresantes PDF"
                                    onPress={() =>
                                        handleExportMultiple(
                                            "Reporte Ingresantes PDF"
                                        )
                                    }
                                >
                                    Reporte Ingresantes PDF
                                </DropdownItem>
                                <DropdownItem
                                    textValue="Reporte Resultados Excel"
                                    onPress={() =>
                                        handleExportMultiple(
                                            "Reporte Resultados Excel"
                                        )
                                    }
                                >
                                    Reporte Resultados Excel
                                </DropdownItem>
                                <DropdownItem
                                    textValue="Reporte Programas Aperturados"
                                    onPress={() =>
                                        handleExportMultiple(
                                            "Reporte Programas Aperturados"
                                        )
                                    }
                                >
                                    Reporte Programas Aperturados
                                </DropdownItem>
                                <DropdownItem
                                    textValue="Reporte Programas No Aperturados"
                                    onPress={() =>
                                        handleExportMultiple(
                                            "Reporte Programas No Aperturados"
                                        )
                                    }
                                >
                                    Reporte Programas No Aperturados
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                        <Dropdown>
                            <DropdownTrigger className="w-full sm:w-auto">
                                <Button
                                    aria-label="lista_columna"
                                    endContent={
                                        <ChevronDownIcon className="text-small" />
                                    }
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
                                        textValue={column.name}
                                        key={column.uid}
                                        className="capitalize"
                                    >
                                        {capitalize(column.name)}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                    {/* 📊 Resumen de resultados */}
                    <div className="flex justify-between items-center w-full">
                        <div className="flex items-center">
                            <span className="text-default-400 text-small">
                                {`${filteredItems.length} ingresantes encontrados`}
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
