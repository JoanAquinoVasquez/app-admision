import axios from 'axios';
import { toast } from 'react-hot-toast';

// Configure axios instance
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// Also make axios available globally for backward compatibility
window.axios = axios;

// Utilidad para saber si estamos en modo docente
function isDocenteRoute() {
  return window.location.pathname.includes('/docente');
}

// Variables de control para refresh único y cola de peticiones
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });

  failedQueue = [];
};

// Interceptor para manejar errores 401
axios.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Evitar intentar renovar en login o ya en refresh
    if (
      originalRequest.url.includes('/docente-login') ||
      originalRequest.url.includes('/login') ||
      originalRequest.url.includes('/refresh-docente') ||
      originalRequest.url.includes('/refresh-user')
    ) {
      return Promise.reject(error);
    }

    // Si la respuesta es 401
    if (error.response?.status === 401) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // Si ya hay un refresh en proceso, se encola
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: () => resolve(axios(originalRequest)),
            reject
          });
        });
      }

      isRefreshing = true;
      const refreshEndpoint = isDocenteRoute() ? '/refresh-docente' : '/refresh-user';

      try {
        await axios.post(refreshEndpoint);
        processQueue(null); // Reintenta todas las solicitudes en cola
        return axios(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        console.error('Fallo al renovar token:', refreshError);

        const redirectPath = isDocenteRoute()
          ? '/admision-epg/iniciar-sesion'
          : '/admision-epg/login';

        window.location.href = redirectPath;

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axios;
