/**
 * Formatea el textValue de un item para mostrarlo al usuario.
 * SOLO convierte a Title Case si el string está completamente en MAYÚSCULAS
 * (ej: "DOCTORADO" → "Doctorado"). Si ya tiene formato correcto
 * ("Administración"), lo deja tal cual.
 *
 * Esta es la fuente única de verdad para el formato visual del Select.
 * Úsala en: Select.jsx, useSelectState.js, SelectDropdown.jsx
 */
export const formatDisplayValue = (str) => {
    if (!str) return "";

    // Excepciones de documentos o acrónimos que deben ir en mayúsculas
    const uppercaseExceptions = ["DNI", "CE", "RUC", "PASAPORTE"];
    if (uppercaseExceptions.includes(str.trim().toUpperCase())) {
        if (str.trim().toUpperCase() === "PASAPORTE") return "Pasaporte";
        return str.trim().toUpperCase();
    }

    // Si tiene alguna minúscula, el texto ya está bien formateado
    if (str !== str.toUpperCase()) return str;
    // Convertir ALL CAPS a Title Case respetando acentos del español
    return str
        .toLowerCase()
        .split(" ")
        .map((word) => (word.length > 0 ? word[0].toUpperCase() + word.slice(1) : word))
        .join(" ");
};
