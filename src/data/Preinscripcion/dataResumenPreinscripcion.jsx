import useDashboardQuery from "../../hooks/useDashboardQuery";

export default function useResumenPreInscripcion() {
    const { data: resumenPreInscripcion, loading, refresh: fetchResumenPreInscripcion } =
        useDashboardQuery("/resumen-preinscripcion");

    return { resumenPreInscripcion, loading, fetchResumenPreInscripcion };
}
