import { useEffect, useState, useCallback } from "react";
import axios from "../../axios";

export default function useResumenGeneral() {
    const [resumenGeneral, setResumenGeneral] = useState(null);

    const fetchResumenGeneral = useCallback(async () => {
        try {
            const response = await axios.get("/resumen-general", {});
            setResumenGeneral(response.data);
        } catch (error) {
            console.error("Error al cargar el resumen general:", error);
        }
    }, []);

    useEffect(() => {
        fetchResumenGeneral();
    }, [fetchResumenGeneral]);

    return { resumenGeneral, fetchResumenGeneral };
}
