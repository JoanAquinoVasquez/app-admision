import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PagoForm from "./PagoForm";
import VoucherInfo from "./VoucherInfo";
import Fondo from "../Fondo/Fondo";
import ChatBot from "../../layouts/ChatBot/ChatBot";
import Carrusel from "../../components/Carrusel/Carrusel";

// Assets
import logoWithTextImage from "../../assets/Isotipos/isotipo_color_epg.webp";
import cronograma from "../../assets/Img/1.webp";
import fechaPagos from "../../assets/Img/4.webp";
import cronogramaAdmision from "../../assets/Img/3.webp";
import InscripcionForm from "./IndexValidacion"; // Reutilizamos el archivo refactorizado
import { StepIndicator } from "../Preinscripcion/components/StepIndicator"; // Reutilizamos el componente
import { admissionConfig, getAdmissionStage } from "../../config/admission";

// 1. DATOS ESTÁTICOS (Slides del Carrusel para la vista finalizada)
const config = admissionConfig?.cronograma || {};

const SLIDES_DATA = [
    {
        title: "Cronograma Proceso Admisión",
        text: "Consulta aquí el cronograma de actividades.",
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

// COMPONENTE INTERNO: Vista cuando la inscripción está cerrada
const VistaFinalizada = () => {
    const etapa = config.etapa;
    const fechas = config.fechas_control || {};

    let titulo = "¡Inscripciones Finalizadas!";
    let mensaje = "Hemos cerrado exitosamente el proceso de inscripción.";
    let detalle = (
        <>
            Ahora nos preparamos para el examen de admisión este{" "}
            <strong>{config.examen_admision || "domingo 27 de Abril"}.</strong>
        </>
    );

    if (etapa === "EVALUACION") {
        titulo = "¡Etapa de Evaluación!";
        mensaje = "El proceso de inscripción ha finalizado.";
        detalle = (
            <>
                Estamos en la etapa de evaluación (Examen y Entrevista) del{" "}
                <strong>{fechas.inicio_evaluacion}</strong> al{" "}
                <strong>{fechas.fin_evaluacion}</strong>.
            </>
        );
    } else if (etapa === "RESULTADOS") {
        titulo = "¡Resultados Publicados!";
        mensaje = "El proceso de admisión ha concluido.";
        detalle = (
            <>
                Los resultados han sido publicados el{" "}
                <strong>{fechas.resultados_publicacion}</strong>. Revisa la sección de resultados.
            </>
        );
    } else if (etapa === "FINALIZADO") {
        titulo = "¡Proceso Finalizado!";
        mensaje = "El proceso de admisión ha concluido.";
        detalle = "Gracias por tu participación.";
    }

    return (
        <div className="flex flex-col items-center justify-center w-full h-full pr-0 text-center">
            <img
                src={logoWithTextImage}
                alt="Logo UNPRG"
                className="w-[180px] md:w-[250px] lg:w-[250px] h-auto mb-8 transition-all"
            />

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-600 mb-4">
                {titulo}
            </h2>

            <p className="text-lg sm:text-xl text-gray-700 mb-6">
                Gracias por confiar en la Escuela de Posgrado de la UNPRG.
            </p>

            <div className="max-w-lg mx-auto text-gray-600 space-y-8">
                <p className="text-base sm:text-lg">
                    {mensaje} {detalle}
                </p>
                <p className="text-base sm:text-lg">
                    Sigue atento a nuestras <strong>redes sociales</strong> para
                    conocer los resultados, fechas de matrícula, y más información
                    relevante.
                </p>
            </div>
        </div>
    );
};

const formatearFecha = (fechaStr) => {
    if (!fechaStr) return "...";
    // Convertir string a objeto Date
    const fecha = new Date(fechaStr + "T00:00:00");
    return new Intl.DateTimeFormat("es-ES", {
        day: "numeric",
        month: "long",
        // year: "numeric", // Opcional, quítalo si solo quieres día y mes
    }).format(fecha);
};

import { MdCalendarMonth, MdInfoOutline, MdNotificationsActive } from "react-icons/md";

const VistaPreinscripcion = ({ config }) => (
    // Reducimos el padding vertical en pantallas medianas/laptops
    <div className="flex flex-col items-center justify-center w-full h-full p-2 md:p-4 lg:p-6">

        {/* Logo: Reducimos el tamaño en laptops para ganar espacio vertical */}
        <div className="relative mb-4 lg:mb-8">
            <img
                src={logoWithTextImage}
                alt="Logo UNPRG"
                className="w-32 sm:w-40 lg:w-56 h-auto drop-shadow-md"
            />
        </div>

        {/* Título: Ajustamos el tamaño de fuente */}
        <div className="text-center space-y-1 mb-6 lg:mb-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-700 to-emerald-500 tracking-tight">
                Fase de Preinscripción
            </h2>
            <p className="text-gray-500 text-sm lg:text-base font-medium max-w-xl mx-auto">
                Estamos preparando todo para tu ingreso a la Escuela de Posgrado.
            </p>
        </div>

        {/* Card: Reducimos paddings internos */}
        <div className="w-full max-w-xl bg-white/80 backdrop-blur-md border border-green-100 rounded-2xl lg:rounded-[2rem] p-4 lg:p-6 shadow-xl shadow-green-900/5">

            <div className="flex items-center gap-2 mb-4 text-green-700">
                <MdCalendarMonth size={20} />
                <h3 className="font-bold text-xs lg:text-sm uppercase tracking-wider">Cronograma de Inscripción</h3>
            </div>

            {/* Grid de Fechas: Más compacto */}
            <div className="grid grid-cols-1 sm:grid-cols-7 items-center gap-2 bg-gray-50/50 p-4 rounded-xl border border-dashed border-gray-200">
                <div className="col-span-3 text-center">
                    <p className="text-[10px] uppercase text-gray-400 font-bold">Inicia el</p>
                    <span className="text-lg lg:text-xl font-black text-gray-800">
                        {formatearFecha(config?.fechas_control?.inicio_inscripcion)}
                    </span>
                </div>

                <div className="hidden sm:col-span-1 sm:flex justify-center italic text-gray-300 text-xs font-bold">AL</div>

                <div className="col-span-3 text-center">
                    <p className="text-[10px] uppercase text-gray-400 font-bold">Finaliza el</p>
                    <span className="text-lg lg:text-xl font-black text-gray-800">
                        {formatearFecha(config?.fechas_control?.fin_inscripcion)}
                    </span>
                </div>
            </div>

            {/* Alerta: Texto más pequeño en laptop */}
            <div className="mt-4 flex items-start gap-3 p-3 bg-emerald-50/50 rounded-lg border border-emerald-100">
                <MdNotificationsActive className="text-emerald-600 shrink-0" size={18} />
                <p className="text-xs lg:text-sm text-emerald-800 leading-tight">
                    Mantente atento a nuestras <strong>redes sociales</strong>. Puedes conocer más acerca del proceso {" "}
                    <strong><a href="https://www.epgunprg.edu.pe/admision-epg" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                        aquí
                    </a></strong>
                </p>
            </div>
        </div>
    </div>
);

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

            {/* CAMBIO CLAVE: 
              1. Usamos h-[95vh] o h-[92vh] en lugar de min-h para forzar el alto.
              2. Agregamos items-stretch para que las columnas internas siempre midan lo mismo.
            */}
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
                                        <VistaFinalizada logoSrc={logoWithTextImage} />
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
