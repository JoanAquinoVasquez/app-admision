const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();

/**
 * El backend declara apiPrefix vacío; la URL puede incluir un subdirectorio de
 * despliegue, pero no se debe agregar /api automáticamente.
 */
export function getApiBaseUrl(fallback) {
    return (configuredApiUrl || fallback).replace(/\/+$/, '');
}
