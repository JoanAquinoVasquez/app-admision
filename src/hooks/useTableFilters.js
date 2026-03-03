import { useState, useMemo, useCallback, useEffect } from "react";

/**
 * Hook genérico para manejar filtrado, ordenamiento y paginación de tablas.
 *
 * Lógica del filtro de Grado (gradoFilter):
 *  - Es un Set con los UIDs de los grados VISIBLES (los que tienen ✓ en el dropdown)
 *  - Set con TODOS los grados → sin filtro activo, muestra todo
 *  - Set con ALGUNOS grados → solo muestra los desmarcados
 *  - Set VACÍO no ocurre (disallowEmptySelection en el Dropdown)
 *
 * @param {Array}  data    - Datos a filtrar y ordenar
 * @param {Object} options - Configuración
 * @param {number}   options.initialRowsPerPage   - Filas por página (default 10)
 * @param {string}   options.initialSortColumn    - Columna de ordenamiento inicial
 * @param {string}   options.initialSortDirection - Dirección de ordenamiento inicial
 * @param {Set}      options.initialGradoFilter   - Set inicial con los UIDs de grados visibles
 *                                                  (debe incluir TODOS para que todo esté activo)
 * @param {number}   options.totalGradoOptions    - Total de opciones del dropdown de grado
 * @param {Function} options.customFilter         - Filtro personalizado adicional
 */
export const useTableFilters = (data = [], options = {}) => {
    const {
        initialRowsPerPage = 10,
        initialSortColumn = "id",
        initialSortDirection = "ascending",
        initialGradoFilter = new Set(),   // Set vacío = sin filtro
        totalGradoOptions = 0,            // 0 = no limitar
        customFilter = null,
    } = options;

    // Estados de filtrado
    const [filterValue, setFilterValue] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [gradoFilter, setGradoFilter] = useState(initialGradoFilter);
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

        // ── Filtro de búsqueda general ────────────────────────────────────────
        if (filterValue) {
            const lower = filterValue.toLowerCase();
            filtered = filtered.filter((item) =>
                Object.values(item).some((value) =>
                    value?.toString().toLowerCase().includes(lower)
                )
            );
        }

        // ── Filtro de estado ──────────────────────────────────────────────────
        if (statusFilter !== "all" && statusFilter?.size > 0) {
            filtered = filtered.filter((item) =>
                statusFilter.has(item.estado?.toString())
            );
        }

        // ── Filtro de Grado ───────────────────────────────────────────────────
        // gradoFilter es un Set<string> con los grados VISIBLES (los que tienen ✓)
        // Si tiene todos los grados → sin filtro → mostrar todo
        // Si tiene algunos         → mostrar solo esos
        const isSetFilter = gradoFilter instanceof Set;
        if (isSetFilter && gradoFilter.size > 0) {
            // Solo aplicar filtro si es selección parcial (alguno fue desmarcado)
            const isPartial = totalGradoOptions > 0
                ? gradoFilter.size < totalGradoOptions
                : true; // si no sabemos el total, siempre filtramos

            if (isPartial) {
                filtered = filtered.filter((item) => {
                    // Estrategia 1: campo grado_id disponible → comparar con uid
                    const gradoId = item.grado_id?.toString();
                    if (gradoId) return gradoFilter.has(gradoId);

                    // Estrategia 2: campo grado_programa → verificar si empieza con algún uid
                    const gpLower = item.grado_programa?.toLowerCase() ?? "";
                    return Array.from(gradoFilter).some((uid) =>
                        gpLower.startsWith(uid.toLowerCase())
                    );
                });
            }
        } else if (!isSetFilter && gradoFilter !== "all" && gradoFilter !== "" && gradoFilter != null) {
            // Filtro simple por string/number (ej. usado en InscritosToolbar)
            filtered = filtered.filter(
                (item) => item.grado_id == gradoFilter
            );
        }

        // ── Filtro de Programa ────────────────────────────────────────────────
        if (programaFilter !== "all" && programaFilter !== null && programaFilter !== undefined) {
            if (Array.isArray(programaFilter)) {
                if (programaFilter.length > 0) {
                    filtered = filtered.filter((item) =>
                        programaFilter.includes(item.programa_id)
                    );
                }
            } else if (programaFilter instanceof Set) {
                if (programaFilter.size > 0) {
                    filtered = filtered.filter((item) =>
                        programaFilter.has(item.programa_id)
                    );
                }
            } else {
                filtered = filtered.filter(
                    (item) => item.programa_id == programaFilter
                );
            }
        }

        // ── Filtro personalizado adicional ────────────────────────────────────
        if (customFilter && typeof customFilter === "function") {
            filtered = customFilter(filtered, {
                filterValue,
                statusFilter,
                gradoFilter,
                programaFilter,
            });
        }

        return filtered;
    }, [
        data,
        filterValue,
        statusFilter,
        gradoFilter,
        programaFilter,
        customFilter,
        totalGradoOptions,
    ]);

    // ── Ordenamiento ──────────────────────────────────────────────────────────
    const sortedItems = useMemo(() => {
        return [...filteredItems].sort((a, b) => {
            const first = a[sortDescriptor.column];
            const second = b[sortDescriptor.column];
            const cmp = first < second ? -1 : first > second ? 1 : 0;
            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [filteredItems, sortDescriptor]);

    // ── Paginación ────────────────────────────────────────────────────────────
    const pages = Math.max(1, Math.ceil(filteredItems.length / rowsPerPage));

    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        return sortedItems.slice(start, start + rowsPerPage);
    }, [page, sortedItems, rowsPerPage]);

    // Reiniciar paginación cuando cambian los filtros
    useEffect(() => {
        setPage(1);
    }, [filterValue, statusFilter, gradoFilter, programaFilter]);

    // ── Handlers ──────────────────────────────────────────────────────────────
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
