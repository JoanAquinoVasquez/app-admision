import { useMemo } from "react";
import { motion } from "framer-motion";
import { Link, Link as RouterLink } from "react-router-dom";
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Chip,
} from "@nextui-org/react";
import ChatBot from "../../layouts/ChatBot/ChatBot";
import logoWithTextImage from "../../assets/Isotipos/isotipo_color_epg.webp";
import Fondo from "../Fondo/Fondo";
import mae from "../../assets/Img/maestrias.webp";
import doc from "../../assets/Img/doctorados.webp";
import seg from "../../assets/Img/segundas-especialidades.webp";
import info from "../../assets/Img/mas-informacion.webp";
import banner from "../../assets/Img/banner_epg.webp";
import { admissionConfig, getAdmissionStage } from "../../config/admission";

// Datos estáticos de programas
const PROGRAMAS = [
    {
        img: mae,
        title: "Maestrías",
        desc: "Especialización profesional avanzada.",
        url: "/maestrias",
        isInternal: true,
    },
    {
        img: doc,
        title: "Doctorados",
        desc: "Investigación y desarrollo académico.",
        url: "/doctorados",
        isInternal: true,
    },
    {
        img: seg,
        title: "Segundas Especialidades",
        desc: "Especialízate en un nuevo enfoque y diversifica tus habilidades.",
        url: "/segundas-especialidades",
        isInternal: true,
    },
    {
        img: info,
        title: "Más información",
        desc: "Resuelve tus dudas aquí.",
        url: "/prospecto",
        isInternal: true,
    },
];

