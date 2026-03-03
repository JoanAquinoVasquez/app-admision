import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axios";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [hasChecked, setHasChecked] = useState(false);

    const checkAuth = async (force = false) => {
        // Si ya chequeamos y no estamos forzando, no volvemos a preguntar
        if (hasChecked && !force && userData) return true;

        // Evitar múltiples llamadas simultáneas solo si ya hemos chequeado una vez
        if (hasChecked && loading && !force) return false;

        setLoading(true);
        try {
            const { data: response } = await axios.get("/check-auth", {
                withCredentials: true,
            });

            // The API returns { success: true, data: { authenticated: true, ... } }
            // So 'response' is { success: true, message: "...", data: { authenticated: true, ... } }
            const authData = response.data;

            if (authData && authData.authenticated) {
                // Handle both 'roles' array and single 'role' string
                let roles = authData.roles || [];
                if (!roles.length && authData.role) {
                    roles = [authData.role];
                }

                setUserData({
                    ...authData.user,
                    roles: roles,
                });
                setHasChecked(true);
                return true;
            } else {
                setUserData(null);
                setHasChecked(true);
                return false;
            }
        } catch (error) {
            setUserData(null);
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
            await axios.post("/logout", null, { withCredentials: true });
        } catch (error) {
            console.error("Error cerrando sesión:", error);
        } finally {
            setHasChecked(false);
            setUserData(null);
            navigate("/login", {
                state: message ? { logoutMessage: message } : {},
            });
        }
    };

    return (
        <UserContext.Provider value={{ userData, loading, logout, refreshUser: checkAuth }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);