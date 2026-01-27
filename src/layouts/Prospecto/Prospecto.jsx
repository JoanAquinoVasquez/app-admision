import { motion } from "framer-motion";
import { Button, Card, CardBody } from "@nextui-org/react";
import Fondo from "../Fondo/Fondo";
import HeroSection from "../../components/HeroSection/HeroSection";
import PageHeader from "../../components/PageHeader/PageHeader";
import informacionImg from "../../assets/Img/informacion.webp";

export default function Prospecto() {
    const prospectoUrl = "https://drive.google.com/file/d/1VsdmSBx0_1FSKfS0GaL-zY5ky9322iPA/view";

    return (
        <Fondo>
            <motion.div
                className="relative flex flex-col items-center bg-white rounded-lg shadow-lg w-full max-w-7xl px-4 md:px-6 lg:px-8 py-6 md:py-8 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                {/* Header con navegación */}
                <PageHeader currentPage="Prospecto" />

                {/* Hero Section */}
                <HeroSection
                    title="Prospecto"
                    subtitle="Admisión 2025-I"
                    image={informacionImg}
                />

                {/* Contenido Principal */}
                <motion.div
                    className="w-full max-w-4xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <Card className="shadow-lg">
                        <CardBody className="p-6 md:p-10 flex flex-col items-center gap-6">
                            {/* Botón de descarga principal */}
                            <Button
                                as="a"
                                href={prospectoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                color="danger"
                                variant="shadow"
                                size="lg"
                                className="text-lg font-semibold px-8"
                            >
                                DESCARGA AQUÍ EL PROSPECTO
                            </Button>

                            <p className="text-center text-gray-700 font-medium">
                                Prospecto Admisión 2025-I
                            </p>

                            {/* Preview del prospecto */}
                            <motion.div
                                className="w-full flex justify-center"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                            >
                                <a
                                    href={prospectoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block hover:opacity-90 transition-opacity"
                                >
                                    <img
                                        src={informacionImg}
                                        alt="Prospecto 2025-I"
                                        className="w-full max-w-2xl rounded-lg shadow-md hover:shadow-xl transition-shadow"
                                    />
                                </a>
                            </motion.div>

                            {/* Botón de descarga secundario */}
                            <Button
                                as="a"
                                href={prospectoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                color="danger"
                                variant="shadow"
                                size="lg"
                                className="text-lg font-semibold px-8"
                            >
                                DESCARGA AQUÍ EL PROSPECTO
                            </Button>

                            {/* Información adicional */}
                            <div className="mt-4 text-center">
                                <p className="text-gray-600 text-sm">
                                    El prospecto contiene información detallada sobre:
                                </p>
                                <ul className="mt-2 text-gray-700 text-sm space-y-1">
                                    <li>• Programas de Maestría y Doctorado</li>
                                    <li>• Requisitos de admisión</li>
                                    <li>• Cronograma del proceso</li>
                                    <li>• Costos y modalidades de pago</li>
                                </ul>
                            </div>
                        </CardBody>
                    </Card>
                </motion.div>
            </motion.div>
        </Fondo>
    );
}
