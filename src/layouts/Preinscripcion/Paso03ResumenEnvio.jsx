import { useState } from "react";
import {
    Button,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    form,
} from "@heroui/react";
import logoWithTextImage from "../../assets/Isotipos/isotipo_color_epg.webp";
import { FormHeader } from "./components";
import { toast } from "react-hot-toast";
import Input from "../../components/Inputs/InputField";
import axios from "axios";

export default function Paso03ResumenEnvio({
    formData,
    setFormData,
    setStep,
    setLoading,
}) {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleSubmit = async () => {
        setIsModalVisible(false);
        setLoading(true);
        try {
            const response = await axios.post("/pre-inscripcion", formData);
            if (response.status === 201) {
                toast.success("Formulario enviado exitosamente");
                setTimeout(() => window.location.reload(), 1500);
            }
        } catch (error) {
            toast.error("Error al enviar el formulario");
        } finally {
            setLoading(false);
        }
    };

    const formatFecha = (fechaISO) => {
        if (!fechaISO) return "";
        const [year, month, day] = fechaISO.split("-");
        return `${day}-${month}-${year}`;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <div className="flex flex-col gap-6 px-2 sm:px-4">
            {/* Encabezado */}
            <FormHeader
                title="Admisión 2025 - I"
                subtitle="Escuela de Posgrado UNPRG"
                logoSrc={logoWithTextImage}
            />

            <h3 className="text-2xl md:text-3xl font-semibold text-center">
                Formulario de Preinscripción
            </h3>
            <h3 className="text-lg font-semibold">3. Información Adicional</h3>

            {/* Inputs editables */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                    label="Universidad de Procedencia"
                    value={formData.uni_procedencia}
                    isRequired={false}
                    name="uni_procedencia"
                    onChange={handleChange}
                    uppercase
                />
                <Input
                    label="Centro de Trabajo"
                    value={formData.centro_trabajo}
                    isRequired={false}
                    name="centro_trabajo"
                    uppercase
                    onChange={handleChange}
                />
                <Input
                    label="Cargo"
                    value={formData.cargo}
                    isRequired={false}
                    uppercase
                    name="cargo"
                    onChange={handleChange}
                />
            </div>

            {/* Botones */}
            <div className="flex justify-center mt-4 gap-8">
                <Button variant="flat" onPress={() => setStep(2)}>
                    Atrás
                </Button>
                <Button color="primary" onPress={() => setIsModalVisible(true)}>
                    Enviar Formulario
                </Button>
            </div>

            {/* Modal Confirmación */}
            <Modal
                isOpen={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                size="2xl"
            >
                <ModalContent>
                    <ModalHeader className="text-xl font-semibold border-b pb-2">
                        Confirmar Envío de Preinscripción
                    </ModalHeader>

                    <ModalBody>
                        <div className="space-y-4 text-sm text-gray-800">
                            {/* Programa Académico */}
                            <div className="bg-gray-50 p-3 rounded-lg border">
                                <h4 className="font-semibold text-base mb-1">
                                    Programa Académico
                                </h4>
                                <p className="text-sm">
                                    {formData.grado_nombre} EN{" "}
                                    {formData.programa_nombre?.toUpperCase()}
                                </p>
                            </div>

                            {/* Información Personal y Contacto */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-3 rounded-lg border space-y-1">
                                    <h4 className="font-semibold text-base mb-2">
                                        Datos Personales
                                    </h4>
                                    <p>
                                        <strong>Nombre Completo:</strong>
                                        <br />
                                        {formData.nombres} {formData.ap_paterno}{" "}
                                        {formData.ap_materno}
                                    </p>
                                    <p>
                                        <strong>{formData.tipo_doc}:</strong>{" "}
                                        {formData.num_iden}
                                    </p>
                                    <p>
                                        <strong>Fecha Nacim.</strong>{" "}
                                        {formatFecha(formData.fecha_nacimiento)}
                                    </p>
                                    <p>
                                        <strong>Género:</strong>{" "}
                                        {formData.sexo === "F"
                                            ? "Femenino"
                                            : "Masculino"}
                                    </p>
                                </div>

                                <div className="bg-gray-50 p-3 rounded-lg border space-y-1">
                                    <h4 className="font-semibold text-base mb-2">
                                        Contacto y Ubicación
                                    </h4>
                                    <p>
                                        <strong>Email:</strong> {formData.email}
                                    </p>
                                    <p>
                                        <strong>Celular:</strong>{" "}
                                        {formData.celular}
                                    </p>
                                    <p>
                                        <strong>Ubicación:</strong>
                                        <br />
                                        {formData.departamento_nombre} |{" "}
                                        {formData.provincia_nombre} |{" "}
                                        {formData.distrito_nombre}
                                    </p>
                                </div>
                            </div>

                            {/* Información Adicional */}
                            <div className="bg-gray-50 p-3 rounded-lg border space-y-1">
                                <h4 className="font-semibold text-base mb-2">
                                    Información Adicional
                                </h4>
                                <p>
                                    <strong>Universidad de Procedencia:</strong>{" "}
                                    {formData.uni_procedencia}
                                </p>
                                <p>
                                    <strong>Centro de Trabajo:</strong>{" "}
                                    {formData.centro_trabajo}
                                </p>
                                <p>
                                    <strong>Cargo:</strong> {formData.cargo}
                                </p>
                            </div>
                        </div>
                    </ModalBody>

                    <ModalFooter className="border-t pt-2">
                        <Button
                            variant="flat"
                            onPress={() => setIsModalVisible(false)}
                        >
                            Cancelar
                        </Button>
                        <Button name="enviar" color="primary" onPress={handleSubmit}>
                            Confirmar y Enviar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
}
