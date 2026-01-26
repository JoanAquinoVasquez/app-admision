import { useEffect, useState, useCallback } from "react";
import axios from "../../axios";

export default function useProgramasHabilitados() {
    const [programasHabilitados, setProgramasHabilitados] = useState([]);
    const [filteredProgramasHabilitados, setFilteredProgramasHabilitados] = useState([]);

    const fetchProgramasHabilitados = useCallback(async () => {
        try {
            const response = await axios.get("/programas-habilitados");
            setProgramasHabilitados(response.data.data); // Mantén todos los programasHabilitados
        } catch (error) {
            console.error("Error al cargar los programas Habilitados:", error);
        }
    }, []);

    const filterByGrado = useCallback(
        (gradoId) => {
            if (!gradoId) {
                setFilteredProgramasHabilitados([]); // Si no hay grado, limpiar programasHabilitados
            } else {
                const filtered = programasHabilitados.filter(
                    (programa) => programa.grado_id == gradoId
                );
                setFilteredProgramasHabilitados(filtered);
            }
        },
        [programasHabilitados]
    );

    useEffect(() => {
        fetchProgramasHabilitados();
    }, [fetchProgramasHabilitados]);

    return { programasHabilitados, filteredProgramasHabilitados, filterByGrado, fetchProgramasHabilitados };
}
