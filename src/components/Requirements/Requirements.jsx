import { Card, CardBody, Link, Button } from "@heroui/react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";

/**
 * Requirements - Componente para mostrar requisitos de postulación
 * @param {string} programType - Tipo de programa: "MAESTRÍAS" o "DOCTORADOS"
 */
export default function Requirements({ programType }) {
    

    const RequirementItem = ({ number, title, children }) => (
        <div className="flex gap-4 items-start group">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                {number}
            </div>
            <div className="space-y-1">
                <h4 className="font-semibold text-gray-900">{title}</h4>
                <div className="text-gray-600 text-sm leading-relaxed">{children}</div>
            </div>
        </div>
    );

    const DownloadCard = ({ title, href, icon = "document" }) => (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-300 group bg-white"
        >
            <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500 group-hover:text-blue-600 group-hover:bg-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
            </div>
            <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 group-hover:text-blue-700">{title}</p>
                <p className="text-xs text-gray-500">Ver documento</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-all">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
        </a>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full bg-white rounded-2xl border border-gray-100 p-6 md:p-8"
        >
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                {/* Columna Izquierda: Requisitos */}
                <div className="space-y-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Requisitos de Postulación</h2>
                        <p className="text-gray-500 mt-1">Documentos necesarios para {programType.toLowerCase()}</p>
                    </div>

                    <div className="space-y-6">
                        <RequirementItem number="1" title="Pago por Derecho de Inscripción">
                            <ul className="mt-1 space-y-1 text-gray-600">
                                <li>• Banco de la Nación (Código: 00000012)</li>
                                <li>• Monto: S/ 250.00</li>
                                <li>• Concepto: POSGRADO-INSCRIPCIÓN</li>
                            </ul>
                        </RequirementItem>

                        <RequirementItem number="2" title="Documento de Identidad">
                            Copia simple de DNI, Carnet de Extranjería o Pasaporte.
                        </RequirementItem>

                        <RequirementItem number="3" title="Grado Académico">
                            Copia simple del grado de {" "}
                            {programType === "MAESTRÍAS" ? "Bachiller" : programType === "DOCTORADOS" ? "Maestro" : "Título Profesional"}
                        </RequirementItem>

                        <div className="bg-blue-50/50 rounded-lg p-4 text-sm text-blue-800 border border-blue-100">
                            <span className="font-semibold">Nota:</span> La inscripción web se realiza 24 horas después del pago.
                            <Link
                                href="https://epgunprg.edu.pe/admision-epg/inscripcion"
                                target="_blank"
                                className="block mt-2 text-blue-600 font-semibold hover:underline"
                            >
                                Ir a Inscripción Web →
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Columna Derecha: Descargas */}
                <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                    <h3 className="font-semibold text-gray-900">Documentos Informativos</h3>
                    <div className="grid gap-3">
                        <DownloadCard
                            title="Folleto"
                            href={programType === "MAESTRÍAS" ? "https://drive.google.com/file/d/1G4JNzj2PjLjDdTQ9QJIanU4ZY8wYQJlh/view?usp=sharing" : programType === "DOCTORADOS" ? "https://drive.google.com/file/d/1mUwD4rncBt255WNaiFrkAkm3GxNxScor/view?usp=sharing" : "https://drive.google.com/drive/folders/1AMPzQY5lk_iYP-KYA3PbautzPjT8pl4w?usp=drive_link"}
                        />

                        {programType !== "SEGUNDAS ESPECIALIDADES" && (
                            <>
                                <DownloadCard
                                    title="Tabla de Evaluación Currículum Vitae"
                                    href="https://drive.google.com/file/d/13OWyVIXaO1ZduP7wA0KezEVIdh24YoyA/view?usp=sharing"
                                />
                                <DownloadCard
                                    title="Tabla de Evaluación Perfil De Proyecto"
                                    href="https://drive.google.com/file/d/1jPuTawyYduA4l-2SAl6bwvIrxkXZvP_q/view?usp=sharing"
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

Requirements.propTypes = {
    programType: PropTypes.oneOf(["MAESTRÍAS", "DOCTORADOS"]).isRequired,
};
