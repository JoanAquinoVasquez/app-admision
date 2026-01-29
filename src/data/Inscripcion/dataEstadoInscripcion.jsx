import { useEffect } from "react";
import useDashboardQuery from "../../hooks/useDashboardQuery";

export default function useEstadoInscripcion() {
    const { data: estadoInscripcion, loading, refresh: fetchEstadoInscripcion } =
        useDashboardQuery("/estado-inscripcion");

    return { estadoInscripcion, loading, fetchEstadoInscripcion };
}
