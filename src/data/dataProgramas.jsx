import { useEffect, useState, useCallback } from "react";
import { programasApi } from "../services/api";

/**
 * Hook para manejar datos de programas académicos
 * Usa la capa de API centralizada
 */
export default function useProgramas() {
    const [programas, setProgramas] = useState([]);
    const [filteredProgramas, setFilteredProgramas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchProgramas = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await programasApi.getAll();
            setProgramas(data); // Mantén todos los programas
        } catch (err) {
            console.error("Error al cargar los programas:", err);
            setError(err.message || "Error al cargar los programas");
        } finally {
            setLoading(false);
        }
    }, []);

    const filterByGrado = useCallback((gradoId) => {
        if (!gradoId) {
            setFilteredProgramas([]); // Si no hay grado, limpiar programas
        } else {
            const filtered = programas.filter(
                (programa) => programa.grado_id == gradoId
            );
            setFilteredProgramas(filtered);
        }
    }, [programas]);

    useEffect(() => {
        fetchProgramas();
    }, [fetchProgramas]);

    return {
        programas,
        filteredProgramas,
        filterByGrado,
        fetchProgramas,
        loading,
        error
    };
}
