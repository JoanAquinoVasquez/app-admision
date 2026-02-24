import { useState, useCallback, useMemo, useEffect } from "react";
import useGrado from "../../data/dataGrados";
// import Spinner from "../Spinner/Spinner"; // Spinner
import { toast } from "react-hot-toast";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Button,
    Pagination,
    Skeleton,
    Chip,
} from "@heroui/react";
import useInscripcion from "../../data/Inscripcion/dataInscripcion";
import axios from "../../axios";
import useProgramas from "../../data/dataProgramas";
import useProvincias from "../../data/dataProvincias";
import useDepartamentos from "../../data/dataDepartamentos";
import useDistritos from "../../data/dataDistritos";
import ActionModals from "./components/ActionModals";
import { useInscritosData } from "../../hooks/useInscritosData";
import { useTableFilters } from "../../hooks/useTableFilters";
import { statusColorMap } from "./utils";

import {
    columns,
    INITIAL_VISIBLE_COLUMNS
} from "./TableConstants";

import {
    PlusIcon,
    VerticalDotsIcon,
    SearchIcon,
    ChevronDownIcon
} from "./TableIcons";
import InscritosToolbar from "./components/InscritosToolbar";
import { useInscritosRenderCell } from "./components/useInscritosRenderCell";
import TablePagination from "./components/TablePagination";

export function capitalize(s) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}



