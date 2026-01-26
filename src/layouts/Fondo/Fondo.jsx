import { useState, useEffect, useMemo } from "react";
import fondo_logo_1 from "../../assets/Img/IMG_8791.webp";
import fondo_logo_2 from "../../assets/Img/IMG_8761.webp";
import fondo_logo_3 from "../../assets/Img/IMG_3393.webp";
import topBarImage from "../../assets/Barra/barra_colores_ofic.webp";

const Fondo = ({ children }) => {
    const backgrounds = useMemo(
        () => [fondo_logo_1, fondo_logo_2, fondo_logo_3],
        []
    );
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % backgrounds.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [backgrounds.length]);

    return (
        <div className="relative w-full min-h-screen flex flex-col overflow-hidden bg-gray-900">
            {/* OPTIMIZACIÓN: Renderizamos TODAS las imágenes en el DOM.
               Controlamos la visibilidad con Opacidad. 
               Esto permite transiciones suaves (cross-fade) y evita que la imagen
               tenga que "cargarse" cuando cambia el índice (evita parpadeos).
            */}
            <div className="absolute inset-0 z-0">
                {backgrounds.map((bg, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out bg-cover bg-center ${index === currentIndex ? "opacity-100" : "opacity-0"
                            }`}
                        style={{ backgroundImage: `url(${bg})` }}
                        aria-hidden="true"
                    />
                ))}
                {/* Overlay oscuro constante */}
                <div className="absolute inset-0 bg-black/40" />
            </div>

            {/* Barra Superior */}
            <div className="relative z-10 w-full h-2">
                <img
                    src={topBarImage}
                    alt=""
                    className="w-full h-full object-cover"
                    aria-hidden="true"
                />
            </div>



            {/* Contenido Principal */}
            {/* Contenido Principal ajustado */}
            <main className="relative z-10 flex-grow flex justify-center items-center overflow-hidden p-1 md:p-2">
                {children}
            </main>

            {/* Barra Inferior */}
            <div className="relative z-10 w-full h-2">
                <img
                    src={topBarImage}
                    alt=""
                    className="w-full h-full object-cover"
                    aria-hidden="true"
                />
            </div>
        </div>
    );
};

export default Fondo;
