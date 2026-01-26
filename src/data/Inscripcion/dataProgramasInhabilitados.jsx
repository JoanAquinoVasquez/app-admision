import { useEffect, useState, useCallback } from "react";
import axios from "../../axios";

export default function useProgramasInhabilitados() {
    const [programasInhabilitados, setProgramasInhabilitados] = useState([]);

    const fetchProgramasInhabilitados = useCallback(async () => {
        try {
            const response = await axios.get("/programas-inhabilitados");
            setProgramasInhabilitados(response.data.data);
        } catch (error) {
            console.error(
                "Error al cargar los programas inhabilitados:",
                error
            );
        }
    }, []);

    useEffect(() => {
        fetchProgramasInhabilitados();
    }, [fetchProgramasInhabilitados]);

    return { programasInhabilitados, refetch: fetchProgramasInhabilitados };
}
