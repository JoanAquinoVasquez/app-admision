import useDashboardQuery from "../../hooks/useDashboardQuery";

export default function useResumenGeneral() {
    const { data: resumenGeneral, loading, refresh: fetchResumenGeneral } =
        useDashboardQuery("/resumen-general");

    return { resumenGeneral, loading, fetchResumenGeneral };
}
