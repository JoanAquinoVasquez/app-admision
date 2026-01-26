import axios from '../../axios';

/**
 * API Service for Inscripcion endpoints
 * Centralizes all API calls related to inscripciones
 */
class InscripcionApiService {
    /**
     * Get all inscripciones
     */
    async getAll(params = {}) {
        const response = await axios.get('/inscripcions', { params });
        return response.data;
    }

    /**
     * Get a single inscripcion by ID
     */
    async getById(id) {
        const response = await axios.get(`/inscripcion/${id}`);
        return response.data;
    }

    /**
     * Create a new inscripcion
     */
    async create(data) {
        const response = await axios.post('/inscripcions', data, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    }

    /**
     * Update an inscripcion
     */
    async update(id, data) {
        const response = await axios.post(`/inscripcion-update/${id}`, data, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    }

    /**
     * Validate digital inscription
     */
    async validateDigital(id, tipoVal, observacion = '') {
        const response = await axios.post('/inscripcion/val-digital', {
            id,
            tipoVal,
            observacion,
        });
        return response.data;
    }

    /**
     * Validate physical inscription
     */
    async validatePhysical(id) {
        const response = await axios.get(`/inscripcion/val-fisica/${id}`);
        return response.data;
    }

    /**
     * Get inscription summary
     */
    async getSummary() {
        const response = await axios.get('/inscripcion/resumen-inscripcion');
        return response.data;
    }

    /**
     * Get inscription status
     */
    async getStatus() {
        const response = await axios.get('/inscripcion/estado-inscripcion');
        return response.data;
    }

    /**
     * Generate reports
     */
    async generateReport(type, params = {}) {
        const endpoints = {
            Excel: '/reporte-inscripcion',
            'Reporte Diario': '/reporte-inscripcion-diario',
            'Facultad Excel': '/reporte-inscripcion-facultad',
            'Facultad PDF': '/reporte-inscripcion-facultad-pdf',
            'Top Programas': '/reporte-programas-top',
        };

        const url = endpoints[type];
        if (!url) {
            throw new Error(`Invalid report type: ${type}`);
        }

        const response = await axios.get(url, {
            params,
            responseType: 'blob',
        });

        return response;
    }
}

export default new InscripcionApiService();
