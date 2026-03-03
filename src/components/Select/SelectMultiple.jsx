import { Select as HeroSelect, SelectItem, Chip } from "@heroui/react";
import { formatDisplayValue } from "./utils/formatDisplay";


/**
 * MultiSelect – select con selección múltiple.
 *
 * Usa HeroUI Select (selectionMode="multiple") que ya maneja:
 *  - Filtrado de búsqueda nativo
 *  - Cierre al hacer clic fuera
 *  - Accesibilidad (ARIA)
 *
 * Principios aplicados:
 *  - SRP: este componente solo "configura" el HeroUI Select para modo múltiple.
 *  - ISP: props mínimas y descritas.
 *  - DIP: depende de la abstracción HeroUI (no implementación manual de dropdown).
 *
 * Props:
 *  @param {string}   label           - Etiqueta del campo
 *  @param {string}   className       - Clases extra del wrapper
 *  @param {Array}    defaultItems    - [{ key: string, textValue: string }]
 *  @param {Array}    selectedKeys    - Keys seleccionados actualmente (controlled)
 *  @param {Function} onSelectionChange - (keys: string[]) => void
 *  @param {boolean}  isRequired      - Marca el campo como requerido
 *  @param {boolean}  disabled        - Deshabilita el componente
 */
const MultiSelect = ({
    label,
    className = "",
    defaultItems = [],
    selectedKeys = [],
    onSelectionChange,
    isRequired = false,
    disabled = false,
}) => {
    const handleChange = (keys) => {
        if (onSelectionChange) {
            onSelectionChange(Array.from(keys));
        }
    };

    const renderSelectedChips = (items) => {
        if (!items || items.length === 0) return null;

        if (items.length > 1) {
            return (
                <div className="flex flex-wrap gap-1 py-0.5">
                    <Chip size="sm" variant="flat" color="primary">
                        {items.length} programas seleccionados
                    </Chip>
                </div>
            );
        }

        return (
            <div className="flex flex-wrap gap-1 py-0.5">
                {items.map((item) => (
                    <Chip key={item.key} size="sm" variant="flat" color="primary" className="max-w-[200px] sm:max-w-full truncate">
                        {formatDisplayValue(item.textValue)}
                    </Chip>
                ))}
            </div>
        );
    };

    return (
        <HeroSelect
            label={label}
            className={`w-full ${className}`}
            items={defaultItems}
            selectedKeys={selectedKeys}
            onSelectionChange={handleChange}
            selectionMode="multiple"
            isRequired={isRequired}
            isDisabled={disabled}
            variant="flat"
            isMultiline={false}
            renderValue={renderSelectedChips}
            listboxProps={{
                emptyContent: "No se encontraron resultados.",
                itemClasses: {
                    // Evita que textos largos se trunquen en la lista
                    title: "whitespace-normal break-words",
                },
            }}
        >
            {(item) => (
                <SelectItem key={item.key} textValue={formatDisplayValue(item.textValue)}>
                    {formatDisplayValue(item.textValue)}
                </SelectItem>
            )}
        </HeroSelect>
    );
};

export default MultiSelect;
