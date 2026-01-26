import apiClient from './apiClient';

/**
 * API para consultas a servicios externos (RENIEC/DNI)
 */
export const dniApi = {
    /**
     * Buscar información de una persona por DNI
     * @param {string} dni - Número de DNI (8 dígitos)
     * @returns {Promise<Object>} Datos de la persona
     */
    search: async (dni) => {
        return await apiClient.post(`/consulta-dni`, { dni });
    }
};