export default function Index() {
    // LEER LA ETAPA ACTUAL DESDE EL .ENV
    // Valores esperados: 'PREINSCRIPCION', 'INSCRIPCION', 'EVALUACION', 'RESULTADOS', 'FINALIZADO'
    const currentStage = getAdmissionStage();
    const config = admissionConfig.cronograma || {};

    // CONFIGURACIÓN DE CONTENIDO SEGÚN ETAPA
    const stageConfig = useMemo(() => {
        switch (currentStage) {
            case "PREINSCRIPCION":
                return {
                    statusLabel: "Fase 1: Preinscripción",
                    statusColor: "primary",
                    title: "Preinscripciones Abiertas",
                    description:
                        "Inicia tu camino al posgrado. Regístrate antes del cierre de convocatoria.",
                    buttonText: "Preinscribirse Ahora",
                    buttonLink: "/admision-epg/preinscripcion", // Ruta interna o link externo
                    isActive: true,
                };
            case "INSCRIPCION":
                return {
                    statusLabel: "Fase 2: Inscripción",
                    statusColor: "success",
                    title: "Inscripciones Abiertas",
                    description:
                        "El proceso de inscripción está activo. Completa tu registro y realiza el pago correspondiente.",
                    buttonText: "Inscribirse Ahora",
                    buttonLink: "/admision-epg/inscripcion", // Ruta interna o link externo
                    isActive: true,
                };
            case "EVALUACION":
                return {
                    statusLabel: "Fase 3: Evaluación",
                    statusColor: "warning",
                    title: "Etapa de Evaluación",
                    description:
                        "Estamos en proceso de evaluación de expedientes y entrevistas. Mantente atento a tu correo.",
                    buttonText: "Ver Cronograma",
                    buttonLink: "/admision-epg/",
                    isActive: true,
                };
            case "RESULTADOS":
                return {
                    statusLabel: "Fase 4: Resultados",
                    statusColor: "secondary",
                    title: "Resultados Publicados",
                    description:
                        "Ya puedes consultar la lista de ingresantes del proceso de admisión.",
                    buttonText: "Consultar Resultados",
                    buttonLink:
                        "/admision-epg/",
                    isActive: true,
                };
            case "FINALIZADO":
            default:
                return {
                    statusLabel: "Proceso Cerrado",
                    statusColor: "default",
                    title: "Proceso de Admisión Finalizado",
                    description:
                        "El proceso de admisión ha concluido. Prepárate para la próxima convocatoria.",
                    buttonText: "Más información",
                    buttonLink: "https://drive.google.com/drive/folders/14WZxQ6TkA4TUGFKeVEcpVY06rH8Qg199?usp=sharing",
                    isActive: false,
                };
        }
    }, [currentStage]);

    return (
        <Fondo>
            <ChatBot />

            <motion.div
                className="relative flex flex-col items-center bg-white rounded-lg shadow-lg w-full max-w-7xl px-4 md:px-6 lg:px-6 lg:py-2 py-4 md:py-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                {/* Header con logo y título */}
                <div className="flex flex-col md:flex-row items-center justify-between w-full gap-3">
                    <img
                        src={logoWithTextImage}
                        alt="Logo UNPRG"
                        className="w-28 sm:w-32 md:w-40"
                    />
                    <div className="flex flex-col items-center md:items-end">
                        {/* Chip de Estado */}
                        <h3 className="text-center md:text-right text-sm md:text-base lg:text-lg font-bold leading-snug">
                            Proceso de Admisión{" "}
                            {config.periodo}
                            <br />
                            <span className="text-gray-500 font-normal">
                                Escuela de Posgrado UNPRG
                            </span>
                        </h3>
                    </div>
                </div>

                {/* Card principal */}
                <Card className="w-full max-w-3xl min-[1700px]:max-w-5xl shadow-xl">
                    <CardHeader className="h-20 lg:h-24 min-[1700px]:h-40 p-0">
                        <img
                            src={banner}
                            alt="Banner informativo"
                            className="w-full h-full object-cover object-[center_15%] rounded-t-lg"
                            loading="lazy"
                        />
                    </CardHeader>

                    <CardBody className="py-3 min-[1700px]:py-8 px-6 flex flex-col items-center text-center">
                        <h4
                            className={`text-xl lg:text-2xl min-[1700px]:text-4xl font-bold ${stageConfig.isActive
                                ? "text-blue-800"
                                : "text-gray-700"
                                }`}
                        >
                            {stageConfig.title}
                        </h4>
                        <p className="text-gray-600 text-sm lg:text-base min-[1700px]:text-xl max-w-xl min-[1700px]:max-w-3xl mt-2">
                            {stageConfig.description}
                        </p>
                    </CardBody>

                    <CardFooter className="flex justify-center pt-0 pb-3 min-[1700px]:pb-6 px-4">
                        <a
                            href={stageConfig.buttonLink}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Button color="primary" variant="shadow" size="md" className="min-[1700px]:text-lg min-[1700px]:px-8">
                                {stageConfig.buttonText}
                            </Button>
                        </a>
                    </CardFooter>
                </Card>

                {/* Grid de programas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 min-[1700px]:gap-8 px-2 sm:px-4 mt-3 min-[1700px]:mt-8 w-full min-[1700px]:max-w-6xl">
                    {PROGRAMAS.map(({ img, title, desc, url, isInternal }, i) => (
                        <Card key={i} className="w-full h-full shadow-md hover:shadow-xl transition-shadow">
                            <CardHeader className="p-0 group overflow-hidden">
                                {isInternal ? (
                                    <RouterLink
                                        to={url}
                                        className="block w-full h-full"
                                    >
                                        <img
                                            src={img}
                                            alt={title}
                                            className="w-full h-32 md:h-40 min-[1700px]:h-64 object-contain rounded-t-lg transition-transform duration-300 ease-in-out group-hover:scale-110"
                                        />
                                    </RouterLink>
                                ) : (
                                    <a
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block w-full h-full"
                                    >
                                        <img
                                            src={img}
                                            alt={title}
                                            className="w-full h-32 md:h-40 min-[1700px]:h-64 object-contain rounded-t-lg transition-transform duration-300 ease-in-out group-hover:scale-110"
                                        />
                                    </a>
                                )}
                            </CardHeader>

                            <CardBody className="py-2 px-3">
                                <h4 className="text-sm md:text-base font-semibold text-center">
                                    {title}
                                </h4>
                                <p className="text-gray-600 text-xs md:text-sm text-center">
                                    {desc}
                                </p>
                            </CardBody>

                            <CardFooter className="flex justify-center pt-0 pb-2 px-4">
                                {isInternal ? (
                                    <RouterLink to={url}>
                                        <Button
                                            color="primary"
                                            variant="shadow"
                                            size="sm"
                                        >
                                            Ver más
                                        </Button>
                                    </RouterLink>
                                ) : (
                                    <a
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Button
                                            color="primary"
                                            variant="shadow"
                                            size="sm"
                                        >
                                            Ver más
                                        </Button>
                                    </a>
                                )}
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </motion.div>
        </Fondo>
    );
}
