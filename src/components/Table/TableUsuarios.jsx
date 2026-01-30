import { useState, useCallback, useMemo, useEffect, useRef } from "react";
// import Spinner from "../../components/Spinner/Spinner"; // Spinner
import { toast } from "react-hot-toast";
import { FormControl, Box } from "@mui/material";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    SelectItem,
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
    Select,
    Spinner,
    user,
} from "@nextui-org/react";
import Typography from "@mui/material/Typography";
import RenderFileUpload from "../../components/Inputs/RenderFileUpload";
import axios from "../../axios";
import ModalConfirm from "../Modal/Confirmation/ModalConfirm";
import useUsuarios from "../../data/Usuarios/dataUsuarios";
import { PlusIcon } from "lucide-react";

export const columns = [
    { name: "ID", uid: "id", sortable: true },
    { name: "Nombres Completos", uid: "nombre_completo", sortable: true },
    { name: "Email", uid: "email", sortable: true },
    { name: "Rol", uid: "rol" },
    { name: "Fecha de Creación", uid: "created_at", sortable: true },
    { name: "Estado", uid: "estado", sortable: true },
    { name: "Acciones", uid: "actions" },
];

export const statusOptions = [
    { name: "Desahabilitado", uid: false },
    { name: "Habilitado", uid: true },
];

export function capitalize(s) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

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
    true: "success",
    false: "danger",
};

const INITIAL_VISIBLE_COLUMNS = [
    "id",
    "nombre_completo",
    "email",
    "rol",
    "created_at",
    "estado",
    "actions",
];

