import useDashboardQuery from "../../hooks/useDashboardQuery";

export default function useDocenteResumen() {
    const { data: docenteResumen, loading, refresh: fetchDocenteResumen } =
        useDashboardQuery("/resumen-docente-notas");

    return { docenteResumen, loading, fetchDocenteResumen };
}
