import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axios";

const UserContext = createContext();
const PROCESS_STORAGE_PREFIX = "admission-process:v1:";

const readSavedProcessId = (userId) => {
    try {
        return window.localStorage.getItem(`${PROCESS_STORAGE_PREFIX}${userId}`);
    } catch {
        return null;
    }
};

const saveProcessId = (userId, processId) => {
    try {
        window.localStorage.setItem(`${PROCESS_STORAGE_PREFIX}${userId}`, String(processId));
    } catch {
        // The API header remains the source of truth for the current session.
    }
};

export const UserProvider = ({ children }) => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [hasChecked, setHasChecked] = useState(false);
    const [admissionProcesses, setAdmissionProcesses] = useState([]);
    const [selectedAdmissionProcess, setSelectedAdmissionProcess] = useState(null);
    const [unifiedAdmissionEnabled, setUnifiedAdmissionEnabled] = useState(false);

    const loadAdmissionProcesses = async (userId) => {
        delete axios.defaults.headers.common["X-Admission-Process"];
        const { data: response } = await axios.get("/procesos-admision", {
            withCredentials: true,
        });
        const data = response?.data;
        const processes = data?.procesos || [];
        const isUnified = Boolean(data?.sistema_unificado);

        setAdmissionProcesses(processes);
        setUnifiedAdmissionEnabled(isUnified);

        if (!isUnified || processes.length === 0) {
            setSelectedAdmissionProcess(null);
            delete axios.defaults.headers.common["X-Admission-Process"];
            return;
        }

        const savedId = readSavedProcessId(userId);
        const selected = processes.find((process) => String(process.id) === savedId)
            || processes.find((process) => process.estado === "activo")
            || processes.find((process) => process.estado === "preparacion")
            || processes[0];

        setSelectedAdmissionProcess(selected);
        axios.defaults.headers.common["X-Admission-Process"] = String(selected.id);
    };

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
                try {
                    await loadAdmissionProcesses(authData.user.id);
                } catch {
                    setAdmissionProcesses([]);
                    setSelectedAdmissionProcess(null);
                    setUnifiedAdmissionEnabled(false);
                    delete axios.defaults.headers.common["X-Admission-Process"];
                }
                setHasChecked(true);
                return true;
            } else {
                setUserData(null);
                setAdmissionProcesses([]);
                setSelectedAdmissionProcess(null);
                setUnifiedAdmissionEnabled(false);
                delete axios.defaults.headers.common["X-Admission-Process"];
                setHasChecked(true);
                return false;
            }
        } catch (error) {
            setUserData(null);
            setAdmissionProcesses([]);
            setSelectedAdmissionProcess(null);
            setUnifiedAdmissionEnabled(false);
            delete axios.defaults.headers.common["X-Admission-Process"];
            setHasChecked(true);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const selectAdmissionProcess = (processId) => {
        const selected = admissionProcesses.find((process) => String(process.id) === String(processId));
        if (!selected || !userData?.id || !unifiedAdmissionEnabled) return;

        saveProcessId(userData.id, selected.id);
        axios.defaults.headers.common["X-Admission-Process"] = String(selected.id);
        setSelectedAdmissionProcess(selected);
        window.location.reload();
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
            setAdmissionProcesses([]);
            setSelectedAdmissionProcess(null);
            setUnifiedAdmissionEnabled(false);
            delete axios.defaults.headers.common["X-Admission-Process"];
            navigate("/login", {
                state: message ? { logoutMessage: message } : {},
            });
        }
    };

    return (
        <UserContext.Provider value={{
            userData,
            loading,
            logout,
            refreshUser: checkAuth,
            admissionProcesses,
            selectedAdmissionProcess,
            unifiedAdmissionEnabled,
            selectAdmissionProcess,
        }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
