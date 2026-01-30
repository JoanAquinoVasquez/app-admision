import { Navigate } from "react-router-dom";
import { useDocente } from "../services/UserContextDocente";
import { Spinner } from "@nextui-org/react";

const ProtectedRoute = ({ children }) => {
    const { docenteData, logout, loading } = useDocente();

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
