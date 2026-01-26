import { useState } from "react";
import { dniApi } from "../services/api";

/**
 * Hook para buscar información de DNI en RENIEC
 * Usa la capa de API centralizada
 */
export default function useBuscarDNI() {
    const [DNI, setDNI] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchDNI = async (dni) => {
        if (!dni || dni.length !== 8) {
            setDNI(null);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const data = await dniApi.search(dni);

            if (
                data &&
                data.nombres &&
                data.apellidoPaterno &&
                data.apellidoMaterno
            ) {
                const { nombres, apellidoPaterno, apellidoMaterno } = data;

                setDNI({
                    nombres: nombres || "",
                    apellidoPaterno: apellidoPaterno || "",
                    apellidoMaterno: apellidoMaterno || "",
                });
            } else {
                setDNI(null);
                setError("No se encontraron datos para este DNI");
            }
        } catch (err) {
            console.error("Error al buscar DNI:", err);
            setError(err.message || "Error al buscar DNI");
            setDNI(null);
        } finally {
            setLoading(false);
        }
    };

    return { DNI, fetchDNI, setDNI, loading, error };
}
