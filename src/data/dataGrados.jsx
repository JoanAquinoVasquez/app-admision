import { useEffect, useState, useCallback } from "react";
import { gradosApi } from "../services/api";

/**
 * Hook para manejar datos de grados académicos
 * Usa la capa de API centralizada
 */
export default function useGrados() {
    const [grados, setGrados] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchGrados = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await gradosApi.getAll();
            const gradosData = data.map((grado) => ({
                nombre: grado.nombre,
                id: grado.id,
            }));
            setGrados(gradosData);
        } catch (err) {
            console.error("Error al cargar los grados:", err);
            setError(err.message || "Error al cargar los grados");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchGrados();
    }, [fetchGrados]);

    return { grados, loading, error, fetchGrados };
}
