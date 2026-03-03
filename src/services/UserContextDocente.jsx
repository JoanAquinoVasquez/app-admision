import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // <-- te faltaba importar esto
import axios from "../axios";

const DocenteContext = createContext();

export const DocenteProvider = ({ children }) => {
    const [docenteData, setDocenteData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [hasChecked, setHasChecked] = useState(false);

    const checkAuth = async (force = false) => {
        if (hasChecked && !force && docenteData) return true;
        if (hasChecked && loading && !force) return false;

        setLoading(true);
        try {
            const { data } = await axios.get("/check-auth-docente", {
                withCredentials: true,
            });

            if (data.authenticated) {
                setDocenteData({
                    ...data.docente,
                });
                setHasChecked(true);
                return true;
            } else {
                setDocenteData(null);
                setHasChecked(true);
                return false;
            }
        } catch (error) {
            setDocenteData(null);
            setHasChecked(true);
            return false;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!hasChecked) {
            checkAuth();
        }
    }, []);

    const logout = async (message = "Sesión cerrada correctamente") => {
        try {
            await axios.post("/docente-logout", null, {
                withCredentials: true,
            });
        } catch (error) {
            console.error("Error cerrando sesión:", error);
        } finally {
            setHasChecked(false);
            setDocenteData(null);
            navigate("/iniciar-sesion", {
                state: message ? { logoutMessage: message } : {},
            });
        }
    };

    return (
        <DocenteContext.Provider
            value={{ docenteData, setDocenteData, loading, logout, refreshDocente: checkAuth }}
        >
            {children}
        </DocenteContext.Provider>
    );
};

export const useDocente = () => useContext(DocenteContext);
