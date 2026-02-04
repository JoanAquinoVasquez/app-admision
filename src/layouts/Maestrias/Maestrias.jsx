import { motion } from "framer-motion";
import Fondo from "../Fondo/Fondo";
import HeroSection from "../../components/HeroSection/HeroSection";
import Requirements from "../../components/Requirements/Requirements";
import ProgramTable from "../../components/ProgramTable/ProgramTable";
import PageHeader from "../../components/PageHeader/PageHeader";
import InfoProspecto from "../../components/InfoProspecto/InfoProspecto";
import { useProgramasLanding } from "../../hooks/useProgramasLanding";
import maestriasImg from "../../assets/Img/maestrias.webp";
import Chatbot from "../ChatBot/ChatBot";

export default function Maestrias() {
    // Fetch maestrías from API (grado_id = 2) - optimized endpoint
    const { programas, loading, error } = useProgramasLanding(2);

    // Format programs for table
    const formattedPrograms = Array.isArray(programas)
        ? programas.map((p, index) => ({
            nro: String(index + 1).padStart(2, '0'),
            facultad: p.facultad?.siglas || 'N/A',
            programa: p.nombre,
            planEstudio: p.plan_estudio || '#',
            brochure: p.brochure || null,
        }))
        : [];

    return (
        <Fondo>
            <Chatbot />
            {/* Contenedor fluido con ancho máximo amplio */}
            <div className="w-full max-w-[1900px] mx-auto px-4 md:px-6 lg:px-8 py-6">

                {/* 1. PageHeader y Hero Section (Ancho Completo) */}
                <div className="space-y-6 mb-8">
                    <PageHeader currentPage="Maestrías" />
                    <div className="overflow-hidden rounded-[2.5rem] shadow-2xl border border-gray-100">
                        <HeroSection
                            title="MAESTRÍAS"
                            subtitle="Impulsa tu carrera profesional con nuestros programas de especialización."
                            image={maestriasImg}
                        />
                    </div>
                </div>

                {/* 2. Grid de Información y Tabla (Lado a Lado) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* COLUMNA IZQUIERDA: Requisitos (Sticky para que no se pierda al bajar la tabla) */}
                    <aside className="lg:col-span-6 xl:col-span-6 space-y-6 lg:sticky lg:top-8">
                        <div className="overflow-hidden rounded-[2.5rem] bg-white border border-gray-200 shadow-sm">
                            <div className="p-2"> {/* Wrapper suave para el componente de requisitos */}
                                <Requirements programType="MAESTRÍAS" />
                            </div>
                        </div>

                        {/* Opcional: Un Flyer de contacto o info extra aquí quedaría genial */}
                        <div className="hidden lg:block">
                            <InfoProspecto title="Prospecto de Admisión" />
                        </div>
                    </aside>

                    {/* COLUMNA DERECHA: Buscador y Tabla de Programas */}
                    <main className="lg:col-span-6 xl:col-span-6">
                        <motion.div
                            className="w-full"
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            <div className="overflow-hidden rounded-[2.5rem] border border-gray-200 shadow-xl shadow-gray-100/50 bg-white">
                                {/* Header Integrado de la Tabla */}
                                <div className="bg-gray-50/50 pt-8 px-8 pb-4">
                                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                                        Lista de Programas
                                    </h2>
                                    <p className="text-sm text-gray-500 italic">Disponibles para el ciclo académico actual</p>
                                </div>

                                {/* Estados de Carga y Tabla */}
                                <div className="min-h-[500px]">
                                    {loading ? (
                                        <div className="flex flex-col items-center justify-center py-32">
                                            <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                                            <p className="text-gray-400 font-medium">Cargando oferta académica...</p>
                                        </div>
                                    ) : error ? (
                                        <div className="p-10 text-center text-red-500 font-medium">
                                            {error}
                                        </div>
                                    ) : (
                                        <ProgramTable programs={formattedPrograms} showBrochure={true} />
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </main>
                </div>
            </div>
        </Fondo>
    );
}
