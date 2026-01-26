import { useState, useEffect, useRef } from "react";
import { FaTimes, FaChevronDown } from "react-icons/fa";

const MultiSelect = ({
    label,
    className = "",
    defaultItems = [],
    selectedKeys = [],
    onSelectionChange,
    isRequired = false,
    disabled = false, // Deshabilitar el componente
}) => {
    const [searchValue, setSearchValue] = useState("");
    const [filteredOptions, setFilteredOptions] = useState(defaultItems);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const dropdownRef = useRef(null);
    const selectRef = useRef(null);

    // Actualiza opciones seleccionadas cuando cambian `selectedKeys`
    useEffect(() => {
        const newSelectedOptions = defaultItems.filter((item) =>
            selectedKeys.includes(item.key)
        );
        if (
            JSON.stringify(newSelectedOptions) !==
            JSON.stringify(selectedOptions)
        ) {
            setSelectedOptions(newSelectedOptions);
        }
    }, [selectedKeys, defaultItems]);

    // Filtra opciones basadas en búsqueda
    useEffect(() => {
        setFilteredOptions(
            defaultItems.filter((item) =>
                item.textValue.toLowerCase().includes(searchValue.toLowerCase())
            )
        );
    }, [searchValue, defaultItems]);

    // Cierra dropdown al hacer clic fuera, excepto dentro del dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                selectRef.current &&
                !selectRef.current.contains(event.target) &&
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Maneja cambios en la entrada de búsqueda
    const handleInputChange = (e) => {
        if (!disabled) {
            setSearchValue(e.target.value);
            setIsDropdownOpen(true);
        }
    };

    // Agrega opción seleccionada
    const handleSelectOption = (option) => {
        const isAlreadySelected = selectedOptions.some(
            (item) => item.key === option.key
        );

        let newSelected;
        if (isAlreadySelected) {
            newSelected = selectedOptions.filter(
                (item) => item.key !== option.key
            );
        } else {
            newSelected = [...selectedOptions, option];
        }

        setSelectedOptions(newSelected);
        if (onSelectionChange) {
            onSelectionChange(newSelected.map((item) => item.key));
        }
    };

    // Elimina opción seleccionada
    const handleRemoveOption = (key) => {
        const newSelected = selectedOptions.filter((item) => item.key !== key);
        setSelectedOptions(newSelected);
        onSelectionChange?.(newSelected.map((item) => item.key));
    };

    // Limpia todas las selecciones
    const handleClearAll = () => {
        setSelectedOptions([]);
        onSelectionChange?.([]);
    };

    return (
        <div ref={selectRef} className={`relative w-full ${className}`}>
            <div
                className={`relative rounded-lg bg-gray-100 shadow-sm ${
                    disabled ? "bg-gray-200 cursor-not-allowed" : ""
                }`}
            >
                {label && (
                    <label
                        className={`absolute left-3 transition-all duration-300 ${
                            searchValue || selectedOptions.length > 0
                                ? "text-xs text-gray-500 -top-0"
                                : "text-gray-500 top-1/2 transform -translate-y-1/2 text-sm"
                        }`}
                    >
                        {label}{" "}
                        {isRequired && <span className="text-red-500">*</span>}
                    </label>
                )}

                <div className="flex flex-wrap items-center gap-1 p-2">
                    {/* Etiquetas de opciones seleccionadas */}
                    <div
                        className="flex flex-wrap items-center gap-1 p-2 overflow-y-auto"
                        style={{ maxHeight: "100px" }} // Ajusta el tamaño que necesites
                    >
                        {selectedOptions.map((item) => (
                            <span
                                key={item.key}
                                className="flex items-center bg-blue-100 text-blue-700 text-sm px-2 py-1 rounded-lg"
                            >
                                {item.textValue}
                                <button
                                    aria-label="Eliminar opción"
                                    onClick={() => handleRemoveOption(item.key)}
                                    className="ml-2 text-blue-500 hover:text-blue-700"
                                >
                                    <FaTimes className="text-xs" />
                                </button>
                            </span>
                        ))}
                    </div>

                    {/* Campo de entrada para búsqueda */}
                    <input
                        type="text"
                        value={searchValue}
                        onChange={handleInputChange}
                        onFocus={() => !disabled && setIsDropdownOpen(true)}
                        className={`flex-1 text-gray-800 focus:outline-none ${
                            disabled
                                ? "bg-gray-200 cursor-not-allowed"
                                : "bg-gray-100"
                        }`}
                        style={{
                            height: "30px", // Ajusta la altura según sea necesario
                            padding: "0 8px", // Ajusta el relleno para hacerlo más delgado
                        }}
                        disabled={disabled}
                        aria-label="Buscar opciones"
                    />
                </div>

                {/* Botón de limpiar todo */}
                {selectedOptions.length > 0 && !disabled && (
                    <button
                        aria-label="Limpiar todas las opciones"
                        onClick={handleClearAll}
                        className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                        <FaTimes className="text-md" />
                    </button>
                )}

                {/* Botón de desplegar */}
                {!disabled && (
                    <button
                        aria-label="Mostrar opciones"
                        type="button"
                        onClick={() => setIsDropdownOpen((prev) => !prev)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                        <FaChevronDown
                            className={`text-md transition-transform duration-300 ${
                                isDropdownOpen ? "rotate-180" : ""
                            }`}
                        />
                    </button>
                )}
            </div>

            {/* Dropdown con opciones */}
            {isDropdownOpen && filteredOptions.length > 0 && !disabled && (
                <div
                    ref={dropdownRef}
                    className="absolute z-20 w-full bg-white rounded-lg shadow-md mt-1"
                >
                    <ul className="list-none p-0 m-0 w-full max-h-40 overflow-y-auto">
                        {filteredOptions.map((item) => (
                            <li
                                key={item.key}
                                onClick={() => handleSelectOption(item)}
                                className="p-2 mx-1 my-0 hover:bg-gray-200 cursor-pointer text-sm rounded-lg flex items-center h-auto"
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedOptions.some(
                                        (sel) => sel.key === item.key
                                    )}
                                    readOnly
                                    className="mr-2"
                                />
                                {item.textValue}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default MultiSelect;
