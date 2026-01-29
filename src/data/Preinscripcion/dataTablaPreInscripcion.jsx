import useDashboardQuery from "../../hooks/useDashboardQuery";

export default function useResumenTablePreInscripcion() {
    const { data: tablePreInscripcion, loading, refresh: fetchTablePreInscripcion } =
        useDashboardQuery("/resumen-tabla-preinscripcion");

    return { tablePreInscripcion, loading, fetchTablePreInscripcion };
}
