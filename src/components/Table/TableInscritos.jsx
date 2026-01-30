import { useMemo, useEffect } from "react";
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
    Pagination,
    Button,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Chip,
    Spinner,
} from "@nextui-org/react";
import useInscripcion from "../../data/Inscripcion/dataInscripcion";
import useProgramas from "../../data/dataProgramas";
import useProvincias from "../../data/dataProvincias";
import useDistritos from "../../data/dataDistritos";
import useDepartamentos from "../../data/dataDepartamentos";

// Hooks & Components
import { useInscritosFilters } from "./hooks/useInscritosFilters";
import { useInscritosActions } from "./hooks/useInscritosActions";
import InscritosToolbar from "./components/InscritosToolbar";
import ActionModals from "./components/ActionModals";
import { VerticalDotsIcon } from "./components/Icons";
import { columns_preview, statusColorMap } from "./utils";

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
    const users = useMemo(() => {
        if (!inscripciones || inscripciones.length === 0) return [];
        return inscripciones.map((item) => {
            const formatoFechaHora = (fechaHora) => {
                if (!fechaHora) return { fecha: "No disponible", hora: "No disponible" };
                const dateObj = new Date(fechaHora);
                if (isNaN(dateObj.getTime())) return { fecha: "Inválida", hora: "Inválida" };
                const fecha = dateObj.toLocaleDateString('es-PE', { year: 'numeric', month: '2-digit', day: '2-digit' });
                const hora = dateObj.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                return { fecha, hora };
            };
            const { fecha, hora } = formatoFechaHora(item.created_at);

            return {
                id: item.id,
                postulante_id: item.postulante.id,
                nombre_completo: [
                    item.postulante.ap_paterno,
                    item.postulante.ap_materno,
                    item.postulante.nombres,
                ].join(" "),
                grado: item.programa.grado.nombre,
                grado_id: item.programa.grado_id,
                programa_id: item.programa_id,
                celular: item.postulante.celular,
                programa: item.programa.nombre,
                programa_estado: item.programa.estado,
                doc_iden: item.postulante.num_iden,
                observacion: item.observacion,
                tipo_doc: item.postulante.tipo_doc,
                fecha_inscripcion: { fecha, hora },
                ruta_dni: item.postulante.documentos.find((doc) => doc.tipo === "DocumentoIdentidad")?.url || null,
                ruta_cv: item.postulante.documentos.find((doc) => doc.tipo === "Curriculum")?.url || null,
                ruta_foto: item.postulante.documentos.find((doc) => doc.tipo === "Foto")?.url || null,
                voucher: item.codigo,
                ruta_voucher: item.postulante.documentos.find((doc) => doc.tipo === "Voucher")?.url || null,
                estado: item.val_digital,
            };
        });
    }, [inscripciones]);

    // Custom Hooks
    const {
        filterValue,
        setFilterValue,
        selectedKeys,
        setSelectedKeys,
        visibleColumns,
        setVisibleColumns,
        statusFilter,
        setStatusFilter,
        gradoFilter,
        setGradoFilter,
        programaFilter,
        setProgramaFilter,
        rowsPerPage,
        setRowsPerPage,
        sortDescriptor,
        setSortDescriptor,
        page,
        setPage,
        headerColumns,
        filteredItems,
        items,
        pages,
        onRowsPerPageChange,
        onSearchChange,
        onClear,
    } = useInscritosFilters(users, columns);

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
    } = useInscritosActions(fetchInscripciones);

    // Effects
    useEffect(() => {
        if (gradoFilter !== "all") {
            filterByGrado(gradoFilter);
        }
    }, [gradoFilter, filterByGrado]);

    // Render Cell Logic
    const renderCell = (user, columnKey) => {
        const cellValue = user[columnKey];

        switch (columnKey) {
            case "id":
                return <p className="text-sm text-default-400">{cellValue}</p>;
            case "nombre_completo":
                return <p className="capitalize text-sm text-default-500">{cellValue}</p>;
            case "grado":
                return (
                    <div className="flex flex-col">
                        <p className="text-sm text-default-400">{cellValue}</p>
                        <p className="font-medium text-sm text-default-500">{user.programa}</p>
                    </div>
                );
            case "fecha_inscripcion":
                return (
                    <div className="flex flex-col">
                        <p className="font-medium capitalize text-sm text-default-500">{cellValue.hora}</p>
                        <p className="text-sm text-default-400">{cellValue.fecha}</p>
                    </div>
                );
            case "doc_iden":
                return (
                    <div className="flex flex-col">
                        <p className="text-sm text-default-400">{user.tipo_doc}</p>
                        <p className="font-medium capitalize text-sm text-default-500">{cellValue}</p>
                    </div>
                );
            case "ruta_dni":
            case "ruta_cv":
            case "ruta_foto":
            case "ruta_voucher":
                return cellValue ? (
                    <a href={cellValue} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                        Abrir
                    </a>
                ) : (
                    <span className="text-gray-400">No disponible</span>
                );
            case "voucher":
                return <p className="font-medium capitalize text-sm text-default-500">{cellValue}</p>;
            case "estado":
                return (
                    <Chip className="capitalize" color={statusColorMap[user.estado]} size="sm" variant="flat">
                        {user.programa_estado == 0
                            ? "Prog. No abierto"
                            : cellValue == 0
                                ? "Pendiente"
                                : cellValue == 1
                                    ? "Validado"
                                    : "Observado"}
                    </Chip>
                );
            case "actions":
                return (
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
                                                setObservacion(user.observacion);
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
                                                setObservacion(user.observacion);
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
                );
            default:
                return cellValue;
        }
    };

    const bottomContent = useMemo(
        () => (
            <div className="py-2 px-2 flex justify-between items-center">
                <span className="w-[30%] text-small text-default-400"></span>
                <Pagination
                    isCompact
                    showControls
                    showShadow
                    color="primary"
                    page={page}
                    total={pages}
                    onChange={setPage}
                />
                <div className="hidden sm:flex w-[30%] justify-end gap-2"></div>
            </div>
        ),
        [page, pages]
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
                    emptyContent={(dataLoading || loading) ? <Spinner label="Cargando..." /> : "No se encontró postulantes registrados"}
                    items={items}
                    className="space-y-1"
                    isLoading={dataLoading || loading}
                    loadingContent={<Spinner label="Cargando..." />}
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
            />


        </>
    );
}