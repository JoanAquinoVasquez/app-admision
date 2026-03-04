export const admissionConfig = {
    cronograma: {
        examen_admision: 'domingo 17 de Mayo',
        inicio_conceptos: '23 de Mayo',
        fecha_fin_inscricion: '13 de Mayo',
        periodo: '2026-I',
        etapa_manual: 'INSCRIPCION', // Valores: 'PREINSCRIPCION', 'INSCRIPCION', 'CERRADO', 'STANDBY' o null
        fechas_control: {
            // Preinscripción
            inicio_preinscripcion: '2026-02-01',
            fin_preinscripcion: '2026-02-01',

            // Inscripción
            inicio_inscripcion: '2026-02-02',
            fin_inscripcion: '2026-05-13',

            // Evaluación (Examen y Entrevista)
            inicio_evaluacion: '2026-05-14',
            fin_evaluacion: '2026-05-16',

            // Resultados
            resultados_publicacion: '2026-05-20',
        }
    }
};

export const getAdmissionStage = () => {
    // Permitir override desde Cypress (window o localStorage para persistencia al recargar)
    if (typeof window !== 'undefined') {
        if (window.CYPRESS_STAGE) return window.CYPRESS_STAGE;
        if (window.localStorage && window.localStorage.getItem('CYPRESS_STAGE')) {
            return window.localStorage.getItem('CYPRESS_STAGE');
        }
    }

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
