export const admissionConfig = {
    cronograma: {
        examen_admision: 'domingo 19 de Abril',
        inicio_conceptos: '27 de Abril al 03 de Mayo',
        periodo: '2026-I',
        etapa_manual: 'FINALIZADO', // Valores: 'PREINSCRIPCION', 'INSCRIPCION', 'CERRADO', o null
        fechas_control: {
            // Preinscripción
            inicio_preinscripcion: '2025-01-19',
            fin_preinscripcion: '2025-01-22',

            // Inscripción
            inicio_inscripcion: '2025-01-23',
            fin_inscripcion: '2025-01-29',

            // Evaluación (Examen y Entrevista)
            inicio_evaluacion: '2025-02-06',
            fin_evaluacion: '2025-02-12',

            // Resultados
            resultados_publicacion: '2025-04-30',
        }
    }
};

export const getAdmissionStage = () => {
    const config = admissionConfig.cronograma;
    const etapa = config.etapa_manual;

    if (etapa) return etapa;

    const now = new Date();
    const fechas = config.fechas_control;

    const parseDate = (dateStr) => {
        // Asumiendo formato YYYY-MM-DD
        const [year, month, day] = dateStr.split('-').map(Number);
        return new Date(year, month - 1, day);
    };

    const inicioPre = parseDate(fechas.inicio_preinscripcion);
    const finPre = parseDate(fechas.fin_preinscripcion);
    // Ajustar fin de día para comparaciones inclusivas
    finPre.setHours(23, 59, 59, 999);

    const inicioIns = parseDate(fechas.inicio_inscripcion);
    const finIns = parseDate(fechas.fin_inscripcion);
    finIns.setHours(23, 59, 59, 999);

    const inicioEva = parseDate(fechas.inicio_evaluacion);
    const finEva = parseDate(fechas.fin_evaluacion);
    finEva.setHours(23, 59, 59, 999);

    const fechaResultados = parseDate(fechas.resultados_publicacion);

    if (now >= fechaResultados) {
        return 'RESULTADOS';
    } else if (now >= inicioEva && now <= finEva) {
        return 'EVALUACION';
    } else if (now >= inicioIns && now <= finIns) {
        return 'INSCRIPCION';
    } else if (now >= inicioPre && now <= finPre) {
        return 'PREINSCRIPCION';
    } else {
        return 'FINALIZADO';
    }
};
