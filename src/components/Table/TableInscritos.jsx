import { useMemo, useEffect, useCallback, useState } from "react";
import useGrado from "../../data/dataGrados";
// import Spinner from "../../components/Spinner/Spinner";
import { useUser } from "../../services/UserContext";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Button,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Chip,
    Skeleton,
} from "@heroui/react";
import useInscripcion from "../../data/Inscripcion/dataInscripcion";
import useProgramas from "../../data/dataProgramas";
import useProvincias from "../../data/dataProvincias";
import useDistritos from "../../data/dataDistritos";
import useDepartamentos from "../../data/dataDepartamentos";

// Hooks & Components
import { useTableFilters } from "../../hooks/useTableFilters";
import { useInscritosActions } from "./hooks/useInscritosActions";
import InscritosToolbar from "./components/InscritosToolbar";
import ActionModals from "./components/ActionModals";
import { VerticalDotsIcon } from "./components/Icons";
import { columns_preview, statusColorMap } from "./utils";
import { useInscritosData } from "../../hooks/useInscritosData";
import { useInscritosRenderCell } from "./components/useInscritosRenderCell";
import TablePagination from "./components/TablePagination";

const INITIAL_VISIBLE_COLUMNS = [
    "id",
    "nombre_completo",
    "grado",
    "celular",
    "doc_iden",
    "ruta_dni",
    "ruta_cv",
    "ruta_foto",
    "voucher",
    "ruta_voucher",
    "estado",
    "actions",
];

