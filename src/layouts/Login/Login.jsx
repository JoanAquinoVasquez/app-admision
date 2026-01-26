import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Divider, Spinner } from "@nextui-org/react";
import { toast } from "react-hot-toast";
import { useUser } from "../../services/UserContext";
import Fondo from "../Fondo/Fondo";
import logoWithTextImage from "../../assets/Isotipos/isotipo_color_epg.webp";
import isotipo from "../../assets/Isotipos/isotipo_color_epg.webp";
import axios from "../../axios";
import { admissionConfig } from "../../config/admission";

function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const config = admissionConfig.cronograma;
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [logoutMessage, setLogoutMessage] = useState("");
    const { refreshUser } = useUser();

    useEffect(() => {
        if (location.state?.logoutMessage) {
            setLogoutMessage(location.state.logoutMessage);
            navigate(location.pathname, { replace: true });
        }
    }, [location, navigate]);

    const handleGoogleLoginSuccess = async (credentialResponse) => {
        setIsAuthenticating(true);
        try {
            await axios.post("/google-login", { credential: credentialResponse.credential }, { withCredentials: true });
            // Wait a moment for cookies to be set by the browser
            await new Promise(resolve => setTimeout(resolve, 100));
            await refreshUser();
            toast.success("Bienvenido");
            navigate("/auth/inicio");
        } catch (error) {
            toast.error("Error al iniciar sesión.");
            setIsAuthenticating(false);
        }
    };

    return (
        <Fondo>
            <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
                {/* h-[100dvh] usa la altura dinámica real del dispositivo (ajusta barras de navegador) */}
                <div className="h-[90dvh] w-full flex items-center justify-center overflow-hidden p-2 sm:p-4">

                    {/* Card con altura máxima basada en el viewport de la laptop (max-h-[90vh]) */}
                    <div className="bg-white/95 backdrop-blur-md rounded-[2rem] shadow-2xl w-full max-w-[380px] max-h-[95vh] flex flex-col items-center p-6 border border-gray-100 transition-all">

                        {/* 1. Logo - Redimensionado para pantallas pequeñas */}
                        <div className="flex-shrink-0 mb-4 text-center">
                            <img
                                src={logoWithTextImage}
                                alt="Logo EPG"
                                className="w-32 sm:w-44 mx-auto"
                            />
                            <div className="mt-2 inline-block bg-blue-50 px-3 py-0.5 rounded-full border border-blue-100">
                                <span className="text-blue-700 text-[10px] font-bold uppercase tracking-tighter">
                                    Admisión {config.periodo}
                                </span>
                            </div>
                        </div>

                        <Divider className="shrink-0 mb-4 opacity-40" />

                        {/* 2. Cuerpo - Usamos flex-grow para que ocupe el espacio central */}
                        <div className="flex-grow flex flex-col items-center justify-center w-full text-center space-y-4">
                            <div>
                                <h3 className="text-lg lg:text-xl font-extrabold text-gray-800">
                                    ¡Bienvenido!
                                </h3>
                                <p className="text-gray-500 text-[11px] sm:text-xs leading-tight">
                                    Inicia sesión con tu cuenta institucional <br className="hidden sm:block" /> para continuar con tu proceso.
                                </p>
                            </div>

                            <div className="w-full flex justify-center py-2">
                                {isAuthenticating ? (
                                    <div className="flex flex-col items-center py-2">
                                        <Spinner size="sm" />
                                        <p className="text-[10px] text-gray-400 mt-2 font-medium">Validando...</p>
                                    </div>
                                ) : (
                                    <div className="scale-90 sm:scale-100 transform transition-transform">
                                        <GoogleLogin
                                            onSuccess={handleGoogleLoginSuccess}
                                            onError={() => toast.error("Error al conectar")}
                                            shape="pill"
                                            size="large"
                                            text="signin_with"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 3. Footer - Pegado abajo pero sin padding excesivo */}
                        <div className="shrink-0 mt-6 pt-4 border-t border-gray-50 w-full text-center">
                            <button className="text-[10px] text-gray-400 hover:text-blue-600 transition-colors">
                                ¿Problemas de acceso? Contacta soporte
                            </button>
                        </div>
                    </div>
                </div>

                {/* Modal (No afecta el scroll de la página principal) */}
                <Modal isOpen={!!logoutMessage} onClose={() => setLogoutMessage("")} backdrop="blur" placement="center">
                    <ModalContent className="rounded-3xl">
                        <ModalHeader className="flex flex-col items-center pt-6">
                            <div className="w-32 h-32 rounded-full flex items-center justify-center mb-1">
                                <img src={isotipo} alt="Logo" className="w-32 opacity-80" />
                            </div>
                            <span className="font-bold">Sesión Finalizada</span>
                        </ModalHeader>
                        <ModalBody className="text-center text-sm text-gray-600 pb-6">
                            {logoutMessage}
                        </ModalBody>
                        <ModalFooter className="flex-col pb-6">
                            <Button color="primary" fullWidth className="font-bold rounded-xl" onPress={() => setLogoutMessage("")}>
                                Entendido
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </GoogleOAuthProvider>
        </Fondo>
    );
}

export default Login;