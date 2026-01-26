import { useState, useEffect, useCallback } from "react";
import axios from "../../axios";

export default function useInscripcion() {
    const [inscripciones, setInscripciones] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchInscripciones = useCallback(async () => {
        try {
            const response = await axios.get("/inscripcion");
            setInscripciones(response.data.data); // Guardamos los datos sin transformarlos
        } catch (error) {
            console.error("Error al cargar los datos de inscripción:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchInscripciones();
    }, [fetchInscripciones]);

    return { inscripciones, fetchInscripciones, loading };
}
