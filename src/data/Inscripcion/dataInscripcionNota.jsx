import { useState, useEffect, useCallback } from "react";
import axios from "../../axios";

export default function useInscripcioNota() {
    const [inscripcioNota, setInscripcionNota] = useState([]);

    const fetchInscripcionNota = useCallback(async () => {
        try {
            const response = await axios.get("/inscripcion-nota");
            setInscripcionNota(response.data); // Guardamos los datos sin transformarlos
        } catch (error) {
            console.error("Error al cargar los datos de inscripción:", error);
        }
    }, []);

    useEffect(() => {
        fetchInscripcionNota();
    }, [fetchInscripcionNota]);

    return { inscripcioNota, fetchInscripcionNota };
}
