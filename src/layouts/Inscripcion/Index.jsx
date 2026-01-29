import { useState } from "react";
import PagoForm from "./PagoForm";
import VoucherInfo from "./VoucherInfo";
import Fondo from "../Fondo/Fondo";
import ChatBot from "../../layouts/ChatBot/ChatBot";
import Carrusel from "../../components/Carrusel/Carrusel";

// Assets
import logoWithTextImage from "../../assets/Isotipos/isotipo_color_epg.webp";
import cronograma from "../../assets/Img/mas-informacion.webp";
import fechaPagos from "../../assets/Img/4.webp";
import cronogramaAdmision from "../../assets/Img/3.webp";

import InscripcionForm from "./IndexValidacion";
import { StepIndicator } from "../Preinscripcion/components/StepIndicator";
import { admissionConfig, getAdmissionStage } from "../../config/admission";

// Componentes extraídos
import VistaFinalizada from "./components/VistaFinalizada";
import VistaPreinscripcion from "./components/VistaPreinscripcion";

// 1. DATOS ESTÁTICOS (Slides del Carrusel para la vista finalizada)
const config = admissionConfig?.cronograma || {};

const SLIDES_DATA = [
    {
        title: "Pasos del Proceso Admisión",
        text: "Consulta aquí el paso a paso del proceso de admisión.",
        image: cronograma,
    },
    {
        title: "Cronograma Matrícula",
        text: "Revisa las fechas del proceso de matrícula.",
        image: cronogramaAdmision,
    },
    {
        title: "Conceptos de Pago",
        text: `Conoce los conceptos disponibles desde el ${admissionConfig.cronograma.inicio_conceptos}.`,
        image: fechaPagos,
    },
];

export default function FormularioInscripcion() {
    const isInscriptionOpen = getAdmissionStage() === "INSCRIPCION";
    const currentStage = getAdmissionStage();
    const [tipo_pago, setTipo_pago] = useState("BN");
    const [datosPago, setDatosPago] = useState(null);

    const currentStep = datosPago ? 2 : 1;
    const inscriptionSteps = ["Validación de Pago", "Registro de Datos"];

    return (
        <Fondo>
            <ChatBot />

            <div className="relative flex flex-col md:flex-row bg-white rounded-xl shadow-2xl w-[98%] max-w-[1600px] mx-auto overflow-hidden my-auto h-[92vh] transition-all">

                {/* COLUMNA 1: Sidebar (Ancho Fijo) */}
                {isInscriptionOpen && (
                    <div className="hidden md:flex flex-col w-20 lg:w-32 border-r border-gray-100 bg-gray-50/50 pt-6 shrink-0 h-full">
                        <h3 className="text-center font-black text-gray-400 mb-6 text-sm uppercase tracking-widest leading-tight">
                            Admisión <br /> {config?.periodo || "2026-I"}
                        </h3>
                        <StepIndicator
                            currentStep={currentStep}
                            totalSteps={2}
                            stepLabels={inscriptionSteps}
                            orientation="vertical"
                        />
                    </div>
                )}

                {/* CONTENEDOR DE CONTENIDO */}
                <div className="flex-1 flex flex-col min-w-0 bg-white overflow-hidden h-full">

                    {/* Indicador Móvil */}
                    {isInscriptionOpen && (
                        <div className="md:hidden w-full px-4 py-2 border-b border-gray-100 bg-gray-50 shrink-0">
                            <StepIndicator
                                currentStep={currentStep}
                                totalSteps={2}
                                stepLabels={inscriptionSteps}
                                orientation="horizontal"
                            />
                        </div>
                    )}

                    {/* ÁREA DE VISTAS DINÁMICAS */}
                    <div className="flex-1 overflow-hidden h-full">
                        {isInscriptionOpen ? (
                            datosPago ? (
                                <div className="h-full overflow-y-auto flex flex-col justify-center">
                                    <InscripcionForm datosPago={datosPago} />
                                </div>
                            ) : (
                                /* PASO 1: Ajuste de proporciones para monitores grandes */
                                <div className="flex flex-col lg:flex-row h-full w-full p-3 lg:p-6 gap-6 overflow-hidden">

                                    {/* COLUMNA 2: Formulario de Pago - Centrado verticalmente en monitores grandes */}
                                    <div className="flex-[1.1] min-w-0 h-full overflow-y-auto pr-2 custom-scrollbar flex flex-col">
                                        <div className="max-w-2xl w-full mx-auto lg:mx-0 my-auto">
                                            {/* my-auto arriba ayuda a centrar el form si sobra espacio en monitores 4K */}
                                            <PagoForm
                                                onTipoPagoChange={setTipo_pago}
                                                onSuccess={setDatosPago}
                                            />
                                        </div>
                                    </div>

                                    {/* COLUMNA 3: Info del Voucher - Ahora con bordes más redondeados y sombra suave */}
                                    <div className="flex-[0.9] min-w-0 h-full hidden lg:flex flex-col py-2">
                                        <div className="flex-1 bg-gray-50/80 border border-gray-100 rounded-[3rem] shadow-inner overflow-hidden">
                                            <div className="h-full p-6">
                                                <VoucherInfo tipo_pago={tipo_pago} />
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            )
                        ) : (
                            /* VISTAS DE PREINSCRIPCIÓN O CIERRE */
                            <div className="flex flex-col lg:flex-row w-full h-full p-4 lg:p-10 gap-10 items-stretch overflow-hidden">

                                <div className="w-full lg:flex-[3] flex flex-col justify-center bg-gray-50/50 rounded-[3.5rem] p-8 overflow-y-auto shadow-inner border border-gray-100">
                                    {currentStage === "PREINSCRIPCION" ? (
                                        <VistaPreinscripcion config={config} />
                                    ) : (
                                        <VistaFinalizada />
                                    )}
                                </div>

                                <div className="w-full lg:flex-[2] h-full relative">
                                    <div className="h-full rounded-[3.5rem] overflow-hidden shadow-2xl border-b-[14px] border-emerald-600">
                                        <Carrusel slides={SLIDES_DATA} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Fondo>
    );
}
