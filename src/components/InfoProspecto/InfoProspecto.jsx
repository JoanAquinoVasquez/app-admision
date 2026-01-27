import { Card, CardBody, Button, Link } from "@nextui-org/react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import {admissionConfig} from "../../config/admission";

/**
 * InfoProspecto - Componente para mostrar folleto informativo general del programa
 * @param {string} title - Título del folleto
 */
export default function InfoProspecto({ title }) {
    const config = admissionConfig.cronograma;
    return (    
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="w-full"
        >
            <div className="relative overflow-hidden bg-blue-900 rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
                {/* Fondo decorativo */}
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-blue-800 rounded-full opacity-50 blur-2xl"></div>
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-blue-600 rounded-full opacity-30 blur-2xl"></div>

                <div className="relative z-10 flex items-start gap-5 max-w-2xl">
                    <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-xl bg-blue-800/50 text-blue-200 border border-blue-700/50 backdrop-blur-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                            {title}
                        </h3>
                        <p className="text-blue-200 mt-2 text-sm md:text-base font-light">
                            Accede al Prospecto del Proceso de Admisión {config.periodo}
                        </p>
                    </div>
                </div>

                <div className="relative z-10 flex-shrink-0">
                    <Button
                        as={Link}
                        href={"https://drive.google.com/file/d/1tQD5LiJOalnAfqrYr4QVHUj8CjM4CgmX/view?usp=drive_link"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white text-blue-900 font-semibold px-6 py-6 rounded-xl hover:bg-blue-50 transition-colors shadow-lg border-0"
                        endContent={
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 ml-1">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                        }
                    >
                        Acceder al Prospecto
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}

InfoProspecto.propTypes = {
    title: PropTypes.string.isRequired,
};
