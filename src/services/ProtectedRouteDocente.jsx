import { useEffect } from "react";
import { Navigate } from "react-router-dom"; // 👈 Importar Navigate
import { useDocente } from "../services/UserContextDocente";
import { Spinner } from "@nextui-org/react";

let inactivityTimer;

const ProtectedRoute = ({ children }) => {
    const { docenteData, logout, loading } = useDocente();

    useEffect(() => {
        if (!docenteData) return;

        const logoutDueToInactivity = () => {
            logout(
                "Por seguridad, tu sesión se cerró automáticamente por inactividad."
            );
        };

        const resetTimer = () => {
            clearTimeout(inactivityTimer);
            inactivityTimer = setTimeout(
                logoutDueToInactivity,
                45 * 60 * 1000
            ); // 45 min
        };

        resetTimer();
        window.addEventListener("mousemove", resetTimer);
        window.addEventListener("keydown", resetTimer);
        window.addEventListener("scroll", resetTimer);

        return () => {
            clearTimeout(inactivityTimer);
            window.removeEventListener("mousemove", resetTimer);
            window.removeEventListener("keydown", resetTimer);
            window.removeEventListener("scroll", resetTimer);
        };
    }, [docenteData, logout]);

    if (loading) {
        return null;
    }

    if (!docenteData) {
        return (
            <Navigate
                to="/iniciar-sesion"
                replace
            />
        );
    }
    return children;
};

export default ProtectedRoute;
