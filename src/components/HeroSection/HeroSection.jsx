import { motion } from "framer-motion";
import PropTypes from "prop-types";

/**
 * HeroSection - Componente Hero reutilizable para páginas de posgrado
 * @param {string} title - Título principal
 * @param {string} subtitle - Subtítulo
 * @param {string} image - Ruta de la imagen
 */
export default function HeroSection({ title, subtitle, image }) {
    return (
        <motion.section
            className="relative w-full h-72 md:h-96 overflow-hidden rounded-2xl shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
        >
            {/* Imagen de fondo con overlay sutil */}
            <div className="absolute inset-0">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover object-[center_28%] transform hover:scale-105 transition-transform duration-[2s]"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900/70 via-gray-900/40 to-transparent" />
            </div>

            {/* Contenido Minimalista */}
            <div className="relative h-full flex flex-col justify-center px-8 md:px-16 lg:px-24 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="space-y-2"
                >
                    <span className="inline-block px-3 py-1 bg-blue-600/90 text-white text-xs font-medium tracking-wider uppercase rounded-full backdrop-blur-sm">
                        Posgrado UNPRG
                    </span>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
                        {title}
                    </h1>
                    <p className="text-lg md:text-xl text-gray-200 font-light max-w-lg border-l-2 border-blue-500 pl-4 mt-4">
                        {subtitle}
                    </p>
                </motion.div>
            </div>
        </motion.section>
    );
}

HeroSection.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
};
