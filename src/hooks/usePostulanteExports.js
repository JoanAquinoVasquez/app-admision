import { useState } from "react";
import axios from "../axios";
import { toast } from "react-hot-toast";

const usePostulanteExports = () => {
    const [loading, setLoading] = useState(false);

    const downloadBlob = (blob, fileName = "archivo.pdf") => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    };

    const handleExport = async (type, options = {}) => {
        const { selectedPrograms, gradoFilter, programaFilter, aperturadoFilter, notasFilter, filterValue } = options;

        if (type === "CV" && !selectedPrograms?.length) {
            toast.error("Por favor, selecciona al menos un programa.");
            return;
        }

        setLoading(true);
        let fileName = "archivo";

        const exportPromise = (async () => {
            let response;
            switch (type) {
                case "CV":
                    if (!selectedPrograms?.length) {
                        toast.error(
                            "Por favor, selecciona al menos un programa."
                        );
                        setLoading(false);
                        return;
                    }
                    response = await axios.post(
                        "postulantes-notasCV-multiple-admin",
                        { ids: Array.from(selectedPrograms).map(Number) },
                        { responseType: "blob" }
                    );
                    fileName = "notas_cv.pdf";
                    break;

                case "Plantilla Notas Entrevista":
                    {
                        const params = {};
                        if (gradoFilter !== "all" && gradoFilter)
                            params.grado = gradoFilter;
                        if (programaFilter && programaFilter.length > 0)
                            params.programa = programaFilter;

                        response = await axios.get("/postulantes-aptos-multiple", {
                            params,
                            responseType: "blob",
                        });
                        fileName = "plantilla_entrevista.pdf";
                    }
                    break;

                case "Reporte Final":
                    response = await axios.get("/reporte-final-notas", {
                        responseType: "blob",
                    });
                    fileName = "reporte_final.pdf";
                    break;

                case "Reporte Aulas PDF":
                    response = await axios.get(
                        "/reporte-inscripcion-final/aulas/pdf",
                        { responseType: "blob" }
                    );
                    fileName = "reporte_aulas.pdf";
                    break;

                case "Reporte Resumen Aulas PDF":
                    response = await axios.get(
                        "/reporte-inscripcion-final/resumen-aulas/pdf",
                        { responseType: "blob" }
                    );
                    fileName = "reporte_resumen_aulas.pdf";
                    break;

                case "Reporte Resumen Evaluadores PDF":
                    response = await axios.get(
                        "/reporte-inscripcion-final/resumen-evaluadores/pdf",
                        { responseType: "blob" }
                    );
                    fileName = "reporte_resumen_evaluadores.pdf";
                    break;

                case "Reporte Aptos Asistencia PDF":
                    response = await axios.get(
                        "/reporte-inscripcion-final/firmas/pdf",
                        { responseType: "blob" }
                    );
                    fileName = "reporte_aptos_firmas.pdf";
                    break;

                case "Reporte Aptos Excel":
                    response = await axios.get(
                        "/reporte-inscripcion-final/excel",
                        { responseType: "blob" }
                    );
                    fileName = "reporte_aptos.xlsx";
                    break;

                case "Reporte Personalizado Excel":
                    {
                        const params = {};
                        if (gradoFilter && gradoFilter !== "all" && typeof gradoFilter !== "object")
                            params.grado = gradoFilter;
                        if (programaFilter && Array.isArray(programaFilter) && programaFilter.length > 0)
                            params.programa = programaFilter;

                        // Filtro de apertura
                        if (aperturadoFilter && aperturadoFilter.size === 1) {
                            params.aperturado = aperturadoFilter.has("aperturado") ? 1 : 0;
                        }

                        // Filtro de notas
                        if (notasFilter && notasFilter.size > 0) {
                            params.notas = Array.from(notasFilter);
                        }

                        // Filtro de búsqueda
                        if (filterValue) {
                            params.search = filterValue;
                        }

                        response = await axios.get(
                            "/reporte-inscripcion-personalizado/excel",
                            {
                                params,
                                responseType: "blob",
                            }
                        );
                        fileName = "reporte_personalizado.xlsx";
                    }
                    break;

                case "Reporte Ingresantes Excel":
                    response = await axios.get("/reporte-notas-final-excel", {
                        responseType: "blob",
                    });
                    fileName = "reporte_ingresantes.xlsx";
                    break;

                case "Excel":
                    {
                        const params = {};
                        if (gradoFilter && gradoFilter !== "all" && typeof gradoFilter !== "object")
                            params.grado = gradoFilter;
                        if (programaFilter && Array.isArray(programaFilter) && programaFilter.length > 0)
                            params.programa = programaFilter;

                        response = await axios.get("/reporte-inscripcion", {
                            params,
                            responseType: "blob",
                        });
                        fileName = "reporte_inscripcion.xlsx";
                    }
                    break;

                case "Reporte Diario":
                    response = await axios.get("/reporte-inscripcion-diario", {
                        responseType: "blob",
                    });
                    fileName = "reporte_diario.pdf";
                    break;

                case "Facultad Excel":
                    response = await axios.get(
                        "/reporte-inscripcion-facultad",
                        {
                            responseType: "blob",
                        }
                    );
                    fileName = "reporte_facultad.xlsx";
                    break;

                case "Facultad PDF":
                    response = await axios.get(
                        "/reporte-inscripcion-facultad-pdf",
                        {
                            responseType: "blob",
                        }
                    );
                    fileName = "reporte_facultad.pdf";
                    break;

                case "Top Programas":
                    response = await axios.get("/reporte-programas-top", {
                        responseType: "blob",
                    });
                    fileName = "reporte_top_programas.pdf";
                    break;

                default:
                    throw new Error("Tipo de exportación no válido.");
            }
            return response;
        })();

        toast.promise(exportPromise, {
            loading: `Generando ${type.toLowerCase()}...`,
            success: "Exportación completada exitosamente.",
            error: (err) => `Error al exportar: ${err.message || "Error inesperado"}`,
        });

        try {
            const response = await exportPromise;

            // Extraer filename desde headers si está disponible
            const disposition = response.headers["content-disposition"];
            const extracted = disposition
                ?.split("filename=")[1]
                ?.replace(/["']/g, "");
            if (extracted) fileName = decodeURIComponent(extracted);

            downloadBlob(response.data, fileName);
        } catch (error) {
            // Managed by toast.promise
        } finally {
            setLoading(false);
        }
    };

    return { loading, handleExport };
};

export default usePostulanteExports;
