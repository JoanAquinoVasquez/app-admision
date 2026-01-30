import { useEffect, useState, useCallback } from "react";
import axios from "../axios";

export default function useBitacora() {
    const [bitacora, setBitacora] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBitacora = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get("/bitacora", {});
            setBitacora(response.data.data);
        } catch (error) {
            console.error("Error al cargar los bitacora:", error);
        } finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        fetchBitacora();
    }, [fetchBitacora]);

    return { bitacora, loading, fetchBitacora };
}
