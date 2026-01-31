import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { FaTimes, FaChevronDown } from "react-icons/fa";

const Select = ({
    label,
    className = "",
    defaultItems = [],
    value,
    selectedKey,
    onSelectionChange,
    isRequired = false,
    disabled = false, // Prop disabled para habilitar/deshabilitar el componente
    idPrefix = "", // Prefijo único para evitar conflictos de ID
}) => {
    const [searchValue, setSearchValue] = useState(""); // Inicializa con vacío
    const [filteredOptions, setFilteredOptions] = useState(defaultItems);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
    const dropdownRef = useRef(null);
    const selectRef = useRef(null);
    const [isItemSelected, setIsItemSelected] = useState(false);

    // Actualiza el filtro de opciones cuando los elementos predeterminados cambian
    useEffect(() => {
        setFilteredOptions(defaultItems);
    }, [defaultItems]);

    // Actualiza el valor de búsqueda cuando cambia el `selectedKey`
    useEffect(() => {
        if (selectedKey) {
            const selectedItem = defaultItems.find(
                (item) => item.key === selectedKey
            );
            if (selectedItem) {
                setSearchValue(selectedItem.textValue);
                setIsItemSelected(true);
            }
        } else {
            setSearchValue("");
            setIsItemSelected(false);
        }
    }, [selectedKey, defaultItems]);

    // Calcular posición del dropdown
    // Calcular posición del dropdown
    const updateCoords = () => {
        if (selectRef.current) {
            const rect = selectRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const dropdownHeight = 200; // Altura máxima estimada

            // Si hay menos espacio abajo que la altura del dropdown, mostrar arriba
            if (spaceBelow < dropdownHeight) {
                setCoords({
                    bottom: window.innerHeight - rect.top, // Anclar al borde superior del input
                    left: rect.left,
                    width: rect.width,
                    placement: 'top'
                });
            } else {
                setCoords({
                    top: rect.bottom,
                    left: rect.left,
                    width: rect.width,
                    placement: 'bottom'
                });
            }
        }
    };

    // Función para manejar clics fuera del componente y cerrar el desplegable
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                selectRef.current &&
                !selectRef.current.contains(event.target) &&
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsDropdownOpen(false);
                setIsItemSelected(false);
            }
        };

        const handleScrollOrResize = () => {
            if (isDropdownOpen) updateCoords();
        };

        document.addEventListener("mousedown", handleClickOutside);
        window.addEventListener("scroll", handleScrollOrResize, true);
        window.addEventListener("resize", handleScrollOrResize);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener("scroll", handleScrollOrResize, true);
            window.removeEventListener("resize", handleScrollOrResize);
        };
    }, [isDropdownOpen]);

    // Actualiza el valor de búsqueda cuando el usuario escribe algo
    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchValue(value);
        setFilteredOptions(
            defaultItems.filter((item) =>
                item.textValue.toLowerCase().includes(value.toLowerCase())
            )
        );
        updateCoords();
        setIsDropdownOpen(true);
        if (value === "") {
            setIsItemSelected(false); // Restablecer la selección si el campo está vacío
        }
    };

    // Selecciona una opción del desplegable
    const handleSelectOption = (option, event) => {
        if (event) {
            event.stopPropagation();
            event.preventDefault();
        }
        setSearchValue(option.textValue);
        setIsDropdownOpen(false);
        setIsItemSelected(true); // Marcar como seleccionado solo al hacer clic
        if (onSelectionChange) onSelectionChange(option.key);
    };

    // Limpia la selección
    const handleClear = () => {
        setSearchValue("");
        setFilteredOptions(defaultItems);
        setIsDropdownOpen(false);
        setIsItemSelected(false); // Restablecer selección al limpiar
        if (onSelectionChange) onSelectionChange(null);
    };

    return (
        <div ref={selectRef} className={`relative w-full ${className}`}>
            <div
                className={`relative rounded-lg bg-gray-100 shadow-sm ${disabled ? "bg-gray-200 cursor-not-allowed" : ""
                    }`}
            >
                {label && (
                    <label
                        htmlFor={label.replace(/\s+/g, "-").toLowerCase()}
                        className={`absolute left-3 transition-all duration-300 ${isFocused || searchValue
                            ? "text-xs text-gray-700 top-1"
                            : "text-gray-700 top-1/2 transform -translate-y-1/2 text-sm"
                            }`}
                    >
                        {label}{" "}
                        {isRequired && <span className="text-red-500">*</span>}
                    </label>
                )}
                <input
                    type="text"
                    id={
                        label
                            ? `${idPrefix}${label.replace(/\s+/g, "-").toLowerCase()}`
                            : `${idPrefix}select-input`
                    } // Añadido id con prefijo
                    name={
                        label
                            ? `${idPrefix}${label.replace(/\s+/g, "-").toLowerCase()}`
                            : `${idPrefix}select`
                    } // Añadido name con prefijo
                    value={searchValue}
                    onChange={handleInputChange}
                    required={isRequired}
                    onFocus={() => { updateCoords(); setIsDropdownOpen(true); }}
                    onClick={() => { updateCoords(); setIsDropdownOpen(true); }}
                    onBlur={null}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            if (filteredOptions.length > 0) {
                                handleSelectOption(filteredOptions[0]);
                            }
                        }
                    }}
                    className={`w-full h-full rounded-lg text-gray-800 px-3 py-2 bg-gray-100 pt-4 
    ${disabled ? "bg-gray-200 text-gray-700" : ""} 
    truncate overflow-hidden text-ellipsis pr-14`}
                    style={{
                        height: "45px",
                        padding: "8px 12px",
                        paddingBottom: "2px",
                        paddingRight: "3rem",
                    }}
                    disabled={disabled}
                />
                {searchValue && !disabled && (
                    <button
                        onClick={handleClear}
                        title="Limpiar_seleccion"
                        aria-label="Limpiar_seleccion"
                        className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-700 hover:text-gray-700"
                    >
                        <FaTimes className="text-md" />
                    </button>
                )}
                {!disabled && (
                    <button
                        type="button"
                        title="Abrir_menu_desplegable"
                        aria-label="Abrir_menu_desplegable"
                        onClick={() => {
                            if (!isDropdownOpen) updateCoords();
                            setIsDropdownOpen((prev) => !prev);
                        }}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-700 hover:text-gray-700"
                    >
                        <FaChevronDown
                            className={`text-md transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""
                                }`}
                        />
                    </button>
                )}
            </div>
            {isDropdownOpen && filteredOptions.length > 0 && !disabled && createPortal(
                <div
                    ref={dropdownRef}
                    className="fixed z-[9999] bg-white rounded-lg shadow-xl border border-gray-200 mt-1 overflow-hidden"
                    style={{
                        top: coords.placement === 'bottom' ? `${coords.top}px` : 'auto',
                        bottom: coords.placement === 'top' ? `${coords.bottom}px` : 'auto',
                        left: `${coords.left}px`,
                        width: `${coords.width}px`,
                        maxHeight: "200px",
                    }}
                >
                    <ul className="list-none p-0 m-0 w-full overflow-y-auto max-h-[200px]">
                        {filteredOptions.map((item) => (
                            <li
                                key={item.key}
                                onClick={(e) => handleSelectOption(item, e)}
                                className="p-2 mx-2 my-1 hover:bg-gray-100 cursor-pointer text-sm rounded-lg transition-colors"
                            >
                                {item.textValue}
                            </li>
                        ))}
                    </ul>
                </div>,
                document.body
            )}
        </div>
    );
};

export default Select;
