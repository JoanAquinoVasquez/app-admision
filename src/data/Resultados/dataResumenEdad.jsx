import { useEffect, useState, useCallback } from "react";
import axios from "../../axios";

export default function useResumenEdad() {
    const [resumenEdad, setResumenEdad] = useState([]);

    const fetchResumenEdad = useCallback(async () => {
        try {
            const response = await axios.get("/resumen-edad", {});
            setResumenEdad(response.data);
        } catch (error) {
            console.error("Error al cargar el resumen de edad:", error);
        }
    }, []);

    useEffect(() => {
        fetchResumenEdad();
    }, [fetchResumenEdad]);

    return { resumenEdad, fetchResumenEdad };
}
