import useDashboardQuery from "../../hooks/useDashboardQuery";

export default function usePreInscripcion() {
    const { data: preInscripciones, loading, refresh: fetchPreInscripcion } =
        useDashboardQuery("/pre-inscripcion");

    return { preInscripciones, loading, fetchPreInscripcion };
}
