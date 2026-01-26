import axios from '../../axios';

/**
 * API Service for Postulante endpoints
 * Centralizes all API calls related to postulantes
 */
class PostulanteApiService {
    /**
     * Get all postulantes
     */
    async getAll(params = {}) {
        const response = await axios.get('/postulantes', { params });
        return response.data;
    }

    /**
     * Get a single postulante by ID
     */
    async getById(id) {
        const response = await axios.get(`/postulante/${id}`);
        return response.data;
    }

    /**
     * Update a postulante
     */
    async update(id, data) {
        const response = await axios.post(`/postulante/${id}`, data, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    }

    /**
     * Generate constancia PDF
     */
    async generateConstancia(postulanteId) {
        const response = await axios.get(`/postulante/constancia/${postulanteId}`, {
            responseType: 'blob',
        });
        return response;
    }

    /**
     * Generate carnet (single or multiple)
     */
    async generateCarnet(postulanteIds) {
        const ids = Array.isArray(postulanteIds) ? postulanteIds : [postulanteIds];
        const response = await axios.post('postulante-carnet', { ids });
        return response.data;
    }
}

export default new PostulanteApiService();
