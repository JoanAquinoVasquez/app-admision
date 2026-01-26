import { useState, useCallback } from "react";
import { ubicacionApi } from "../services/api";

// Caché global para distritos (por provincia)
const globalDistritosCache = new Map();

/**
 * Hook para manejar datos de distritos
 * Usa la capa de API centralizada con caché global por provincia
 */
export default function useDistritos() {
    const [distritos, setDistritos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchDistritos = useCallback(async (provinciaId, force = false) => {
        if (!provinciaId) {
            setDistritos([]);
            return;
        }

        // Si ya está en caché y no es forzado, usar caché
        if (!force && globalDistritosCache.has(provinciaId)) {
            setDistritos(globalDistritosCache.get(provinciaId));
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const data = await ubicacionApi.getDistritos(provinciaId);
            const distritosData = data.map((distrito) => ({
                nombre: distrito.nombre,
                id: distrito.id,
            }));

            // Guardar en caché global
            globalDistritosCache.set(provinciaId, distritosData);
            setDistritos(distritosData);
        } catch (err) {
            console.error("Error al cargar los distritos:", err);
            setError(err.message || "Error al cargar los distritos");
            setDistritos([]);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        distritos,
        fetchDistritos,
        setDistritos,
        loading,
        error
    };
}
