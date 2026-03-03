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
const useSelectState = (items, selectedKey, onSelectionChange) => {
    const [displayValue, setDisplayValue] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    // Sincronizar displayValue cuando cambia selectedKey externamente
    useEffect(() => {
        if (selectedKey !== null && selectedKey !== undefined && selectedKey !== "") {
            // Usamos == (loose) para tolerar que key sea número o string
            const found = items.find((item) => item.key == selectedKey);
            setDisplayValue(found ? formatDisplayValue(found.textValue) : "");
        } else {
            setDisplayValue("");
        }
    }, [selectedKey, items]);

    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);
    const toggle = () => setIsOpen((prev) => !prev);

    const selectOption = (option) => {
        setDisplayValue(formatDisplayValue(option.textValue));
        close();
        if (onSelectionChange) onSelectionChange(option.key);
    };

    const clearSelection = () => {
        setDisplayValue("");
        if (onSelectionChange) onSelectionChange(null);
    };

    return {
        displayValue,
        setDisplayValue,
        isOpen,
        open,
        close,
        toggle,
        selectOption,
        clearSelection,
    };
};

export default useSelectState;
