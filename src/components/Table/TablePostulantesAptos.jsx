import { useState, useCallback, useMemo, useEffect } from "react";
import { useTableFilters } from "../../hooks/useTableFilters";
import useGrado from "../../data/dataGrados";
import { Skeleton } from "@heroui/react";

import MultiSelect from "../../components/Select/SelectMultiple";
import UploadNotesModal from "./modals/UploadNotesModal";
import GradeModal from "./modals/GradeModal";
import usePostulanteExports from "../../hooks/usePostulanteExports";
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
import useInscripcioNota from "../../data/Inscripcion/dataInscripcionNota";
import Select from "../../components/Select/Select";

import useProgramasHabilitados from "../../data/Inscripcion/dataProgramasHabilitados";

export const columns = [
    { name: "ID", uid: "id", sortable: true },
    { name: "Nombres Completos", uid: "nombre_completo", sortable: true },
    { name: "Grado y Programa", uid: "grado", sortable: true },
    { name: "Doc. Identidad", uid: "doc_iden", sortable: true },
    { name: "Nota CV", uid: "nota_expediente", sortable: true },
    { name: "Nota Entrevista", uid: "nota_entrevista", sortable: true },
    { name: "Nota Examen", uid: "nota_examen", sortable: true },
    // { name: "Estado", uid: "estado", sortable: true },
    { name: "Acciones", uid: "actions" },
];

export const statusOptions = [
    { name: "Validado", uid: "1" },
    { name: "Pendiente", uid: "0" },
    { name: "Observado", uid: "2" },
];

export function capitalize(s) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

import {
    PlusIcon,
    VerticalDotsIcon,
    RefreshIcon,
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
    "doc_iden",
    "nota_expediente",
    "nota_entrevista",
    "nota_examen",
    // "estado",
    "actions",
];

