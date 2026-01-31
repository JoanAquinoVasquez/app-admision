import { useEffect, useState, useCallback } from "react";
import axios from "../../axios";

export default function useProgramasPosibles(id) {
    const [gradosPosibles, setGradosPosibles] = useState([]);
    const [programasPosibles, setProgramasPosibles] = useState([]);

    const fetchProgramasPosibles = useCallback(async () => {
        if (!id) {
            return;
        }

        try {
            const response = await axios.get(`/programas-posibles/${id}`);
           
            // API returns data in response.data.data structure
            const apiData = response.data.data || response.data;
            setGradosPosibles(apiData.grados_posibles || []);
            setProgramasPosibles(apiData.programas_posibles || []);
           
        } catch (error) {
            console.error("Error al cargar los datos:", error);
        }
    }, [id]);

    useEffect(() => {
        fetchProgramasPosibles();
    }, [fetchProgramasPosibles]);

    return { gradosPosibles, programasPosibles, fetchProgramasPosibles };
}
