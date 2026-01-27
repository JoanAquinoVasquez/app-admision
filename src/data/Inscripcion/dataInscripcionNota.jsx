import { useState, useEffect, useCallback } from "react";
import axios from "../../axios";

export default function useInscripcioNota() {
    const [inscripcioNota, setInscripcionNota] = useState([]);

    const fetchInscripcionNota = useCallback(async () => {
        try {
            const response = await axios.get("/inscripcion-nota");
            // Aseguramos que siempre sea un array
            setInscripcionNota(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Error al cargar los datos de inscripción:", error);
            setInscripcionNota([]); // En caso de error, mantener array vacío
        }
    }, []);

    useEffect(() => {
        fetchInscripcionNota();
    }, [fetchInscripcionNota]);

    return { inscripcioNota, fetchInscripcionNota };
}
