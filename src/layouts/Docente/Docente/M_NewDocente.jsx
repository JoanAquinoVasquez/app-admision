import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    Select,
    SelectItem,
    Spinner,
    Divider
} from "@heroui/react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { MdSearch } from "react-icons/md";
import { dniApi } from "../../../services/api/dniApi";

const M_NewDocente = ({ isOpen, onClose, onSave, docenteToEdit = null }) => {
    const modo = docenteToEdit ? "editar" : "nuevo";
    const [formData, setFormData] = useState({
        nombres: "",
        apPaterno: "",
        apMaterno: "",
        dni: "",
        email: "",
        password: "",
        tipo: "cv",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [isSearchingDni, setIsSearchingDni] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (modo === "editar" && docenteToEdit) {
                setFormData({
                    nombres: docenteToEdit.nombres || "",
                    apPaterno: docenteToEdit.ap_paterno || "",
                    apMaterno: docenteToEdit.ap_materno || "",
                    dni: docenteToEdit.dni || "",
                    email: docenteToEdit.email || "",
                    password: "",
                    tipo: docenteToEdit.tipo || "cv",
                });
            } else {
                setFormData({
                    nombres: "",
                    apPaterno: "",
                    apMaterno: "",
                    dni: "",
                    email: "",
                    password: "",
                    tipo: "cv",
                });
            }
            setShowPassword(false);
            setIsSearchingDni(false);
            setIsSaving(false);
        }
    }, [isOpen, docenteToEdit, modo]);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'email' || name === 'password' ? value : value.toUpperCase()
        }));
    };

    const handleDniChange = (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value) && value.length <= 8) {
            setFormData(prev => ({ ...prev, dni: value }));
        }
    };

    const handleSubmit = async () => {
        // Validación de campos requeridos
        if (
            !formData.nombres ||
            !formData.apPaterno ||
            !formData.apMaterno ||
            !formData.dni ||
            !formData.email
        ) {
            toast.error("Por favor, completa todos los campos obligatorios.");
            return;
        }

        if (modo === "nuevo" && !formData.password) {
            toast.error("La contraseña es obligatoria para nuevos docentes.");
            return;
        }

        setIsSaving(true);
        try {
            await onSave({
                id: docenteToEdit?.id,
                nombres: formData.nombres,
                ap_paterno: formData.apPaterno,
                ap_materno: formData.apMaterno,
                dni: formData.dni,
                email: formData.email,
                password: formData.password,
                tipo: formData.tipo,
            }, modo);
        } finally {
            setIsSaving(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const buscarDNI = async () => {
        if (formData.dni.length !== 8) {
            toast.error("El DNI debe tener 8 dígitos.");
            return;
        }

        setIsSearchingDni(true);
        try {
            const data = await dniApi.search(formData.dni);
            if (data && data.nombres) {
                setFormData(prev => ({
                    ...prev,
                    nombres: data.nombres || "",
                    apPaterno: data.apellidoPaterno || "",
                    apMaterno: data.apellidoMaterno || "",
                }));
                toast.success("Datos obtenidos correctamente");
            } else {
                toast.error("No se encontraron datos para este DNI");
            }
        } catch (error) {
            console.error("Error consultando DNI:", error);
            toast.error("Error al consultar el DNI");
        } finally {
            setIsSearchingDni(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            backdrop="blur"
            size="3xl"
            className="p-4"
        >
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1 text-slate-800 text-lg font-semibold">
                    {modo === "nuevo" ? "Registrar Nuevo Docente" : "Editar Datos del Docente"}
                </ModalHeader>

                <ModalBody>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            type="text"
                            label="DNI"
                            name="dni"
                            data-testid="input-dni"
                            value={formData.dni}
                            onChange={handleDniChange}
                            isRequired={true}
                            variant="bordered"
                            endContent={
                                <Button
                                    isIconOnly
                                    size="sm"
                                    color="primary"
                                    variant="flat"
                                    isLoading={isSearchingDni}
                                    onPress={buscarDNI}
                                    className="h-8 w-8 min-w-8"
                                >
                                    {!isSearchingDni && <MdSearch size={18} />}
                                </Button>
                            }
                            description="Ingrese 8 dígitos y busque"
                        />
                        <Input
                            type="text"
                            label="Nombres"
                            name="nombres"
                            data-testid="input-nombres"
                            value={formData.nombres}
                            onChange={handleFormChange}
                            isRequired={true}
                            variant="bordered"
                            classNames={{ input: "uppercase" }}
                        />
                        
                        <div className="grid grid-cols-2 gap-2">
                            <Input
                                type="text"
                                label="Ap. Paterno"
                                name="apPaterno"
                                data-testid="input-apellido-paterno"
                                value={formData.apPaterno}
                                onChange={handleFormChange}
                                isRequired={true}
                                variant="bordered"
                                classNames={{ input: "uppercase" }}
                            />
                            <Input
                                type="text"
                                label="Ap. Materno"
                                name="apMaterno"
                                data-testid="input-apellido-materno"
                                value={formData.apMaterno}
                                onChange={handleFormChange}
                                isRequired={true}
                                variant="bordered"
                                classNames={{ input: "uppercase" }}
                            />
                        </div>

                        <Input
                            type="email"
                            label="Correo Electrónico"
                            name="email"
                            data-testid="input-correo"
                            value={formData.email}
                            onChange={handleFormChange}
                            isRequired={true}
                            autoComplete="email"
                            variant="bordered"
                        />
                        
                        <Select
                            label="Tipo de Evaluación"
                            name="tipo"
                            selectedKeys={[formData.tipo]}
                            onChange={(e) => setFormData(p => ({ ...p, tipo: e.target.value }))}
                            variant="bordered"
                            isRequired={true}
                        >
                            <SelectItem key="cv" value="cv">Evaluador por Expediente (CV)</SelectItem>
                            <SelectItem key="entrevista" value="entrevista">Evaluador por Entrevista</SelectItem>
                        </Select>

                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                label={modo === "editar" ? "Nueva Contraseña (opcional)" : "Contraseña"}
                                name="password"
                                value={formData.password}
                                autoComplete="off"
                                data-testid="input-password"
                                onChange={handleFormChange}
                                maxLength={8}
                                isRequired={modo === "nuevo"}
                                variant="bordered"
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute top-4 right-3 text-slate-400 hover:text-slate-600 outline-none"
                            >
                                {showPassword ? (
                                    <AiFillEyeInvisible size={20} />
                                ) : (
                                    <AiFillEye size={20} />
                                )}
                            </button>
                        </div>
                    </div>
                    
                    <Divider className="my-2" />
                    <p className="text-xs text-slate-500 italic">
                        {modo === "editar" ? "* Deje la contraseña en blanco si no desea cambiarla." : "* La contraseña será requerida para el primer inicio de sesión del docente."}
                    </p>
                </ModalBody>

                <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose} isDisabled={isSaving}>
                        Cancelar
                    </Button>
                    <Button
                        color="primary"
                        data-testid="btn-guardar-docente"
                        onPress={handleSubmit}
                        isLoading={isSaving}
                    >
                        {modo === "nuevo" ? "Crear Docente" : "Guardar Cambios"}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default M_NewDocente;
