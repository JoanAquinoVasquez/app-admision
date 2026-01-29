import { MdInfoOutline } from "react-icons/md";
import { admissionConfig, getAdmissionStage } from "../../../config/admission";
import logoWithTextImage from "../../../assets/Isotipos/isotipo_color_epg.webp";

const VistaFinalizada = () => {
    const etapa = getAdmissionStage();
    const config = admissionConfig?.cronograma || {};
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
    } else if (etapa === "STANDBY") {
        titulo = "¡Próximamente!";
        mensaje = "Nos estamos preparando para el siguiente proceso de admisión.";
        detalle = "Pronto más novedades.";
    } else if (etapa === "FINALIZADO") {
        titulo = "¡Proceso Finalizado!";
        mensaje = "El proceso de admisión ha concluido.";
        detalle = "Gracias por tu participación.";
    }

    return (
        <div className="flex flex-col items-center justify-center w-full h-full p-4 lg:p-8 text-center overflow-y-auto">
            <img
                src={logoWithTextImage}
                alt="Logo UNPRG"
                className="w-[180px] md:w-[220px] lg:w-[240px] h-auto mb-6 transition-all drop-shadow-md"
            />

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-700 to-emerald-500 mb-4 tracking-tight">
                {titulo}
            </h2>

            <p className="text-lg sm:text-xl text-gray-600 mb-8 font-medium max-w-2xl">
                Gracias por confiar en la Escuela de Posgrado de la UNPRG.
            </p>

            <div className="max-w-3xl mx-auto space-y-8 w-full">
                {/* Mensaje Principal */}
                <div className="bg-green-50/50 border border-green-100 rounded-2xl p-6 shadow-sm">
                    <p className="text-base sm:text-lg text-gray-700">
                        {mensaje} <br />
                        <span className="font-semibold text-green-800">{detalle}</span>
                    </p>
                    <p className="text-sm sm:text-base text-gray-500 mt-3">
                        Sigue atento a nuestras <strong>redes sociales</strong> para
                        conocer los resultados, fechas de matrícula, y más información relevante.
                    </p>
                </div>

                {/* Sección de Contacto y Redes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Contacto */}
                    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-lg shadow-gray-100/50 flex flex-col items-center justify-center gap-3 hover:shadow-xl transition-shadow">
                        <div className="p-3 bg-blue-50 rounded-full text-blue-600 mb-1">
                            <MdInfoOutline size={24} />
                        </div>
                        <h3 className="font-bold text-gray-800 uppercase text-sm tracking-wider">Atención al Postulante</h3>

                        <div className="text-center space-y-2 w-full">
                            <div className="flex items-center justify-center gap-2 text-gray-600">
                                <span className="font-bold text-gray-800">Celulares:</span>
                                <div className="flex flex-col sm:flex-row gap-1 sm:gap-3">
                                    <a href="tel:995901454" className="hover:text-blue-600 transition-colors">995 901 454</a>
                                    <span className="hidden sm:inline text-gray-300">|</span>
                                    <a href="tel:924545013" className="hover:text-blue-600 transition-colors">924 545 013</a>
                                </div>
                            </div>
                            <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
                                {/* Icono de calendario eliminado o reemplazado si es necesario */}
                                <span>Lunes a Viernes: <strong>08:00 am - 02:00 pm</strong></span>
                            </div>
                        </div>
                    </div>

                    {/* Redes Sociales */}
                    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-lg shadow-gray-100/50 flex flex-col items-center justify-center gap-4 hover:shadow-xl transition-shadow">
                        <h3 className="font-bold text-gray-800 uppercase text-sm tracking-wider">Síguenos</h3>
                        <div className="flex gap-4">
                            <a
                                href="https://www.facebook.com/epgunprg"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 bg-[#1877F2]/10 text-[#1877F2] rounded-xl hover:bg-[#1877F2] hover:text-white transition-all duration-300 transform hover:scale-110"
                            >
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                                </svg>
                            </a>
                            <a
                                href="https://www.epgunprg.edu.pe"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all duration-300 transform hover:scale-110"
                            >
                                {/* Icono MdPublic eliminado o reemplazado */}
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                </svg>
                            </a>
                        </div>
                        <p className="text-xs text-gray-400 font-medium">Mantente informado</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VistaFinalizada;
