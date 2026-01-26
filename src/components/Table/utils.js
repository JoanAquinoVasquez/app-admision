export const columns_preview = [
    { name: "ID", uid: "id", sortable: true },
    { name: "Nombres Completos", uid: "nombre_completo", sortable: true },
    { name: "Grado y Programa", uid: "grado", sortable: true },
    { name: "Celular", uid: "celular" },
    { name: "Doc. Identidad", uid: "doc_iden", sortable: true },
    { name: "DNI", uid: "ruta_dni" },
    { name: "CV", uid: "ruta_cv" },
    { name: "Foto Carnet", uid: "ruta_foto" },
    { name: "Núm. Voucher", uid: "voucher" },
    { name: "Voucher", uid: "ruta_voucher" },
    { name: "Fecha Inscripción", uid: "fecha_inscripcion" },
    { name: "Estado", uid: "estado", sortable: true },
];

export const statusOptions = [
    { name: "Validado", uid: "1" },
    { name: "Pendiente", uid: "0" },
    { name: "Observado", uid: "2" },
];

export function capitalize(s) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

export const statusColorMap = {
    1: "success",
    0: "danger",
    2: "warning",
};
