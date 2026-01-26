import { useState, useEffect, useCallback } from "react";
import axios from "../../axios";

export default function useGraphicInscripcion() {
    const [graphicInscripcion, setGraphicInscripcion] = useState([]);

    const fetchGraphicInscripcion = useCallback(async () => {
        try {
            const response = await axios.get("/resumen-inscripcion-grafico");
            setGraphicInscripcion(response.data.data); // Guardamos los datos sin transformarlos
        } catch (error) {
            console.error(
                "Error al cargar los datos del grafico de inscripción:",
                error
            );
        }
    }, []);

    useEffect(() => {
        fetchGraphicInscripcion();
    }, [fetchGraphicInscripcion]);

    return { graphicInscripcion, fetchGraphicInscripcion };
}
