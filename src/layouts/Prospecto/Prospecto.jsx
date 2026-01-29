import { motion } from "framer-motion";
import { Button, Card, CardBody } from "@nextui-org/react";
import { Download, FileText, Calendar, CheckCircle, CreditCard } from "lucide-react"; // Importa iconos
import Fondo from "../Fondo/Fondo";
import HeroSection from "../../components/HeroSection/HeroSection";
import PageHeader from "../../components/PageHeader/PageHeader";
import banner_epg from "../../assets/Img/banner_epg.webp";
import prospectoImg from "../../assets/Img/2026-PROSPECTO.webp";
import { admissionConfig } from "../../config/admission";

export default function Prospecto() {
    const config = admissionConfig.cronograma;
    const prospectoUrl = "https://drive.google.com/file/d/1tQD5LiJOalnAfqrYr4QVHUj8CjM4CgmX/view?usp=drive_link";

    const features = [
        { icon: <FileText size={20} className="text-blue-500" />, text: "Programas de Posgrado detallados" },
        { icon: <CheckCircle size={20} className="text-green-500" />, text: "Requisitos de admisión actualizados" },
        { icon: <Calendar size={20} className="text-purple-500" />, text: "Cronograma completo del proceso" },
        { icon: <CreditCard size={20} className="text-amber-500" />, text: "Costos y facilidades de pago" },
    ];

    return (
        <Fondo>
            <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-6">

                {/* Header y Hero (Consistente con Maestrías/Doctorados) */}
                <div className="space-y-6 mb-8">
                    <PageHeader currentPage="Prospecto" />
                    <div className="overflow-hidden rounded-[2.5rem] shadow-2xl border border-gray-100">
                        <HeroSection
                            title="Prospecto Digital"
                            subtitle={`Todo lo que necesitas saber para tu Admisión ${config.periodo}`}
                            image={banner_epg}
                        />
                    </div>
                </div>

                {/* Grid Principal */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

                    {/* COLUMNA IZQUIERDA: Info y Beneficios */}
                    <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white/60 backdrop-blur-md p-8 rounded-[2.5rem] border border-white shadow-xl"
                        >
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                Guía Completa de Admisión
                            </h2>
                            <p className="text-gray-600 mb-8 leading-relaxed">
                                Descarga el documento oficial donde encontrarás la hoja de ruta para tu crecimiento profesional en nuestra casa de estudios.
                            </p>

                            <div className="grid grid-cols-1 gap-4 mb-8">
                                {features.map((item, index) => (
                                    <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-2xl shadow-sm border border-gray-100">
                                        {item.icon}
                                        <span className="text-gray-700 font-medium">{item.text}</span>
                                    </div>
                                ))}
                            </div>

                            <Button
                                as="a"
                                href={prospectoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full h-16 text-lg font-bold bg-gradient-to-r from-red-600 to-red-500 text-white rounded-2xl shadow-lg hover:shadow-red-200 transition-all gap-3"
                            >
                                <Download size={24} />
                                DESCARGAR PROSPECTO PDF
                            </Button>
                        </motion.div>
                    </div>

                    {/* COLUMNA DERECHA: Visual Preview */}
                    <div className="lg:col-span-7">
                        <motion.div
                            className="h-full"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6 }}
                        >
                            <Card className="h-full rounded-[2.5rem] border-none shadow-2xl bg-gray-900 overflow-hidden group">
                                <CardBody className="p-0 relative flex items-center justify-center">
                                    <img
                                        src={prospectoImg}
                                        alt="Preview Prospecto"
                                        className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-500"
                                    />
                                    {/* Overlay con botón para ver pantalla completa */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <a
                                            href={prospectoUrl}
                                            target="_blank"
                                            className="bg-white text-gray-900 px-8 py-4 rounded-full font-bold shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform"
                                        >
                                            Ver Documento Completo
                                        </a>
                                    </div>
                                    <div className="absolute bottom-8 left-8 text-white">
                                        <p className="text-sm font-light uppercase tracking-widest opacity-80">Vista Previa</p>
                                        <h3 className="text-2xl font-bold">Edición {config.periodo}</h3>
                                    </div>
                                </CardBody>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </div>
        </Fondo>
    );
}