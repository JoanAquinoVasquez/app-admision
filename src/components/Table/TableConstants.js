export const columns = [
    { name: "ID", uid: "id", sortable: true },
    { name: "Nombres Completos", uid: "nombre_completo", sortable: true },
    { name: "Grado y Programa", uid: "grado", sortable: true },
    { name: "Documento Identidad", uid: "doc_iden", sortable: true },
    { name: "Celular", uid: "celular" },
    { name: "Fecha Inscripción", uid: "fecha_inscripcion" },
    { name: "Copia CV", uid: "ruta_cv" },
    { name: "Estado", uid: "estado", sortable: true },
    { name: "Acciones", uid: "actions" },
];

export const statusOptions = [
    { name: "Pendiente", uid: "0" },
    { name: "Validado", uid: "1" },
];

export const INITIAL_VISIBLE_COLUMNS = [
    "id",
    "nombre_completo",
    "grado",
    "celular",
    "doc_iden",
    "ruta_cv",
    "estado",
    "actions",
];

export const statusColorMap = {
    1: "success",
    0: "danger",
    2: "warning",
};
