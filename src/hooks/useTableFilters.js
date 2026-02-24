import { useState, useMemo, useCallback, useEffect } from "react";

/**
 * Hook genérico para manejar filtrado, ordenamiento y paginación de tablas
 * @param {Array} data - Datos a filtrar y ordenar
 * @param {Object} options - Opciones de configuración
 * @param {number} options.initialRowsPerPage - Filas por página inicial (default: 10)
 * @param {string} options.initialSortColumn - Columna inicial para ordenar
 * @param {string} options.initialSortDirection - Dirección inicial de ordenamiento ('ascending' | 'descending')
 * @param {Function} options.customFilter - Función personalizada de filtrado adicional
 */
export const useTableFilters = (data = [], options = {}) => {
    const {
        initialRowsPerPage = 10,
        initialSortColumn = "id",
        initialSortDirection = "ascending",
        customFilter = null,
    } = options;

    // Estados de filtrado
    const [filterValue, setFilterValue] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [gradoFilter, setGradoFilter] = useState("all");
    const [programaFilter, setProgramaFilter] = useState("all");

    // Estados de paginación
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);

    // Estado de ordenamiento
    const [sortDescriptor, setSortDescriptor] = useState({
        column: initialSortColumn,
        direction: initialSortDirection,
    });

    // Filtrado de datos
    const filteredItems = useMemo(() => {
        let filtered = [...data];

        // Filtro de búsqueda general
        if (filterValue) {
            const lowerCaseFilter = filterValue.toLowerCase();
            filtered = filtered.filter((item) =>
                Object.values(item).some((value) =>
                    value?.toString().toLowerCase().includes(lowerCaseFilter)
                )
            );
        }

        // Filtro de estado
        if (statusFilter !== "all" && statusFilter.size > 0) {
            filtered = filtered.filter((item) =>
                statusFilter.has(item.estado?.toString())
            );
        }

        // Filtro de grado
        if (gradoFilter !== "all") {
            if (typeof gradoFilter === "object" && gradoFilter.size > 0) {
                // Para filtros múltiples (Set)
                filtered = filtered.filter((item) => {
                    const gradoProgramUid = item.grado_programa
                        ? item.grado_programa.split(" - ")[0]
                        : "";
                    return gradoFilter.has(gradoProgramUid);
                });
            } else {
                // Para filtro simple
                filtered = filtered.filter(
                    (item) => item.grado_id === gradoFilter
                );
            }
        }

        // Filtro de programa
        if (programaFilter !== "all") {
            if (Array.isArray(programaFilter) && programaFilter.length > 0) {
                filtered = filtered.filter((item) =>
                    programaFilter.includes(item.programa_id)
                );
            } else {
                filtered = filtered.filter(
                    (item) => item.programa_id === programaFilter
                );
            }
        }

        // Filtro personalizado adicional
        if (customFilter && typeof customFilter === "function") {
            filtered = customFilter(filtered, { filterValue, statusFilter, gradoFilter, programaFilter });
        }

        return filtered;
    }, [
        data,
        filterValue,
        statusFilter,
        gradoFilter,
        programaFilter,
        customFilter,
    ]);

    // Ordenamiento de datos
    const sortedItems = useMemo(() => {
        return [...filteredItems].sort((a, b) => {
            const first = a[sortDescriptor.column];
            const second = b[sortDescriptor.column];
            const cmp = first < second ? -1 : first > second ? 1 : 0;
            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [filteredItems, sortDescriptor]);

    // Cálculo de páginas
    const pages = Math.max(1, Math.ceil(filteredItems.length / rowsPerPage));

    // Items de la página actual
    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        return sortedItems.slice(start, start + rowsPerPage);
    }, [page, sortedItems, rowsPerPage]);

    // Reiniciar a la primera página cuando cambian los filtros
    useEffect(() => {
        setPage(1);
    }, [filterValue, statusFilter, gradoFilter, programaFilter]);

    // Handlers
    const onSearchChange = useCallback((value) => {
        setFilterValue(value || "");
        setPage(1);
    }, []);

    const onClear = useCallback(() => {
        setFilterValue("");
        setPage(1);
    }, []);

    const onRowsPerPageChange = useCallback((e) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    }, []);

    return {
        // Estados
        filterValue,
        statusFilter,
        gradoFilter,
        programaFilter,
        page,
        rowsPerPage,
        sortDescriptor,

        // Setters
        setFilterValue,
        setStatusFilter,
        setGradoFilter,
        setProgramaFilter,
        setPage,
        setRowsPerPage,
        setSortDescriptor,

        // Datos procesados
        filteredItems,
        sortedItems,
        items,
        pages,

        // Handlers
        onSearchChange,
        onClear,
        onRowsPerPageChange,

        // Utilidades
        hasSearchFilter: Boolean(filterValue),
    };
};
