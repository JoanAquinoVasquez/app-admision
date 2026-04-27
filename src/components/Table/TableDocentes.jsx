import { useState, useCallback, useMemo } from "react";
import { toast } from "react-hot-toast";
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
    Skeleton,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Divider,
    Select,
    SelectItem,
    Pagination
} from "@heroui/react";
import {
    Search,
    Plus,
    MoreVertical,
    User,
    Mail,
    IdCard,
    ShieldCheck,
    ShieldAlert,
    Edit,
    Trash2,
    Eye,
    EyeOff
} from "lucide-react";
import axios from "../../axios";
import useDocentes from "../../data/Docentes/dataDocentes";
import ModalConfirm from "../Modal/Confirmation/ModalConfirm";
import { useTableFilters } from "../../hooks/useTableFilters";

export const columns = [
    { name: "ID", uid: "id", sortable: true },
    { name: "Docente", uid: "nombre_completo", sortable: true },
    { name: "DNI", uid: "dni", sortable: true },
    { name: "Email", uid: "email", sortable: true },
    { name: "Tipo", uid: "tipo", sortable: true },
    { name: "Estado", uid: "estado", sortable: true },
    { name: "Acciones", uid: "actions" },
];

const statusColorMap = {
    true: "success",
    false: "danger",
};

const tipoLabelMap = {
    cv: "Evaluador CV",
    entrevista: "Entrevista",
};

