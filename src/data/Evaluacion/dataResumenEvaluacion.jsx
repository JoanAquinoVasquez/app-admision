import { useEffect, useState, useCallback } from "react";
import axios from "../../axios";

export default function useResumenEvaluacion() {
    const [resumenEvaluacion, setResumenEvaluacion] = useState([]);

    const fetchResumenEvaluacion = useCallback(async () => {
        try {
            const response = await axios.get("/resumen-evaluacion", {});
            setResumenEvaluacion(response.data.data);
        } catch (error) {
            console.error("Error al cargar los datos:", error);
        }
    }, []);
    useEffect(() => {
        fetchResumenEvaluacion();
    }, [fetchResumenEvaluacion]);

    return { resumenEvaluacion, fetchResumenEvaluacion };
}
