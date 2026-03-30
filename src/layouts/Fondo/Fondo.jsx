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
        <div className="relative w-full min-h-screen flex flex-col" style={{ isolation: "isolate" }}>
            {/* Fondo animado: absolute para no salirse del contenedor y tapar el footer */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-gray-900">
                {backgrounds.map((bg, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 bg-cover bg-center ${
                            index === currentIndex ? "opacity-100" : "opacity-0"
                        }`}
                        style={{
                            backgroundImage: `url(${bg})`,
                            backgroundRepeat: "no-repeat",
                            transition: "opacity 1.5s ease-in-out",
                            WebkitBackfaceVisibility: "hidden",
                            WebkitTransform: "translateZ(0)",
                            transform: "translateZ(0)",
                            willChange: "opacity",
                        }}
                        aria-hidden="true"
                    />
                ))}
                {/* Overlay oscuro siempre visible, por encima de las imágenes */}
                <div className="absolute inset-0 bg-black/40" style={{ zIndex: 1 }} />
            </div>

            {/* Barra Superior */}
            <div className="relative z-10 w-full h-2 flex-shrink-0">
                <img
                    src={topBarImage}
                    alt=""
                    className="w-full h-full object-cover"
                    aria-hidden="true"
                />
            </div>

            {/* Contenido Principal */}
            <main className="relative z-10 flex-grow flex flex-col items-center justify-center p-1 md:p-2">
                {children}
            </main>

            {/* Barra Inferior */}
            <div className="relative z-10 w-full h-2 flex-shrink-0">
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
