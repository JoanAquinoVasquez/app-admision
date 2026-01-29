import useDashboardQuery from "../../hooks/useDashboardQuery";

export default function useResumenNotasDiarias() {
    const { data: resumenNotasDiarias, loading, refresh: fetchResumenNotasDiarias } =
        useDashboardQuery("/notas-cv-diarias");

    return { resumenNotasDiarias, loading, fetchResumenNotasDiarias };
}