export default function App() {
    const { inscripciones, fetchInscripciones, loading: dataLoading } = useInscripcion();
    const { userData } = useUser();
    const { grados } = useGrado();
    const { filteredProgramas, filterByGrado } = useProgramas();
    const { departamentos } = useDepartamentos();
    const { provincias, fetchProvincias } = useProvincias();
    const { distritos, fetchDistritos } = useDistritos();

    const columns = userData?.roles?.includes("comision")
        ? columns_preview
        : [...columns_preview, { name: "Acciones", uid: "actions" }];

    // Prepare data
    const users = useInscritosData(inscripciones, "val_digital", null);

    // Custom Hooks
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
        initialSortColumn: "id",
    });

    const [selectedKeys, setSelectedKeys] = useState(new Set([]));
    const [visibleColumns, setVisibleColumns] = useState(
        new Set(INITIAL_VISIBLE_COLUMNS)
    );

    const headerColumns = useMemo(() => {
        return visibleColumns === "all"
            ? columns
            : columns.filter((column) => visibleColumns.has(column.uid));
    }, [visibleColumns, columns]);

    const {
        isValidarOpen,
        setIsValidarOpen,
        validarId,
        setValidarId,
        isObservarOpen,
        setIsObservarOpen,
        isEditarOpen,
        setIsEditarOpen,
        observacion,
        setObservacion,
        loading,
        handleValidar,
        handleObservar,
        handleEditar,
        handleVerConstancia,
        handleExportMultiple,
        isExporting,
    } = useInscritosActions(fetchInscripciones);

    // Effects
    useEffect(() => {
        if (gradoFilter !== "all") {
            filterByGrado(gradoFilter);
        }
    }, [gradoFilter, filterByGrado]);

    // Render Cell Logic
    const renderActions = useCallback((user) => (
        <div className="relative flex justify-end items-center gap-2">
            <Dropdown>
                <DropdownTrigger>
                    <Button aria-label="Actions" isIconOnly size="sm" variant="light">
                        <VerticalDotsIcon className="text-default-300" />
                    </Button>
                </DropdownTrigger>
                <DropdownMenu>
                    {user.estado == 0 && (
                        <>
                            <DropdownItem
                                key="validar"
                                onPress={() => {
                                    setValidarId(user.id);
                                    setIsValidarOpen(true);
                                }}
                            >
                                Validar
                            </DropdownItem>
                            <DropdownItem key="edit" onPress={() => handleEditar(user.id)}>
                                Editar
                            </DropdownItem>
                            <DropdownItem
                                key="observar"
                                onPress={() => {
                                    setObservacion(user.observacion || "");
                                    setValidarId(user.id);
                                    setIsObservarOpen(true);
                                }}
                            >
                                Observar
                            </DropdownItem>
                        </>
                    )}
                    {user.estado == 1 && (
                        <DropdownItem key="ver_constancia" onPress={() => handleVerConstancia(user.postulante_id)}>
                            Ver Constancia
                        </DropdownItem>
                    )}
                    {user.estado == 2 && (
                        <>
                            <DropdownItem
                                key="observacion"
                                onPress={() => {
                                    setValidarId(user.id);
                                    setObservacion(user.observacion || "");
                                    setIsObservarOpen(true);
                                }}
                            >
                                Ver Observacion
                            </DropdownItem>
                            <DropdownItem key="edit" onPress={() => handleEditar(user.id)}>
                                Editar
                            </DropdownItem>
                            <DropdownItem
                                key="validar"
                                onPress={() => {
                                    setValidarId(user.id);
                                    setIsValidarOpen(true);
                                }}
                            >
                                Validar
                            </DropdownItem>
                        </>
                    )}
                </DropdownMenu>
            </Dropdown>
        </div>
    ), [setValidarId, setIsValidarOpen, handleEditar, setObservacion, setIsObservarOpen, handleVerConstancia]);

    const renderStatus = useCallback((user) => (
        <Chip
            className="capitalize"
            color={statusColorMap[user.estado]}
            size="sm"
            variant="flat"
        >
            {user.programa_estado == 0
                ? "Prog. No abierto"
                : user.estado == 0
                    ? "Pendiente"
                    : user.estado == 1
                        ? "Validado"
                        : "Observado"}
        </Chip>
    ), []);

    const renderCell = useInscritosRenderCell({
        renderActions,
        renderStatus,
    });

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
        [page, pages, setPage, filteredItems.length, selectedKeys]
    );

    return (
        <>
            <InscritosToolbar
                filterValue={filterValue}
                onClear={onClear}
                onSearchChange={onSearchChange}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                visibleColumns={visibleColumns}
                setVisibleColumns={setVisibleColumns}
                columns={columns}
                grados={grados}
                gradoFilter={gradoFilter}
                setGradoFilter={setGradoFilter}
                setProgramaFilter={setProgramaFilter}
                filteredProgramas={filteredProgramas}
                programaFilter={programaFilter}
                handleExportMultiple={handleExportMultiple}
                filteredItemsLength={filteredItems.length}
                isExporting={isExporting}
            />

            <Table
                aria-label="Tabla de inscritos"
                layout="auto"
                isHeaderSticky
                bottomContent={bottomContent}
                bottomContentPlacement="outside"
                classNames={{ wrapper: "max-h-auto overflow-auto w-full p-4" }}
                selectedKeys={selectedKeys}
                sortDescriptor={sortDescriptor}
                topContentPlacement="outside"
                onSelectionChange={setSelectedKeys}
                onSortChange={setSortDescriptor}
            >
                <TableHeader columns={headerColumns}>
                    {(column) => (
                        <TableColumn
                            key={column.uid}
                            align={column.uid === "actions" ? "center" : "start"}
                            allowsSorting={column.sortable}
                            className="p-1 text-sm text-gray-600"
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
                    ) : "No se encontró postulantes registrados"}
                    items={items}
                    className="space-y-1"
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
                        <TableRow key={item.id} className="p-1 text-sm leading-tight">
                            {(columnKey) => <TableCell className="p-1 text-sm">{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <ActionModals
                isValidarOpen={isValidarOpen}
                setIsValidarOpen={setIsValidarOpen}
                handleValidar={handleValidar}
                validarId={validarId}
                isObservarOpen={isObservarOpen}
                setIsObservarOpen={setIsObservarOpen}
                handleObservar={handleObservar}
                observacion={observacion}
                isEditarOpen={isEditarOpen}
                setIsEditarOpen={setIsEditarOpen}
                fetchInscripciones={fetchInscripciones}
                grados={grados}
                filteredProgramas={filteredProgramas}
                departamentos={departamentos}
                provincias={provincias}
                distritos={distritos}
                fetchProvincias={fetchProvincias}
                fetchDistritos={fetchDistritos}
                loading={loading}
            />


        </>
    );
}