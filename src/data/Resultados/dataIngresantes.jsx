import { useState, useEffect, useCallback } from "react";
import axios from "../../axios";

const useDataIngresantes = () => {
    const [ingresantes, setIngresantes] = useState([]);

    const fetchIngresantes = useCallback(async () => {
        try {
            const response = await axios.get("/resultados-ingresantes");
            setIngresantes(response.data);
        } catch (err) {
            console.error("Error al cargar los datos de ingresantes:", err);
        }
    }, []);

    useEffect(() => {
        fetchIngresantes();
    }, [fetchIngresantes]);

    return {
        ingresantes,
        refetch: fetchIngresantes, // puedes llamarlo desde cualquier componente
    };
};

export default useDataIngresantes;
