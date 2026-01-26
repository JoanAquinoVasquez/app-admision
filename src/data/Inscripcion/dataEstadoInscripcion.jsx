import { useEffect, useState, useCallback } from "react";
import axios from "../../axios";

export default function useEstadoInscripcion() {
    const [estadoInscripcion, setEstadoInscripcion] = useState([]);

    const fetchEstadoInscripcion = useCallback(async () => {
        try {
            const response = await axios.get("/estado-inscripcion", {});
            setEstadoInscripcion(response.data.data);
        } catch (error) {
            console.error("Error al cargar los estado inscripcion:", error);
        }
    }, []);
    useEffect(() => {
        fetchEstadoInscripcion();
    }, [fetchEstadoInscripcion]);

    return { estadoInscripcion, fetchEstadoInscripcion };
}
