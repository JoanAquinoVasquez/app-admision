import { useState, useEffect, useCallback } from 'react';
import { inscripcionApi } from '../services/api';
import { toast } from 'react-hot-toast';

/**
 * Custom hook for managing inscripciones
 * Separates data fetching logic from UI components
 */
export const useInscripciones = () => {
    const [inscripciones, setInscripciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchInscripciones = useCallback(async (params = {}) => {
        try {
            setLoading(true);
            setError(null);
            const data = await inscripcionApi.getAll(params);
            setInscripciones(data);
        } catch (err) {
            setError(err.message);
            toast.error('Error al cargar inscripciones');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchInscripciones();
    }, [fetchInscripciones]);

    const createInscripcion = useCallback(async (data) => {
        try {
            setLoading(true);
            const result = await inscripcionApi.create(data);
            toast.success('Inscripción creada exitosamente');
            await fetchInscripciones();
            return result;
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error al crear inscripción');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [fetchInscripciones]);

    const updateInscripcion = useCallback(async (id, data) => {
        try {
            setLoading(true);
            const result = await inscripcionApi.update(id, data);
            toast.success('Inscripción actualizada exitosamente');
            await fetchInscripciones();
            return result;
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error al actualizar inscripción');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [fetchInscripciones]);

    const validateDigital = useCallback(async (id, tipoVal, observacion = '') => {
        try {
            setLoading(true);
            const result = await inscripcionApi.validateDigital(id, tipoVal, observacion);
            toast.success(tipoVal === 1 ? 'Inscripción validada' : 'Inscripción observada');
            await fetchInscripciones();
            return result;
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error al validar');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [fetchInscripciones]);

    const validatePhysical = useCallback(async (id) => {
        try {
            setLoading(true);
            const result = await inscripcionApi.validatePhysical(id);
            toast.success('Validación física exitosa');
            await fetchInscripciones();
            return result;
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error al validar físicamente');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [fetchInscripciones]);

    return {
        inscripciones,
        loading,
        error,
        fetchInscripciones,
        createInscripcion,
        updateInscripcion,
        validateDigital,
        validatePhysical,
    };
};
