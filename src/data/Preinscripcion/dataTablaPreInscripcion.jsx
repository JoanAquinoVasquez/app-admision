import { useState, useEffect, useCallback } from "react";
import axios from "../../axios";

export default function useResumenTablePreInscripcion() {
    const [tablePreInscripcion, setTablePreInscripcion] = useState([]);

    const fetchTablePreInscripcion = useCallback(async () => {
        try {
            const response = await axios.get("/resumen-tabla-preinscripcion");
            setTablePreInscripcion(response.data.data); // Guardamos los datos sin transformarlos
        } catch (error) {
            console.error("Error al cargar los datos de inscripción:", error);
        }
    }, []);

    useEffect(() => {
        fetchTablePreInscripcion();
    }, [fetchTablePreInscripcion]);

    return { tablePreInscripcion, fetchTablePreInscripcion };
}
