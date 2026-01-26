import { useState, useCallback, useRef } from "react";
import { preinscripcionApi } from "../../services/api";

/**
 * Hook para verificar si un DNI ya está preinscrito
 * Refactorizado para usar la capa de API
 * Evita verificaciones repetidas del mismo DNI
 */
export default function usePreInscripcionRegistrado() {
    const [preInscripcion, setPreInscripcion] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // Referencia para rastrear DNIs ya verificados
    const verifiedDnis = useRef(new Set());

    const fetchPreInscripcion = useCallback(async (num_iden, force = false) => {
        try {
            if (!num_iden) {
                setError("DNI no proporcionado.");
                setPreInscripcion(null);
                return null;
            }

            // Si ya se verificó este DNI y no es forzado, no verificar de nuevo
            if (!force && verifiedDnis.current.has(num_iden)) {
                return;
            }

            setLoading(true);
            setError(null);

            const response = await preinscripcionApi.checkExists(num_iden);

            // Marcar este DNI como verificado
            verifiedDnis.current.add(num_iden);

            // response tiene: { exists: true/false, message: '...', data: {...} }
            if (response && response.exists) {
                // Ya está preinscrito
                const preInscripcionRegistrado = {
                    nombres: response.data.nombres,
                    ap_paterno: response.data.ap_paterno,
                    ap_materno: response.data.ap_materno,
                };
                setPreInscripcion(preInscripcionRegistrado);
                return preInscripcionRegistrado;
            } else {
                // No está preinscrito
                setPreInscripcion(null);
                return { notFound: true };
            }
        } catch (err) {
            const errorMessage = err.message || "Error al realizar la solicitud.";
            setError(errorMessage);
            setPreInscripcion(null);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Resetear el estado y limpiar caché
     */
    const resetVerification = useCallback(() => {
        setPreInscripcion(null);
        setError(null);
        verifiedDnis.current.clear();
    }, []);

    return { preInscripcion, error, loading, fetchPreInscripcion, resetVerification };
}
