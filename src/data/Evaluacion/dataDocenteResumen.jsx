import { useEffect, useState, useCallback } from "react";
import axios from "../../axios";

export default function useDocenteResumen() {
    const [docenteResumen, setDocenteResumen] = useState([]);

    const fetchDocenteResumen = useCallback(async () => {
        try {
            const response = await axios.get("/resumen-docente-notas");
            setDocenteResumen(response.data.data);
        } catch (error) {
            console.error("Error al cargar el resumen de docentes:", error);
        }
    }, []);
    useEffect(() => {
        fetchDocenteResumen();
    }, [fetchDocenteResumen]);

    return { docenteResumen, fetchDocenteResumen };
}
