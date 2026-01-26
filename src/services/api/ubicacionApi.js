import apiClient from './apiClient';

/**
 * API para operaciones de ubicación geográfica (departamentos, provincias, distritos)
 */
export const ubicacionApi = {
    /**
     * Obtener todos los departamentos
     * @returns {Promise<Array>} Lista de departamentos
     */
    getDepartamentos: async () => {
        return await apiClient.get('/departamentos');
    },

    /**
     * Obtener provincias de un departamento
     * @param {number} departamentoId - ID del departamento
     * @returns {Promise<Array>} Lista de provincias
     */
    getProvincias: async (departamentoId) => {
        return await apiClient.get(`/provincias/${departamentoId}`);
    },

    /**
     * Obtener distritos de una provincia
     * @param {number} provinciaId - ID de la provincia
     * @returns {Promise<Array>} Lista de distritos
     */
    getDistritos: async (provinciaId) => {
        return await apiClient.get(`/distritos/${provinciaId}`);
    }
};