export default function App() {
    const { inscripciones, fetchInscripciones, loading: dataLoading } = useInscripcion();
    const [isValidarOpen, setIsValidarOpen] = useState(false);
    const [validarId, setValidarId] = useState(null);
    const [isObservarOpen, setIsObservarOpen] = useState(false);
    const [isEditarOpen, setIsEditarOpen] = useState(false);
    const [observacion, setObservacion] = useState("");

    const { grados, fetchGrados } = useGrado();
    const { programas, filteredProgramas, filterByGrado } = useProgramas();
    const [gradosPosibles, setGradosPosibles] = useState([]);
    const [programasPosibles, setProgramasPosibles] = useState([]);
    const [programasFiltrados, setProgramasFiltrados] = useState([]);
    const { departamentos } = useDepartamentos();
    const { provincias, setProvincias, fetchProvincias } = useProvincias();
    const { distritos, setDistritos, fetchDistritos } = useDistritos();
    const [loading, setLoading] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    // ... previous lines

    // State variables needed by useEffect hooks (even though inline modal is disabled)
    const [departamento_id, setDepartamento_id] = useState("");
    const [provincia_id, setProvincia_id] = useState("");
    const [distrito_id, setDistrito_id] = useState("");
    const [grado_id, setGrado_id] = useState("");
    const [loadingEditar, setLoadingEditar] = useState(false);

    // Filter Logic Extracted to Hooks
    const users = useInscritosData(inscripciones);

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
    }, [visibleColumns]);

    useEffect(() => {
        filterByGrado(gradoFilter);
    }, [gradoFilter, filterByGrado]);

    // Función auxiliar para obtener IDs seleccionados de forma síncrona/on-demand
    const getSelectedPostulanteIds = useCallback(() => {
        if (selectedKeys === "all") {
            // Si se seleccionan todos, devolvermos todos los IDs filtrados
            return filteredItems.map((item) => item.postulante_id);
        }

        // Si es una selección específica (Set)
        // Nota: key suele ser string en HeroUI/NextUI, mientras que i.id puede ser number. Usamos String() para comparar.
        return Array.from(selectedKeys)
            .map((key) => {
                const item = filteredItems.find((i) => String(i.id) === String(key));
                return item ? item.postulante_id : null;
            })
            .filter(Boolean);
    }, [selectedKeys, filteredItems]);

    const handleExportCarnetMasivo = useCallback(async () => {
        const ids = getSelectedPostulanteIds();

        if (!ids.length) {
            toast.error("No has seleccionado ninguna inscripción");
            return;
        }

        setIsExporting(true);
        try {
            const response = await axios.post("postulante-carnet", {
                ids: ids,
            });

            if (response.headers["content-type"].includes("text/html")) {
                toast.success("Carnets exportados correctamente");
                const newWindow = window.open();
                newWindow.document.write(response.data);
                newWindow.document.close();
            } else {
                toast.success("Carnets exportados correctamente");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error al exportar carnets");
        } finally {
            setIsExporting(false);
        }
    }, [getSelectedPostulanteIds]);

    // API Validar
    const handleValidar = async (inscripcionId) => {
        setIsValidarOpen(false);
        setLoading(true);
        try {
            const response = await axios.get(
                `/inscripcion/val-fisica/${inscripcionId}`
            );
            setIsValidarOpen(false);
            fetchInscripciones();
            toast.success(response.data.message);
        } catch (error) {
            toast.error("Error al validar:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleExportCarnet = async (inscripcionId) => {
        setLoading(true);
        try {
            const response = await axios.post("postulante-carnet", {
                ids: [inscripcionId], // Enviar como un array
            });

            // Verifica si la respuesta es una vista o un archivo
            if (response.headers["content-type"].includes("text/html")) {
                toast.success("Carnet exportado correctamente");
                const newWindow = window.open();
                newWindow.document.write(response.data);
                newWindow.document.close();
            } else {
                toast.success("Carnet exportado correctamente");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error al exportar carnet");
        } finally {
            setLoading(false);
        }
    };

    // API Editar
    const handleEditar = async (inscripcionId) => {
        setIsEditarOpen(true);
        setValidarId(inscripcionId);
        setLoadingEditar(true);

        try {
            const response = await axios.get(`/inscripcion/${inscripcionId}`);
            const data = {
                grado_id: response.data.programa.grado_id || null,
                programa_id: response.data.programa_id || null,
                num_iden: response.data.postulante.num_iden || null,
                nombres: response.data.postulante.nombres || null,
                ap_paterno: response.data.postulante.ap_paterno || null,
                ap_materno: response.data.postulante.ap_materno || null,
                celular: response.data.postulante.celular || null,
                direccion: response.data.postulante.direccion || null,
                email: response.data.postulante.email || null,
                fecha_nacimiento:
                    response.data.postulante.fecha_nacimiento || null,
                num_voucher: response.data.codigo || null,
                departamento_id:
                    response.data.postulante.distrito.provincia
                        .departamento_id || null,
                provincia_id:
                    response.data.postulante.distrito.provincia_id || null,
                distrito_id: response.data.postulante.distrito_id || null,
                sexo: response.data.postulante.sexo || null,
                tipo_documento: response.data.postulante.tipo_doc || null,
            };

            // Guardamos los valores originales
            setOriginalData(data);

            setGrado_id(response.data.programa.grado_id || null);
            setPrograma_id(response.data.programa.id || null);
            setNum_iden(response.data.postulante.num_iden || null);
            setNombres(response.data.postulante.nombres || null);
            setAp_paterno(response.data.postulante.ap_paterno || null);
            setAp_materno(response.data.postulante.ap_materno || null);
            setCelular(response.data.postulante.celular || null);
            setDireccion(response.data.postulante.direccion || null);
            setEmail(response.data.postulante.email || null);
            setFecha_nacimiento(
                response.data.postulante.fecha_nacimiento || null
            );
            setNum_voucher(response.data.codigo || null);
            setDepartamento_id(
                response.data.postulante.distrito.provincia.departamento_id ||
                null
            );
            setProvincia_id(
                response.data.postulante.distrito.provincia_id || null
            );
            setDistrito_id(response.data.postulante.distrito_id || null);
            setSexo(response.data.postulante.sexo || null);
            setTipo_documento(response.data.postulante.tipo_doc || null);
            setRutaVoucher(response.data.postulante.documentos[0].url || null);
            setRutaDocIden(response.data.postulante.documentos[1].url || null);
            setRutaCV(response.data.postulante.documentos[2].url || null);
            setRutaFoto(response.data.postulante.documentos[3].url || null);
            // Si la API devuelve una lista de gradosPosibles y programasPosibles, asignarlos
            setGradosPosibles(response.data.grados_posibles || []); // Asigna gradosPosibles
            setProgramasPosibles(response.data.programas_posibles || []);
            setLoadingEditar(false);
        } catch (error) {
            toast.error(
                response.data.message ||
                "Hubo un error al procesar la solicitud."
            );
        }
    };

    const handleChange = (field, value) => {
        if (originalData[field] !== value) {
            formDataRef.current.set(field, value);
        } else {
            formDataRef.current.delete(field);
        }
    };

    // Manejar subida de archivos
    const handleFileUpload = (inputId, file) => {
        formDataRef.current.set(inputId, file);
    };

    const handleSubmitEditar = async (inscripcionId) => {
        let tieneCambios = [...formDataRef.current.entries()].length > 0;

        if (tieneCambios) {
            try {
                setIsEditarOpen(false);
                setLoading(true);

                await axios.post(
                    `/inscripcion-update/${inscripcionId}`,
                    formDataRef.current,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
                fetchInscripciones(); // Refrescar la lista de inscripciones

                toast.success("Inscripción actualizada correctamente.");

                // Limpiar formData después del envío
                formDataRef.current = new FormData();
            } catch (error) {
                toast.error("Error al editar la inscripción.");
            } finally {
                setLoading(false);
            }
        } else {
            toast.error("No hay cambios para actualizar.");
        }
    };

    const renderStatus = useCallback((user) => {
        return (
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
                        : "Validado"}
            </Chip>
        );
    }, []);

    const renderCell = useInscritosRenderCell({
        handleExportCarnet,
        setValidarId,
        setIsValidarOpen,
        handleEditar,
        renderStatus,
    });

    useEffect(() => {
        if (departamento_id) {
            fetchProvincias(departamento_id); // Filtrar provincias por departamento
        } else {
            setProvincias([]); // Limpiar provincias si no hay departamento seleccionado
            setDistritos([]);
            setProvincia_id(null); // Resetear la provincia seleccionada
            setDistrito_id(null); // Resetear distrito_id cuando no hay provincia
        }
    }, [departamento_id]);

    useEffect(() => {
        if (provincia_id) {
            fetchDistritos(provincia_id); // Filtrar distritos por provincia
        } else {
            setDistritos([]); // Limpiar distritos si no hay provincia seleccionada
            setDistrito_id(null); // Resetear distrito_id cuando no hay provincia
        }
    }, [provincia_id]);

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



    const customStatusOptions = [
        { name: "Pendiente", uid: "0" },
        { name: "Validado", uid: "1" },
    ];

    const topContent = useMemo(() => {
        return (
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
                filteredItemsLength={filteredItems.length}
                simpleExport={true}
                exportLabel="Exportar Carnet Masivo"
                onExport={handleExportCarnetMasivo}
                customStatusOptions={customStatusOptions}
                isExporting={isExporting}
            />
        );
    }, [
        filterValue,
        statusFilter,
        visibleColumns,
        onSearchChange,
        onClear,
        grados,
        gradoFilter,
        filteredProgramas,
        programaFilter,
        filteredItems.length,
        handleExportCarnetMasivo,
    ]);

    const bottomContent = useMemo(
        () => (
            <TablePagination
                page={page}
                pages={pages}
                setPage={setPage}
                selectedKeys={selectedKeys}
                filteredItemsLength={filteredItems.length}
                hasSelection={true}
            />
        ),
        [selectedKeys, filteredItems.length, page, pages, setPage]
    );

    return (
        <>
            <ActionModals
                isValidarOpen={isValidarOpen}
                setIsValidarOpen={setIsValidarOpen}
                handleValidar={handleValidar}
                validarId={validarId}
                isObservarOpen={false}
                setIsObservarOpen={() => { }}
                handleObservar={() => { }}
                observacion=""
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
            <Table
                isHeaderSticky
                aria-label="Tabla de Postulantes con validación digital"
                bottomContent={bottomContent}
                bottomContentPlacement="outside"
                classNames={{
                    wrapper: "max-h-auto overflow-auto w-full p-4", // Ajustar tamaño y eliminar márgenes
                }}
                selectedKeys={selectedKeys}
                selectionMode="multiple"
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
        </>
    );
}
