import { useMemo } from 'react';
import { admissionConfig, getAdmissionStage } from "../config/admission";

export const useAdmissionStageConfig = () => {
    // LEER LA ETAPA ACTUAL DESDE EL .ENV
    // Valores esperados: 'PREINSCRIPCION', 'INSCRIPCION', 'EVALUACION', 'RESULTADOS', 'FINALIZADO'
    const currentStage = getAdmissionStage();
    const config = admissionConfig.cronograma || {};

    // CONFIGURACIÓN DE CONTENIDO SEGÚN ETAPA
    const stageConfig = useMemo(() => {
        switch (currentStage) {
            case "PREINSCRIPCION":
                return {
                    statusLabel: "Fase 1: Preinscripción",
                    statusColor: "primary",
                    title: "Preinscripciones Abiertas",
                    description:
                        "Inicia tu camino al posgrado. Regístrate antes del cierre de convocatoria.",
                    buttonText: "Preinscribirse Ahora",
                    buttonLink: "/admision-epg/preinscripcion", // Ruta interna o link externo
                    isActive: true,
                };
            case "INSCRIPCION":
                return {
                    statusLabel: "Fase 2: Inscripción",
                    statusColor: "success",
                    title: "Inscripciones Abiertas",
                    description:
                        `No dejes pasar esta oportunidad, disponible hasta el ${config.fecha_fin_inscricion}`,
                    buttonText: "Inscribirse Ahora",
                    buttonLink: "/admision-epg/inscripcion", // Ruta interna o link externo
                    isActive: true,
                };
            case "EVALUACION":
                return {
                    statusLabel: "Fase 3: Evaluación",
                    statusColor: "warning",
                    title: "Etapa de Evaluación",
                    description:
                        "Estamos en proceso de evaluación de expedientes y entrevistas. Mantente atento a tu correo.",
                    buttonText: "Ver Cronograma",
                    buttonLink: "/admision-epg/",
                    isActive: true,
                };
            case "RESULTADOS":
                return {
                    statusLabel: "Fase 4: Resultados",
                    statusColor: "secondary",
                    title: "Resultados Publicados",
                    description:
                        "Ya puedes consultar la lista de ingresantes del proceso de admisión.",
                    buttonText: "Consultar Resultados",
                    buttonLink:
                        "/admision-epg/",
                    isActive: true,
                };
            case "STANDBY":
                return {
                    statusLabel: "Próximamente",
                    statusColor: "default",
                    title: "Próximamente",
                    description:
                        `Nos estamos preparando para el siguiente proceso de admisión ${config.periodo}. Pronto más novedades.`,
                    buttonText: "Más información",
                    buttonLink: "https://www.facebook.com/epgunprg", // Opcional: link a facebook o web principal
                    isActive: false,
                };
            case "FINALIZADO":
            default:
                return {
                    statusLabel: "Proceso Cerrado",
                    statusColor: "default",
                    title: "Proceso de Admisión Finalizado",
                    description:
                        "El proceso de admisión ha concluido. Prepárate para la próxima convocatoria.",
                    buttonText: "Más información",
                    buttonLink: "https://drive.google.com/drive/folders/14WZxQ6TkA4TUGFKeVEcpVY06rH8Qg199?usp=sharing",
                    isActive: false,
                };
        }
    }, [currentStage, config]);

    return { stageConfig, config };
};
