import { useState, useEffect, useCallback } from "react";
import axios from "../../axios";

export default function useInscripcionInhabilitada() {
    const [inscripcionesInhabilitadas, setInscripcionesInhabilitadas] = useState([]);

    const fetchInscripcionesInhabilitadas = useCallback(async () => {
        try {
            const response = await axios.get("/inscripciones-inhabilitadas");
            // Aseguramos que siempre sea un array
            setInscripcionesInhabilitadas(Array.isArray(response.data.data) ? response.data.data : []);
        } catch (error) {
            console.error("Error al cargar los datos de inscripción:", error);
            setInscripcionesInhabilitadas([]); // En caso de error, mantener array vacío
        }
    }, []);

    useEffect(() => {
        fetchInscripcionesInhabilitadas();
    }, [fetchInscripcionesInhabilitadas]);

    return { inscripcionesInhabilitadas, fetchInscripcionesInhabilitadas };
}
