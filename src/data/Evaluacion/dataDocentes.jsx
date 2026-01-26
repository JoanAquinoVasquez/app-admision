import { useEffect, useState, useCallback } from "react";
import axios from "../../axios";

export default function usedocentes() {
    const [docentes, setDocentes] = useState([]);

    const fetchDocentes = useCallback(async () => {
        try {
            const response = await axios.get("/docentes", {});
            setDocentes(response.data.data);
        } catch (error) {
            console.error("Error al cargar los docentes:", error);
        }
    }, []);
    useEffect(() => {
        fetchDocentes();
    }, [fetchDocentes]);

    return { docentes, fetchDocentes };
}
