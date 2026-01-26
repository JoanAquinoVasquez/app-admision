import apiClient from './apiClient';

/**
 * API para operaciones relacionadas con preinscripciones
 */
export const preinscripcionApi = {
    /**
     * Crear una nueva preinscripción
     * @param {Object} data - Datos de la preinscripción
     * @returns {Promise<Object>} Preinscripción creada
     */
    create: async (data) => {
        return await apiClient.post('/preinscripcion', data);
    },

    /**
     * Verificar si un número de identificación ya está preinscrito
     * @param {string} numIden - Número de identificación
     * @returns {Promise<Object>} Resultado de la verificación
     */
    checkExists: async (numIden) => {
        return await apiClient.post('/pre-inscripcion/registrado', { num_iden: numIden });
    },

    /**
     * Obtener preinscripción por número de identificación
     * @param {string} numIden - Número de identificación
     * @returns {Promise<Object>} Preinscripción encontrada
     */
    getByNumIden: async (numIden) => {
        return await apiClient.get(`/preinscripcion/${numIden}`);
    },

    /**
     * Obtener todas las preinscripciones
     * @returns {Promise<Array>} Lista de preinscripciones
     */
    getAll: async () => {
        return await apiClient.get('/preinscripcion');
    }
};

