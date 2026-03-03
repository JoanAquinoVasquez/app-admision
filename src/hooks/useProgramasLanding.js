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
        const controller = new AbortController();

        const fetchProgramas = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await axios.get('/programas-landing', {
                    signal: controller.signal
                });
                const data = Array.isArray(response.data) ? response.data : (response.data.data || []);

                const filtered = gradoId
                    ? data.filter(p => Number(p.grado_id) === Number(gradoId))
                    : data;

                if (!controller.signal.aborted) {
                    setProgramas(filtered);
                }
            } catch (err) {
                if (err.name === 'CanceledError' || err.code === 'ERR_CANCELED' || err.message === 'canceled') {
                    return; // Silenciar la cancelación (cambio rápido de vista)
                }

                if (!controller.signal.aborted) {
                    setError(err.message);
                    toast.error('Error al cargar programas');
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        fetchProgramas();

        return () => controller.abort();
    }, [gradoId]);

    return {
        programas,
        loading,
        error,
    };
};
