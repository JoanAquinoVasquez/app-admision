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

    const handleValidar = useCallback(async (inscripcionId) => {
        setIsValidarOpen(false);
        setLoading(true);
        try {
            await axios.post(`/inscripcion/val-digital`, {
                id: inscripcionId,
                tipoVal: 1,
            });
            setIsValidarOpen(false);
            fetchInscripciones();
            toast.success("Inscripción validada correctamente");
        } catch (error) {
            toast.error("Error al validar:", error);
        } finally {
            setLoading(false);
        }
    }, [fetchInscripciones]);

    const handleObservar = useCallback(async (inscripcionId, observationText) => {
        setIsObservarOpen(false);
        setLoading(true);
        try {
            await axios.post(`/inscripcion/val-digital`, {
                id: inscripcionId,
                tipoVal: 2,
                observacion: observationText || "No agregó descripción",
            });
            setIsObservarOpen(false);
            fetchInscripciones();
            toast.success("Inscripción observada correctamente");
        } catch (error) {
            toast.error("Error al observar");
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

        try {
            const response = await axios.get(
                `/postulante/constancia/${postulanteId}`,
                {
                    responseType: "blob",
                }
            );

            const file = new Blob([response.data], { type: "application/pdf" });
            const fileURL = URL.createObjectURL(file);

            window.open(fileURL, "_blank");
        } catch (error) {
            toast.error("Error al obtener la constancia:");
        } finally {
            setLoading(false);
        }
    }, []);

    const handleExportMultiple = useCallback(async (type, gradoFilter, programaFilter) => {
        setLoading(true);
        try {
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

            const response = await axios.get(url, {
                params,
                responseType: "blob",
            });

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
            toast.error("Error durante la exportación");
        } finally {
            setLoading(false);
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
        handleValidar,
        handleObservar,
        handleEditar,
        handleVerConstancia,
        handleExportMultiple,
    };
}
