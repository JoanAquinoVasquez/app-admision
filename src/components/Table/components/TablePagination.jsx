import React from "react";
import { Pagination, Button } from "@heroui/react";

/**
 * Componente de paginación reutilizable para las tablas del sistema.
 * 
 * @param {number} page - Página actual 
 * @param {number} pages - Total de páginas
 * @param {function} setPage - Función para cambiar de página
 * @param {string|number|Set} selectedKeys - (Opcional) Keys seleccionadas
 * @param {number} filteredItemsLength - (Opcional) Total de items filtrados
 * @param {boolean} hasSelection - (Opcional) Si la tabla permite selección múltiple
 */
export default function TablePagination({
    page = 1,
    pages = 1,
    setPage,
    selectedKeys,
    filteredItemsLength,
    hasSelection = false,
    customLabel = null,
}) {
    // Siempre renderizamos el contenedor para mantener la consistencia estética
    // aunque no haya páginas (mostraremos "0 resultados" etc.)

    const renderSelectionText = () => {
        if (customLabel) return customLabel;

        if (hasSelection && selectedKeys !== undefined) {
            if (selectedKeys === "all") {
                return "Todos los seleccionados";
            }
            const selectionSize = selectedKeys instanceof Set ? selectedKeys.size : 0;
            return `${selectionSize} de ${filteredItemsLength} seleccionados`;
        }

        return filteredItemsLength !== undefined ? `${filteredItemsLength} resultados` : "";
    };

    return (
        <div className="py-2 px-2 flex justify-between items-center">
            <span className="w-[30%] text-small text-default-400">
                {renderSelectionText()}
            </span>

            <Pagination
                isCompact
                showControls
                showShadow
                color="primary"
                page={page}
                total={Math.max(pages, 1)}
                onChange={setPage}
            />

            <div className="hidden sm:flex w-[30%] justify-end gap-2">
                <Button
                    isDisabled={page === 1}
                    size="sm"
                    variant="flat"
                    onPress={() => setPage((prev) => Math.max(prev - 1, 1))}
                >
                    Anterior
                </Button>
                <Button
                    isDisabled={page === pages}
                    size="sm"
                    variant="flat"
                    onPress={() => setPage((prev) => Math.min(prev + 1, pages))}
                >
                    Siguiente
                </Button>
            </div>
        </div>
    );
}
