import { useEffect, useState, useCallback } from "react";
import axios from "../../axios";

export default function useProgramaDocente() {
    const [programaDocente, setProgramaDocente] = useState([]);
    const [loading, setLoading] = useState(true); // Estado para cargar programas
    const [error, setError] = useState(null);

    const fetchProgramaDocente = useCallback(async () => {
        try {
            // Si hay token, realizar la solicitud
            const response = await axios.get("/docente-programas", {
                withCredentials: true, // Asegúrate de enviar las cookies
            });
            setProgramaDocente(response.data.data);
            setLoading(false);
        } catch (error) {
            setError("Error al cargar los Programas Docente.");
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProgramaDocente();
    }, [fetchProgramaDocente]);

    return { programaDocente, loading, error, fetchProgramaDocente };
}
