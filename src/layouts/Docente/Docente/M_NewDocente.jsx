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
} from "@nextui-org/react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai"; // Importa los íconos de ojo

const M_NewDocente = ({ isOpen, onClose, onSave }) => {
    const [nombres, setNombres] = useState("");
    const [apPaterno, setApPaterno] = useState("");
    const [apMaterno, setApMaterno] = useState("");
    const [dni, setDni] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar la contraseña

    useEffect(() => {
        if (!isOpen) {
            // Resetear los valores cuando se cierra el modal
            setNombres("");
            setApPaterno("");
            setApMaterno("");
            setDni("");
            setEmail("");
            setPassword("");
            setShowPassword(false);
        }
    }, [isOpen]);

    const handleSubmit = () => {
        // Validación de campos requeridos
        if (
            !nombres ||
            !apPaterno ||
            !apMaterno ||
            !dni ||
            !email ||
            !password
        ) {
            toast.error("Todos los campos son requeridos.");
            return;
        }

        onSave({
            nombres,
            ap_paterno: apPaterno,
            ap_materno: apMaterno,
            dni,
            email,
            password,
        });
        onClose(); // Cierra el modal después de guardar
    };

    // Función para validar que solo se ingresen letras en nombres y apellidos
    const handleTextChange = (setter) => (e) => {
        const value = e.target.value;
        if (/^[a-zA-Z\s]*$/.test(value)) {
            setter(value);
        }
    };

    // Función para validar que solo se ingresen números en DNI y contraseña
    const handleNumberChange = (setter, maxLength) => (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value) && value.length <= maxLength) {
            setter(value);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword); // Alternar la visibilidad de la contraseña
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            backdrop="blur"
            size="md"
            className="p-4"
        >
            <ModalContent>
                <ModalHeader className="text-lg font-semibold">
                    Agregar Docente
                </ModalHeader>

                <ModalBody>
                    <form
                        onSubmit={(e) => e.preventDefault()}
                        className="space-y-4"
                    >
                        <Input
                            type="text"
                            label="Nombres"
                            data-testid="input-nombres"
                            value={nombres}
                            onChange={handleTextChange(setNombres)}
                            isRequired={true}
                        />
                        <Input
                            type="text"
                            label="Apellido Paterno"
                            data-testid="input-apellido-paterno"
                            value={apPaterno}
                            onChange={handleTextChange(setApPaterno)}
                            isRequired={true}
                        />
                        <Input
                            type="text"
                            label="Apellido Materno"
                            data-testid="input-apellido-materno"
                            value={apMaterno}
                            onChange={handleTextChange(setApMaterno)}
                            isRequired={true}
                        />
                        <Input
                            type="text"
                            label="DNI"
                            data-testid="input-dni"
                            value={dni}
                            onChange={handleNumberChange(setDni, 8)}
                            isRequired={true}
                        />
                        <Input
                            type="email"
                            label="Correo"
                            data-testid="input-correo"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            isRequired={true}
                            autocomplete="email" // Autocompletar para el correo
                        />
                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"} // Cambiar el tipo según el estado de visibilidad
                                label="Contraseña"
                                value={password}
                                autoComplete="off"
                                data-testid="input-password"
                                onChange={(e) => setPassword(e.target.value)}
                                maxLength={8}
                                autocomplete="new-password" // Autocompletar para la contraseña
                                isRequired={true}
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility} // Cambiar la visibilidad de la contraseña
                                className="absolute top-3 right-3"
                            >
                                {showPassword ? (
                                    <AiFillEyeInvisible size={20} />
                                ) : (
                                    <AiFillEye size={20} />
                                )}
                            </button>
                        </div>
                    </form>
                </ModalBody>

                <ModalFooter>
                    <Button color="default" variant="flat" onPress={onClose}>
                        Cancelar
                    </Button>
                    <Button
                        color="primary"
                        data-testid="btn-guardar-docente"
                        onPress={handleSubmit} // Ahora se maneja el submit con onPress
                    >
                        Guardar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default M_NewDocente;
