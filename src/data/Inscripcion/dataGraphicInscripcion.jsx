import useDashboardQuery from "../../hooks/useDashboardQuery";

export default function useGraphicInscripcion() {
    const { data: graphicInscripcion, loading, refresh: fetchGraphicInscripcion } =
        useDashboardQuery("/resumen-inscripcion-grafico");

    return { graphicInscripcion, loading, fetchGraphicInscripcion };
}