export default function App() {
    const { inscripcioNota, fetchInscripcionNota, loading: dataLoading } = useInscripcioNota();
    const [validarId, setValidarId] = useState(null);
    const [isObservarOpen, setIsObservarOpen] = useState(false);

    const { grados, loading: gradosLoading } = useGrado();
    const { filteredProgramasHabilitados, filterByGrado, loading: programasLoading } = useProgramasHabilitados();

    const [programasPosibles, setProgramasPosibles] = useState([]);
    const [programasFiltrados, setProgramasFiltrados] = useState([]);
    const [isNotaEntrevista, setIsNotaEntrevista] = useState(false);

    const [selectedNota, setSelectedNota] = useState("");
    const [grado_id, setGrado_id] = useState("");
    const [gradoSelected, setGradoSelected] = useState("");
    const [editMode, setEditMode] = useState(false);
    const toggleEditMode = () => setEditMode(!editMode);
    // loading state removed as it was only for export/internal actions now handled by hook or modals
    // But dataLoading is from useInscripcioNota
    const { loading: exportLoading, handleExport } = usePostulanteExports();
    const [selectedKeysPrograma, setSelectedKeysPrograma] = useState([]);

    // ✅ Estado que indica si es la carga inicial (para mostrar Skeletons solo la primera vez)
    const isInitialLoading = dataLoading && (!inscripcioNota || inscripcioNota.length === 0);

    // ✅ Aseguramos que `inscripcioNota` tenga datos antes de mapear
    const users = useMemo(() => {
        if (!inscripcioNota || inscripcioNota.length === 0) {
            return []; // Evita errores si aún no hay datos
        }
        return inscripcioNota
            .filter((item) => item.val_fisico == 1) // Filtra solo los elementos con val_fisico === 1
            .map((item) => {
                return {
                    id: item.id,
                    postulante_id: item.postulante_id,
                    nombre_completo: [
                        item.postulante.ap_paterno,
                        item.postulante.ap_materno,
                        item.postulante.nombres,
                    ].join(" "),
                    grado: item.programa.grado.nombre,
                    grado_id: item.programa.grado.id,
                    programa_id: item.programa.id,
                    programa: item.programa.nombre,
                    doc_iden: item.postulante.num_iden,
                    tipo_doc: item.postulante.tipo_doc,
                    voucher: item.codigo,
                    nota_entrevista: item.nota?.entrevista
                        ? item.nota?.entrevista
                        : "-",
                    nota_expediente: item.nota?.cv ? item.nota?.cv : "-",
                    nota_examen: item.nota?.examen ? item.nota?.examen : "-",
                    estado: item.val_fisico,
                };
            });
    }, [inscripcioNota]);


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
    } = useTableFilters(users);

    const [selectedKeys, setSelectedKeys] = useState(new Set([]));
    const [visibleColumns, setVisibleColumns] = useState(
        new Set(INITIAL_VISIBLE_COLUMNS)
    );



    const headerColumns = useMemo(() => {
        return visibleColumns === "all"
            ? columns
            : columns.filter((column) => visibleColumns.has(column.uid));
    }, [visibleColumns]);


    const notaStats = useMemo(() => {
        const conNota = filteredItems.filter((item) => {
            return !isNaN(parseFloat(item.nota_expediente));
        }).length;

        const sinNota = filteredItems.length - conNota;

        return { conNota, sinNota };
    }, [filteredItems]);

    const onExport = (type) => {
        handleExport(type, {
            selectedPrograms: selectedKeysPrograma,
            gradoFilter: gradoFilter,
            programaFilter: programaFilter,
        });
    }

    const renderActions = useCallback((user) => (
        <div className="relative flex justify-end items-center gap-2">
            <Dropdown shouldBlockScroll={false}>
                <DropdownTrigger>
                    <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        aria-label="actions"
                    >
                        <VerticalDotsIcon className="text-default-300" />
                    </Button>
                </DropdownTrigger>
                <DropdownMenu>
                    <DropdownItem
                        key="nota_entrevista"
                        textValue="Registrar/Editar Nota Entrevista"
                        onPress={() => {
                            setIsNotaEntrevista(true);
                            setSelectedNota(user.nota_entrevista || "");
                            setValidarId(user.id);
                            setGradoSelected(user.grado_id);
                        }}
                    >
                        {user.nota_entrevista !== "-"
                            ? "Editar nota de entrevista"
                            : "Registrar nota de entrevista"}
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </div>
    ), [setIsNotaEntrevista, setSelectedNota, setValidarId, setGradoSelected]);

    const baseRenderCell = useInscritosRenderCell({
        renderActions
    });

    const renderCell = useCallback((user, columnKey) => {
        const cellValue = user[columnKey];

        if (["id", "nota_expediente", "nota_entrevista", "nota_examen"].includes(columnKey)) {
            return (
                <div className="flex flex-col">
                    <p className="font-medium capitalize text-sm text-default-500">
                        {cellValue}
                    </p>
                </div>
            );
        }

        return baseRenderCell(user, columnKey);
    }, [baseRenderCell]);

    // Filtrar programas cuando cambia el `grado_id` en el modal de edición
    useEffect(() => {
        if (grado_id) {
            const filtrados = programasPosibles.filter(
                (p) => p.grado_id == parseInt(grado_id)
            );
            setProgramasFiltrados(filtrados);
        } else {
            setProgramasFiltrados([]);
        }
    }, [grado_id, programasPosibles]);

    // Filtrar programas en la tabla cuando cambia el grado seleccionado
    useEffect(() => {
        if (gradoFilter !== "all") {
            filterByGrado(gradoFilter);
        }
    }, [gradoFilter, filterByGrado]);



    const topContent = useMemo(() => {
        return (
            <div className="flex flex-col gap-2 mb-4">
                <UploadNotesModal
                    isOpen={isObservarOpen}
                    onClose={() => setIsObservarOpen(false)}
                    onSuccess={fetchInscripcionNota}
                />
                <GradeModal
                    isOpen={isNotaEntrevista}
                    onClose={() => setIsNotaEntrevista(false)}
                    validarId={validarId}
                    initialNota={selectedNota}
                    gradoSelected={gradoSelected}
                    onSuccess={fetchInscripcionNota}
                />

                {/* 1) Fila de Búsqueda */}
                <div className="w-full">
                    {isInitialLoading ? (
                        <Skeleton className="w-full h-12 rounded-lg" />
                    ) : (
                        <Input
                            isClearable
                            className="w-full h-12 focus:outline-none"
                            classNames={{
                                input: "placeholder:text-gray-800 placeholder:opacity-100 text-gray-900",
                            }}
                            placeholder="Buscar Postulante..."
                            startContent={<SearchIcon />}
                            value={filterValue}
                            onClear={onClear}
                            onValueChange={onSearchChange}
                        />
                    )}
                </div>

                {/* 2) Fila de Filtros Avanzados y Acciones Principales */}
                <div className="w-full flex flex-col md:flex-row md:items-end gap-3">
                    <div className="w-full md:w-[220px] shrink-0">
                        {isInitialLoading ? (
                            <Skeleton className="w-full h-12 rounded-lg" />
                        ) : (
                            <Select
                                label="Grado Académico"
                                variant="flat"
                                className="w-full h-12 text-sm"
                                placeholder={gradosLoading ? "Cargando..." : "Todos los grados"}
                                defaultItems={(grados || []).map((item) => ({
                                    key: (item.id || item.uid || "").toString(),
                                    textValue: item.nombre || item.name || "",
                                    ...item,
                                }))}
                                selectedKey={gradoFilter !== "all" ? gradoFilter.toString() : null}
                                onSelectionChange={(grado_id) => {
                                    if (!grado_id || grado_id === "all") {
                                        setGradoFilter("all");
                                        setProgramaFilter([]);
                                        setSelectedKeysPrograma(new Set([]));
                                        filterByGrado(null);
                                    } else {
                                        setGradoFilter(grado_id);
                                        setProgramaFilter([]);
                                        setSelectedKeysPrograma(new Set([]));
                                        filterByGrado(grado_id);
                                    }
                                }}
                            />
                        )}
                    </div>

                    <div className="w-full md:flex-1">
                        {isInitialLoading ? (
                            <Skeleton className="w-full h-12 rounded-lg" />
                        ) : (
                            <MultiSelect
                                label="Filtrar por Programas"
                                placeholder={programasLoading ? "Cargando..." : "Seleccione uno o más programas"}
                                defaultItems={
                                    filteredProgramasHabilitados.map((item) => ({
                                        key: item.id.toString(),
                                        textValue: item.nombre,
                                        ...item,
                                    }))
                                }
                                selectedKeys={selectedKeysPrograma}
                                onSelectionChange={(keys) => {
                                    setSelectedKeysPrograma(keys);
                                    setProgramaFilter(Array.from(keys).map((key) => parseInt(key)));
                                }}
                                disabled={gradoFilter === "all"}
                                isRequired={true}
                                className="w-full h-12 text-sm"
                            />
                        )}
                    </div>

                    <div className="w-full md:w-auto flex flex-col sm:flex-row gap-2 md:ml-auto">
                        {isInitialLoading ? (
                            <>
                                <Skeleton className="h-12 w-12 rounded-lg" />
                                <Skeleton className="w-full sm:w-[150px] h-12 rounded-lg" />
                                <Skeleton className="w-full sm:w-[120px] h-12 rounded-lg" />
                            </>
                        ) : (
                            <>
                                <Button
                                    isIconOnly
                                    variant="flat"
                                    color="default"
                                    onPress={fetchInscripcionNota}
                                    aria-label="Recargar"
                                    className="bg-white shadow-sm border border-slate-200 h-12 w-12 shrink-0"
                                    isLoading={dataLoading}
                                >
                                    <RefreshIcon />
                                </Button>
                                <Button
                                    color="success"
                                    className="text-white font-semibold h-12 w-full sm:w-auto px-4"
                                    onPress={() => setIsObservarOpen(true)}
                                >
                                    Importar Notas
                                </Button>
                                <Dropdown shouldBlockScroll={false}>
                                    <DropdownTrigger>
                                        <Button
                                            color="primary"
                                            className="font-semibold h-12 w-full sm:w-auto px-4"
                                            endContent={<ChevronDownIcon />}
                                        >
                                            Exportar
                                        </Button>
                                    </DropdownTrigger>
                                    <DropdownMenu aria-label="Opciones de exportación">
                                        <DropdownItem key="cv" textValue="Reporte Notas CV PDF" onPress={() => onExport("CV")}>
                                            Reporte Notas CV PDF
                                        </DropdownItem>
                                        <DropdownItem key="entrevista" textValue="Plantilla Notas Entrevista" onPress={() => onExport("Plantilla Notas Entrevista")}>
                                            Plantilla Notas Entrevista PDF
                                        </DropdownItem>
                                        <DropdownItem key="asistencia" textValue="Plantilla Asistencia PDF" onPress={() => onExport("Reporte Aptos Asistencia PDF")}>
                                            Plantilla Asistencia PDF
                                        </DropdownItem>
                                        <DropdownItem key="aulas" textValue="Plantilla Aulas PDF" onPress={() => onExport("Reporte Aulas PDF")}>
                                            Plantilla Aulas PDF
                                        </DropdownItem>
                                        <DropdownItem key="excel" textValue="Reporte Final Notas Excel" onPress={() => onExport("Reporte Aptos Excel")}>
                                            Reporte Final Notas Excel
                                        </DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </>
                        )}
                    </div>
                </div>

                {/* 3) Info de resultados y paginación en el mismo layout limpio */}
                <div className="flex justify-between items-center w-full mt-2">
                    <div className="flex items-center">
                        <span className="text-default-400 text-small font-semibold">
                            {`${notaStats.conNota} de ${filteredItems.length} evaluados`}
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
        users.length,
        gradoFilter,
        filteredProgramasHabilitados,
        grados,
        selectedKeysPrograma,
        isObservarOpen,
        isNotaEntrevista,
        validarId,
        selectedNota,
        gradoSelected,
        notaStats.conNota,
        filteredItems.length,
        rowsPerPage,
        setPage,
        setRowsPerPage,
        fetchInscripcionNota,
        onExport,
        dataLoading,
    ]);

    const bottomContent = useMemo(
        () => (
            <TablePagination
                page={page}
                pages={pages}
                setPage={setPage}
                filteredItemsLength={filteredItems.length}
                customLabel={`${notaStats.conNota} de ${filteredItems.length} evaluados`}
            />
        ),
        [page, pages, filteredItems.length, notaStats.conNota, setPage]
    );

    return (
        <Table
            aria-label="Example table"
            layout="auto"
            isHeaderSticky
            isLoading={dataLoading}
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
                emptyContent={(dataLoading && !inscripcioNota.length) ? (
                    <div className="flex flex-col gap-2 w-full p-2">
                        <Skeleton className="h-10 w-full rounded-lg" />
                        <Skeleton className="h-10 w-full rounded-lg" />
                        <Skeleton className="h-10 w-full rounded-lg" />
                    </div>
                ) : "No se encontró información"}
                items={items}
                className="space-y-1"
                isLoading={dataLoading && !inscripcioNota.length}
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
