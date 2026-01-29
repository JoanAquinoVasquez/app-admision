import { useState, useEffect, useCallback } from "react";
import axios from "../axios";

// Cache global simple para persistir datos entre montajes de componentes
const globalCache = new Map();

/**
 * Hook genérico para consultas con patrón Stale-While-Revalidate (SWR)
 * @param {string} url - El endpoint de la API
 * @param {any} initialData - Valor inicial si no hay nada en cache
 * @returns {object} { data, loading, refresh }
 */
export default function useDashboardQuery(url, initialData = []) {
    const [data, setData] = useState(globalCache.get(url) || initialData);
    const [loading, setLoading] = useState(!globalCache.has(url));

    const fetchData = useCallback(async (isSilent = false) => {
        if (!isSilent) setLoading(true);
        try {
            const response = await axios.get(url);
            const newData = response.data.data;

            // Solo actualizamos si los datos son diferentes (opcional, pero ayuda a evitar re-renders)
            globalCache.set(url, newData);
            setData(newData);
        } catch (error) {
            console.error(`Error fetching ${url}:`, error);
        } finally {
            setLoading(false);
        }
    }, [url]);

    useEffect(() => {
        // Al montar, siempre intentamos actualizar en segundo plano
        // Si ya tenemos datos en cache, el usuario los ve al instante
        fetchData(globalCache.has(url));
    }, [fetchData]);

    return { data, loading, refresh: fetchData };
}
