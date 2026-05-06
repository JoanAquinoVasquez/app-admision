import PropTypes from "prop-types";
import { Link, Modal, ModalContent, ModalHeader, ModalBody, Button, useDisclosure } from "@heroui/react";
import { motion } from "framer-motion";
import { admissionConfig } from "../../config/admission";
import conceptosImg from "../../assets/Img/conceptos_inscripcion.webp";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.4,
            staggerChildren: 0.08,
            ease: "easeOut"
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: "easeOut" }
    }
};

const RequirementItem = ({ number, title, children }) => (
    <motion.div
        variants={itemVariants}
        className="flex gap-5 items-start group relative"
    >
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white text-[#003399] flex items-center justify-center font-bold text-sm border-2 border-[#003399] shadow-sm group-hover:bg-[#003399] group-hover:text-white transition-all duration-300 z-10">
            {number}
        </div>
        <div className="space-y-2 flex-grow">
            <h4 className="font-bold text-gray-900 text-base tracking-tight group-hover:text-[#003399] transition-colors">{title}</h4>
            <div className="text-gray-600 text-xs leading-relaxed">{children}</div>
        </div>
    </motion.div>
);

const DownloadCard = ({ title, href }) => (
    <motion.a
        variants={itemVariants}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 p-3 rounded-xl border border-gray-200/50 hover:border-[#003399]/30 hover:bg-white hover:shadow-lg hover:shadow-blue-900/5 transition-all duration-300 group bg-white/60 backdrop-blur-sm"
    >
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center text-[#003399] group-hover:from-[#003399] group-hover:to-[#0044bb] group-hover:text-white transition-all shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
        </div>
        <div className="flex-1">
            <p className="text-[14px] font-bold text-gray-900 group-hover:text-[#003399] leading-tight">{title}</p>
            <p className="text-[9px] uppercase tracking-widest font-bold text-gray-400 mt-0.5">PDF</p>
        </div>
    </motion.a>
);

export default function Requirements({ programType }) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const isSegundaEspecialidad = programType === "SEGUNDAS ESPECIALIDADES PROFESIONALES";

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full bg-white rounded-[2rem] border border-gray-100 p-4 md:p-6 shadow-xl shadow-blue-900/5 relative overflow-hidden group/container"
        >
            {/* Decoración de fondo Premium */}

            <div className="relative z-10 space-y-2">
                {/* Cabecera compacta */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-100 pb-4 mb-4">
                    <div className="space-y-0">
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                            <span className="w-1.5 h-6 bg-primary rounded-full inline-block" />
                            Requisitos de Postulación
                        </h2>
                        <p className="text-gray-500 font-medium text-sm italic">
                            Admisión {admissionConfig.cronograma.periodo}
                        </p>
                    </div>
                    <div className="bg-gray-900/5 px-4 py-1 rounded-xl flex items-center gap-3">
                        <div className="relative z-10 space-y-0.5">
                            <p className="text-[14px] text-gray-400 font-bold uppercase tracking-wider">Inscripción Web</p>
                            <p className="text-xs text-gray-600 font-medium">24h después del pago</p>
                        </div>
                        <Link
                            href="https://epgunprg.edu.pe/admision-epg/inscripcion"
                            target="_blank"
                            className="bg-[#003399] text-white px-4 py-2 rounded-lg font-bold text-[14px] uppercase hover:bg-white hover:text-[#003399] transition-all shadow-md"
                        >
                            Ir ahora →
                        </Link>
                    </div>
                </div>

                {/* Modal de Conceptos */}
                <Modal
                    isOpen={isOpen}
                    onOpenChange={onOpenChange}
                    size="4xl"
                    scrollBehavior="inside"
                    backdrop="blur"
                    placement="center"
                >
                    <ModalContent className="bg-white max-h-[95vh]">
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1 text-gray-900 border-b border-gray-100 py-3">
                                    Conceptos de Inscripción {admissionConfig.cronograma.periodo}
                                </ModalHeader>
                                <ModalBody className="p-1 sm:p-4 bg-gray-50 flex items-center justify-center overflow-hidden">
                                    <img
                                        src={conceptosImg}
                                        alt="Conceptos de Inscripción"
                                        className="max-w-full h-auto object-contain shadow-xl rounded-2xl"
                                        style={{ maxHeight: '85vh' }}
                                    />
                                </ModalBody>
                            </>
                        )}
                    </ModalContent>
                </Modal>

                {/* Grid de Requisitos Horizontal */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-4">
                    {/* 1. PAGO */}
                    <RequirementItem number="1" title="Voucher de pago">
                        <div className="space-y-4">
                            <p className="text-gray-600 text-[15px] leading-relaxed">
                                Puedes hacer el pago en cualquier agencia del <span className="font-bold text-[#003399]">Banco de la Nación</span> o en el aplicativo <a href="https://pagalo.pe/" target="_blank" rel="noopener noreferrer"><span className="font-bold text-[#003399] underline decoration-2 underline-offset-4">Págalo.pe</span></a>.
                            </p>

                            <Button
                                onClick={onOpen}
                                variant="flat"
                                className="w-full sm:w-auto bg-blue-50 text-blue-700 font-bold border border-blue-100/50 hover:bg-blue-100 transition-all rounded-xl"
                                startContent={
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75m0 5.25v.75m0 5.25v.75m16.5-12v.75m0 5.25v.75m0 5.25v.75M7.5 7.5h.75m0 5.25h.75m0 5.25h.75m5.25-10.5h.75m0 5.25h.75m0 5.25h.75" />
                                    </svg>
                                }
                            >
                                Ver aquí conceptos de inscripción
                            </Button>
                        </div>
                    </RequirementItem>

                    {/* 4. CV (Moved here for visual balance) */}
                    <RequirementItem number="2" title={`${programType === "MAESTRÍAS" ? "Grado de Bachiller" : programType === "DOCTORADOS" ? "Grado de Maestro" : "Título Profesional"}`}>
                        <div className="space-y-3">
                            <p className="text-gray-600 text-[15px] leading-relaxed">
                                Registrado en SUNEDU.
                            </p>

                        </div>
                    </RequirementItem>

                    {/* 2. DNI */}
                    <RequirementItem number="3" title="Currículum Vitae Documentado">
                        <div className="bg-gradient-to-r from-[#003399]/10 to-transparent rounded-xl p-3 border-l-4 border-[#003399]">
                            <p className="text-[12px] text-[#003399] leading-relaxed font-medium">
                                Incluyendo Hoja de vida, grados, capacitaciones, diplomados y publicaciones.
                            </p>
                        </div>
                    </RequirementItem>

                    {/* 3. FOTO */}
                    <RequirementItem number="4" title="Documentos Personales">
                        <p className="text-gray-600 text-[15px]">
                            - Copia simple legible de <span className="font-bold text-gray-900">DNI</span>, <span className="font-bold text-gray-900">Carnet de Extranjería</span> o <span className="font-bold text-gray-900">Pasaporte</span> (vigente).
                        </p>
                        <p className="text-gray-600 text-[15px]">
                            - Una (1) fotografía <span className="font-bold text-[#003399]">a color</span> tamaño carné (fondo blanco, sin accesorios, no escaneada).
                        </p>
                    </RequirementItem>
                </div>

                {/* Fila inferior con Documentos */}
                <div className="pt-3 border-t border-gray-100 flex flex-col gap-3">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-tighter">Documentos</h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <DownloadCard
                                title="Folleto Informativo"
                                href={programType === "MAESTRÍAS" ? "https://drive.google.com/file/d/1G4JNzj2PjLjDdTQ9QJIanU4ZY8wYQJlh/view?usp=sharing" : programType === "DOCTORADOS" ? "https://drive.google.com/file/d/1mUwD4rncBt255WNaiFrkAkm3GxNxScor/view?usp=sharing" : "https://drive.google.com/drive/folders/1AMPzQY5lk_iYP-KYA3PbautzPjT8pl4w?usp=drive_link"}
                            />

                            {!isSegundaEspecialidad ? (
                                <>
                                    <DownloadCard
                                        title="Solicitud Dirigida al Rector"
                                        href="https://drive.google.com/file/d/17EA0pZehxc8xP1tE7IlHeDiYc0XMj_zG/view?usp=sharing"
                                    />
                                    <DownloadCard
                                        title="Rúbrica de Evaluación del CV"
                                        href="https://drive.google.com/file/d/13OWyVIXaO1ZduP7wA0KezEVIdh24YoyA/view?usp=sharing"
                                    />
                                    <DownloadCard
                                        title="Perfil de Proyecto"
                                        href="https://drive.google.com/file/d/18tZFUHQyehMIgxn-9o25h_JHG-jv-Il3/view?usp=sharing"
                                    />
                                </>
                            ) : (
                                <>
                                    <DownloadCard
                                        title="Rúbrica de Evaluación de la Entrevista"
                                        href="https://drive.google.com/file/d/1PW1m0ULnGQOQJVyYX8EUJj7ZFRxDUwzk/view?usp=sharing"
                                    />
                                    <DownloadCard
                                        title="Rúbrica de Evaluación del CV"
                                        href="https://drive.google.com/file/d/1_y0pDbpoxxMJx_DgSmbVr4IThCJaituH/view?usp=sharing"
                                    />
                                    <DownloadCard
                                        title="Solicitud Dirigida al Decano"
                                        href="https://drive.google.com/drive/folders/1AMPzQY5lk_iYP-KYA3PbautzPjT8pl4w?usp=drive_link"
                                    />
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

Requirements.propTypes = {
    programType: PropTypes.oneOf(["MAESTRÍAS", "DOCTORADOS", "SEGUNDAS ESPECIALIDADES PROFESIONALES"]).isRequired,
};
