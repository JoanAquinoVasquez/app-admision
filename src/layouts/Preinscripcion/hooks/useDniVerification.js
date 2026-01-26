import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { dniApi } from '../../../services/api';

// Caché global que persiste entre renderizados y montajes del componente
const globalDniCache = new Map();
const globalToastShown = new Set();

/**
 * Hook para verificación de DNI en RENIEC
 * Maneja solo la búsqueda de datos en RENIEC
 * Evita búsquedas repetidas del mismo DNI y guarda datos en caché global
 */
export const useDniVerification = (numIden, tipoDoc) => {
    const [dniData, setDniData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    /**
     * Buscar DNI en RENIEC
     */
    const searchDni = useCallback(async (dni, force = false, showToast = true) => {
        if (!dni || dni.length !== 8) {
            return;
        }

        // Si ya se buscó este DNI y no es forzado, restaurar del caché
        if (!force && globalDniCache.has(dni)) {
            const cachedData = globalDniCache.get(dni);
            setDniData(cachedData);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const reniecData = await dniApi.search(dni);

            if (reniecData && reniecData.nombres) {
                const dniDataObj = {
                    nombres: reniecData.nombres || '',
                    apellidoPaterno: reniecData.apellidoPaterno || '',
                    apellidoMaterno: reniecData.apellidoMaterno || ''
                };

                setDniData(dniDataObj);

                // Guardar en caché global
                globalDniCache.set(dni, dniDataObj);

                // Solo mostrar toast si no se ha mostrado antes y showToast es true
                if (showToast && !globalToastShown.has(dni)) {
                    toast.success('DNI encontrado en RENIEC');
                    globalToastShown.add(dni);
                }
            } else {
                setDniData(null);
                setError('No se encontraron datos para este DNI');
            }
        } catch (err) {
            console.error('Error buscando DNI:', err);
            setError(err.message || 'Error al buscar DNI');
            setDniData(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Efecto para buscar automáticamente cuando se completa el DNI
     * Solo busca si no se ha buscado antes, o restaura del caché
     */
    useEffect(() => {
        if (tipoDoc === 'DNI' && numIden && numIden.length === 8) {
            // Si está en caché global, restaurar sin toast
            if (globalDniCache.has(numIden)) {
                const cachedData = globalDniCache.get(numIden);
                setDniData(cachedData);
            } else {
                // Solo buscar si no está en caché
                searchDni(numIden, false, true);
            }
        } else if (!numIden || numIden.length < 8) {
            // Limpiar datos si el DNI es incompleto
            setDniData(null);
        }
    }, [numIden, tipoDoc, searchDni]);

    /**
     * Resetear el estado y limpiar caché de búsquedas
     */
    const resetDni = useCallback(() => {
        setDniData(null);
        setError(null);
        globalDniCache.clear();
        globalToastShown.clear();
    }, []);

    return {
        dniData,
        isLoading,
        error,
        searchDni,
        resetDni
    };
};
