import { useState, useCallback } from "react";
import { ubicacionApi } from "../services/api";

// Caché global para provincias (por departamento)
const globalProvinciasCache = new Map();

/**
 * Hook para manejar datos de provincias
 * Usa la capa de API centralizada con caché global por departamento
 */
export default function useProvincias() {
    const [provincias, setProvincias] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchProvincias = useCallback(async (departamentoId, force = false) => {
        if (!departamentoId) {
            setProvincias([]);
            return;
        }

        // Si ya está en caché y no es forzado, usar caché
        if (!force && globalProvinciasCache.has(departamentoId)) {
            setProvincias(globalProvinciasCache.get(departamentoId));
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const data = await ubicacionApi.getProvincias(departamentoId);
            const provinciasData = data.map((provincia) => ({
                nombre: provincia.nombre,
                id: provincia.id,
            }));

            // Guardar en caché global
            globalProvinciasCache.set(departamentoId, provinciasData);
            setProvincias(provinciasData);
        } catch (err) {
            console.error("Error al cargar las provincias:", err);
            setError(err.message || "Error al cargar las provincias");
            setProvincias([]);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        provincias,
        fetchProvincias,
        setProvincias,
        loading,
        error
    };
}
