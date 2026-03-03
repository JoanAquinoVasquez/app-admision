import { useRef, useState, useCallback, useEffect } from "react";
import SelectInput from "./components/SelectInput";
import SelectDropdown from "./components/SelectDropdown";
import useSelectState from "./hooks/useSelectState";
import useSelectFilter from "./hooks/useSelectFilter";
import useClickOutside from "./hooks/useClickOutside";
import { formatDisplayValue } from "./utils/formatDisplay";

/**
 * Select – componente unificado con búsqueda integrada y texto completo.
 *
 * Principios aplicados:
 *  - SRP: cada hook / subcomponente tiene una única responsabilidad.
 *  - OCP: agregar comportamiento (ej. grupos, íconos) sin tocar este archivo.
 *  - DIP: depende de abstracciones (hooks), no de implementaciones concretas.
 *  - ISP: props mínimas y específicas para cada subcomponente.
 *
 * Props:
 *  @param {string}   label           - Etiqueta flotante del campo
 *  @param {string}   className       - Clases extra del wrapper
 *  @param {Array}    defaultItems    - [{ key: string, textValue: string }]
 *  @param {string}   selectedKey     - Key seleccionado actualmente (controlled)
 *  @param {Function} onSelectionChange - (key: string|null) => void
 *  @param {boolean}  isRequired      - Marca el campo como requerido
 *  @param {boolean}  disabled        - Deshabilita el componente
 *  @param {string}   idPrefix        - Prefijo para el id/name del input (evita duplicados)
 *  @param {boolean}  loading         - Indica si se está cargando información
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

    // Estado de posición del dropdown (calculado dinámicamente)
    const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

    // ── Hook: estado de selección y apertura ──────────────────────────────────
    const {
        displayValue,
        setDisplayValue,
        isOpen,
        open,
        close,
        toggle,
        selectOption,
        clearSelection,
    } = useSelectState(defaultItems, selectedKey, onSelectionChange);

    // ── Hook: filtrado de opciones por búsqueda ───────────────────────────────
    const { filteredItems, searchQuery, setSearchQuery, resetFilter } =
        useSelectFilter(defaultItems);

    // ── Hook: cerrar al clic fuera ────────────────────────────────────────────
    useClickOutside(containerRef, dropdownRef, isOpen, close);

    // ── Cálculo de coordenadas del dropdown ───────────────────────────────────
    const recalcCoords = useCallback(() => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const dropdownMaxHeight = 260;

        if (spaceBelow < dropdownMaxHeight) {
            // No hay espacio abajo → mostrar arriba
            setCoords({
                bottom: window.innerHeight - rect.top,
                left: rect.left,
                width: rect.width,
                top: undefined,
            });
        } else {
            setCoords({
                top: rect.bottom + 4,
                left: rect.left,
                width: rect.width,
                bottom: undefined,
            });
        }
    }, []);

    // ── Actualización de coords en scroll / resize ────────────────────────────
    useEffect(() => {
        if (!isOpen) return;
        const handleScrollOrResize = (e) => {
            // Ignorar el propio scroll interno de la lista desplegable
            if (dropdownRef.current && dropdownRef.current.contains(e.target)) return;
            recalcCoords();
        };

        // El parámetro 'true' (useCapture) permite interceptar eventos de scroll en contenedores overflow.
        window.addEventListener("scroll", handleScrollOrResize, true);
        window.addEventListener("resize", handleScrollOrResize);

        return () => {
            window.removeEventListener("scroll", handleScrollOrResize, true);
            window.removeEventListener("resize", handleScrollOrResize);
        };
    }, [isOpen, recalcCoords]);

    // ── Handlers ──────────────────────────────────────────────────────────────
    const handleFocus = () => {
        if (disabled) return;
        recalcCoords();
        open();
        // Al abrir, si hay un valor de searchQuery previo del usuario, lo mantenemos
        // pero si el campo muestra un item seleccionado, vaciamos para buscar
        if (selectedKey && !searchQuery) {
            setDisplayValue("");
        }
    };

    const handleInputChange = (e) => {
        const newValue = e.target.value;
        setDisplayValue(newValue);   // lo que ve el usuario mientras escribe
        setSearchQuery(newValue);    // filtra las opciones
        if (!isOpen) {
            recalcCoords();
            open();
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (filteredItems.length > 0 && isOpen) {
                handleSelect(filteredItems[0]);
            }
        }
        if (e.key === "Escape") {
            close();
            restoreDisplayValue();
            resetFilter();
        }
    };

    // ── Prevenir clausuras obsoletas en onBlur (setTimeout 150ms) ──
    const latestProps = useRef({ selectedKey, defaultItems });
    useEffect(() => {
        latestProps.current = { selectedKey, defaultItems };
    }, [selectedKey, defaultItems]);

    // Restaura el displayValue al item seleccionado (o vacío si no hay ninguno)
    const restoreDisplayValue = useCallback(() => {
        const { selectedKey: currentKey, defaultItems: currentItems } = latestProps.current;
        if (currentKey !== null && currentKey !== undefined && currentKey !== "") {
            // Usamos == para tolerar tipos mixtos número/string
            const found = currentItems.find((i) => i.key == currentKey);
            setDisplayValue(found ? formatDisplayValue(found.textValue) : "");
        } else {
            setDisplayValue("");
        }
        resetFilter();
    }, [setDisplayValue, resetFilter]);

    const handleSelect = (item) => {
        resetFilter();
        selectOption(item);   // setDisplayValue + close + callback
    };

    const handleClear = () => {
        resetFilter();
        clearSelection();
        recalcCoords();
        open();
        if (inputRef.current) inputRef.current.focus();
    };

    const handleToggle = () => {
        recalcCoords();
        toggle();
    };

    return (
        <div ref={containerRef} className={`relative w-full ${className}`}>
            {/* ── Trigger: input con label flotante ──────────────────────── */}
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
                onBlur={restoreDisplayValue}
                onKeyDown={handleKeyDown}
                onClear={handleClear}
                onToggle={handleToggle}
            />

            {/* ── Dropdown flotante (vía portal) ─────────────────────────── */}
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
