export const formatearFecha = (fechaStr) => {
    if (!fechaStr) return "...";
    // Convertir string a objeto Date
    const fecha = new Date(fechaStr + "T00:00:00");
    return new Intl.DateTimeFormat("es-ES", {
        day: "numeric",
        month: "long",
        // year: "numeric", // Opcional, quítalo si solo quieres día y mes
    }).format(fecha);
};
