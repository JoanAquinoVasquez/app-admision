import useDashboardQuery from "../../hooks/useDashboardQuery";

export default function useHistogramaNotas() {
    const { data: histogramaNotas, loading, refresh: fetchHistogramaNotas } =
        useDashboardQuery("/histograma-notas");

    return { histogramaNotas, loading, fetchHistogramaNotas };
}
