import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axios";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const checkAuth = async () => {
        try {
            const { data } = await axios.get("/check-auth", {
                withCredentials: true,
            });

            // The API returns { success: true, data: { authenticated: true, ... } }
            const authData = data.data || data;

            if (authData.authenticated) {
                // Handle both 'roles' array and single 'role' string
                let roles = authData.roles || [];
                if (!roles.length && authData.role) {
                    roles = [authData.role];
                }

                setUserData({
                    ...authData.user,
                    roles: roles,
                });
            } else {
                setUserData(null);
            }
        } catch (error) {
            setUserData(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const logout = async (message = "Sesión cerrada correctamente") => {
        try {
            await axios.post("/logout", null, { withCredentials: true });
        } catch (error) {
            console.error("Error cerrando sesión:", error);
        } finally {
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