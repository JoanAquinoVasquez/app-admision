import { useEffect, useState, useCallback } from "react";
import axios from "../../axios";

export default function useHistogramaNotas() {
    const [histogramaNotas, setHistogramaNotas] = useState([]);

    const fetchHistogramaNotas = useCallback(async () => {
        try {
            const response = await axios.get("/histograma-notas", {});
            setHistogramaNotas(response.data);
        } catch (error) {
            console.error("Error al cargar las notas:", error);
        }
    }, []);

    useEffect(() => {
        fetchHistogramaNotas();
    }, [fetchHistogramaNotas]);

    return { histogramaNotas, fetchHistogramaNotas };
}
