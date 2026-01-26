import { admissionConfig, getAdmissionStage } from "../../../config/admission";
import { MdOutlineErrorOutline, MdArrowForward, MdInfoOutline, MdNotificationsActive, MdPublic, MdEventAvailable } from "react-icons/md";

export const VistaFinalizada = ({ logoSrc }) => {
    const config = admissionConfig?.cronograma || {};
    const etapa = getAdmissionStage();
    const fechas = config.fechas_control || {};

    const getContent = () => {
        switch (etapa) {
            case "INSCRIPCION":
                return {
                    color: "text-emerald-700",
                    bg: "bg-emerald-50",
                    border: "border-emerald-200",
                    icon: <MdEventAvailable className="text-emerald-600" size={32} />,
                    titulo: "¡Fase de Preinscripción Concluida!",
                    mensaje: "Hemos cerrado el registro de preinscripción para dar inicio a la inscripción.",
                    detalle: (
                        <span>
                           Recuerda que si no pudiste preinscribirte, puedes inscribirte con normalidad.
                        </span>
                    )
                };
            case "EVALUACION":
            case "RESULTADOS":
            case "FINALIZADO":
                return {
                    color: "text-slate-700",
                    bg: "bg-slate-50",
                    border: "border-slate-200",
                    icon: <MdOutlineErrorOutline className="text-slate-500" size={32} />,
                    titulo: "Etapa de Preinscripción Cerrada",
                    mensaje: `El periodo de preinscripción para el ciclo ${config.periodo || ''} ha finalizado.`,
                    detalle: "El proceso de admisión ha avanzado a sus etapas finales (Evaluación/Resultados). El formulario de registro ya no se encuentra disponible."
                };
            default:
                return {
                    color: "text-blue-700",
                    bg: "bg-blue-50",
                    border: "border-blue-200",
                    icon: <MdInfoOutline size={32} />,
                    titulo: "Información del Proceso",
                    mensaje: "La etapa de Preinscripción no está activa en este momento.",
                    detalle: "Revisa el cronograma oficial para conocer las fechas exactas de apertura."
                };
        }
    };

    const content = getContent();

    return (
        <div className="flex flex-col items-center justify-center w-full h-full p-4 lg:p-8 text-center overflow-y-auto bg-transparent">
            
            {/* 1. LOGO: Compacto para Laptop */}
            <div className="mb-6 group">
                <img
                    src={logoSrc}
                    alt="Logo UNPRG"
                    className="w-28 sm:w-36 lg:w-40 h-auto drop-shadow-lg mx-auto transition-transform duration-500 group-hover:scale-105"
                />
            </div>

            {/* 2. STATUS CARD: Indica el estado de la Preinscripción */}
            <div className="flex flex-col items-center mb-4">
                <div className={`relative p-4 rounded-2xl ${content.bg} mb-4`}>
                    <div className="relative z-10">
                        {content.icon}
                    </div>
                    <span className={`absolute inset-0 rounded-2xl animate-pulse opacity-20 ${content.bg}`}></span>
                </div>
                
                <h2 className={`text-2xl lg:text-3xl font-black ${content.color} tracking-tight leading-tight max-w-md`}>
                    {content.titulo}
                </h2>
            </div>

            {/* 3. CONTENIDO: Información de transición */}
            <div className="max-w-lg mx-auto w-full space-y-4">
                <p className="text-gray-500 text-sm lg:text-base leading-relaxed font-medium">
                    {content.mensaje}
                </p>

                {/* Banner Informativo Refinado */}
                <div className={`relative overflow-hidden p-5 rounded-3xl border ${content.border} ${content.bg} shadow-sm`}>
                    <div className="relative z-10 flex flex-col gap-2">
                        <div className="flex items-center justify-center gap-2 mb-1">
                            <MdInfoOutline className={`${content.color} opacity-60`} size={16} />
                            <span className={`text-[10px] uppercase font-extrabold tracking-widest ${content.color} opacity-60`}>
                                NOTA IMPORTANTE
                            </span>
                        </div>
                        <div className="text-gray-700 text-xs lg:text-sm leading-relaxed font-semibold italic antialiased">
                            {content.detalle}
                        </div>
                    </div>
                    {/* Elemento decorativo */}
                    <div className={`absolute -right-4 -bottom-4 w-16 h-16 rounded-full opacity-10 ${content.color} bg-current`} />
                </div>

                {/* Social/Update Indicator */}
                <div className="flex items-center justify-center gap-2 py-2">
                    <span className="flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-sky-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                    </span>
                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-tighter">
                        Actualizaciones en tiempo real en nuestras redes
                    </p>
                </div>
            </div>

            {/* 4. ACCIONES: Claridad en el siguiente paso */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 w-full max-w-md mx-auto">
                {etapa === "INSCRIPCION" ? (
                    <a
                        href="https://epgunprg.edu.pe/admision-epg/inscripcion"
                        className="group relative flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3.5 rounded-2xl transition-all duration-300 shadow-xl shadow-emerald-200 hover:shadow-emerald-300 hover:-translate-y-1 w-full sm:w-auto active:scale-95"
                    >
                        <span className="text-sm">Ir a Inscripción</span>
                        <MdArrowForward className="text-xl group-hover:translate-x-1 transition-transform" />
                    </a>
                ) : (
                    <a
                        href="https://epgunprg.edu.pe/admision-epg/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 bg-white border-2 border-gray-100 hover:border-gray-300 text-gray-600 font-bold px-8 py-3.5 rounded-2xl transition-all w-full sm:w-auto text-sm shadow-sm hover:shadow-md active:scale-95"
                    >
                        <MdPublic className="text-lg opacity-70" />
                        Portal de Admisión
                    </a>
                )}
            </div>
        </div>
    );
};