export default function TableDocentes() {
    const { docentes, loading, refetch } = useDocentes();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [selectedDocente, setSelectedDocente] = useState(null);
    const [modo, setModo] = useState("nuevo"); // "nuevo" o "editar"
    const [showPassword, setShowPassword] = useState(false);
    const [loadingGuardado, setLoadingGuardado] = useState(false);

    // Filtro adicional por tipo
    const [tipoFilter, setTipoFilter] = useState("all");

    const {
        filterValue,
        onSearchChange,
        onClear,
        items,
        pages,
        page,
        setPage,
        sortDescriptor,
        setSortDescriptor,
        filteredItems
    } = useTableFilters(docentes, {
        initialRowsPerPage: 10,
        initialSortColumn: "id",
        customFilter: (data) => {
            if (tipoFilter === "all") return data;
            return data.filter(d => d.tipo === tipoFilter);
        }
    });

    // Form states
    const [formData, setFormData] = useState({
        nombres: "",
        ap_paterno: "",
        ap_materno: "",
        dni: "",
        email: "",
        password: "",
        tipo: "cv",
    });

    const handleOpenModal = (docente = null) => {
        if (docente) {
            setModo("editar");
            setSelectedDocente(docente);
            setFormData({
                nombres: docente.nombres,
                ap_paterno: docente.ap_paterno,
                ap_materno: docente.ap_materno,
                dni: docente.dni,
                email: docente.email,
                password: "",
                tipo: docente.tipo,
            });
        } else {
            setModo("nuevo");
            setSelectedDocente(null);
            setFormData({
                nombres: "",
                ap_paterno: "",
                ap_materno: "",
                dni: "",
                email: "",
                password: "",
                tipo: "cv",
            });
        }
        setIsModalOpen(true);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'email' ? value.toLowerCase() : value.toUpperCase()
        }));
    };

    const handleSave = async () => {
        // Validaciones básicas
        if (!formData.nombres || !formData.ap_paterno || !formData.ap_materno || !formData.dni || !formData.email) {
            toast.error("Por favor, completa todos los campos obligatorios");
            return;
        }

        if (modo === "nuevo" && !formData.password) {
            toast.error("La contraseña es obligatoria para nuevos docentes");
            return;
        }

        setLoadingGuardado(true);
        try {
            if (modo === "nuevo") {
                await axios.post("/docentes", formData);
                toast.success("Docente creado exitosamente");
            } else {
                const updateData = { ...formData };
                if (!updateData.password) delete updateData.password; // No actualizar password si está vacía
                await axios.post(`/docentes/${selectedDocente.id}`, updateData);
                toast.success("Docente actualizado exitosamente");
            }
            setIsModalOpen(false);
            refetch();
        } catch (error) {
            const msg = error.response?.data?.message || "Ocurrió un error al guardar";
            toast.error(msg);
        } finally {
            setLoadingGuardado(false);
        }
    };

    const handleToggleEstado = (docente) => {
        setSelectedDocente(docente);
        setIsConfirmOpen(true);
    };

    const confirmToggleEstado = async () => {
        try {
            const nuevoEstado = !selectedDocente.estado;
            await axios.post(`/docentes/${selectedDocente.id}`, { estado: nuevoEstado });
            toast.success(`Docente ${nuevoEstado ? 'habilitado' : 'inhabilitado'} correctamente`);
            setIsConfirmOpen(false);
            refetch();
        } catch (error) {
            toast.error("Error al cambiar el estado");
        }
    };

    const renderCell = useCallback((docente, columnKey) => {
        const cellValue = docente[columnKey];

        switch (columnKey) {
            case "nombre_completo":
                return (
                    <div className="flex flex-col">
                        <p className="text-sm font-semibold text-slate-700">
                            {docente.ap_paterno} {docente.ap_materno}, {docente.nombres}
                        </p>
                    </div>
                );
            case "dni":
                return (
                    <div className="flex items-center gap-2">
                        <IdCard size={14} className="text-slate-400" />
                        <span className="text-sm text-slate-600">{cellValue}</span>
                    </div>
                );
            case "email":
                return (
                    <div className="flex items-center gap-2">
                        <Mail size={14} className="text-slate-400" />
                        <span className="text-sm text-slate-600">{cellValue}</span>
                    </div>
                );
            case "tipo":
                return (
                    <Chip
                        size="sm"
                        variant="flat"
                        color={cellValue === "cv" ? "secondary" : "primary"}
                        className="font-medium"
                    >
                        {tipoLabelMap[cellValue] || cellValue}
                    </Chip>
                );
            case "estado":
                return (
                    <Chip
                        className="capitalize font-bold border-none"
                        color={docente.estado ? "success" : "danger"}
                        size="sm"
                        variant="flat"
                    >
                        {docente.estado ? "Activo" : "Inactivo"}
                    </Chip>
                );
            case "actions":
                return (
                    <div className="relative flex justify-end items-center gap-2">
                        <Dropdown>
                            <DropdownTrigger>
                                <Button isIconOnly size="sm" variant="light">
                                    <MoreVertical className="text-slate-400" size={18} />
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Acciones de docente">
                                <DropdownItem
                                    key="edit"
                                    startContent={<Edit size={16} />}
                                    onPress={() => handleOpenModal(docente)}
                                >
                                    Editar Información
                                </DropdownItem>
                                <DropdownItem
                                    key="toggle"
                                    color={docente.estado ? "danger" : "success"}
                                    startContent={docente.estado ? <ShieldAlert size={16} /> : <ShieldCheck size={16} />}
                                    onPress={() => handleToggleEstado(docente)}
                                >
                                    {docente.estado ? "Inhabilitar" : "Habilitar"}
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);

    const topContent = useMemo(() => {
        if (loading && docentes.length === 0) {
            return (
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row justify-between gap-3 items-end">
                        <div className="flex gap-2 w-full sm:max-w-2xl">
                            <Skeleton className="w-full h-10 rounded-lg" />
                            <Skeleton className="w-[200px] h-10 rounded-lg" />
                        </div>
                        <Skeleton className="w-[160px] h-10 rounded-lg" />
                    </div>
                </div>
            );
        }

        return (
            <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row justify-between gap-3 items-end">
                    <div className="flex gap-2 w-full sm:max-w-2xl">
                        <Input
                            isClearable
                            className="w-full"
                            placeholder="Nombre, DNI o correo..."
                            startContent={<Search size={18} className="text-slate-400" />}
                            value={filterValue}
                            onClear={onClear}
                            onValueChange={onSearchChange}
                            variant="bordered"
                        />
                        <Select
                            className="max-w-[200px]"
                            placeholder="Tipo Docente"
                            selectedKeys={[tipoFilter]}
                            onSelectionChange={(keys) => setTipoFilter(Array.from(keys)[0])}
                            variant="bordered"
                        >
                            <SelectItem key="all">Todos los Tipos</SelectItem>
                            <SelectItem key="cv">Evaluador CV</SelectItem>
                            <SelectItem key="entrevista">Entrevista</SelectItem>
                        </Select>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            color="primary"
                            endContent={<Plus size={20} />}
                            className="font-bold h-10 px-6"
                            onPress={() => handleOpenModal()}
                        >
                            Nuevo Docente
                        </Button>
                    </div>
                </div>
            </div>
        );
    }, [filterValue, onSearchChange, onClear, tipoFilter, loading, docentes.length]);

    const bottomContent = useMemo(() => {
        if (loading && docentes.length === 0) {
            return (
                <div className="py-2 px-2 flex justify-between items-center">
                    <Skeleton className="w-[150px] h-5 rounded-lg" />
                    <Skeleton className="w-[300px] h-8 rounded-lg" />
                </div>
            );
        }

        return (
            <div className="py-2 px-2 flex justify-between items-center">
                <span className="text-small text-default-400">
                    {filteredItems.length} docentes encontrados
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
            </div>
        );
    }, [page, pages, setPage, filteredItems.length, loading, docentes.length]);

    const loadingBody = useMemo(() => {
        return (
            <TableBody emptyContent=" ">
                {[...Array(5)].map((_, i) => (
                    <TableRow key={`skeleton-${i}`}>
                        {columns.map((col) => (
                            <TableCell key={`${i}-${col.uid}`}>
                                <Skeleton className="w-full h-8 rounded-lg" />
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        );
    }, []);

    return (
        <div className="w-full">
            <Table
                aria-label="Tabla de gestión de docentes"
                bottomContent={bottomContent}
                bottomContentPlacement="outside"
                classNames={{
                    wrapper: "shadow-sm border border-slate-100 rounded-xl bg-white p-0 overflow-hidden",
                    th: "bg-slate-50 text-slate-800 font-bold py-4 border-b border-divider",
                    td: "py-3"
                }}
                topContent={topContent}
                topContentPlacement="outside"
                sortDescriptor={sortDescriptor}
                onSortChange={setSortDescriptor}
            >
                <TableHeader columns={columns}>
                    {(column) => (
                        <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                {loading && docentes.length === 0 ? (
                    loadingBody
                ) : (
                    <TableBody
                        items={items}
                        emptyContent={!loading && "No se encontraron docentes."}
                    >
                        {(item) => (
                            <TableRow key={item.id}>
                                {(columnKey) => (
                                    <TableCell>{renderCell(item, columnKey)}</TableCell>
                                )}
                            </TableRow>
                        )}
                    </TableBody>
                )}
            </Table>

            {/* Modal de CRUD */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                size="3xl"
                backdrop="blur"
            >
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1 text-slate-800">
                        {modo === "nuevo" ? "Registrar Nuevo Docente" : "Editar Datos del Docente"}
                    </ModalHeader>
                    <ModalBody>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Nombres"
                                name="nombres"
                                value={formData.nombres}
                                onChange={handleFormChange}
                                isRequired
                                variant="bordered"
                                className="uppercase"
                            />
                            <div className="grid grid-cols-2 gap-2">
                                <Input
                                    label="Ap. Paterno"
                                    name="ap_paterno"
                                    value={formData.ap_paterno}
                                    onChange={handleFormChange}
                                    isRequired
                                    variant="bordered"
                                />
                                <Input
                                    label="Ap. Materno"
                                    name="ap_materno"
                                    value={formData.ap_materno}
                                    onChange={handleFormChange}
                                    isRequired
                                    variant="bordered"
                                />
                            </div>
                            <Input
                                label="DNI"
                                name="dni"
                                maxLength={8}
                                value={formData.dni}
                                onChange={handleFormChange}
                                isRequired
                                variant="bordered"
                            />
                            <Input
                                label="Correo Electrónico"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleFormChange}
                                isRequired
                                variant="bordered"
                            />
                            <Select
                                label="Tipo de Evaluación"
                                name="tipo"
                                selectedKeys={[formData.tipo]}
                                onChange={(e) => setFormData(p => ({ ...p, tipo: e.target.value }))}
                                variant="bordered"
                                isRequired
                            >
                                <SelectItem key="cv" value="cv">Evaluador por Expediente (CV)</SelectItem>
                                <SelectItem key="entrevista" value="entrevista">Evaluador por Entrevista</SelectItem>
                            </Select>
                            <div className="relative">
                                <Input
                                    label={modo === "editar" ? "Nueva Contraseña (opcional)" : "Contraseña"}
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={handleFormChange}
                                    variant="bordered"
                                    isRequired={modo === "nuevo"}
                                />
                                <button
                                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 outline-none"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                        <Divider className="my-2" />
                        <p className="text-xs text-slate-500 italic">
                            {modo === "editar" ? "* Deje la contraseña en blanco si no desea cambiarla." : "* La contraseña será requerida para el primer inicio de sesión del docente."}
                        </p>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="light" onPress={() => setIsModalOpen(false)} isDisabled={loadingGuardado}>
                            Cancelar
                        </Button>
                        <Button color="primary" onPress={handleSave} isLoading={loadingGuardado}>
                            {modo === "nuevo" ? "Crear Docente" : "Guardar Cambios"}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Modal de Confirmación para Inhabilitar */}
            <ModalConfirm
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={confirmToggleEstado}
                message={`¿Estás seguro de que deseas ${selectedDocente?.estado ? 'inhabilitar' : 'habilitar'} a este docente?`}
            />
        </div>
    );
}
