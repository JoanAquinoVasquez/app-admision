import { Link, useNavigate } from "react-router-dom";
import { Button, Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";

/**
 * PageHeader - Header con breadcrumbs y botón de regreso para páginas de landing
 * @param {string} currentPage - Nombre de la página actual
 * @param {boolean} showBackButton - Mostrar botón de regreso
 */
export default function PageHeader({ currentPage, showBackButton = true }) {
    const navigate = useNavigate();

    return (
        <motion.div
            className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 pb-4 border-b border-gray-100/80"
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            {/* Breadcrumbs con estilo mejorado */}
            <div className="flex flex-col gap-2">
                {/* Contenedor con fondo estilizado */}
                <div className="inline-flex items-center bg-gray-50/80 backdrop-blur-md border border-gray-200 px-4 py-2 rounded-full shadow-sm w-fit">
                    <Breadcrumbs
                        size="sm"
                        variant="light"
                        classNames={{
                            list: "gap-1",
                        }}
                    >
                        <BreadcrumbItem>
                            <Link
                                to="/"
                                className="flex items-center gap-1 text-gray-500 hover:text-blue-600 transition-all duration-200 font-medium"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                    <path d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z" />
                                </svg>
                                <span>Inicio</span>
                            </Link>
                        </BreadcrumbItem>
                        <BreadcrumbItem
                            classNames={{
                                item: "text-blue-700 font-semibold px-2 py-0.5 rounded-full",
                            }}
                        >
                            {currentPage}
                        </BreadcrumbItem>
                    </Breadcrumbs>
                </div>

                {/* Label inferior solo para móviles */}
                <p className="text-[10px] text-gray-400 md:hidden ml-4 uppercase tracking-widest font-bold">
                    Estás en: {currentPage}
                </p>
            </div>

            {/* Botón de regreso con micro-interacción */}
            {showBackButton && (
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Button
                        variant="outline"
                        onPress={() => navigate("/")}
                        className="bg-white border-gray-200 text-gray-600 hover:text-primary hover:border-primary/50 shadow-sm px-5 h-10 font-semibold transition-all duration-300"
                        startContent={
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2.5}
                                stroke="currentColor"
                                className="w-4 h-4"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                            </svg>
                        }
                    >
                        Volver al inicio
                    </Button>
                </motion.div>
            )}
        </motion.div>
    );
}

PageHeader.propTypes = {
    currentPage: PropTypes.string.isRequired,
    showBackButton: PropTypes.bool,
};
