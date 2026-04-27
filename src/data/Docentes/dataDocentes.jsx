import { useState, useEffect, useCallback } from "react";
import axios from "../../axios";

/**
 * Hook para gestionar la data de docentes desde el frontend
 */
const useDocentes = () => {
    const [docentes, setDocentes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDocentes = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get("/docentes");
            // La respuesta viene con { success: true, data: [...] } por el BaseController
            setDocentes(response.data.data || []);
            setError(null);
        } catch (err) {
            console.error("Error fetching docentes:", err);
            setError(err.response?.data?.message || "Error al cargar la lista de docentes");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDocentes();
    }, [fetchDocentes]);

    return {
        docentes,
        loading,
        error,
        refetch: fetchDocentes
    };
};

export default useDocentes;
