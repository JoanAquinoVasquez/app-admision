import axios from 'axios';

/**
 * Cliente API centralizado con configuración base
 * Maneja automáticamente la estructura de respuesta del backend
 */
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/admision-epg/api',
    withCredentials: true, // Importante para enviar cookies de sesión
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    timeout: 60000 // 60 segundos
});

/**
 * Interceptor de respuestas
 * Extrae automáticamente response.data.data del wrapper del backend
 */
apiClient.interceptors.response.use(
    (response) => {
        // El backend devuelve: { success: true, message: '...', data: [...] }
        // Extraemos directamente el 'data' para simplificar el uso
        if (response.data && response.data.data !== undefined) {
            return response.data.data;
        }
        return response.data;
    },
    (error) => {
        // Manejo centralizado de errores
        console.error('API Error:', error);

        // Extraer mensaje de error del backend si existe
        const errorMessage = error.response?.data?.message || error.message || 'Error en la petición';

        // Re-lanzar con mensaje mejorado
        return Promise.reject({
            message: errorMessage,
            status: error.response?.status,
            data: error.response?.data
        });
    }
);

/**
 * Interceptor de peticiones (opcional)
 * Aquí se pueden agregar tokens de autenticación, etc.
 */
apiClient.interceptors.request.use(
    (config) => {
        // Ejemplo: Agregar token si existe
        // const token = localStorage.getItem('token');
        // if (token) {
        //     config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;
