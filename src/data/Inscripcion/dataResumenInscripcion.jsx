import useDashboardQuery from "../../hooks/useDashboardQuery";

export default function useResumenInscripcion() {
    const { data: resumenInscripcion, loading, refresh: fetchResumenInscripcion } =
        useDashboardQuery("/resumen-inscripcion");

    return { resumenInscripcion, loading, fetchResumenInscripcion };
}
