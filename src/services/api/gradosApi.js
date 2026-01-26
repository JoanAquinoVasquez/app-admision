import apiClient from './apiClient';

/**
 * API para operaciones relacionadas con grados académicos
 */
export const gradosApi = {
    /**
     * Obtener todos los grados
     * @returns {Promise<Array>} Lista de grados
     */
    getAll: async () => {
        return await apiClient.get('/grados');
    },

    /**
     * Obtener un grado por ID
     * @param {number} id - ID del grado
     * @returns {Promise<Object>} Grado encontrado
     */
    getById: async (id) => {
        return await apiClient.get(`/grados/${id}`);
    }
};
