import { useEffect, useState, useCallback } from "react";
import axios from "../../axios";

export default function useResumenInscripcion() {
    const [resumenInscripcion, setResumenInscripcion] = useState([]);

    const fetchResumenInscripcion = useCallback(async () => {
        try {
            const response = await axios.get("/resumen-inscripcion", {});
            setResumenInscripcion(response.data.data);
        } catch (error) {
            console.error("Error al cargar los datos:", error);
        }
    }, []);
    useEffect(() => {
        fetchResumenInscripcion();
    }, [fetchResumenInscripcion]);

    return { resumenInscripcion, fetchResumenInscripcion };
}
