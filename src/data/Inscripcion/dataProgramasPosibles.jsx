import { useEffect, useState, useCallback } from "react";
import axios from "../../axios";

export default function useProgramasPosibles(id) {
    const [gradosPosibles, setGradosPosibles] = useState([]);
    const [programasPosibles, setProgramasPosibles] = useState([]);

    const fetchProgramasPosibles = useCallback(async () => {
        if (!id) return; // Si no hay un id, no hacemos la llamada

        try {
            const response = await axios.get(`/programas-posibles/${id}`);
            setGradosPosibles(response.data.grados_posibles);
            setProgramasPosibles(response.data.programas_posibles);
        } catch (error) {
            console.error("Error al cargar los datos:", error);
        }
    }, [id]);

    useEffect(() => {
        fetchProgramasPosibles();
    }, [fetchProgramasPosibles]);

    return { gradosPosibles, programasPosibles, fetchProgramasPosibles };
}
