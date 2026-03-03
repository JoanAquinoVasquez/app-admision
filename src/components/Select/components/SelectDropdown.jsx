import { createPortal } from "react-dom";
import { formatDisplayValue } from "../utils/formatDisplay";
import { Spinner } from "@heroui/react";

/**
 * Componente responsable ÚNICAMENTE de renderizar la lista de opciones.
 * Usa createPortal para escapar del z-index/overflow del padre.
 * (Single Responsibility Principle)
 *
 * Props:
 * - items:         Array<{ key, textValue }>
 * - selectedKey:   string|null  — resalta la opción activa
 * - onSelect:      (item) => void
 * - coords:        { top, left, width } — posición calculada del trigger
 * - dropdownRef:   React.RefObject — para detectar clics fuera
 * - loading:       boolean — muestra un estado de carga
 */

const SelectDropdown = ({ items, selectedKey, onSelect, coords, dropdownRef, loading }) => {
    const style = {
        position: "fixed",
        top: coords.top ?? "auto",
        bottom: coords.bottom ?? "auto",
        left: coords.left,
        width: coords.width,
        zIndex: 9999,
    };

    const content = (
        <div
            ref={dropdownRef}
            style={style}
            className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden mt-1"
        >
            <ul className="list-none m-0 p-1 max-h-[240px] overflow-y-auto">
                {loading ? (
                    <li className="px-3 py-6 flex flex-col items-center justify-center gap-2 text-gray-400 italic">
                        <Spinner size="sm" color="primary" />
                        <span className="text-[10px] font-medium non-italic">Cargando...</span>
                    </li>
                ) : items.length > 0 ? (
                    items.map((item) => (
                        <li
                            key={item.key}
                            onMouseDown={(e) => {
                                // preventDefault evita que el input pierda el foco antes de seleccionar
                                e.preventDefault();
                                onSelect(item);
                            }}
                            className={`flex items-center px-3 py-2 mx-0.5 my-0.5 text-sm rounded-lg cursor-pointer transition-colors
                                ${selectedKey != null && item.key == selectedKey
                                    ? "bg-primary-100 text-primary font-semibold"
                                    : "text-gray-700 hover:bg-gray-100"
                                }`}
                            style={{ wordBreak: "break-word", whiteSpace: "normal" }}
                        >
                            {formatDisplayValue(item.textValue)}
                        </li>
                    ))
                ) : (
                    <li className="px-3 py-3 text-sm text-gray-400 text-center italic">
                        No se encontraron resultados.
                    </li>
                )}
            </ul>
        </div>
    );

    return createPortal(content, document.body);
};

export default SelectDropdown;
