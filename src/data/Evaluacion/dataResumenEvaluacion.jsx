import useDashboardQuery from "../../hooks/useDashboardQuery";

export default function useResumenEvaluacion() {
    const { data: resumenEvaluacion, loading, refresh: fetchResumenEvaluacion } =
        useDashboardQuery("/resumen-evaluacion");

    return { resumenEvaluacion, loading, fetchResumenEvaluacion };
}
