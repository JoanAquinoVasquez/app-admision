import { useEffect, useState, useCallback } from "react";
import axios from "../../axios";

export default function useIngresantesPrograma() {
    const [ingresantesPrograma, setIngresantesPrograma] = useState([]);

    const fetchIngresantesPrograma = useCallback(async () => {
        try {
            const response = await axios.get("/ingresantes-programa");
            setIngresantesPrograma(response.data);
        } catch (error) {
            console.error("Error al cargar ingresantesPrograma:", error);
        }
    }, []);

    useEffect(() => {
        fetchIngresantesPrograma(); // ⬅️ se llama automáticamente al montar
    }, [fetchIngresantesPrograma]);

    return { ingresantesPrograma, fetchIngresantesPrograma };
}
