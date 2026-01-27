import { useState, useEffect, useCallback } from "react";
import axios from "../../axios";

export default function useInscripcion() {
    const [inscripciones, setInscripciones] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchInscripciones = useCallback(async () => {
        try {
            const response = await axios.get("/inscripcion");
            // Aseguramos que siempre sea un array
            setInscripciones(Array.isArray(response.data.data) ? response.data.data : []);
        } catch (error) {
            console.error("Error al cargar los datos de inscripción:", error);
            setInscripciones([]); // En caso de error, mantener array vacío
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchInscripciones();
    }, [fetchInscripciones]);

    return { inscripciones, fetchInscripciones, loading };
}
