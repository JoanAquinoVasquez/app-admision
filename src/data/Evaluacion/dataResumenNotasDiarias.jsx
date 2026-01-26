import { useEffect, useState, useCallback } from "react";
import axios from "../../axios";

export default function useResumenNotasDiarias() {
    const [resumenNotasDiarias, setResumenNotasDiarias] = useState([]);

    const fetchResumenNotasDiarias = useCallback(async () => {
        try {
            const response = await axios.get("/notas-cv-diarias", {});
            setResumenNotasDiarias(response.data.data);
        } catch (error) {
            console.error("Error al cargar los datos:", error);
        }
    }, []);
    useEffect(() => {
        fetchResumenNotasDiarias();
    }, [fetchResumenNotasDiarias]);

    return { resumenNotasDiarias, fetchResumenNotasDiarias };
}
