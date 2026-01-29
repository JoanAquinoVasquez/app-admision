import { MdCalendarMonth, MdNotificationsActive } from "react-icons/md";
import logoWithTextImage from "../../../assets/Isotipos/isotipo_color_epg.webp";
import { formatearFecha } from "../../../utils/dateUtils";

const VistaPreinscripcion = ({ config }) => (
    // Reducimos el padding vertical en pantallas medianas/laptops
    <div className="flex flex-col items-center justify-center w-full h-full p-2 md:p-4 lg:p-6">

        {/* Logo: Reducimos el tamaño en laptops para ganar espacio vertical */}
        <div className="relative mb-4 lg:mb-8">
            <img
                src={logoWithTextImage}
                alt="Logo UNPRG"
                className="w-32 sm:w-40 lg:w-56 h-auto drop-shadow-md"
            />
        </div>

        {/* Título: Ajustamos el tamaño de fuente */}
        <div className="text-center space-y-1 mb-6 lg:mb-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-700 to-emerald-500 tracking-tight">
                Fase de Preinscripción
            </h2>
            <p className="text-gray-500 text-sm lg:text-base font-medium max-w-xl mx-auto">
                Estamos preparando todo para tu ingreso a la Escuela de Posgrado.
            </p>
        </div>

        {/* Card: Reducimos paddings internos */}
        <div className="w-full max-w-xl bg-white/80 backdrop-blur-md border border-green-100 rounded-2xl lg:rounded-[2rem] p-4 lg:p-6 shadow-xl shadow-green-900/5">

            <div className="flex items-center gap-2 mb-4 text-green-700">
                <MdCalendarMonth size={20} />
                <h3 className="font-bold text-xs lg:text-sm uppercase tracking-wider">Cronograma de Inscripción</h3>
            </div>

            {/* Grid de Fechas: Más compacto */}
            <div className="grid grid-cols-1 sm:grid-cols-7 items-center gap-2 bg-gray-50/50 p-4 rounded-xl border border-dashed border-gray-200">
                <div className="col-span-3 text-center">
                    <p className="text-[10px] uppercase text-gray-400 font-bold">Inicia el</p>
                    <span className="text-lg lg:text-xl font-black text-gray-800">
                        {formatearFecha(config?.fechas_control?.inicio_inscripcion)}
                    </span>
                </div>

                <div className="hidden sm:col-span-1 sm:flex justify-center italic text-gray-300 text-xs font-bold">AL</div>

                <div className="col-span-3 text-center">
                    <p className="text-[10px] uppercase text-gray-400 font-bold">Finaliza el</p>
                    <span className="text-lg lg:text-xl font-black text-gray-800">
                        {formatearFecha(config?.fechas_control?.fin_inscripcion)}
                    </span>
                </div>
            </div>

            {/* Alerta: Texto más pequeño en laptop */}
            <div className="mt-4 flex items-start gap-3 p-3 bg-emerald-50/50 rounded-lg border border-emerald-100">
                <MdNotificationsActive className="text-emerald-600 shrink-0" size={18} />
                <p className="text-xs lg:text-sm text-emerald-800 leading-tight">
                    Mantente atento a nuestras <strong>redes sociales</strong>. Puedes conocer más acerca del proceso {" "}
                    <strong><a href="https://www.epgunprg.edu.pe/admision-epg" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                        aquí
                    </a></strong>
                </p>
            </div>
        </div>
    </div>
);

export default VistaPreinscripcion;
