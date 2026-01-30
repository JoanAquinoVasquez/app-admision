import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logoWithTextImage from "../../assets/Isotipos/isotipo_color_epg.webp";
import cronograma from "../../assets/Img/cronograma.webp";
import pasos from "../../assets/Img/pasos.webp";
import fecha_examen from "../../assets/Img/fecha_examen.webp";
import Carrusel from "../../components/Carrusel/Carrusel";
import "./Index.css";
import { admissionConfig } from "../../config/admission";
import Fondo from "../Fondo/Fondo";
import Chatbot from "../ChatBot/ChatBot";

function InscripcionFinalizada() {
    const config = admissionConfig.cronograma;
    const navigate = useNavigate();
    const location = useLocation();

    const slides = [
        {
            title: "Pasos del Proceso Admisión",
            text: "Consulta aquí el paso a paso del proceso de admisión.",
            image: pasos,
        },
        {
            title: "Prepárate para el examen de admisión",
            text: "Revisa las fechas del examen de admisión.",
            image: fecha_examen,
        },
        {
            title: `Cronograma de Admisión ${admissionConfig.cronograma.periodo}`,
            text: `Conoce el cronograma de admisión ${admissionConfig.cronograma.periodo}.`,
            image: cronograma,
        },
        {
            title: "Conceptos de Pago Inscripción",
            text: "Revisa los conceptos de pago para el proceso de inscripción.",
            image: conceptos_inscripcion,
        }
    ];

    useEffect(() => {
        if (location.state && location.state.logoutMessage) {
            navigate(location.pathname, { replace: true });
        }
    }, [location, navigate]);

    return (
        <Fondo>
            <Chatbot />
            <div className="relative flex flex-col sm:flex-row bg-white px-4 py-6 rounded-lg shadow-lg w-[98%] max-w-screen-xl mx-auto">
                {/* Sección Izquierda */}
                <div className="flex flex-col items-center justify-center w-full sm:w-[60%] pr-4 sm:pr-8 text-center">
                    <img
                        src={logoWithTextImage}
                        alt="Logo UNPRG"
                        className="w-[40%] sm:w-[30%] h-auto mb-4"
                    />

                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-600 mb-2">
                        ¡Inscripciones Finalizadas!
                    </h2>

                    <p className="text-lg sm:text-xl text-gray-700 mb-6">
                        Gracias por confiar en la Escuela de Posgrado de la
                        UNPRG.
                    </p>

                    <p className="text-base sm:text-lg text-gray-600 mb-4">
                        Hemos cerrado exitosamente el proceso de inscripción.
                        Ahora nos preparamos para el examen de admisión este{" "}
                        <strong>{config.examen_admision || "domingo 27 de Abril"}.</strong>
                    </p>

                    <p className="text-base sm:text-lg text-gray-600 mb-6">
                        Sigue atento a nuestras <strong>redes sociales</strong>{" "}
                        para conocer los resultados, fechas de matrícula, y más
                        información relevante.
                    </p>
                </div>

                {/* Sección Derecha: Carrusel */}
                <div className="flex flex-col items-center justify-center w-full sm:w-[40%] mt-6 sm:mt-0">
                    <Carrusel autoPlay={true} interval={3000} slides={slides} />
                </div>
            </div>
        </Fondo>
    );
}

export default InscripcionFinalizada;
