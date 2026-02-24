import { useMemo } from 'react';

export const useInscritosData = (
    inscripciones,
    statusField = "val_fisico",
    filterCallback = (item) => item.val_digital == 1
) => {
    return useMemo(() => {
        if (!inscripciones || inscripciones.length === 0) {
            return [];
        }

        let data = inscripciones;
        if (filterCallback) {
            data = data.filter(filterCallback);
        }

        return data.map((item) => {
            const formatoFechaHora = (fechaHora) => {
                if (!fechaHora)
                    return {
                        fecha: "No disponible",
                        hora: "No disponible",
                        dateObj: new Date(0),
                    };

                const dateObj = new Date(fechaHora);
                if (isNaN(dateObj.getTime())) {
                    return {
                        fecha: "Inválida",
                        hora: "Inválida",
                        dateObj: new Date(0),
                    };
                }

                const fecha = dateObj.toLocaleDateString("es-PE", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                });
                const hora = dateObj.toLocaleTimeString("es-PE", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                });

                return { fecha, hora, dateObj };
            };
            const { fecha, hora, dateObj } = formatoFechaHora(item.created_at);

            return {
                id: item.id,
                postulante_id: item.postulante.id,
                nombre_completo: [
                    item.postulante.ap_paterno,
                    item.postulante.ap_materno,
                    item.postulante.nombres,
                ].join(" "),
                grado: item.programa.grado.nombre,
                grado_id: item.programa.grado_id,
                programa_id: item.programa_id,
                programa: item.programa.nombre,
                programa_estado: item.programa.estado,
                doc_iden: item.postulante.num_iden,
                observacion: item.observacion,
                celular: item.postulante.celular,
                tipo_doc: item.postulante.tipo_doc,
                fecha_inscripcion: { fecha, hora, dateObj },
                ruta_dni:
                    item.postulante?.documentos?.find(
                        (doc) => doc.tipo === "DocumentoIdentidad"
                    )?.url || null,
                ruta_cv:
                    item.postulante?.documentos?.find(
                        (doc) => doc.tipo === "Curriculum"
                    )?.url || null,
                ruta_foto:
                    item.postulante?.documentos?.find(
                        (doc) => doc.tipo === "Foto"
                    )?.nombre_archivo || null,
                voucher: item.codigo,
                ruta_voucher:
                    item.postulante?.documentos?.find(
                        (doc) => doc.tipo === "Voucher"
                    )?.url || null,
                estado: item[statusField], // Dynamic status field
            };
        });
    }, [inscripciones, statusField, filterCallback]);
};
