import { useEffect, useState, useCallback } from "react";
import axios from "../../axios";

export default function useResumenPreInscripcion() {
    const [resumenPreInscripcion, setResumenPreInscripcion] = useState([]);

    const fetchResumenPreInscripcion = useCallback(async () => {
        try {
            const response = await axios.get("/resumen-preinscripcion", {});
            setResumenPreInscripcion(response.data.data);
        } catch (error) {
            console.error("Error al cargar los datos:", error);
        }
    }, []);
    useEffect(() => {
        fetchResumenPreInscripcion();
    }, [fetchResumenPreInscripcion]);

    return { resumenPreInscripcion, fetchResumenPreInscripcion };
}
