import { useState } from "react";
import { createPortal } from "react-dom";
import { FaTimes, FaSearchPlus } from "react-icons/fa"; // Añadimos icono de zoom
import voucherBN from "../../assets/Img/voucher_bn.webp";
import voucherPagaloPe from "../../assets/Img/voucher_py.webp";
import logoBN from "../../assets/Img/logo_bn.webp";

const recursos = [
    { label: "📖 Más Información", url: "..." },
];

const VoucherInfo = ({ tipo_pago }) => {
    const isBN = tipo_pago === "BN";
    const [isModalOpen, setIsModalOpen] = useState(false);
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
            <div className="relative group w-full flex-1 flex items-center justify-center overflow-hidden mb-4">
                <div className="relative overflow-hidden rounded-xl shadow-lg border border-gray-200 bg-white p-1 max-h-full">
                    <img
                        src={currentImage}
                        loading="lazy"
                        alt="Voucher"
                        /* max-h-[40vh] para laptops, sube a [50vh] en monitores grandes */
                        className="max-w-full h-auto max-h-[40vh] 2xl:max-h-[50vh] object-contain transition-transform duration-500 group-hover:scale-105 cursor-zoom-in"
                        onClick={() => setIsModalOpen(true)}
                    />
                    <div className="absolute bottom-2 right-2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <FaSearchPlus size={14} />
                    </div>
                </div>
            </div>

            {/* Sección de Enlaces: Más robusta en monitores */}
            <div className="w-full mt-auto">
                <div className="grid grid-cols-1 gap-2">
                    {recursos.map(({ label, url }, index) => (
                        <a
                            key={index}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center py-2 2xl:py-4 px-4 rounded-xl bg-white border border-gray-100 text-slate-600 hover:text-blue-600 hover:border-blue-200 hover:shadow-sm transition-all text-xs lg:text-sm 2xl:text-base font-semibold"
                        >
                            {label}
                        </a>
                    ))}
                </div>
            </div>

            {/* Modal de Zoom (Portal) */}
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
        </div>
    );
};
export default VoucherInfo;