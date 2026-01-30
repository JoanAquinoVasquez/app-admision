import { useState, useEffect, useCallback } from "react";
import axios from "../../axios";

const useDataIngresantes = () => {
    const [ingresantes, setIngresantes] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchIngresantes = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get("/resultados-ingresantes");
            // Aseguramos que siempre sea un array
            setIngresantes(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            console.error("Error al cargar los datos de ingresantes:", err);
            setIngresantes([]); // En caso de error, mantener array vacío
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchIngresantes();
    }, [fetchIngresantes]);

    return {
        ingresantes,
        refetch: fetchIngresantes,
        loading,
    };
};

export default useDataIngresantes;
