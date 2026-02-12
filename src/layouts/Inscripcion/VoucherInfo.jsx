import { useState } from "react";
import { createPortal } from "react-dom";
import { FaTimes, FaSearchPlus, FaYoutube } from "react-icons/fa"; // Añadimos icono de zoom y youtube
import voucherBN from "../../assets/Img/voucher_bn.webp";
import voucherPagaloPe from "../../assets/Img/voucher_py.webp";
import logoBN from "../../assets/Img/logo_bn.webp";

const recursos = [
    { label: "📖 Más Información", url: "https://epgunprg.edu.pe/admision-epg/prospecto" },
];

const VoucherInfo = ({ tipo_pago }) => {
    const isBN = tipo_pago === "BN";
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isVideoOpen, setIsVideoOpen] = useState(false); // Estado para el modal de video
    const currentImage = isBN ? voucherBN : voucherPagaloPe;

    return (
        <div className="w-full h-full flex flex-col items-center justify-between py-1 px-2 overflow-hidden">

            {/* Encabezado: Texto más grande en monitores (2xl) */}
            <div className="text-center mb-2 2xl:mb-6">
                <h2 className="text-[10px] lg:text-xs 2xl:text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">
                    Guía de Referencia
                </h2>
                <div className="flex items-center justify-center gap-2 2xl:gap-4">
                    <img src={logoBN} alt="Logo" className="w-6 h-6 lg:w-8 lg:h-8 2xl:w-12 2xl:h-12 object-contain" />
                    <h3 className="text-sm lg:text-xl 2xl:text-2xl font-black text-slate-700">
                        {isBN ? "Banco de la Nación" : "PagaloPe"}
                    </h3>
                </div>
            </div>

            {/* Contenedor de Imagen: Control de altura absoluta */}
            <div className="relative group w-full flex-1 flex items-center justify-center overflow-hidden mb-4 rounded-xl border border-gray-100 bg-white p-2">
                {/* Botón Flotante para Video (Sobre la imagen o en la esquina) - OPCIONAL, pero mejor lo ponemos abajo como botón principal */}
                <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-lg">
                    <img
                        src={currentImage}
                        loading="lazy"
                        alt="Voucher"
                        className="max-w-full h-full object-contain cursor-zoom-in transition-transform duration-500 group-hover:scale-105"
                        onClick={() => setIsModalOpen(true)}
                    />
                    <div className="absolute bottom-2 right-2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <FaSearchPlus size={14} />
                    </div>
                </div>
            </div>

            {/* Sección de Botones de Acción */}
            <div className="w-full mt-auto space-y-2">

                {/* Botón de Video Tutorial */}
                <button
                    onClick={() => setIsVideoOpen(true)}
                    className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg hover:shadow-red-200 transition-all group"
                >
                    <div className="bg-white/20 p-1.5 rounded-full group-hover:scale-110 transition-transform">
                        <FaYoutube size={16} />
                    </div>
                    <span className="text-xs lg:text-sm 2xl:text-base font-bold tracking-wide">
                        VER TUTORIAL DE INSCRIPCIÓN
                    </span>
                </button>

                {/* Enlaces y Recursos */}
                <div className="grid grid-cols-1 gap-2">
                    {recursos.map(({ label, url }, index) => (
                        <a
                            key={index}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center py-2 px-4 rounded-xl bg-white border border-gray-200 text-slate-600 hover:text-blue-600 hover:border-blue-300 hover:shadow-sm transition-all text-xs lg:text-sm 2xl:text-base font-semibold"
                        >
                            {label}
                        </a>
                    ))}
                </div>
            </div>

            {/* Modal de Zoom (Imagen) */}
            {isModalOpen && createPortal(
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/95 backdrop-blur-md p-4"
                    onClick={() => setIsModalOpen(false)}
                >
                    <button className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors">
                        <FaTimes size={32} />
                    </button>
                    <img
                        src={currentImage}
                        alt="Zoom"
                        className="max-w-full max-h-[90vh] object-contain shadow-2xl rounded-lg animate-in zoom-in-95 duration-300"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>,
                document.body
            )}

            {/* Modal de Video (YouTube) */}
            {isVideoOpen && createPortal(
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300"
                    onClick={() => setIsVideoOpen(false)}
                >
                    <button className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-50">
                        <FaTimes size={32} />
                    </button>

                    <div
                        className="w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10 relative animate-in zoom-in-95 duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* REEMPLAZAR 'VIDEO_ID' CON EL ID REAL DEL VIDEO DE YOUTUBE */}
                        {/* Ejemplo: https://www.youtube.com/embed/dQw4w9WgXcQ */}
                        <iframe
                            width="100%"
                            height="100%"
                            src="https://www.youtube.com/embed/ExCRgKaKDjA?autoplay=1"
                            title="Video Tutorial"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            className="absolute inset-0 w-full h-full"
                        ></iframe>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};
export default VoucherInfo;