import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { FaTimes } from "react-icons/fa";

const Carrusel = ({ slides, autoPlay = true, interval = 3000 }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [modalImage, setModalImage] = useState(null);

    const goToNext = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, [slides.length]);

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    };

    const goToSlide = (index) => setCurrentIndex(index);

    useEffect(() => {
        if (!autoPlay || isPaused) return;
        const timer = setInterval(goToNext, interval);
        return () => clearInterval(timer);
    }, [autoPlay, interval, isPaused, goToNext]);

    return (
        <div className="relative flex flex-col items-center justify-center w-full h-full flex-grow bg-gray-100 p-6 rounded-lg shadow-lg overflow-hidden">
            {/* Flechas */}
            <div
                role="button"
                aria-label="Anterior"
                className="absolute top-1/2 left-3 transform -translate-y-1/2 cursor-pointer text-gray-700 hover:text-black text-2xl z-10"
                onClick={goToPrevious}
            >
                &#9664;
            </div>
            <div
                role="button"
                aria-label="Siguiente"
                className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-700 hover:text-black text-2xl z-10"
                onClick={goToNext}
            >
                &#9654;
            </div>

            {/* Slides */}
            <div className="relative w-full overflow-hidden flex-grow">
                <div
                    className="flex h-full transition-transform duration-300"
                    style={{
                        transform: `translateX(-${currentIndex * 100}%)`,
                    }}
                >
                    {slides.map((slide, index) => (
                        <div
                            key={index}
                            className="w-full h-full flex-shrink-0 flex justify-center"
                        >
                            <div className="flex flex-col items-center text-center px-2 h-full justify-center">
                                <h2 className="text-lg sm:text-xl lg:text-3xl font-semibold mb-2">
                                    {slide.title}
                                </h2>
                                <p className="text-gray-700 text-sm lg:text-lg mb-5 lg:mb-8">
                                    {slide.text}
                                </p>
                                <div className="flex-1 w-full relative min-h-0">
                                    <img
                                        src={slide.image}
                                        alt={`Slide ${index}`}
                                        className="absolute inset-0 w-full h-full object-contain mx-auto rounded-lg shadow-md transition-transform duration-300 hover:scale-105 cursor-zoom-in"
                                        onMouseEnter={() => setIsPaused(true)}
                                        onMouseLeave={() => setIsPaused(false)}
                                        onClick={() => {
                                            setModalImage(slide.image);
                                            setIsPaused(true);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Puntos */}
            <div className="flex justify-center mt-2 space-x-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        aria-label={`Ir a la diapositiva ${index + 1}`}
                        className={`w-3 h-3 rounded-full transition-colors duration-200 ${currentIndex === index
                            ? "bg-blue-600"
                            : "bg-gray-400"
                            }`}
                    />
                ))}
            </div>

            {/* Modal de Zoom */}
            {
                modalImage && createPortal(
                    <div
                        className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90 p-4"
                        onClick={() => setModalImage(null)}
                    >
                        <button
                            className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 transition-colors"
                            onClick={() => setModalImage(null)}
                        >
                            <FaTimes />
                        </button>
                        <img
                            src={modalImage}
                            alt="Zoom"
                            className="max-w-full max-h-[95vh] object-contain rounded-lg shadow-2xl animate-scaleIn"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>,
                    document.body
                )
            }
        </div >
    );
};

export default Carrusel;
