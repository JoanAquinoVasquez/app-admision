import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import useGrado from "../../data/dataGrados";
// import Spinner from "../Spinner/Spinner"; // Spinner
import { toast } from "react-hot-toast";
import { FormControl, Box } from "@mui/material";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Textarea,
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
    Radio,
    RadioGroup,
    Pagination,
    Spinner,
} from "@heroui/react";
import useInscripcion from "../../data/Inscripcion/dataInscripcion";
import Typography from "@mui/material/Typography";
import RenderFileUpload from "../Inputs/RenderFileUpload";
import Select from "../Select/Select";
import axios from "../../axios";
import ModalConfirm from "../Modal/Confirmation/ModalConfirm";
import useProgramas from "../../data/dataProgramas";
import useProvincias from "../../data/dataProvincias";
import useDistritos from "../../data/dataDistritos";
import useDepartamentos from "../../data/dataDepartamentos";
import ActionModals from "./components/ActionModals";

export const columns = [
    { name: "ID", uid: "id", sortable: true },
    { name: "Nombres Completos", uid: "nombre_completo", sortable: true },
    { name: "Grado y Programa", uid: "grado", sortable: true },
    { name: "Documento Identidad", uid: "doc_iden", sortable: true },
    { name: "Celular", uid: "celular" },
    { name: "Fecha Inscripción", uid: "fecha_inscripcion" },
    { name: "Copia CV", uid: "ruta_cv" },
    { name: "Estado", uid: "estado", sortable: true },
    { name: "Acciones", uid: "actions" },
];

export const statusOptions = [
    { name: "Pendiente", uid: "0" },
    { name: "Validado", uid: "1" },
];

export function capitalize(s) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

export const PlusIcon = ({ size = 24, width, height, ...props }) => {
    return (
        <svg
            aria-hidden="true"
            fill="none"
            focusable="false"
            height={size || height}
            role="presentation"
            viewBox="0 0 24 24"
            width={size || width}
            {...props}
        >
            <g
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
            >
                <path d="M6 12h12" />
                <path d="M12 18V6" />
            </g>
        </svg>
    );
};

export const VerticalDotsIcon = ({ size = 24, width, height, ...props }) => {
    return (
        <svg
            aria-hidden="true"
            fill="none"
            focusable="false"
            height={size || height}
            role="presentation"
            viewBox="0 0 24 24"
            width={size || width}
            {...props}
        >
            <path
                d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 12c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
                fill="currentColor"
            />
        </svg>
    );
};

export const SearchIcon = (props) => {
    return (
        <svg
            aria-hidden="true"
            fill="none"
            focusable="false"
            height="1em"
            role="presentation"
            viewBox="0 0 24 24"
            width="1em"
            {...props}
        >
            <path
                d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
            />
            <path
                d="M22 22L20 20"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
            />
        </svg>
    );
};

export const ChevronDownIcon = ({ strokeWidth = 1.5, ...otherProps }) => {
    return (
        <svg
            aria-hidden="true"
            fill="none"
            focusable="false"
            height="1em"
            role="presentation"
            viewBox="0 0 24 24"
            width="1em"
            {...otherProps}
        >
            <path
                d="m19.92 8.95-6.52 6.52c-.77.77-2.03.77-2.8 0L4.08 8.95"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeMiterlimit={10}
                strokeWidth={strokeWidth}
            />
        </svg>
    );
};

const statusColorMap = {
    1: "success",
    0: "danger",
    2: "warning",
};

