import Paso01SeleccionPrograma from "./Paso01SeleccionPrograma";
import Paso02DatosPersonales from "./Paso02DatosPersonales";
import Paso03ResumenEnvio from "./Paso03ResumenEnvio";
import Fondo from "../Fondo/Fondo";
import Carrusel from "../../components/Carrusel/Carrusel";
import Chatbot from "../ChatBot/ChatBot";
import Spinner from "../../components/Spinner/Spinner";

// Components
import { VistaFinalizada, StepIndicator } from "./components";

// Hooks
import { usePreinscripcionForm } from "./hooks";
import useGrados from "../../data/dataGrados";
import useProgramas from "../../data/dataProgramas";

// Assets
import cronograma from "../../assets/Img/cronograma.webp";
import pasos from "../../assets/Img/pasos.webp";
import fecha_examen from "../../assets/Img/fecha_examen.webp";
import logoWithTextImage from "../../assets/Isotipos/isotipo_color_epg.webp";
import { useMemo } from "react";
import { admissionConfig, getAdmissionStage } from "../../config/admission";

// DATOS ESTÁTICOS (Slides del Carrusel)

const SLIDES_DATA = [
    {
        title: "Pasos del Proceso Admisión",
        text: "Consulta aquí el paso a paso del proceso de admisión.",
        image: pasos,
    },
    {
        title: "Prepárate para el examen de admisión",
        text: "Revisa las fechas del examen de admisión.",
        image: fecha_examen,
    },
    {
        title: `Cronograma de Admisión ${admissionConfig.cronograma.periodo}`,
        text: `Conoce el cronograma de admisión ${admissionConfig.cronograma.periodo}.`,
        image: cronograma,
    },
];
// DATOS INICIALES DEL FORMULARIO
const INITIAL_FORM_DATA = {
    grado_id: "",
    grado_nombre: "",
    tipo_doc: "DNI",
    programa_id: "",
    programa_nombre: "",
    num_iden: "",
    nombres: "",
    ap_paterno: "",
    ap_materno: "",
    fecha_nacimiento: "",
    email: "",
    celular: "",
    sexo: "F",
    departamento_id: "",
    departamento_nombre: "",
    provincia_nombre: "",
    provincia_id: "",
    distrito_id: "",
    distrito_nombre: "",
    uni_procedencia: "",
    centro_trabajo: "",
    cargo: "",
};

/**
 * Componente principal del formulario de preinscripción
 * Orquesta los diferentes pasos y maneja el estado global
 */
// Main Component
export default function FormularioUnificado({ isAdmin = false, isModal = false }) {
    // Control de estado (Variable de entorno)
    const isPreinscriptionOpen =
        getAdmissionStage() === "PREINSCRIPCION" || isAdmin;

    // Hooks de datos
    const { grados } = useGrados();
    const { programas, filteredProgramas, filterByGrado } = useProgramas();

    // Hook personalizado para el formulario
    const {
        formData,
        step,
        loading,
        setFormData,
        setStep,
        setLoading,
    } = usePreinscripcionForm(INITIAL_FORM_DATA);

    // Memoización de opciones
    const gradoOptions = useMemo(
        () =>
            (grados || []).map((g) => ({ key: g.id.toString(), textValue: g.nombre })),
        [grados]
    );

    const programaOptions = useMemo(
        () =>
            (filteredProgramas || []).map((p) => ({
                key: p.id.toString(),
                textValue: p.nombre,
            })),
        [filteredProgramas]
    );

    // Renderizar el paso activo
    const renderActiveFormStep = () => {
        switch (step) {
            case 1:
                return (
                    <Paso01SeleccionPrograma
                        formData={formData}
                        setFormData={setFormData}
                        setStep={setStep}
                        grados={grados}
                        gradoOptions={gradoOptions}
                        programas={programas}
                        filteredProgramas={filteredProgramas}
                        programaOptions={programaOptions}
                        filterByGrado={filterByGrado}
                    />
                );
            case 2:
                return (
                    <Paso02DatosPersonales
                        formData={formData}
                        setFormData={setFormData}
                        setStep={setStep}
                    />
                );
            case 3:
                return (
                    <Paso03ResumenEnvio
                        formData={formData}
                        setFormData={setFormData}
                        setStep={setStep}
                        setLoading={setLoading}
                    />
                );
            default:
                return null;
        }
    };

    const content = (
        <div className="w-full h-full flex flex-col">
            {/* Spinner solo se muestra si está cargando */}
            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 z-50">
                    <Spinner label="Enviando formulario..." />
                </div>
            )}

            {/* Layout Principal Unificado */}
            <div className={`relative bg-white w-full mx-auto overflow-hidden flex flex-col h-full ${!isModal ? 'md:w-[98%] md:max-w-[1800px] md:rounded-xl md:shadow-2xl md:h-[95vh]' : ''}`}>

                {/* 1. HEADER (Fijo) */}
                {(isPreinscriptionOpen || isAdmin) && (
                    <div className="w-full bg-gray-50/50 border-b border-gray-100 p-2 md:px-6 flex-shrink-0">
                        <StepIndicator currentStep={step} totalSteps={3} />
                    </div>
                )}

                {/* 2. CONTENEDOR DE CONTENIDO (Flexible) */}
                <div className={`flex flex-col flex-grow overflow-y-auto ${!isModal ? 'md:flex-row md:overflow-hidden' : ''}`}>
                    {/* COLUMNA IZQUIERDA: Formulario */}
                    <div className={`w-full p-4 md:p-6 flex flex-col ${!isModal ? 'md:w-[60%] md:overflow-y-auto' : ''}`}>
                        <div className="w-full max-w-4xl xl:max-w-4xl mx-auto my-auto">
                            {(isPreinscriptionOpen || isAdmin) ? (
                                <div className="animate-fadeIn">
                                    {renderActiveFormStep()}
                                </div>
                            ) : (
                                <VistaFinalizada logoSrc={logoWithTextImage} />
                            )}
                        </div>
                    </div>

                    {/* COLUMNA DERECHA: Carrusel (Solo si no es modal) */}
                    {!isModal && (
                        <div className="w-full md:w-[40%] h-[450px] md:h-full flex-shrink-0 relative bg-gray-100">
                            <div className="absolute inset-0">
                                <Carrusel
                                    slides={SLIDES_DATA}
                                    autoPlay
                                    interval={3000}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    if (isModal) return content;

    return (
        <Fondo>
            {content}
            <Chatbot />
        </Fondo>
    );
}
