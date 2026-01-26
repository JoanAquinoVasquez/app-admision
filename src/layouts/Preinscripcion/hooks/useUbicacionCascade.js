import { useState, useEffect, useCallback } from 'react';
import useDepartamentos from '../../../data/dataDepartamentos';
import useProvincias from '../../../data/dataProvincias';
import useDistritos from '../../../data/dataDistritos';

/**
 * Hook para manejar la cascada de ubicación (Departamento -> Provincia -> Distrito)
 * Centraliza la lógica de carga dependiente de ubicaciones
 */
export const useUbicacionCascade = (departamentoId, provinciaId) => {
    const { departamentos, loading: loadingDepartamentos } = useDepartamentos();
    const {
        provincias,
        fetchProvincias,
        setProvincias,
        loading: loadingProvincias
    } = useProvincias();
    const {
        distritos,
        fetchDistritos,
        setDistritos,
        loading: loadingDistritos
    } = useDistritos();

    /**
     * Cargar provincias cuando cambia el departamento
     */
    useEffect(() => {
        if (departamentoId) {
            fetchProvincias(departamentoId);
        } else {
            setProvincias([]);
        }
    }, [departamentoId, fetchProvincias, setProvincias]);

    /**
     * Cargar distritos cuando cambia la provincia
     */
    useEffect(() => {
        if (provinciaId) {
            fetchDistritos(provinciaId);
        } else {
            setDistritos([]);
        }
    }, [provinciaId, fetchDistritos, setDistritos]);

    /**
     * Obtener el nombre de un departamento por ID
     */
    const getDepartamentoNombre = useCallback((id) => {
        const departamento = departamentos.find(d => d.id === id);
        return departamento?.nombre || '';
    }, [departamentos]);

    /**
     * Obtener el nombre de una provincia por ID
     */
    const getProvinciaNombre = useCallback((id) => {
        const provincia = provincias.find(p => p.id === id);
        return provincia?.nombre || '';
    }, [provincias]);

    /**
     * Obtener el nombre de un distrito por ID
     */
    const getDistritoNombre = useCallback((id) => {
        const distrito = distritos.find(d => d.id === id);
        return distrito?.nombre || '';
    }, [distritos]);

    /**
     * Resetear provincias y distritos
     */
    const resetCascade = useCallback(() => {
        setProvincias([]);
        setDistritos([]);
    }, [setProvincias, setDistritos]);

    return {
        // Datos
        departamentos,
        provincias,
        distritos,

        // Estados de carga
        loading: loadingDepartamentos || loadingProvincias || loadingDistritos,
        loadingDepartamentos,
        loadingProvincias,
        loadingDistritos,

        // Métodos
        getDepartamentoNombre,
        getProvinciaNombre,
        getDistritoNombre,
        resetCascade
    };
};
