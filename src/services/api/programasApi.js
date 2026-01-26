import apiClient from './apiClient';

/**
 * API para operaciones relacionadas con programas académicos
 */
export const programasApi = {
    /**
     * Obtener todos los programas
     * @returns {Promise<Array>} Lista de programas
     */
    getAll: async () => {
        return await apiClient.get('/programas');
    },

    /**
     * Obtener un programa por ID
     * @param {number} id - ID del programa
     * @returns {Promise<Object>} Programa encontrado
     */
    getById: async (id) => {
        return await apiClient.get(`/programas/${id}`);
    },

    /**
     * Obtener programas filtrados por grado
     * @param {number} gradoId - ID del grado
     * @returns {Promise<Array>} Lista de programas del grado
     */
    getByGrado: async (gradoId) => {
        return await apiClient.get(`/programas?grado_id=${gradoId}`);
    }
};