export default function App() {
    const {
        users: dataUsers,
        loading: loadingUsers,
        error: errorUsers,
        refetch: fetchUsers,
    } = useUsuarios();
    const [isValidarOpen, setIsValidarOpen] = useState(false);
    const [modo, setModo] = useState(null); // "nuevo" o "editar"
    const [validarId, setValidarId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);

    const [nombres, setNombres] = useState("");
    const [email, setEmail] = useState("");
    const [rol, setRol] = useState("");
    const [estado, setEstado] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const toggleEditMode = () => setEditMode(!editMode);

    const formDataRef = useRef(new FormData());
    const [originalData, setOriginalData] = useState({}); // Guardamos los valores originales
    const [loading, setLoading] = useState(false);
    const [loadingEditar, setLoadingEditar] = useState(false);

    // ✅ Aseguramos que `inscripciones` tenga datos antes de mapear
    const users = useMemo(() => {
        if (loadingUsers) {
            setLoading(true);
            return []; // Evita errores si aún no hay datos
        }
        setLoading(false);
        return dataUsers.map((item) => {
            const formatoFechaHora = (fechaHora) => {
                if (!fechaHora) {
                    return { fecha: "No disponible", hora: "No disponible" };
                }

                try {
                    const date = new Date(fechaHora);

                    const fecha = date.toLocaleDateString("es-PE", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                    });

                    const hora = date.toLocaleTimeString("es-PE", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: false, // si prefieres formato 24h
                    });

                    return { fecha, hora };
                } catch (error) {
                    console.error("Error al formatear fecha:", error);
                    return { fecha: "No disponible", hora: "No disponible" };
                }
            };

            const { fecha, hora } = formatoFechaHora(item.created_at);
            return {
                id: item.id,
                nombre_completo: `${capitalize(item.name)}`,
                email: item.email,
                rol: item.roles[0]?.nombre ?? "No asignado",
                fecha_created_at: fecha,
                hora_created_at: hora,
                estado: item.estado,
            };
        });
    }, [dataUsers]);

    const [filterValue, setFilterValue] = useState("");
    const [selectedKeys, setSelectedKeys] = useState(new Set([]));
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

    // API Validar
    // API Validar / Toggle estado
    const handleValidar = async (userId) => {
        setIsValidarOpen(false);
        setLoading(true);

        try {
            const user = users.find((u) => u.id == userId);
            if (!user) throw new Error("Usuario no encontrado");

            await axios.post(`/users/${userId}`, {
                estado: !user.estado, // 🔄 toggle habilitar/inhabilitar
            });
            fetchUsers(); // 🔄 refrescar lista
            toast.success(
                `Usuario ${!user.estado ? "habilitado" : "inhabilitado"
                } correctamente`
            );
        } catch (error) {
            toast.error("Error al actualizar usuario");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitNuevo = async () => {
        setLoading(true);
        try {
            const response = await axios.post("/users", {
                name: nombres,
                email: email,
                rol: rol,
                estado: estado,
            });
            toast.success(
                response.data.message || "Usuario creado exitosamente."
            );
            setIsModalOpen(false);
            fetchUsers(); // Refrescar la lista de usuarios
            setNombres("");
            setEmail("");
            setRol("");
            setEstado(true);
        } catch (error) {
            if (error.response?.data?.errors) {
                // Backend devolvió validaciones
                const errores = error.response.data.errors;
                Object.values(errores).forEach((mensajes) => {
                    mensajes.forEach((msg) => toast.error(msg));
                });
            } else if (error.response?.data?.error) {
                // Error de backend
                toast.error(error.response.data.error);
            } else {
                toast.error("Hubo un error al crear el usuario.");
            }
        } finally {
            setLoading(false);
        }
    };

    // API Editar

    const handleSubmitEditar = async (userId) => {
        setLoading(true);
        try {
            const user = users.find((u) => u.id == userId);
            if (!user) throw new Error("Usuario no encontrado");
            const formData = formDataRef.current;
            if (formData.size === 0) {
                toast.error("No se han realizado cambios.");
                setIsModalOpen(false);
                setLoading(false);
                return;
            }
            await axios.post(`/users/${userId}`, Object.fromEntries(formData));
            toast.success("Usuario actualizado correctamente.");
            setIsModalOpen(false);
            fetchUsers(); // Refrescar la lista de usuarios
            setNombres("");
            setEmail("");
            setRol("");
            setEstado(true);
            fetchUsers(); // Refrescar la lista de usuarios
            formDataRef.current = new FormData(); // Resetear formData
            setOriginalData({}); // Resetear datos originales
        } catch (error) {
            toast.error(
                error.response?.data?.email ||
                "Hubo un error al actualizar el usuario."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field, value) => {
        if (originalData[field] !== value) {
            formDataRef.current.set(field, value);
        } else {
            formDataRef.current.delete(field);
        }
    };

    const renderCell = useCallback((user, columnKey) => {
        const cellValue = user[columnKey];

        switch (columnKey) {
            case "id":
                return (
                    <div className="flex flex-col">
                        <p className="text-sm text-default-400">{cellValue}</p>
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
            case "email":
                return (
                    <div className="flex flex-col">
                        <p className="text-sm text-default-400">{cellValue}</p>
                        <p className="font-medium text-sm text-default-500">
                            {user.email}
                        </p>
                    </div>
                );

            case "rol":
                return (
                    <div className="flex flex-col">
                        <p className="font-medium text-sm text-default-500">
                            {cellValue}
                        </p>
                    </div>
                );

            case "created_at":
                return (
                    <div className="flex flex-col">
                        <p className="text-sm text-default-400">
                            {user.hora_created_at}
                        </p>
                        <p className="font-medium text-sm text-default-500">
                            {user.fecha_created_at}
                        </p>
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
                        {user.estado === true ? "Habilitado" : "Deshabilitado"}
                    </Chip>
                );

            case "actions":
                return (
                    <div className="relative flex justify-end items-center gap-2">
                        <Dropdown>
                            <DropdownTrigger>
                                <Button
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
                                    key="toggleEstado"
                                    textValue={
                                        user.estado
                                            ? "Inhabilitar"
                                            : "Habilitar"
                                    }
                                    onPress={() => {
                                        setValidarId(user.id);
                                        setIsValidarOpen(true);
                                    }}
                                >
                                    {user.estado ? "Inhabilitar" : "Habilitar"}
                                </DropdownItem>

                                <DropdownItem
                                    key="edit"
                                    textValue="Editar"
                                    onPress={() => {
                                        setModo("editar");
                                        setNombres(user.nombre_completo);
                                        setSelectedUserId(user.id);
                                        setEmail(user.email);
                                        setRol(user.rol);
                                        setIsModalOpen(true);
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
                <ModalConfirm
                    isOpen={isValidarOpen}
                    onClose={() => setIsValidarOpen(false)}
                    onConfirm={() => handleValidar(validarId)}
                    message={`¿Estás seguro que deseas ${users.find((u) => u.id === validarId)?.estado
                        ? "inhabilitar"
                        : "habilitar"
                        } este usuario?`}
                />

                <Modal
                    backdrop="opaque"
                    isOpen={isModalOpen}
                    placement="center"
                    size="5xl"
                    scrollBehavior="inside"
                    onClose={() => setIsModalOpen(false)}
                >
                    <ModalContent>
                        <ModalHeader className="flex flex-col gap-1">
                            {modo === "editar"
                                ? "Editar Usuario"
                                : "Nuevo Usuario"}
                        </ModalHeader>

                        <ModalBody>
                            <form>
                                <h3 className="font-bold mb-2">
                                    Datos personales
                                </h3>
                                <Box
                                    sx={{
                                        display: "grid",
                                        gap: 2,
                                        gridTemplateColumns: {
                                            xs: "1fr",
                                            md: "2fr 2fr 2fr",
                                        },
                                        mb: 2,
                                    }}
                                >
                                    <Input
                                        label="Nombres Completos"
                                        name="name"
                                        value={nombres || ""}
                                        isRequired
                                        maxLength={50}
                                        onChange={(e) => {
                                            setNombres(e.target.value);
                                            handleChange(
                                                "name",
                                                e.target.value
                                            );
                                        }}
                                    />
                                    <Input
                                        label="Correo Electrónico"
                                        name="email"
                                        value={email || ""}
                                        isRequired
                                        maxLength={50}
                                        type="email"
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            handleChange(
                                                "email",
                                                e.target.value
                                            );
                                        }}
                                    />
                                    <Select
                                        label="Rol del Usuario"
                                        placeholder="Selecciona un rol"
                                        selectedKeys={rol ? [rol] : []} // ✅ Forma correcta en NextUI
                                        onSelectionChange={(keys) => {
                                            const value = Array.from(keys)[0]; // Obtener el valor seleccionado
                                            setRol(value);
                                            handleChange("rol", value);
                                        }}
                                        isRequired
                                    >
                                        <SelectItem
                                            key="Super Administrativo"
                                            value="super-admin"
                                        >
                                            Super Admin
                                        </SelectItem>
                                        <SelectItem
                                            key="Administrativo"
                                            value="admin"
                                        >
                                            Administrativo
                                        </SelectItem>
                                        <SelectItem
                                            key="Comision Admision"
                                            value="comision"
                                        >
                                            Comisión de Admisión
                                        </SelectItem>
                                    </Select>
                                </Box>
                            </form>
                        </ModalBody>

                        <ModalFooter>
                            <Button
                                color="default"
                                variant="flat"
                                onPress={() => setIsModalOpen(false)}
                            >
                                Cancelar
                            </Button>
                            <Button
                                color="primary"
                                onPress={() =>
                                    modo === "editar"
                                        ? handleSubmitEditar(selectedUserId)
                                        : handleSubmitNuevo()
                                }
                            >
                                {modo === "editar"
                                    ? "Guardar Cambios"
                                    : "Crear Usuario"}
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>



                <div className="flex flex-col gap-2">
                    {/* 🔎 Fila 1: Búsqueda y Filtros Principales */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-1 w-full">
                        {/* 🔍 Input de búsqueda */}
                        <div className="col-span-1 md:col-span-2">
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

                        {/* 🧩 Filtros Estado y Columnas */}
                        <div className="col-span-1 md:col-span-2 flex flex-col sm:flex-row gap-2 justify-end w-full">
                            <Dropdown>
                                <DropdownTrigger className="w-full sm:w-auto">
                                    <Button
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
                                    closeOnSelect={false}
                                    selectedKeys={statusFilter}
                                    selectionMode="multiple"
                                    onSelectionChange={setStatusFilter}
                                >
                                    {statusOptions.map((status) => (
                                        <DropdownItem
                                            key={status.uid}
                                            textValue={status.name}
                                            className="capitalize"
                                        >
                                            {capitalize(status.name)}
                                        </DropdownItem>
                                    ))}
                                </DropdownMenu>
                            </Dropdown>

                            <Dropdown>
                                <DropdownTrigger className="w-full sm:w-auto">
                                    <Button
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
                                            key={column.uid}
                                            textValue={column.name}
                                            className="capitalize"
                                        >
                                            {capitalize(column.name)}
                                        </DropdownItem>
                                    ))}
                                </DropdownMenu>
                            </Dropdown>
                            <Button
                                endContent={<PlusIcon className="text-small" />}
                                color="primary"
                                className="h-12 w-full md:w-auto"
                                onPress={() => {
                                    setModo("nuevo");
                                    setIsModalOpen(true);
                                    setNombres("");
                                    setEmail("");
                                    setRol("");
                                    setEstado(true);
                                }}
                            >
                                Nuevo Usuario
                            </Button>
                        </div>
                    </div>

                    {/* 📊 Resumen de resultados */}
                    <div className="flex justify-between items-center text-default-400 text-sm mt-0">
                        <span>{`${filteredItems.length} usuarios`}</span>
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
                emptyContent={(loading || loadingUsers) ? <Spinner label="Cargando..." /> : "No se encontró usuarios"}
                items={items}
                className="space-y-1" // Reducir espacio entre filas
                isLoading={loading || loadingUsers}
                loadingContent={<Spinner label="Cargando..." />}
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
        </Table >
    );
}
