import { Button, Link, Modal, ModalContent, ModalHeader, ModalBody, useDisclosure } from "@heroui/react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { admissionConfig } from "../../config/admission";
import cronogramaImg from "../../assets/Img/cronograma.webp";

// Sub-componente para evitar repetición
const ContactLink = ({ number }) => (
    <a
        href={`https://api.whatsapp.com/send/?phone=51${number.replace(/\s/g, "")}&text=Hola+estoy+interesado+en+el+programa+de&type=phone_number&app_absent=0`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 group/contact transition-all hover:scale-105"
    >
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-800/40 border border-blue-700/50 group-hover/contact:bg-emerald-500/20 group-hover/contact:border-emerald-500/50">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="text-blue-300 group-hover/contact:text-emerald-400" viewBox="0 0 16 16">
                <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
            </svg>
            <span className="text-[14px] font-bold text-blue-50 group-hover/contact:text-white">{number}</span>
        </div>
    </a>
);

export default function InfoProspecto({ title }) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const config = admissionConfig.cronograma;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full"
        >
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-900 to-blue-950 rounded-3xl p-6 md:p-10 shadow-2xl border border-blue-800/50">
                {/* Decoración de fondo optimizada */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-700/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="relative z-10 flex flex-col gap-8">
                    {/* Sección Superior: Título y Botones */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div className="flex items-center gap-5 max-w-xl">
                            <div className="hidden sm:flex shrink-0 items-center justify-center w-14 h-14 rounded-2xl bg-white/10 text-white border border-white/20 backdrop-blur-md">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
                                {title}
                            </h3>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                            <Button
                                onPress={onOpen}
                                className="bg-white text-blue-900 font-bold h-14 px-8 rounded-xl hover:scale-105 active:scale-95 transition-transform shadow-xl"
                                startContent={
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                                    </svg>
                                }
                            >
                                Ver Cronograma
                            </Button>
                            <Button
                                as={Link}
                                href="https://drive.google.com/file/d/1tQD5LiJOalnAfqrYr4QVHUj8CjM4CgmX/view?usp=drive_link"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-blue-600 text-white font-bold h-14 px-8 rounded-xl hover:bg-blue-500 hover:scale-105 active:scale-95 transition-all shadow-xl border-b-4 border-blue-800"
                                endContent={
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                    </svg>
                                }
                            >
                                Ver Prospecto
                            </Button>
                        </div>
                    </div>

                    {/* Sección Inferior: Contactos */}
                    <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center gap-4">
                        <span className="text-xs font-black text-white uppercase tracking-[0.2em]">
                            Canales de atención:
                        </span>
                        <div className="flex flex-wrap justify-center gap-3">
                            <ContactLink number="995 901 454" />
                            <ContactLink number="924 545 013" />
                        </div>
                    </div>
                </div>

                <Modal
                    isOpen={isOpen}
                    onOpenChange={onOpenChange}
                    size="3xl"
                    scrollBehavior="inside"
                    backdrop="blur"
                    className="max-h-[90vh]"
                >
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1 text-gray-900 border-b">
                                    Cronograma de Admisión {config.periodo}
                                </ModalHeader>
                                <ModalBody className="py-6">
                                    <div className="rounded-2xl overflow-hidden border border-gray-200 bg-gray-50">
                                        <img
                                            src={cronogramaImg}
                                            alt="Cronograma de Admisión"
                                            className="w-full h-auto object-contain"
                                        />
                                    </div>
                                </ModalBody>
                            </>
                        )}
                    </ModalContent>
                </Modal>
            </div>
        </motion.div>
    );
}

InfoProspecto.propTypes = {
    title: PropTypes.string.isRequired,
};