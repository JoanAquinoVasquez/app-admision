import { useEffect, useState, useMemo } from "react";
import Select from "../../components/Select/Select";
import { Button } from "@heroui/react";
import { toast } from "react-hot-toast";

import logoWithTextImage from "../../assets/Isotipos/isotipo_color_epg.webp";
import { FormHeader } from "./components";
import { admissionConfig } from "../../config/admission";
import { MdNotificationsActive } from "react-icons/md";

export default function Paso01SeleccionPrograma({
    formData,
    setFormData,
    setStep,
    grados,
    gradoOptions,
    programas,
    filteredProgramas,
    programaOptions,
    filterByGrado,
    yaVerificado,
}) {
    // Estado local
    const [selectedGradoId, setSelectedGradoId] = useState(
        formData.grado_id || null
    );
    const [selectedProgramaId, setSelectedProgramaId] = useState(
        formData.programa_id || null
    );

    // Cuando los programas se carguen y formData.grado_id existe, filtra
    useEffect(() => {
        if (programas.length > 0 && selectedGradoId) {
            filterByGrado(selectedGradoId);
        }
    }, [programas, selectedGradoId]);

    // Cuando cambie el grado seleccionado, filtra
    useEffect(() => {
        if (selectedGradoId) {
            // Reinicia el programa seleccionado al cambiar de grado
            setSelectedProgramaId(null);
            filterByGrado(selectedGradoId);
        }
    }, [selectedGradoId]);

    // Cuando los programas ya estén filtrados, intenta restaurar el programa_id
    useEffect(() => {
        if (formData.programa_id && filteredProgramas.length > 0) {
            const exists = filteredProgramas.some(
                (p) => p.id === formData.programa_id
            );
            if (exists) {
                setSelectedProgramaId(formData.programa_id);
            }
        }
    }, [filteredProgramas, formData.programa_id]);

    const handleNext = () => {
        const grado = grados.find((g) => g.id === selectedGradoId);
        const programa = programas.find((p) => p.id === selectedProgramaId);
        if (!selectedGradoId || !selectedProgramaId) {
            toast.error(
                "Debe seleccionar un grado y un programa antes de continuar."
            );
            return;
        }

        setFormData((prev) => ({
            ...prev,
            grado_id: grado.id,
            grado_nombre: grado.nombre,
            programa_id: programa.id,
            programa_nombre: programa.nombre,
        }));

        setStep(2);
    };

    return (
        <div className="flex flex-col justify-between h-full px-4 py-4 gap-6">
            {/* Encabezado */}
            <FormHeader
                title={`Admisión ${admissionConfig.cronograma.periodo}`}
                subtitle="Escuela de Posgrado UNPRG"
                logoSrc={logoWithTextImage}
            />

            {/* Formulario */}
            <div className="flex flex-col gap-5 justify-center">
                <h3 className="text-2xl md:text-3xl font-semibold text-center">
                    Formulario de Preinscripción
                </h3>
                <h4 className="text-lg font-semibold">
                    1. Seleccionar el Programa a Postular
                </h4>

                <div className="flex flex-col gap-4">
                    <Select
                        label="Seleccionar Grado Académico"
                        defaultItems={gradoOptions}
                        selectedKey={selectedGradoId?.toString() || ""}
                        onSelectionChange={(gradoId) => {
                            if (!gradoId) {
                                // Se limpió el grado, también limpia el programa
                                setSelectedGradoId(null);
                                setSelectedProgramaId(null);
                                return;
                            }
                            const id = parseInt(gradoId, 10);
                            setSelectedGradoId(id);
                        }}
                        isRequired
                    />

                    <Select
                        label="Seleccionar Programa"
                        defaultItems={programaOptions}
                        selectedKey={selectedProgramaId?.toString() || ""}
                        onSelectionChange={(programaId) => {
                            const id = parseInt(programaId, 10);
                            setSelectedProgramaId(id);
                        }}
                        isRequired
                        disabled={!selectedGradoId}
                    />

                    <Button color="primary" onPress={handleNext}>
                        Siguiente
                    </Button>
                </div>
            </div>

            {/* Info adicional */}
            {/* Alerta: Texto más pequeño en laptop */}
            <div className="mt-4 flex items-start gap-3 p-3 bg-blue-50/50 rounded-lg border border-blue-100">
                <MdNotificationsActive className="text-blue-600 shrink-0" size={18} />
                <p className="text-xs lg:text-sm text-blue-800 leading-tight">
                    Mantente atento a nuestras <strong>redes sociales</strong>. Conoce más acerca del proceso {" "}
                    <strong><a href="https://www.epgunprg.edu.pe/admision-epg" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        aquí
                    </a></strong>
                </p>
            </div>
        </div>
    );
}
