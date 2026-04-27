import { useState, useEffect } from "react";
import { formatDisplayValue } from "../utils/formatDisplay";

/**
 * Hook responsable ÚNICAMENTE del estado de selección y apertura.
 * (Single Responsibility Principle)
 *
 * @param {Array}  items       - Lista de opciones [{ key, textValue }]
 * @param {string} selectedKey - Key seleccionado externamente (controlled)
 * @param {Function} onSelectionChange - Callback al seleccionar/limpiar
 * @returns estado y handlers para el Select
 */
const useSelectState = () => {
    const [isOpen, setIsOpen] = useState(false);

    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);
    const toggle = () => setIsOpen((prev) => !prev);

    return {
        isOpen,
        open,
        close,
        toggle,
    };
};


export default useSelectState;