const INITIAL_VISIBLE_COLUMNS = [
    "id",
    "nombre_completo",
    "grado",
    "celular",
    "doc_iden",
    "ruta_cv",
    "estado",
    "actions",
];

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

    // State variables needed by useEffect hooks (even though inline modal is disabled)
    const [departamento_id, setDepartamento_id] = useState("");
    const [provincia_id, setProvincia_id] = useState("");
    const [distrito_id, setDistrito_id] = useState("");
    const [grado_id, setGrado_id] = useState("");
    const [loadingEditar, setLoadingEditar] = useState(false);

    // ✅ Aseguramos que `inscripciones` tenga datos antes de mapear
    const users = useMemo(() => {
        if (!inscripciones || inscripciones.length === 0) {
            return []; // Evita errores si aún no hay datos
        }
        return inscripciones
            .filter((item) => item.val_digital == 1) // Filtra solo los elementos con val_fisico === 0
            .map((item) => {
                const formatoFechaHora = (fechaHora) => {
                    if (!fechaHora)
                        return {
                            fecha: "No disponible",
                            hora: "No disponible",
                            dateObj: new Date(0), // Fecha inválida por defecto
                        };

                    const dateObj = new Date(fechaHora);
                    if (isNaN(dateObj.getTime())) {
                        return {
                            fecha: "Inválida",
                            hora: "Inválida",
                            dateObj: new Date(0),
                        };
                    }

                    const fecha = dateObj.toLocaleDateString('es-PE', { year: 'numeric', month: '2-digit', day: '2-digit' });
                    const hora = dateObj.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

                    return { fecha, hora, dateObj };
                };
                const { fecha, hora, dateObj } = formatoFechaHora(
                    item.created_at
                );

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
                    programa: item.programa.nombre,
                    programa_estado: item.programa.estado,
                    doc_iden: item.postulante.num_iden,
                    observacion: item.observacion,
                    celular: item.postulante.celular,
                    tipo_doc: item.postulante.tipo_doc,
                    fecha_inscripcion: { fecha, hora, dateObj }, // Agregamos `dateObj` para ordenamiento
                    ruta_dni:
                        item.postulante.documentos.find(
                            (doc) => doc.tipo === "DocumentoIdentidad"
                        )?.url || null,
                    ruta_cv:
                        item.postulante.documentos.find(
                            (doc) => doc.tipo === "Curriculum"
                        )?.url || null,
                    ruta_foto:
                        item.postulante.documentos.find(
                            (doc) => doc.tipo === "Foto"
                        )?.nombre_archivo || null,
                    voucher: item.codigo,
                    ruta_voucher:
                        item.postulante.documentos.find(
                            (doc) => doc.tipo === "Voucher"
                        )?.url || null,
                    estado: item.val_fisico,
                };
            });
    }, [inscripciones]);

    const [filterValue, setFilterValue] = useState("");
    const [selectedKeys, setSelectedKeys] = useState(new Set([]));
    // const [selectedPostulantes, setSelectedPostulantes] = useState([]); // Removed redundant state
    const [visibleColumns, setVisibleColumns] = useState(
        new Set(INITIAL_VISIBLE_COLUMNS)
    );
    const [statusFilter, setStatusFilter] = useState("all");
    const [gradoFilter, setGradoFilter] = useState("all");
    const [programaFilter, setProgramaFilter] = useState("all");
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [sortDescriptor, setSortDescriptor] = useState({
        column: "id",
        direction: "ascending",
    });
    const [page, setPage] = useState(1);

    const headerColumns = useMemo(() => {
        return visibleColumns === "all"
            ? columns
            : columns.filter((column) => visibleColumns.has(column.uid));
    }, [visibleColumns]);

    const filteredItems = useMemo(() => {
        let filteredUsers = [...users];
        if (filterValue) {
            const lowerCaseFilter = filterValue.toLowerCase();
            filteredUsers = filteredUsers.filter((user) =>
                Object.values(user).some((value) =>
                    value?.toString().toLowerCase().includes(lowerCaseFilter)
                )
            );
        }
        if (statusFilter !== "all") {
            filteredUsers = filteredUsers.filter((user) =>
                statusFilter.has(user.estado.toString())
            );
        }
        if (gradoFilter !== "all") {
            filteredUsers = filteredUsers.filter(
                (user) => user.grado_id == gradoFilter
            );
        }

        if (programaFilter !== "all") {
            filteredUsers = filteredUsers.filter(
                (user) => user.programa_id == programaFilter
            );
        }

        return filteredUsers;
    }, [filterValue, statusFilter, users, gradoFilter, programaFilter]);

    const sortedItems = useMemo(() => {
        return [...filteredItems].sort((a, b) => {
            const first = a[sortDescriptor.column];
            const second = b[sortDescriptor.column];
            const cmp = first < second ? -1 : first > second ? 1 : 0;
            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, filteredItems]);
    const pages = Math.ceil(filteredItems.length / rowsPerPage);
    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        return sortedItems.slice(start, start + rowsPerPage);
    }, [page, sortedItems, rowsPerPage]);
    useEffect(() => {
        setPage(1); // Reiniciar a la primera página cuando se aplica un filtro
    }, [filterValue, statusFilter, sortedItems, gradoFilter]);

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

        setLoading(true);
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
            setLoading(false);
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

    const renderCell = useCallback((user, columnKey) => {
        const cellValue = user[columnKey];

        switch (columnKey) {
            case "id":
                return (
                    <div className="flex flex-col">
                        <p className="text-sm text-default-400">
                            {user.postulante_id}
                        </p>
                        {/* <p className="text-bold text-tiny capitalize text-default-400">
                            {user.nombre_completo}
                        </p> */}
                    </div>
                );

            case "nombre_completo":
                return (
                    <div className="flex flex-col">
                        <p className="capitalize text-sm text-default-500">
                            {cellValue}
                        </p>
                        {/* <p className="text-bold text-tiny capitalize text-default-400">
                            {user.nombre_completo}
                        </p> */}
                    </div>
                );
            case "grado":
                return (
                    <div className="flex flex-col">
                        <p className="text-sm text-default-400">{cellValue}</p>
                        <p className="font-medium text-sm text-default-500">
                            {user.programa}
                        </p>
                    </div>
                );

            case "fecha_inscripcion":
                return (
                    <div className="flex flex-col">
                        <p className="font-medium capitalize text-sm text-default-500">
                            {cellValue.hora}
                        </p>
                        <p className="text-sm text-default-400">
                            {cellValue.fecha}
                        </p>
                    </div>
                );
            case "doc_iden":
                return (
                    <div className="flex flex-col">
                        <p className="text-sm text-default-400">
                            {user.tipo_doc}
                        </p>
                        <p className="font-medium capitalize text-sm text-default-500">
                            {cellValue}
                        </p>
                    </div>
                );
            case "ruta_dni":
                return (
                    <div className="flex flex-col">
                        {cellValue ? (
                            <a
                                href={cellValue}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 underline"
                            >
                                Abrir
                            </a>
                        ) : (
                            <span className="text-gray-400">No disponible</span>
                        )}
                    </div>
                );

            case "ruta_cv":
                return (
                    <div className="flex flex-col">
                        {cellValue ? (
                            <a
                                href={cellValue}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 underline"
                            >
                                Abrir
                            </a>
                        ) : (
                            <span className="text-gray-400">No disponible</span>
                        )}
                    </div>
                );
            case "ruta_foto":
                return (
                    <div className="flex flex-col">
                        {cellValue ? (
                            <a
                                //  href={cellValue}
                                href={`/${cellValue}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 underline"
                            >
                                Abrir
                            </a>
                        ) : (
                            <span className="text-gray-400">No disponible</span>
                        )}
                    </div>
                );
            case "voucher":
                return (
                    <div className="flex flex-col">
                        <p className="font-medium capitalize text-sm text-default-500">
                            {cellValue}
                        </p>
                    </div>
                );
            case "ruta_voucher":
                return (
                    <div className="flex flex-col">
                        {cellValue ? (
                            <a
                                href={cellValue}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 underline"
                            >
                                Abrir
                            </a>
                        ) : (
                            <span className="text-gray-400">No disponible</span>
                        )}
                    </div>
                );

            case "estado":
                return (
                    <Chip
                        className="capitalize"
                        color={statusColorMap[user.estado]}
                        size="sm"
                        variant="flat"
                    >
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
                                <Button
                                    aria-label="Actions"
                                    isIconOnly
                                    size="sm"
                                    variant="light"
                                    data-testid="actions-button"
                                >
                                    <VerticalDotsIcon className="text-default-300" />
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu>
                                <DropdownItem
                                    textValue="Exportar Carnet"
                                    key="carnet"
                                    onPress={() => {
                                        setValidarId(user.id);
                                        handleExportCarnet(user.postulante_id);
                                    }}
                                >
                                    Exportar Carnet
                                </DropdownItem>
                                {user.estado == 0 && (
                                    <DropdownItem
                                        textValue="Validar"
                                        key="validar"
                                        onPress={() => {
                                            setValidarId(user.id);
                                            setIsValidarOpen(true);
                                        }}
                                    >
                                        Validar
                                    </DropdownItem>
                                )}
                                <DropdownItem
                                    textValue="Editar"
                                    key="edit"
                                    onPress={() => {
                                        handleEditar(user.id);
                                    }}
                                >
                                    Editar
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);

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

    const onRowsPerPageChange = useCallback((e) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    }, []);

    const onSearchChange = useCallback((value) => {
        setFilterValue(value || "");
        setPage(1);
    }, []);

    const onClear = useCallback(() => {
        setFilterValue("");
        setPage(1);
    }, []);

    const topContent = useMemo(() => {
        return (
            <>
                <div className="flex flex-col gap-4">
                    {/* Fila de filtros y búsqueda */}
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 w-full">
                        <div className="col-span-1 md:col-span-4">
                            {/* Input de búsqueda */}
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
                        </div>

                        {/* Selects de Filtros */}
                        <div className="col-span-1 md:col-span-2 flex flex-col sm:flex-row gap-4 justify-end w-full">
                            {/* Dropdown Estado */}
                            <Dropdown>
                                <DropdownTrigger className="w-full sm:w-auto">
                                    <Button
                                        aria-label="estado"
                                        endContent={
                                            <ChevronDownIcon className="text-small" />
                                        }
                                        variant="flat"
                                        className="h-12 w-full sm:w-auto"
                                    >
                                        Estado
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu
                                    disallowEmptySelection
                                    aria-label="Table Columns"
                                    closeOnSelect={false}
                                    selectedKeys={statusFilter}
                                    selectionMode="multiple"
                                    onSelectionChange={setStatusFilter}
                                >
                                    {statusOptions.map((status) => (
                                        <DropdownItem
                                            textValue={status.name}
                                            key={status.uid}
                                            className="capitalize"
                                        >
                                            {capitalize(status.name)}
                                        </DropdownItem>
                                    ))}
                                </DropdownMenu>
                            </Dropdown>

                            {/* Dropdown Columnas */}
                            <Dropdown>
                                <DropdownTrigger className="w-full sm:w-auto">
                                    <Button
                                        aria-label="columnas"
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

                    {/* 📋 Fila 2: Filtros Avanzados y Exportación */}
                    <div className="w-full flex flex-col md:flex-row md:items-end gap-4">
                        {/* 🎓 Select Grado Académico */}
                        <div className="w-full md:w-1/5">
                            <Select
                                label="Grado Académico"
                                variant="flat"
                                className="w-full h-12 text-sm"
                                defaultItems={grados.map((item) => ({
                                    key: item.id, // mantiene key como número si tu componente lo acepta así
                                    textValue: item.nombre,
                                    ...item,
                                }))}
                                selectedKey={
                                    gradoFilter !== "all" ? gradoFilter : null
                                }
                                onSelectionChange={(grado_id) => {
                                    if (grado_id === null) {
                                        setGradoFilter("all");
                                        setProgramaFilter("all");
                                    } else {
                                        setGradoFilter(grado_id); // grado_id ya es el key exacto
                                        setProgramaFilter("all");
                                    }
                                }}
                            />
                        </div>
                        {/* 🏫 Select Programa */}
                        <div className="w-full md:flex-1">
                            {/* Select Programa */}
                            <Select
                                label="Programa"
                                className="w-full h-12 text-sm"
                                disabled={gradoFilter === "all"}
                                defaultItems={filteredProgramas.map((item) => ({
                                    key: item.id, // igual que arriba
                                    textValue: item.nombre,
                                    ...item,
                                }))}
                                selectedKey={
                                    programaFilter !== "all"
                                        ? programaFilter
                                        : null
                                }
                                onSelectionChange={(programa_id) => {
                                    if (programa_id === null) {
                                        setProgramaFilter("all");
                                    } else {
                                        setProgramaFilter(programa_id);
                                    }
                                }}
                            />
                        </div>

                        {/* 📤 Botón Exportar */}
                        <div className="w-full md:w-auto md:ml-auto">
                            <Button
                                color="primary"
                                onPress={handleExportCarnetMasivo}
                                className="h-12 w-full md:w-auto"
                            >
                                Exportar Carnets
                            </Button>
                        </div>
                    </div>

                    {/* Total y filas por página */}
                    {/* 📊 Resumen de resultados */}
                    <div className="flex justify-between items-center text-default-400 text-sm mt-0">
                        <span>{`${filteredItems.length} postulantes`}</span>
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
        gradoFilter,
        filteredProgramas,
        grados,
        handleExportCarnetMasivo
    ]);

    const bottomContent = useMemo(
        () => (
            <div className="py-2 px-2 flex justify-between items-center">
                <span className="w-[30%] text-small text-default-400">
                    {selectedKeys == "all"
                        ? "Todos los postulantes seleccionados"
                        : `${selectedKeys.size} de ${filteredItems.length} seleccionados`}
                </span>
                <Pagination
                    isCompact
                    showControls
                    showShadow
                    color="primary"
                    page={page}
                    total={pages}
                    onChange={setPage}
                />
                <div className="hidden sm:flex w-[30%] justify-end gap-2">
                    <Button
                        isDisabled={page === 1}
                        size="sm"
                        variant="flat"
                        onPress={() => setPage((prev) => Math.max(prev - 1, 1))}
                    >
                        Anterior
                    </Button>
                    <Button
                        isDisabled={page === pages}
                        size="sm"
                        variant="flat"
                        onPress={() =>
                            setPage((prev) => Math.min(prev + 1, pages))
                        }
                    >
                        Siguiente
                    </Button>
                </div>
            </div>
        ),
        [selectedKeys, filteredItems.length, page, pages]
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

            {/* DEPRECATED: Modal inline - ahora se usa ActionModals arriba */}
            {false && <ModalConfirm
                isOpen={isValidarOpen}
                onClose={() => setIsValidarOpen(false)}
                onConfirm={() => handleValidar(validarId)}
                isDismissable={false}
                message="¿Confirma la validación física? Esta acción es irreversible y se asumirá que se entregó carnet al postulante."
            />}

            {/* DEPRECATED: Inline edit modal - now using ActionModals component */}
            {false && <Modal
                backdrop="opaque"
                isOpen={isEditarOpen}
                placement="center"
                size="5xl"
                scrollBehavior="inside"
                onClose={() => setIsEditarOpen(false)}
                isDismissable={false}
            >
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">
                        Editar Inscripción
                    </ModalHeader>

                    <ModalBody>
                        {loadingEditar ? (
                            <div className="flex justify-center items-center py-12">
                                <Spinner label="Cargando datos..." />
                            </div>
                        ) : (
                            <form>
                                <h3 className="font-bold">
                                    Seleccionar Grado y Programa a postular
                                </h3>
                                <Box
                                    sx={{
                                        display: "grid",
                                        gap: 2,
                                        gridTemplateColumns: {
                                            xs: "1fr",
                                            md: "1fr 3fr",
                                        },
                                        mb: 2,
                                    }}
                                >
                                    <FormControl>
                                        <Select
                                            label="Grado Académico"
                                            variant="flat"
                                            className="w-30"
                                            isRequired={true}
                                            value={grado_id ? grado_id : ""}
                                            defaultItems={gradosPosibles.map(
                                                (item) => ({
                                                    key: item.id.toString(),
                                                    textValue: item.nombre,
                                                    ...item,
                                                })
                                            )}
                                            selectedKey={
                                                grado_id
                                                    ? grado_id.toString()
                                                    : null
                                            }
                                            onSelectionChange={(grado_id) => {
                                                setGrado_id(grado_id);
                                                setPrograma_id(null);
                                                handleChange(
                                                    "grado_id",
                                                    grado_id
                                                );
                                            }}
                                        />
                                    </FormControl>

                                    <FormControl fullWidth>
                                        <Select
                                            label="Programa"
                                            className="w-full"
                                            defaultItems={programasFiltrados.map(
                                                (item) => ({
                                                    key: item.id.toString(),
                                                    textValue: item.nombre,
                                                    ...item,
                                                })
                                            )}
                                            value={
                                                programa_id ? programa_id : ""
                                            }
                                            selectedKey={
                                                programa_id
                                                    ? programa_id.toString()
                                                    : null
                                            }
                                            onSelectionChange={(programaId) => {
                                                setPrograma_id(programaId);
                                                handleChange(
                                                    "programa_id",
                                                    programaId
                                                );
                                            }}
                                            isRequired={true}
                                            disabled={!grado_id}
                                        />
                                    </FormControl>
                                </Box>
                                <h3 className="font-bold mb-2">
                                    Datos personales
                                </h3>
                                <Box
                                    sx={{
                                        display: "grid",
                                        gap: 2,
                                        gridTemplateColumns: {
                                            xs: "1fr",
                                            md: "2fr 2fr 2fr 2fr 2fr",
                                        },
                                        mb: 2,
                                    }}
                                >
                                    <Select
                                        label="Tipo de Documento"
                                        variant="flat"
                                        className="w-30"
                                        disabled={true}
                                        value={
                                            tipo_documento
                                                ? tipo_documento.toString
                                                : null
                                        }
                                        isRequired={true}
                                        defaultItems={tipo_doc.map((item) => ({
                                            key: item.nombre.toString(),
                                            textValue: item.nombre,
                                            ...item,
                                        }))}
                                        selectedKey={
                                            tipo_documento
                                                ? tipo_documento.toString()
                                                : null
                                        }
                                    />

                                    <Input
                                        label={`Número de ${tipo_doc.find(
                                            (item) =>
                                                item.nombre ==
                                                tipo_documento
                                        )?.nombre ||
                                            "Documento de Identidad"
                                            }`}
                                        value={num_iden ? num_iden : ""}
                                        isRequired={true}
                                        disabled={true}
                                        onChange={(e) => {
                                            setNum_iden(e.target.value);
                                            handleChange(
                                                "num_iden",
                                                e.target.value
                                            );
                                        }}
                                    />

                                    <Input
                                        label="Nombres"
                                        value={nombres ? nombres : ""}
                                        isRequired={true}
                                        onChange={(e) => {
                                            setNombres(e.target.value);
                                            handleChange(
                                                "nombres",
                                                e.target.value
                                            );
                                        }}
                                    />

                                    <Input
                                        label="Apellido Paterno"
                                        value={ap_paterno ? ap_paterno : ""}
                                        isRequired={true}
                                        onChange={(e) => {
                                            setAp_paterno(e.target.value);
                                            handleChange(
                                                "ap_paterno",
                                                e.target.value
                                            );
                                        }}
                                    />

                                    <Input
                                        label="Apellido Materno"
                                        value={ap_materno ? ap_materno : ""}
                                        isRequired={true}
                                        onChange={(e) => {
                                            setAp_materno(e.target.value);
                                            handleChange(
                                                "ap_materno",
                                                e.target.value
                                            );
                                        }}
                                    />
                                </Box>

                                <Box
                                    sx={{
                                        display: "grid",
                                        gap: 2,
                                        gridTemplateColumns: {
                                            xs: "1fr",
                                            md: "2fr 2fr 4fr 2fr 1fr",
                                        },
                                        mb: 2,
                                    }}
                                >
                                    <Input
                                        label="Celular"
                                        value={celular ? celular : ""}
                                        isRequired={true}
                                        onChange={(e) => {
                                            setCelular(e.target.value);
                                            handleChange(
                                                "celular",
                                                e.target.value
                                            );
                                        }}
                                    />

                                    <Input
                                        label="Correo Electrónico"
                                        value={email ? email : ""}
                                        isRequired={true}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            handleChange(
                                                "email",
                                                e.target.value
                                            );
                                        }}
                                    />
                                    <Input
                                        label="Dirección"
                                        value={direccion ? direccion : ""}
                                        isRequired={true}
                                        onChange={(e) => {
                                            setDireccion(e.target.value);
                                            handleChange(
                                                "direccion",
                                                e.target.value
                                            );
                                        }}
                                    />
                                    <Input
                                        label="Fecha de Nacimiento"
                                        type="date"
                                        value={
                                            fecha_nacimiento
                                                ? fecha_nacimiento
                                                : ""
                                        }
                                        isRequired={true}
                                        onChange={(e) => {
                                            setFecha_nacimiento(e.target.value);
                                            handleChange(
                                                "fecha_nacimiento",
                                                e.target.value
                                            );
                                        }}
                                    />
                                    <RadioGroup
                                        label="Sexo"
                                        isRequired
                                        value={sexo}
                                        orientation="horizontal"
                                        onChange={(e) => {
                                            setSexo(e.target.value);
                                            handleChange("sexo", e.target.value);
                                        }}
                                    >
                                        <Radio value="M">M</Radio>
                                        <Radio value="F">F</Radio>
                                    </RadioGroup>
                                </Box>

                                <Box
                                    sx={{
                                        display: "grid",
                                        gap: 2,
                                        gridTemplateColumns: {
                                            xs: "1fr",
                                            sm: "1fr 1fr",
                                            md: "1fr 1fr 1fr",
                                        },
                                        mb: 2,
                                    }}
                                >
                                    <Select
                                        label="Departamento"
                                        isRequired={true}
                                        className="flex-1 min-w-200"
                                        selectedKey={
                                            departamento_id
                                                ? departamento_id.toString()
                                                : ""
                                        }
                                        value={
                                            departamento_id
                                                ? departamento_id
                                                : ""
                                        }
                                        defaultItems={departamentos.map(
                                            (item) => ({
                                                key: item.id.toString(),
                                                textValue: item.nombre,
                                                ...item,
                                            })
                                        )}
                                        onSelectionChange={(departamentoId) => {
                                            setDepartamento_id(departamentoId);
                                            handleChange(
                                                "departamento_id",
                                                departamentoId
                                            );
                                            setProvincia_id(null);
                                            setDistrito_id(null);
                                        }}
                                    />

                                    <Select
                                        label="Provincia"
                                        isRequired={true}
                                        selectedKey={
                                            provincia_id
                                                ? provincia_id.toString()
                                                : ""
                                        }
                                        className="flex-1 min-w-200"
                                        disabled={!departamento_id}
                                        value={provincia_id ? provincia_id : ""}
                                        defaultItems={provincias.map(
                                            (item) => ({
                                                key: item.id.toString(),
                                                textValue: item.nombre,
                                                ...item,
                                            })
                                        )}
                                        onSelectionChange={(provinciaId) => {
                                            setProvincia_id(provinciaId);
                                            handleChange(
                                                "provincia_id",
                                                provinciaId
                                            );
                                            setDistrito_id(null);
                                        }}
                                    />

                                    <Select
                                        key={`distrito-${departamento_id}`}
                                        label="Distrito"
                                        disabled={!provincia_id}
                                        selectedKey={
                                            distrito_id
                                                ? distrito_id.toString()
                                                : ""
                                        }
                                        isRequired={true}
                                        value={distrito_id ? distrito_id : ""}
                                        className="flex-1 min-w-200"
                                        defaultItems={distritos.map((item) => ({
                                            key: item.id.toString(),
                                            textValue: item.nombre,
                                            ...item,
                                        }))}
                                        onSelectionChange={(distritoId) => {
                                            setDistrito_id(distritoId);
                                            handleChange(
                                                "distrito_id",
                                                distritoId
                                            );
                                        }}
                                    />
                                </Box>
                                <Box
                                    sx={{
                                        display: "grid",
                                        gap: 2,
                                        gridTemplateColumns: {
                                            xs: "1fr",
                                            sm: "1fr 1fr",
                                            md: "repeat(2, 1fr)",
                                        },
                                        mb: 2,
                                    }}
                                >
                                    <Input
                                        label="Dirección"
                                        value={direccion ? direccion : ""}
                                        isRequired={true}
                                        onChange={(e) => {
                                            setDireccion(e.target.value);
                                            handleChange(
                                                "direccion",
                                                e.target.value
                                            );
                                        }}
                                    />

                                    <div className="flex flex-wrap md:flex-nowrap gap-4 mt-4 items-center">
                                        <Button
                                            aria-label="Editar Archivos"
                                            variant="flat"
                                            color="primary"
                                            onPress={toggleEditMode}
                                            className="flex-1 min-w-200"
                                            sx={{ mb: 2 }}
                                        >
                                            {editMode
                                                ? "Cancelar Edición"
                                                : "Editar Archivos"}
                                        </Button>
                                    </div>
                                </Box>

                                {!editMode ? (
                                    <Box
                                        sx={{
                                            display: "grid",
                                            gridTemplateColumns:
                                                "repeat(2, 1fr)",
                                            gap: 2,
                                        }}
                                    >
                                        {rutaVoucher && (
                                            <Typography variant="body2">
                                                <strong>Voucher:</strong>{" "}
                                                <a
                                                    href={rutaVoucher}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-800 hover:text-blue-400"
                                                >
                                                    Ver Comprobante de Pago
                                                </a>
                                            </Typography>
                                        )}
                                        {rutaDocIden && (
                                            <Typography variant="body2">
                                                <strong>DNI:</strong>{" "}
                                                <a
                                                    href={rutaDocIden}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-800 hover:text-blue-400"
                                                >
                                                    Ver Copia DNI
                                                </a>
                                            </Typography>
                                        )}
                                        {rutaCV && (
                                            <Typography variant="body2">
                                                <strong>Currículum:</strong>{" "}
                                                <a
                                                    href={rutaCV}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-800 hover:text-blue-400"
                                                >
                                                    Ver CV
                                                </a>
                                            </Typography>
                                        )}
                                        {rutaFoto && (
                                            <Typography variant="body2">
                                                <strong>Foto Carnet:</strong>{" "}
                                                <a
                                                    href={rutaFoto}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-800 hover:text-blue-400"
                                                >
                                                    Ver Foto Carnet
                                                </a>
                                            </Typography>
                                        )}
                                    </Box>
                                ) : (
                                    <Box
                                        sx={{
                                            display: "grid",
                                            gridTemplateColumns:
                                                "repeat(2, 1fr)",
                                            gap: 2,
                                        }}
                                    >
                                        <div>
                                            <RenderFileUpload
                                                uploadType="Subir Voucher (PDF)"
                                                allowedFileTypes={[
                                                    "application/pdf",
                                                ]}
                                                inputId="rutaVoucher"
                                                tamicono={24}
                                                tamletra={14}
                                                required={true}
                                                onFileUpload={handleFileUpload}
                                            />
                                            <Typography
                                                variant="body2"
                                                color="textSecondary"
                                                sx={{ fontSize: "0.7rem" }}
                                            >
                                                * Suba el comprobante de pago de
                                                inscripción en formato PDF.
                                            </Typography>
                                        </div>

                                        <div>
                                            <RenderFileUpload
                                                uploadType="Subir Copia DNI (PDF)"
                                                allowedFileTypes={[
                                                    "application/pdf",
                                                ]}
                                                inputId="rutaDocIden"
                                                tamicono={24}
                                                tamletra={14}
                                                onFileUpload={handleFileUpload}
                                            />
                                            <Typography
                                                variant="body2"
                                                color="textSecondary"
                                                sx={{ fontSize: "0.7rem" }}
                                            >
                                                * Suba una copia legible de su
                                                DNI (ambas caras) en formato
                                                PDF.
                                            </Typography>
                                        </div>

                                        <div>
                                            <RenderFileUpload
                                                uploadType="Subir Curriculum Vitae (PDF)"
                                                allowedFileTypes={[
                                                    "application/pdf",
                                                ]}
                                                inputId="rutaCV"
                                                tamicono={24}
                                                tamletra={14}
                                                onFileUpload={handleFileUpload}
                                            />
                                            <Typography
                                                variant="body2"
                                                color="textSecondary"
                                                sx={{ fontSize: "0.7rem" }}
                                            >
                                                * Suba su Curriculum Vitae en
                                                formato PDF. Tamaño máximo:
                                                10MB.
                                            </Typography>
                                        </div>

                                        <div>
                                            <RenderFileUpload
                                                uploadType="Subir Foto Carnet (IMG)"
                                                value={rutaFoto}
                                                allowedFileTypes={[
                                                    "image/jpeg",
                                                    "image/png",
                                                    "image/jpg",
                                                ]}
                                                inputId="rutaFoto"
                                                tamicono={24}
                                                tamletra={14}
                                                onFileUpload={handleFileUpload}
                                            />
                                            <Typography
                                                variant="body2"
                                                color="textSecondary"
                                                sx={{ fontSize: "0.7rem" }}
                                            >
                                                * Suba una foto tipo carnet en
                                                formato JPG o PNG. Debe ser a
                                                color, con fondo blanco, sin
                                                lentes. No escaneado.
                                            </Typography>
                                        </div>
                                    </Box>
                                )}
                            </form>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            aria-label="Cancelar"
                            color="default"
                            variant="flat"
                            onPress={() => setIsEditarOpen(false)}
                            isDisabled={loading || loadingEditar}
                        >
                            Cancelar
                        </Button>
                        <Button
                            aria-label="Guardar Cambios"
                            color="primary"
                            onPress={() => handleSubmitEditar(validarId)}
                            isLoading={loading}
                            isDisabled={loadingEditar}
                        >
                            Guardar Cambios
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>}

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
                    emptyContent={(dataLoading || loading) ? <Spinner label="Cargando..." /> : "No se encontró postulantes"}
                    items={items}
                    className="space-y-1" // Reducir espacio entre filas
                    isLoading={dataLoading || loading}
                    loadingContent={<div className="w-full h-full flex justify-center items-center z-50 bg-content1/50 backdrop-blur-sm top-0 left-0 absolute"><Spinner label="Cargando..." /></div>}
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
