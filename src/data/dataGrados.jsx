import useDashboardQuery from "../hooks/useDashboardQuery";

/**
 * Hook para manejar datos de grados académicos
 * Usa el patrón de cache global para mayor velocidad
 */
export default function useGrados() {
    const { data: grados, loading, refresh: fetchGrados } =
        useDashboardQuery("/grados");

    return { grados, loading, fetchGrados };
}
