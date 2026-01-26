import axios from '../../axios';

/**
 * API Service for Programa endpoints
 * Centralizes all API calls related to programas
 */
class ProgramaApiService {
    /**
     * Get all programas
     */
    async getAll(params = {}) {
        const response = await axios.get('/programas', { params });
        return response.data;
    }

    /**
     * Get programas by grado
     */
    async getByGrado(gradoId) {
        const response = await axios.get('/programas', {
            params: { grado_id: gradoId },
        });
        return response.data;
    }

    /**
     * Get active programas
     */
    async getActive() {
        const response = await axios.get('/programas', {
            params: { estado: 1 },
        });
        return response.data;
    }

    /**
     * Get programas with inscripciones count
     */
    async getWithInscriptions() {
        const response = await axios.get('/programas/with-inscripciones');
        return response.data;
    }
}

export default new ProgramaApiService();
