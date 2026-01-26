import { useState, useEffect, useCallback } from "react";
import axios from "../../axios";

export default function useInscripcionInhabilitada() {
    const [inscripcionesInhabilitadas, setInscripcionesInhabilitadas] = useState([]);

    const fetchInscripcionesInhabilitadas = useCallback(async () => {
        try {
            const response = await axios.get("/inscripciones-inhabilitadas");
            setInscripcionesInhabilitadas(response.data.data); // Guardamos los datos sin transformarlos
        } catch (error) {
            console.error("Error al cargar los datos de inscripción:", error);
        }
    }, []);

    useEffect(() => {
        fetchInscripcionesInhabilitadas();
    }, [fetchInscripcionesInhabilitadas]);

    return { inscripcionesInhabilitadas, fetchInscripcionesInhabilitadas };
}
