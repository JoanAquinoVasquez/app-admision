import React from "react";
import { useState } from "react";
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
    Pagination,
    User,
    Spinner as NextUISpinner,
} from "@heroui/react";
import useBitacora from "../../data/dataBitacora";
import Spinner from "../../components/Spinner/Spinner";
import DashboardCard from "../../components/Cards/DashboardCard";
import { FileDown } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "../../axios";

export const columns = [
    { name: "ID", uid: "id", sortable: true },
    { name: "Causante", uid: "causer", sortable: true },
    { name: "Descripcion", uid: "description", sortable: true },
    { name: "Implicado", uid: "subject", sortable: true },
    { name: "Propiedades", uid: "properties", sortable: true },
    { name: "Fecha", uid: "created_at", sortable: true },
    // { name: "Acciones", uid: "actions", sortable: true },
];

export const statusOptions = [
    {
        name: "Cambio de programa a uno habilitado",
        uid: "cambio_de_programa_a_uno_habilitado",
    },
    { name: "El usuario cerró sesión", uid: "el_usuario_cerro_sesion" },
    { name: "El usuario inició sesión", uid: "el_usuario_inicio_sesion" },
    {
        name: "Inscripciones inhabilitadas para los programas",
        uid: "inscripciones_inhabilitadas_para_los_programas",
    },
    {
        name: "Inscripción validada digitalmente",
        uid: "inscripcion_validada_digitalmente",
    },
    {
        name: "Inscripción validada físicamente",
        uid: "inscripcion_validada_fisicamente",
    },
    { name: "Inscripción observada", uid: "inscripcion_observada" },
    {
        name: "Datos del postulante actualizados",
        uid: "datos_del_postulante_actualizados",
    },
    {
        name: "Cambio de programa y actualización de datos del postulante",
        uid: "cambio_de_programa_y_actualizacion_de_datos_del_postulante",
    },
    {
        name: "Correo de confirmación de inscripción enviado",
        uid: "correo_de_confirmacion_de_inscripcion_enviado",
    },
    {
        name: "Correo de validación digital y constancia de postulante enviado",
        uid: "correo_de_validacion_digital_y_constancia_de_postulante_enviado",
    },
    {
        name: "Programas asignados a docente",
        uid: "programas_asignados_a_docente",
    },
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

const INITIAL_VISIBLE_COLUMNS = [
    "id",
    "description",
    "causer",
    "subject",
    "properties",
    "created_at",
    // "actions",
];

export default function App() {
    const { bitacora, loading: dataLoading } = useBitacora();
    const [exportLoading, setExportLoading] = useState(false);
    const [date, setDate] = React.useState(null);

    const loading = dataLoading || exportLoading;

    // ✅ Transformar datos de bitácora con formato de fecha/hora
    const users = React.useMemo(() => {
        if (!bitacora || bitacora.length === 0) {
            return [];
        }

        // Función para formatear la fecha y hora
        const formatoFechaHora = (fechaHora) => {
            if (!fechaHora) {
                return { fecha: "No disponible", hora: "No disponible" };
            }

            const dateObj = new Date(fechaHora);
            if (isNaN(dateObj.getTime())) {
                return { fecha: "Inválida", hora: "Inválida" };
            }

            const dia = dateObj.getDate().toString().padStart(2, '0');
            const mes = (dateObj.getMonth() + 1).toString().padStart(2, '0');
            const anio = dateObj.getFullYear();
            const nuevaFecha = `${dia}-${mes}-${anio}`;
            const hora = dateObj.toLocaleTimeString('es-PE', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });

            return { fecha: nuevaFecha, hora };
        };

        return bitacora.map((item) => {
            const { fecha, hora } = formatoFechaHora(item.created_at);

            // Extraer información del causante
            const causer = item.causer?.name || "Sistema";
            const causer_profile_picture = item.causer?.profile_picture ||
                "https://cdn-icons-png.flaticon.com/512/1077/1077012.png";
            const causer_email = item.causer?.email || "";

            // Construir propiedades dinámicamente según el tipo de actividad
            let properties = "";
            let subject = "";
            let subject_tipo_doc = "";
            let subject_num_iden = "";
            let subject_nombre_programa = "";

            // Extraer subject si existe
            if (item.properties?.subject) {
                const s = item.properties.subject;
                subject = `${s.nombres || ""} ${s.ap_paterno || ""} ${s.ap_materno || ""}`.trim();
                subject_tipo_doc = s.tipo_doc || "";
                subject_num_iden = s.num_iden || "";
            }

            // Procesar propiedades según el tipo de descripción
            if (item.properties?.programa_old && item.properties?.programa_new) {
                // Cambio de programa
                properties = `De ${item.properties.programa_old.nombre_grado || ""} en ${item.properties.programa_old.nombre_programa || ""} a ${item.properties.programa_new.nombre_grado || ""} en ${item.properties.programa_new.nombre_programa || ""}`;
            } else if (item.properties?.observacion) {
                // Inscripción observada
                subject_nombre_programa = `Observación: ${item.properties.observacion}`;
            } else if (item.properties?.data_old && item.properties?.data_new) {
                // Datos actualizados
                const keys = new Set([
                    ...Object.keys(item.properties.data_old || {}),
                    ...Object.keys(item.properties.data_new || {}),
                ]);

                const changes = Array.from(keys).map((key) => {
                    const oldValue = item.properties.data_old?.[key] ?? "No especificado";
                    const newValue = item.properties.data_new?.[key] ?? "No especificado";

                    if (typeof oldValue === "object" && oldValue !== null) {
                        return Object.entries(oldValue)
                            .map(([subKey, subValue]) =>
                                `${subKey}: ${subValue} → ${item.properties.data_new?.[key]?.[subKey] ?? "No especificado"}`
                            )
                            .join(", ");
                    }

                    return `${key}: ${oldValue} → ${newValue}`;
                });

                if (item.properties.archivo_modificado) {
                    changes.push(`Archivos: ${item.properties.archivo_modificado}`);
                }

                properties = changes.join(" | ");
            } else if (item.properties?.email) {
                properties = item.properties.email;
            } else if (item.properties?.programas) {
                // Si es un array de programas
                if (Array.isArray(item.properties.programas)) {
                    properties = item.properties.programas.join(", ");
                } else if (item.properties.programas.nombres) {
                    properties = item.properties.programas.nombres;
                }

                if (item.properties.observacion) {
                    subject_nombre_programa = `Observación: ${item.properties.observacion}`;
                }
            }

            return {
                id: item.id,
                description: item.description || "",
                causer,
                causer_profile_picture,
                causer_email,
                subject,
                subject_tipo_doc,
                subject_num_iden,
                subject_nombre_programa,
                properties,
                created_at: { fecha, hora },
            };
        });
    }, [bitacora]);

    const [filterValue, setFilterValue] = React.useState("");
    const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
    const [visibleColumns, setVisibleColumns] = React.useState(
        new Set(INITIAL_VISIBLE_COLUMNS)
    );
    const [statusFilter, setStatusFilter] = React.useState(
        new Set(statusOptions.map((s) => s.uid))
    );
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [sortDescriptor, setSortDescriptor] = React.useState({
        column: "id",
        direction: "descending",
    });
    const [page, setPage] = React.useState(1);

    const hasSearchFilter = Boolean(filterValue);

    const headerColumns = React.useMemo(() => {
        if (visibleColumns === "all") return columns;

        return columns.filter((column) =>
            Array.from(visibleColumns).includes(column.uid)
        );
    }, [visibleColumns]);

    const filteredItems = React.useMemo(() => {
        let filteredUsers = [...users];
        if (filterValue) {
            const lowerCaseFilter = filterValue.toLowerCase();
            filteredUsers = filteredUsers.filter((user) =>
                Object.values(user).some((value) =>
                    value?.toString().toLowerCase().includes(lowerCaseFilter)
                )
            );
        }

        // Filtrar solo si no están todos seleccionados
        if (statusFilter.size < statusOptions.length) {
            filteredUsers = filteredUsers.filter((user) =>
                statusFilter.has(
                    user.description
                        .toLowerCase()
                        .replace(/\s+/g, "_")
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")
                )
            );
        }

        return filteredUsers;
    }, [users, filterValue, statusFilter]);

    const sortedItems = React.useMemo(() => {
        return [...filteredItems].sort((a, b) => {
            const valueA = a[sortDescriptor.column];
            const valueB = b[sortDescriptor.column];

            if (valueA < valueB)
                return sortDescriptor.direction === "ascending" ? -1 : 1;
            if (valueA > valueB)
                return sortDescriptor.direction === "ascending" ? 1 : -1;
            return 0;
        });
    }, [filteredItems, sortDescriptor]);

    const pages = Math.ceil(filteredItems.length / rowsPerPage);

    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return sortedItems.slice(start, end);
    }, [page, sortedItems, rowsPerPage]);

    const renderCell = React.useCallback((user, columnKey) => {
        const cellValue = user[columnKey];

        switch (columnKey) {
            case "id":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-small capitalize">
                            {cellValue}
                        </p>
                        {/* <p className="text-bold text-tiny capitalize text-default-400">
                            {user.grado_programa}
                        </p> */}
                    </div>
                );
            case "description":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-small">{cellValue}</p>
                        {/* <p className="text-bold text-tiny capitalize text-default-400">
                            {user.inscritos}
                        </p> */}
                    </div>
                );
            case "causer":
                return (
                    <User
                        avatarProps={{
                            radius: "lg",
                            src: user.causer_profile_picture
                                ? user.causer_profile_picture
                                : "https://cdn-icons-png.flaticon.com/512/1077/1077012.png",
                        }}
                        description={
                            user.causer_email
                                ? user.causer_email
                                : "No disponible"
                        }
                        name={cellValue ? cellValue : "Sistema"}
                    >
                        {user.causer_email
                            ? user.causer_email
                            : "No disponible"}
                    </User>
                );
            case "subject":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-small capitalize">
                            {cellValue}
                        </p>
                        <p className="text-bold text-tiny capitalize text-default-600">
                            {user.subject_num_iden
                                ? `${user.subject_tipo_doc}: ${user.subject_num_iden}`
                                : ""}
                        </p>
                    </div>
                );
            case "properties":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-tiny text-default-600">
                            {user.subject_nombre_grado
                                ? user.subject_nombre_grado
                                : ""}
                        </p>
                        <p className="text-bold text-small">
                            {cellValue
                                ? cellValue
                                : user.subject_nombre_programa
                                    ? user.subject_nombre_programa
                                    : ""}
                        </p>
                    </div>
                );
            case "created_at":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-small capitalize">
                            {cellValue.hora}
                        </p>
                        <p className="text-bold text-tiny capitalize text-default-400">
                            {cellValue.fecha}
                        </p>
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);

    const onNextPage = React.useCallback(() => {
        if (page < pages) {
            setPage(page + 1);
        }
    }, [page, pages]);

    const onPreviousPage = React.useCallback(() => {
        if (page > 1) {
            setPage(page - 1);
        }
    }, [page]);

    const onRowsPerPageChange = React.useCallback((e) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    }, []);

    const onSearchChange = React.useCallback((value) => {
        if (value) {
            setFilterValue(value);
            setPage(1);
        } else {
            setFilterValue("");
        }
    }, []);

    const onClear = React.useCallback(() => {
        setFilterValue("");
        setPage(1);
    }, []);

    const exportBitacora = async () => {
        setExportLoading(true);
        try {
            const response = await axios.get(`/bitacora-export`, {
                responseType: "blob", // importante
            });

            // Crear un enlace para forzar descarga
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;

            // Nombre del archivo desde backend o por defecto
            const contentDisposition = response.headers["content-disposition"];
            let fileName = `bitacora_admision_${new Date().toLocaleDateString('es-PE').replace(/\//g, '-')}.xlsx`;

            if (contentDisposition) {
                const match = contentDisposition.match(/filename="?([^"]+)"?/);
                if (match?.[1]) fileName = match[1];
            }

            link.setAttribute("download", fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            const errorMessage =
                error.response?.data?.message ||
                error.message ||
                "Error al exportar";
            toast.error(errorMessage);
        } finally {
            setExportLoading(false);
        }
    };

    const topContent = React.useMemo(() => {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex justify-between gap-3 items-end">
                    <Input
                        isClearable
                        className="w-full sm:max-w-[44%]"
                        placeholder="Buscar por nombre..."
                        startContent={<SearchIcon />}
                        value={filterValue}
                        onClear={() => onClear()}
                        onValueChange={onSearchChange}
                    />

                    <div className="flex gap-3">
                        <Button
                            onPress={exportBitacora}
                            color="primary"
                            size="md"
                            variant="flat"
                            startContent={<FileDown className="h-5 w-5" />}
                            className="flex items-center gap-2 rounded-xl"
                        >
                            Exportar
                        </Button>
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button
                                    endContent={
                                        <ChevronDownIcon className="text-small" />
                                    }
                                    variant="flat"
                                    aria-label="descripcion-filter"
                                >
                                    Descripción
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
                                        key={status.uid}
                                        textValue={status.name}
                                        aria-label={status.uid}
                                    >
                                        {status.name}
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
                        {/* <Button color="primary" endContent={<PlusIcon />}>
                            Nuevo
                        </Button> */}
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">
                        Total {filteredItems.length} registros
                    </span>
                    <label className="flex items-center text-default-400 text-small">
                        Filas por página
                        <select
                            className="bg-transparent outline-none text-default-400 text-small"
                            onChange={onRowsPerPageChange}
                        >
                            <option value="10">10</option>
                            <option value="5">5</option>
                            <option value="15">15</option>
                        </select>
                    </label>
                </div>
            </div>
        );
    }, [
        filterValue,
        statusFilter,
        visibleColumns,
        onRowsPerPageChange,
        users.length,
        onSearchChange,
        hasSearchFilter,
    ]);

    const bottomContent = React.useMemo(() => {
        return (
            <div className="py-2 px-2 flex justify-between items-center">
                <span className="w-[30%] text-small text-default-400">
                    {selectedKeys === "all"
                        ? "All items selected"
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
                        isDisabled={pages === 1}
                        size="sm"
                        variant="flat"
                        onPress={onPreviousPage}
                    >
                        Anterior
                    </Button>
                    <Button
                        isDisabled={pages === 1}
                        size="sm"
                        variant="flat"
                        onPress={onNextPage}
                    >
                        Siguiente
                    </Button>
                </div>
            </div>
        );
    }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

    return (
        <DashboardCard
            title="Bitácora Proceso Admisión 2025 - I"
            icon={<ChevronDownIcon className="text-green-500" />}
            className="p-2 m-0" // Reducir padding y márgenes del DashboardCard
        >
            {/* Overlay de carga para exportación (opcional, si lo quieres mantener solo para exportar) */}
            {exportLoading && (
                <Spinner label={"Exportando..."} />
            )}
            <Table
                aria-label="Tabla de bitácora"
                layout="auto"
                isHeaderSticky
                bottomContent={bottomContent}
                bottomContentPlacement="outside"
                classNames={{
                    wrapper:
                        "max-h-[550px] overflow-auto w-full p-2 m-0 sm:p-4 lg:p-6", // Añadir más padding para pantallas más grandes
                }}
                selectedKeys={selectedKeys}
                sortDescriptor={sortDescriptor}
                topContent={topContent}
                topContentPlacement="outside"
                onSelectionChange={setSelectedKeys}
                onSortChange={setSortDescriptor}
                wrap="soft"
                responsive
                isCompact
                isStriped
            >
                <TableHeader>
                    {headerColumns.map((column) => (
                        <TableColumn
                            key={column.uid}
                            allowsSorting={column.sortable}
                            className="text-default-400 text-small"
                            aria-label={column.name}
                            scope="col"
                        >
                            {capitalize(column.name)}
                        </TableColumn>
                    ))}
                </TableHeader>
                <TableBody
                    emptyContent={dataLoading ? <NextUISpinner label="Cargando..." /> : "No se encontró información"}
                    items={items}
                    className="space-y-1 sm:space-y-2 lg:space-y-3" // Reducir espacio entre filas en pantallas pequeñas
                    isLoading={dataLoading}
                    loadingContent={<NextUISpinner label="Cargando..." />}
                >
                    {(item) => (
                        <TableRow
                            key={item.id}
                            className="p-1 text-sm leading-tight sm:text-base lg:text-lg"
                        >
                            {(columnKey) => (
                                <TableCell className="p-1 text-sm sm:text-base lg:text-lg">
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
