import { useEffect, useState, useCallback } from "react";
import axios from "../axios";

export default function useBitacora() {
    const [bitacora, setBitacora] = useState([]);

    const fetchBitacora = useCallback(async () => {
        try {
            const response = await axios.get("/bitacora", {});
            setBitacora(response.data.data);
        } catch (error) {
            console.error("Error al cargar los bitacora:", error);
        }
    }, []);
    useEffect(() => {
        fetchBitacora();
    }, [fetchBitacora]);

    return { bitacora, fetchBitacora };
}
