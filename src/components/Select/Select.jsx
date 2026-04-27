import { useRef, useState, useCallback, useEffect, useMemo } from "react";
import SelectInput from "./components/SelectInput";
import SelectDropdown from "./components/SelectDropdown";
import useSelectState from "./hooks/useSelectState";
import useSelectFilter from "./hooks/useSelectFilter";
import useClickOutside from "./hooks/useClickOutside";
import { formatDisplayValue } from "./utils/formatDisplay";

/**
 * Select – componente con estado derivado puro: sincronización perfecta e instantánea.
 */
const Select = ({
    label,
    className = "",
    defaultItems = [],
    selectedKey,
    onSelectionChange,
    isRequired = false,
    disabled = false,
    idPrefix = "",
    loading = false,
}) => {
    const containerRef = useRef(null);
    const dropdownRef = useRef(null);
    const inputRef = useRef(null);

    // ── Hooks de estado ──────────────────────────────────────────────────────
    const { isOpen, open, close, toggle } = useSelectState();
    
    // Solo usamos estado local para la BÚSQUEDA activa.
    const { filteredItems, searchQuery, setSearchQuery, resetFilter } = useSelectFilter(defaultItems);
    
    const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

    // ── Valor de la Tabla (Fuente de Verdad) ─────────────────────────────────
    const selectedItem = useMemo(() =>
        defaultItems.find(item => String(item.key) === String(selectedKey)),
    [selectedKey, defaultItems]);
    
    const derivedValueFromProp = selectedItem ? formatDisplayValue(selectedItem.textValue) : "";

    // ── Lógica de Visualización (Derived State) ──────────────────────────────
    // Si el menú está abierto y el usuario ha escrito algo en el buscador, mostramos eso.
    // En el momento en que se cierra, o si no hay búsqueda activa, mostramos la verdad de la tabla.
    const displayValue = (isOpen && searchQuery !== "") ? searchQuery : derivedValueFromProp;

    // Resetear búsqueda al cerrar
    useEffect(() => {
        if (!isOpen) {
            resetFilter();
        }
    }, [isOpen, resetFilter]);

    // ── Utilidades ──────────────────────────────────────────────────────────
    const recalcCoords = useCallback(() => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const dropdownMaxHeight = 260;

        if (spaceBelow < dropdownMaxHeight) {
            setCoords({ bottom: window.innerHeight - rect.top, left: rect.left, width: rect.width, top: undefined });
        } else {
            setCoords({ top: rect.bottom + 4, left: rect.left, width: rect.width, bottom: undefined });
        }
    }, []);

    useClickOutside(containerRef, dropdownRef, isOpen, close);

    // ── Handlers ──────────────────────────────────────────────────────────────
    const handleFocus = () => {
        if (disabled) return;
        recalcCoords();
        if (!isOpen) {
            resetFilter();
            open();
        }
        setTimeout(() => {
            if (inputRef.current) inputRef.current.select();
        }, 10);
    };

    const handleInputChange = (e) => {
        setSearchQuery(e.target.value);
        if (!isOpen) open();
    };

    const handleSelect = (item) => {
        // Al seleccionar, notificamos al padre e inmediatamente 
        // limpiamos la búsqueda local para que el input muestre el nuevo prop.
        resetFilter();
        if (onSelectionChange) onSelectionChange(item.key);
        close();
    };

    const handleClear = () => {
        resetFilter();
        if (onSelectionChange) onSelectionChange(null);
        if (inputRef.current) inputRef.current.focus();
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && isOpen) {
            e.preventDefault();
            if (filteredItems.length > 0) handleSelect(filteredItems[0]);
        }
        if (e.key === "Escape") close();
    };

    return (
        <div ref={containerRef} className={`relative w-full ${className}`}>
            <SelectInput
                label={label}
                idPrefix={idPrefix}
                isRequired={isRequired}
                disabled={disabled}
                value={displayValue}
                isOpen={isOpen}
                inputRef={inputRef}
                onChange={handleInputChange}
                onFocus={handleFocus}
                onClick={handleFocus}
                onKeyDown={handleKeyDown}
                onClear={handleClear}
                onToggle={() => {
                    recalcCoords();
                    toggle();
                }}
            />

            {isOpen && !disabled && (
                <SelectDropdown
                    items={filteredItems}
                    selectedKey={selectedKey}
                    onSelect={handleSelect}
                    coords={coords}
                    dropdownRef={dropdownRef}
                    loading={loading}
                />
            )}
        </div>
    );
};

export default Select;
