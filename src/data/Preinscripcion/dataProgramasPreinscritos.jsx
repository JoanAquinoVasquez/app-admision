import { useEffect, useState, useCallback } from "react";
import axios from "../../axios";

export default function useProgramaPreinscritos() {
    const [programasPreinscritos, setProgramasPreinscritos] = useState([]);

    const fetchProgramasPreinscritos = useCallback(async () => {
        try {
            const response = await axios.get("/preinscritos-totales", {});
            setProgramasPreinscritos(response.data.data);
        } catch (error) {
            console.error("Error al cargar los Programas Preinscritos:", error);
        }
    }, []);
    useEffect(() => {
        fetchProgramasPreinscritos();
    }, [fetchProgramasPreinscritos]);

    return { programasPreinscritos, fetchProgramasPreinscritos };
}
