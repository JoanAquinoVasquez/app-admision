import { Navigate } from "react-router-dom";
import { useDocente } from "../services/UserContextDocente";
import Spinner from "../components/Spinner/Spinner";

const ProtectedRoute = ({ children }) => {
    const { docenteData, logout, loading } = useDocente();

    if (loading) {
        return <Spinner fullScreen={true} label="Cargando..." />;
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
