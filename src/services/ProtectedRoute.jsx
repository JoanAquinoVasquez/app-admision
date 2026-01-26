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

        const logoutDueToInactivity = () => {
            logout(
                "Por seguridad, tu sesión se cerró automáticamente por inactividad."
            );
        };

        const resetTimer = () => {
            clearTimeout(inactivityTimer);
            inactivityTimer = setTimeout(logoutDueToInactivity, 45 * 60 * 1000); // 45 min
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
