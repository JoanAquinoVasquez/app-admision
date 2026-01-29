import useDashboardQuery from "../../hooks/useDashboardQuery";

export default function useResumenEdad() {
    const { data: resumenEdad, loading, refresh: fetchResumenEdad } =
        useDashboardQuery("/resumen-edad");

    return { resumenEdad, loading, fetchResumenEdad };
}
