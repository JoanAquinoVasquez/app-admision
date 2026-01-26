import { useState, useEffect, useCallback } from "react";
import axios from "../../axios";

export default function usePreInscripcion() {
    const [preInscripciones, setPreInscripciones] = useState([]);

    const fetchPreInscripciones = useCallback(async () => {
        try {
            const response = await axios.get("/pre-inscripcion");
            // Transformar los datos en un formato más claro y con nombres de campos
            setPreInscripciones(response.data.data);
        } catch (error) {
            console.error(
                "Error al cargar los datos de preinscripción:",
                error
            );
        }
    }, []);

    useEffect(() => {
        fetchPreInscripciones();
    }, [fetchPreInscripciones]);

    return { preInscripciones, fetchPreInscripciones };
}
