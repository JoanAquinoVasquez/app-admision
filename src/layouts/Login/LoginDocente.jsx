import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    Divider
} from "@heroui/react";
import { toast } from "react-hot-toast";
import { Eye, EyeOff, Lock, Mail, Info } from "lucide-react";
import Fondo from "../Fondo/Fondo";
import { admissionConfig } from "../../config/admission";
import logoWithTextImage_1 from "../../assets/Isotipos/isotipo_color_epg.webp";
import isotipo_color_epg from "../../assets/Isotipos/isotipo_color_epg.webp";
import axios from "../../axios";
import { useDocente } from "../../services/UserContextDocente";

function LoginDocente() {
    const navigate = useNavigate();
    const location = useLocation();
    const { setDocenteData } = useDocente();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [logoutMessage, setLogoutMessage] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (location.state && location.state.logoutMessage) {
            const msg = location.state.logoutMessage;
            if (msg === "Sesión cerrada correctamente") {
                toast.success(msg);
            } else {
                setLogoutMessage(msg);
            }
            // Limpiar el estado para evitar que el mensaje vuelva a aparecer al recargar
            navigate(location.pathname, { replace: true });
        }
    }, [location, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.post("/docente-login", { email, password });

            if (data.success && data.docente) {
                // Use docente data from login response
                setDocenteData(data.docente);
                toast.success("Bienvenido, estimado docente");
                navigate("/docente/inicio");
            } else {
                toast.error("Error al iniciar sesión");
            }
        } catch (error) {
            const errorMsg = error.response?.data?.error || "Credenciales incorrectas.";
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Fondo>

            {/* Contenedor Blindado contra Scroll */}
            <div className="h-[90dvh] w-full flex items-center justify-center p-4 overflow-hidden">

                <div className="bg-white/95 backdrop-blur-md rounded-[2.5rem] shadow-2xl w-full max-w-[420px] p-8 flex flex-col items-center border border-gray-100 animate-in fade-in zoom-in duration-500">

                    {/* Header: Logo y Periodo */}
                    <div className="w-full flex justify-between items-center mb-6">
                        <img
                            src={logoWithTextImage_1}
                            alt="Logo EPG"
                            className="w-32 h-auto"
                        />
                        <div className="bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                            <span className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">
                                Admisión {admissionConfig.cronograma.periodo}
                            </span>
                        </div>
                    </div>

                    <Divider className="mb-6 opacity-50" />

                    {/* Títulos */}
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-black text-slate-800">
                            Portal Docente
                        </h2>
                        <p className="text-slate-500 text-xs mt-1">
                            Ingrese sus credenciales para acceder al sistema
                        </p>
                    </div>

                    {/* Formulario */}
                    <form onSubmit={handleLogin} className="w-full flex flex-col">
                        {/* Contenedor con espacio controlado para evitar colisiones de labels */}
                        <div className="flex flex-col gap-8 w-full mb-8">
                            <Input
                                label="Correo Electrónico"
                                placeholder="ejemplo@correo.com"
                                variant="bordered"
                                labelPlacement="outside"
                                startContent={<Mail size={18} className="text-slate-400 shrink-0" />}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                isRequired
                                fullWidth
                                autoComplete="email"
                                classNames={{
                                    label: "text-slate-700 font-semibold pb-1", // Asegura espacio bajo la label
                                    inputWrapper: "h-12 border-1 hover:border-primary focus-within:!border-primary transition-colors",
                                    mainWrapper: "h-fit" // Evita que el contenedor crezca infinitamente
                                }}
                            />

                            <Input
                                label="Contraseña"
                                placeholder="••••••••"
                                variant="bordered"
                                labelPlacement="outside"
                                startContent={<Lock size={18} className="text-slate-400 shrink-0" />}
                                endContent={
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="focus:outline-none p-1 hover:bg-slate-100 rounded-full transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff size={20} className="text-slate-400" />
                                        ) : (
                                            <Eye size={20} className="text-slate-400" />
                                        )}
                                    </button>
                                }
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                isRequired
                                fullWidth
                                autoComplete="current-password"
                                classNames={{
                                    label: "text-slate-700 font-semibold pb-1",
                                    inputWrapper: "h-12 border-1 hover:border-primary focus-within:!border-primary transition-colors",
                                    mainWrapper: "h-fit"
                                }}
                            />
                        </div>

                        <Button
                            type="submit"
                            color="primary"
                            className="w-full h-12 text-md font-bold rounded-xl shadow-lg shadow-blue-100 transition-all active:scale-95"
                            isLoading={loading}
                        >
                            {loading ? "Verificando..." : "Acceder al Portal"}
                        </Button>
                    </form>

                    {/* Footer de Ayuda */}
                    <div className="mt-8 flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
                        <Info size={14} />
                        <span className="text-[11px] font-medium">Si necesita ayuda, contacte con Soporte.</span>
                    </div>
                </div>
            </div>

            {/* Modal de Mensajes (Inactividad) */}
            <Modal
                isOpen={!!logoutMessage}
                onClose={() => setLogoutMessage("")}
                backdrop="blur"
                placement="center"
            >
                <ModalContent className="rounded-[2rem] p-4">
                    <ModalHeader className="flex flex-col items-center gap-2">
                        <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center">
                            <img src={isotipo_color_epg} alt="Aviso" className="w-8" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800">
                            {logoutMessage.includes("inactividad") ? "Sesión Expirada" : "Aviso de Sesión"}
                        </h2>
                    </ModalHeader>
                    <ModalBody className="text-center">
                        <p className="text-slate-600 text-sm leading-relaxed">
                            {logoutMessage || "Por seguridad, tu sesión se ha cerrado automáticamente debido a la inactividad."}
                        </p>
                    </ModalBody>
                    <ModalFooter className="flex flex-col">
                        <Button
                            color="primary"
                            className="w-full font-bold h-12 rounded-xl"
                            onPress={() => setLogoutMessage("")}
                        >
                            Entendido, iniciar sesión
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Fondo>
    );
}

export default LoginDocente;