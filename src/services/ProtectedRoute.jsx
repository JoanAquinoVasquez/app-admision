import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../services/UserContext";
import NotAuthorizated from "../pages/NotAuthorizated/NotAuthorizated";
import { Spinner } from "@nextui-org/react";

let inactivityTimer;

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { userData, logout, loading } = useUser();

    useEffect(() => {
        if (!userData) return;

        // Clave para guardar la última actividad en localStorage
        const ACTIVITY_KEY = "lastActivityTime";
        const TIMEOUT_MS = 45 * 60 * 1000; // 45 minutos

        const logoutDueToInactivity = () => {
            logout(
                "Por seguridad, tu sesión se cerró automáticamente por inactividad."
            );
        };

        const checkInactivity = () => {
            const lastActivity = localStorage.getItem(ACTIVITY_KEY);
            const now = Date.now();

            if (lastActivity && now - parseInt(lastActivity, 10) > TIMEOUT_MS) {
                logoutDueToInactivity();
            }
        };

        const updateActivity = () => {
            const lastActivity = localStorage.getItem(ACTIVITY_KEY);
            const now = Date.now();

            // Si ya pasó el tiempo, cerramos sesión en lugar de renovar
            if (lastActivity && now - parseInt(lastActivity, 10) > TIMEOUT_MS) {
                logoutDueToInactivity();
                return;
            }

            localStorage.setItem(ACTIVITY_KEY, now.toString());
        };

        // Inicializar si no existe
        if (!localStorage.getItem(ACTIVITY_KEY)) {
            localStorage.setItem(ACTIVITY_KEY, Date.now().toString());
        } else {
            // Verificar al montar (por ejemplo, si recarga la página o vuelve de otra pestaña)
            checkInactivity();
        }

        // Intervalo para verificar periódicamente (útil si el tab está abierto pero inactivo)
        const intervalId = setInterval(checkInactivity, 60000); // Revisar cada minuto

        // Event listeners para actividad del usuario
        window.addEventListener("mousemove", updateActivity);
        window.addEventListener("keydown", updateActivity);
        window.addEventListener("scroll", updateActivity);
        window.addEventListener("click", updateActivity);

        return () => {
            clearInterval(intervalId);
            window.removeEventListener("mousemove", updateActivity);
            window.removeEventListener("keydown", updateActivity);
            window.removeEventListener("scroll", updateActivity);
            window.removeEventListener("click", updateActivity);
        };
    }, [userData, logout]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen w-screen bg-white">
                <Spinner />
            </div>
        );
    }

    if (!userData) {
        return (
            <Navigate
                to="/login"
                replace
                state={{
                    logoutMessage: "Debes iniciar sesión para continuar.",
                }}
            />
        );
    }

    if (
        allowedRoles.length > 0 &&
        !allowedRoles.some((role) => userData.roles?.includes(role))
    ) {
        return <NotAuthorizated />;
    }

    return children;
};

export default ProtectedRoute;
