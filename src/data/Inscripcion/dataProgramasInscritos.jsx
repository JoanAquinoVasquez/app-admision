import { useEffect, useState, useCallback } from "react";
import axios from "../../axios";

export default function useProgramaInscritos() {
    const [programasInscritos, setProgramasInscritos] = useState([]);

    const fetchProgramasInscritos = useCallback(async () => {
        try {
            const response = await axios.get("/programas-inscritos", {});
            const programasInscritosData = response.data.map(
                (programasInscrito) => ({
                    grado: programasInscrito.grado,
                    facultad_nombre: programasInscrito.facultad_nombre,
                    facultad_sigleas: programasInscrito.facultad_siglas,
                    programa: programasInscrito.programa,
                    vacantes: programasInscrito.vacantes,
                    inscritos: programasInscrito.inscritos,
                })
            );
            setProgramasInscritos(programasInscritosData);
        } catch (error) {
            console.error("Error al cargar los Programas Inscritos:", error);
        }
    }, []);
    useEffect(() => {
        fetchProgramasInscritos();
    }, [fetchProgramasInscritos]);

    return { programasInscritos, fetchProgramasInscritos };
}
