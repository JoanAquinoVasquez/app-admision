import { useState, useEffect, useCallback } from 'react';
import { programaApi } from '../services/api';
import { toast } from 'react-hot-toast';

/**
 * Custom hook for managing programas
 */
export const useProgramas = (initialGradoId = null) => {
    const [programas, setProgramas] = useState([]);
    const [filteredProgramas, setFilteredProgramas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProgramas = useCallback(async (params = {}) => {
        try {
            setLoading(true);
            setError(null);
            const response = await programaApi.getAll(params);
            // Extract data array from API response structure
            const data = Array.isArray(response) ? response : (response.data || []);
            setProgramas(data);
            setFilteredProgramas(data);
        } catch (err) {
            setError(err.message);
            toast.error('Error al cargar programas');
        } finally {
            setLoading(false);
        }
    }, []);

    const filterByGrado = useCallback((gradoId) => {
        if (!gradoId || gradoId === 'all') {
            setFilteredProgramas(programas);
        } else {
            const filtered = programas.filter(
                (programa) => Number(programa.grado_id) === Number(gradoId)
            );
            setFilteredProgramas(filtered);
        }
    }, [programas]);

    useEffect(() => {
        fetchProgramas();
    }, [fetchProgramas]);

    useEffect(() => {
        if (initialGradoId) {
            filterByGrado(initialGradoId);
        }
    }, [initialGradoId, filterByGrado]);

    return {
        programas,
        filteredProgramas,
        loading,
        error,
        fetchProgramas,
        filterByGrado,
    };
};
