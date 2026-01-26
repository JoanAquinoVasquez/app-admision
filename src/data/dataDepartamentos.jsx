import { useEffect, useState, useCallback } from "react";
import { ubicacionApi } from "../services/api";

// Caché global para departamentos
let globalDepartamentosCache = null;

/**
 * Hook para manejar datos de departamentos
 * Usa la capa de API centralizada con caché global
 */
export default function useDepartamentos() {
    const [departamentos, setDepartamentos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchDepartamentos = useCallback(async (force = false) => {
        // Si ya está en caché y no es forzado, usar caché
        if (!force && globalDepartamentosCache) {
            setDepartamentos(globalDepartamentosCache);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const data = await ubicacionApi.getDepartamentos();
            const departamentosData = data.map((departamento) => ({
                nombre: departamento.nombre,
                id: departamento.id,
            }));

            // Guardar en caché global
            globalDepartamentosCache = departamentosData;
            setDepartamentos(departamentosData);
        } catch (err) {
            console.error("Error al cargar los departamentos:", err);
            setError(err.message || "Error al cargar los departamentos");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // Si ya está en caché, usar caché
        if (globalDepartamentosCache) {
            setDepartamentos(globalDepartamentosCache);
        } else {
            fetchDepartamentos();
        }
    }, [fetchDepartamentos]);

    return { departamentos, loading, error, fetchDepartamentos };
}
