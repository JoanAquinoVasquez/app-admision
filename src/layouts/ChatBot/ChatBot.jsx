import { useEffect, useState } from "react";
import ChatBot from "../../assets/Isotipos/chatbot.png";

const Chatbot = () => {
    const [loaded, setLoaded] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Detectar si es un dispositivo móvil
        const checkIfMobile = () => {
            const userAgent = navigator.userAgent.toLowerCase();
            return /android|iphone|ipad|ipod/i.test(userAgent);
        };

        setIsMobile(checkIfMobile());

        // Cargar el script de Dialogflow si no está presente
        const scriptSrc =
            "https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1";
        if (!document.querySelector(`script[src="${scriptSrc}"]`)) {
            const script = document.createElement("script");
            script.src = scriptSrc;
            script.async = true;
            script.onload = () => setLoaded(true);
            document.body.appendChild(script);
        } else {
            setLoaded(true);
        }
    }, []);

    useEffect(() => {
        if (!loaded) return;

        const checkMessengerLoaded = () => {
            const dfMessenger = document.querySelector("df-messenger");
            if (dfMessenger && typeof dfMessenger.showMinChat === "function") {
                // Asegurar que el chat inicie minimizado
                dfMessenger.setAttribute("expand", "false");

                // Si no es móvil, abrirlo minimizado después de que se cargue
                if (!isMobile) {
                    setTimeout(() => {
                        dfMessenger.showMinChat();
                    }, 500);
                }
            } else {
                setTimeout(checkMessengerLoaded, 200); // Reintentar cada 200ms
            }
        };

        // Esperar que el chatbot se cargue completamente
        setTimeout(checkMessengerLoaded, 500);
    }, [loaded, isMobile]);

    return (
        <>
            {loaded && (
                <>
                    <style>
                        {`
                            df-messenger {
                                --df-messenger-send-icon: #ffffff;
                                --df-messenger-button-titlebar-color: #006daf;
                            }
                        `}
                    </style>
                    <df-messenger
                        chat-title="Asistente Virtual"
                        agent-id="60053988-9e29-4b3e-b453-cd4032105813"
                        language-code="es"
                        intent="Welcome"
                        expand="false" //  Siempre inicia minimizado
                        chat-icon={ChatBot}
                    ></df-messenger>
                </>
            )}
        </>
    );
};

export default Chatbot;
