import axios from '../../axios';

/**
 * API Service for User/Authentication endpoints
 */
class UserApiService {
    /**
     * Login user
     */
    async login(credentials) {
        const response = await axios.post('/login', credentials);
        return response.data;
    }

    /**
     * Logout user
     */
    async logout() {
        const response = await axios.post('/logout');
        return response.data;
    }

    /**
     * Get current user
     */
    async getCurrentUser() {
        const response = await axios.get('/user');
        return response.data;
    }

    /**
     * Get all users
     */
    async getAll(params = {}) {
        const response = await axios.get('/users', { params });
        return response.data;
    }

    /**
     * Create user
     */
    async create(userData) {
        const response = await axios.post('/users', userData);
        return response.data;
    }

    /**
     * Update user
     */
    async update(userId, userData) {
        const response = await axios.post(`/users/${userId}`, userData);
        return response.data;
    }

    /**
     * Toggle user status
     */
    async toggleStatus(userId, estado) {
        const response = await axios.post(`/users/${userId}`, { estado });
        return response.data;
    }
}

export default new UserApiService();
