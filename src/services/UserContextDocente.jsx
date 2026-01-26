import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // <-- te faltaba importar esto
import axios from "../axios";

const DocenteContext = createContext();

export const DocenteProvider = ({ children }) => {
    const [docenteData, setDocenteData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingSession, setLoadingSession] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const { data } = await axios.get("/check-auth-docente", {
                    withCredentials: true,
                });

                if (data.authenticated) {
                    setDocenteData({
                        ...data.docente,
                    });
                } else {
                    setDocenteData(null);
                }
            } catch (error) {
                setDocenteData(null);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const logout = async (message = "Sesión cerrada correctamente") => {
        try {
            await axios.post("/docente-logout", null, {
                withCredentials: true,
            });
        } catch (error) {
            console.error("Error cerrando sesión:", error);
        } finally {
            setLoadingSession(false);
            navigate("/iniciar-sesion", {
                state: message ? { logoutMessage: message } : {},
            });
        }
    };

    return (
        <DocenteContext.Provider
            value={{ docenteData, setDocenteData, loadingSession, loading, logout }}
        >
            {children}
        </DocenteContext.Provider>
    );
};

export const useDocente = () => useContext(DocenteContext);
