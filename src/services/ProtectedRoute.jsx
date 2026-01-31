import { Navigate } from "react-router-dom";
import { useUser } from "../services/UserContext";
import NotAuthorizated from "../pages/NotAuthorizated/NotAuthorizated";
import { Spinner } from "@heroui/react";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { userData, logout, loading } = useUser();

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
