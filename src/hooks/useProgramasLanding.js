import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import axios from '../axios';

/**
 * Optimized hook for landing pages - fetches only necessary fields
 * Much faster than useProgramas since it doesn't load full relations
 */
export const useProgramasLanding = (gradoId) => {
    const [programas, setProgramas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProgramas = async () => {
            try {
                setLoading(true);
                setError(null);

                // Call optimized endpoint
                const response = await axios.get('/programas-landing');
                const data = Array.isArray(response.data) ? response.data : (response.data.data || []);

                // Filter by grado_id if provided
                const filtered = gradoId
                    ? data.filter(p => Number(p.grado_id) === Number(gradoId))
                    : data;

                setProgramas(filtered);
            } catch (err) {
                setError(err.message);
                toast.error('Error al cargar programas');
            } finally {
                setLoading(false);
            }
        };

        fetchProgramas();
    }, [gradoId]);

    return {
        programas,
        loading,
        error,
    };
};
