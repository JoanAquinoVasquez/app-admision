import { useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import axios from "../../../axios";

export function useInscritosActions(fetchInscripciones) {
    const [isValidarOpen, setIsValidarOpen] = useState(false);
    const [validarId, setValidarId] = useState(null);
    const [isObservarOpen, setIsObservarOpen] = useState(false);
    const [isEditarOpen, setIsEditarOpen] = useState(false);
    const [observacion, setObservacion] = useState("");
    const [loading, setLoading] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    const handleValidar = useCallback(async (inscripcionId) => {
        setLoading(true);
        const promise = axios.post(`/inscripcion/val-digital`, {
            id: inscripcionId,
            tipoVal: 1,
        });

        toast.promise(promise, {
            loading: "Validando inscripción...",
            success: "Inscripción validada correctamente",
            error: "Error al validar la inscripción",
        });

        try {
            await promise;
            setIsValidarOpen(false);
            fetchInscripciones();
        } catch (error) {
            // Error managed by toast.promise
        } finally {
            setLoading(false);
        }
    }, [fetchInscripciones]);

    const handleObservar = useCallback(async (inscripcionId, observationText) => {
        setLoading(true);
        const promise = axios.post(`/inscripcion/val-digital`, {
            id: inscripcionId,
            tipoVal: 2,
            observacion: observationText || "No agregó descripción",
        });

        toast.promise(promise, {
            loading: "Guardando observación...",
            success: "Inscripción observada correctamente",
            error: "Error al observar la inscripción",
        });

        try {
            await promise;
            setIsObservarOpen(false);
            fetchInscripciones();
        } catch (error) {
            // Error managed by toast.promise
        } finally {
            setLoading(false);
        }
    }, [fetchInscripciones]);

    const handleEditar = useCallback((inscripcionId) => {
        setValidarId(inscripcionId);
        setIsEditarOpen(true);
    }, []);

    const handleVerConstancia = useCallback(async (postulanteId) => {
        setLoading(true);

        const constanciaPromise = axios.get(
            `/postulante/constancia/${postulanteId}`,
            {
                responseType: "blob",
            }
        );

        toast.promise(constanciaPromise, {
            loading: "Generando constancia...",
            success: "Constancia generada con éxito",
            error: "Error al obtener la constancia",
        });

        try {
            const response = await constanciaPromise;

            const file = new Blob([response.data], { type: "application/pdf" });
            const fileURL = URL.createObjectURL(file);

            window.open(fileURL, "_blank");
        } catch (error) {
            // Error managed by toast.promise
        } finally {
            setLoading(false);
        }
    }, []);

    const handleExportMultiple = useCallback(async (type, gradoFilter, programaFilter) => {
        let url = "";
        let params = {};

        switch (type) {
            case "Excel":
                url = "/reporte-inscripcion";
                if (gradoFilter !== "all" && gradoFilter) {
                    params.grado = gradoFilter;
                }
                if (programaFilter !== "all" && programaFilter) {
                    params.programa = programaFilter;
                }
                break;

            case "Reporte Diario":
                url = "/reporte-inscripcion-diario";
                break;

            case "Facultad Excel":
                url = "/reporte-inscripcion-facultad";
                break;

            case "Facultad PDF":
                url = "/reporte-inscripcion-facultad-pdf";
                break;

            case "Top Programas":
                url = "/reporte-programas-top";
                break;

            default:
                toast.error("Tipo de exportación no válido");
                return;
        }

        setIsExporting(true);
        const exportPromise = axios.get(url, {
            params,
            responseType: "blob",
        });

        toast.promise(exportPromise, {
            loading: `Generando ${type.toLowerCase()}...`,
            success: "Reporte generado con éxito",
            error: "Error durante la exportación",
        });

        try {
            const response = await exportPromise;

            const disposition = response.headers["content-disposition"];
            const filename =
                disposition?.split("filename=")[1]?.replace(/"/g, "") ||
                "archivo.pdf";

            const blob = new Blob([response.data]);
            const fileURL = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = fileURL;
            link.setAttribute("download", filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(fileURL);
        } catch (error) {
            // Managed by toast.promise
        } finally {
            setIsExporting(false);
        }
    }, []);

    return {
        isValidarOpen,
        setIsValidarOpen,
        validarId,
        setValidarId,
        isObservarOpen,
        setIsObservarOpen,
        isEditarOpen,
        setIsEditarOpen,
        observacion,
        setObservacion,
        loading,
        setLoading,
        isExporting,
        handleValidar,
        handleObservar,
        handleEditar,
        handleVerConstancia,
        handleExportMultiple,
    };
}
