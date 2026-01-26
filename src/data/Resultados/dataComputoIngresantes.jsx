import { useEffect, useState, useCallback } from "react";
import axios from "../../axios";

export default function useComputoIngresantes() {
    const [computoIngresantes, setComputoIngresantes] = useState([]);

    const fetchComputoIngresantes = useCallback(async () => {
        try {
            const response = await axios.get("/computo-ingresantes", {});
            setComputoIngresantes(response.data);
        } catch (error) {
            console.error("Error al cargar los cómputos de ingresantes:", error);
        }
    }, []);

    useEffect(() => {
        fetchComputoIngresantes();
    }, [fetchComputoIngresantes]);

    return { computoIngresantes, fetchComputoIngresantes };
}
