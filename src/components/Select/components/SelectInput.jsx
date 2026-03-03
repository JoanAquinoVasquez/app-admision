import { FaTimes, FaChevronDown } from "react-icons/fa";

/**
 * Componente responsable ÚNICAMENTE de renderizar el campo de texto del Select.
 * (Single Responsibility Principle / Interface Segregation Principle)
 *
 * Props:
 * - label, idPrefix, isRequired, disabled
 * - value, isOpen, showLabel (flag flotante del label)
 * - onChange, onFocus, onKeyDown, onClear, onToggle
 * - inputRef
 */
const SelectInput = ({
    label,
    idPrefix = "",
    isRequired = false,
    disabled = false,
    value,
    isOpen,
    inputRef,
    onChange,
    onFocus,
    onBlur,
    onKeyDown,
    onClear,
    onToggle,
}) => {
    const inputId = label
        ? `${idPrefix}${label.replace(/\s+/g, "-").toLowerCase()}`
        : `${idPrefix}select`;

    const labelIsFloating = isOpen || !!value;

    return (
        <div
            className={`relative rounded-lg border-2 transition-all duration-200 ${disabled
                ? "bg-gray-200 border-transparent cursor-not-allowed"
                : isOpen
                    ? "bg-white border-primary shadow-sm"
                    : "bg-gray-100 border-transparent hover:bg-gray-200"
                }`}
            onClick={() => !disabled && onFocus()}
        >
            {/* Label flotante */}
            {label && (
                <label
                    htmlFor={inputId}
                    className={`absolute left-3 transition-all duration-200 pointer-events-none z-10 ${labelIsFloating
                        ? "text-[11px] font-medium top-1 text-primary"
                        : "text-sm text-gray-500 top-1/2 -translate-y-1/2"
                        }`}
                >
                    {label}
                    {isRequired && <span className="text-red-500 ml-0.5">*</span>}
                </label>
            )}

            {/* Input de búsqueda */}
            <input
                ref={inputRef}
                id={inputId}
                name={inputId}
                type="text"
                value={value}
                onChange={onChange}
                onFocus={onFocus}
                onBlur={() => {
                    // Delay para que el onMouseDown del dropdown se ejecute primero
                    setTimeout(() => { if (onBlur) onBlur(); }, 150);
                }}
                onKeyDown={onKeyDown}
                disabled={disabled}
                required={isRequired}
                autoComplete="off"
                className={`w-full rounded-lg text-gray-800 px-3 bg-transparent outline-none pr-14 ${label ? "pt-5 pb-1" : "py-2"
                    } ${disabled ? "text-gray-500 cursor-not-allowed" : ""}`}
                style={{ height: "48px" }}
            />

            {/* Botón limpiar */}
            {value && !disabled && (
                <button
                    type="button"
                    aria-label="Limpiar selección"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        onClear();
                    }}
                    className="absolute right-9 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <FaTimes className="text-xs" />
                </button>
            )}

            {/* Botón chevron */}
            {!disabled && (
                <button
                    type="button"
                    aria-label="Abrir opciones"
                    tabIndex={-1}
                    onMouseDown={(e) => {
                        e.preventDefault();
                        onToggle();
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <FaChevronDown
                        className={`text-xs transition-transform duration-200 ${isOpen ? "rotate-180 text-primary" : ""
                            }`}
                    />
                </button>
            )}
        </div>
    );
};

export default SelectInput;
