import { useState, useMemo, useCallback, useEffect } from "react";

const INITIAL_VISIBLE_COLUMNS = [
    "id",
    "nombre_completo",
    "grado",
    "celular",
    "doc_iden",
    "ruta_dni",
    "ruta_cv",
    "ruta_foto",
    "voucher",
    "ruta_voucher",
    "estado",
    "actions",
];

export function useInscritosFilters(users, columns) {
    const [filterValue, setFilterValue] = useState("");
    const [selectedKeys, setSelectedKeys] = useState(new Set([]));
    const [visibleColumns, setVisibleColumns] = useState(
        new Set(INITIAL_VISIBLE_COLUMNS)
    );
    const [statusFilter, setStatusFilter] = useState("all");
    const [gradoFilter, setGradoFilter] = useState("all");
    const [programaFilter, setProgramaFilter] = useState("all");
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [sortDescriptor, setSortDescriptor] = useState({
        column: "id",
        direction: "ascending",
    });
    const [page, setPage] = useState(1);

    const headerColumns = useMemo(() => {
        return visibleColumns === "all"
            ? columns
            : columns.filter((column) => visibleColumns.has(column.uid));
    }, [visibleColumns, columns]);

    const filteredItems = useMemo(() => {
        let filteredUsers = [...users];
        if (filterValue) {
            const lowerCaseFilter = filterValue.toLowerCase();
            filteredUsers = filteredUsers.filter((user) =>
                Object.values(user).some((value) =>
                    value?.toString().toLowerCase().includes(lowerCaseFilter)
                )
            );
        }
        if (statusFilter !== "all") {
            filteredUsers = filteredUsers.filter((user) =>
                statusFilter.has(user.estado.toString())
            );
        }
        if (gradoFilter !== "all") {
            filteredUsers = filteredUsers.filter(
                (user) => user.grado_id == gradoFilter
            );
        }

        if (programaFilter !== "all") {
            filteredUsers = filteredUsers.filter(
                (user) => user.programa_id == programaFilter
            );
        }

        return filteredUsers;
    }, [filterValue, statusFilter, users, gradoFilter, programaFilter]);

    const sortedItems = useMemo(() => {
        return [...filteredItems].sort((a, b) => {
            const first = a[sortDescriptor.column];
            const second = b[sortDescriptor.column];
            const cmp = first < second ? -1 : first > second ? 1 : 0;
            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, filteredItems]);

    const pages = Math.ceil(filteredItems.length / rowsPerPage);

    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        return sortedItems.slice(start, start + rowsPerPage);
    }, [page, sortedItems, rowsPerPage]);

    useEffect(() => {
        setPage(1);
    }, [filterValue, statusFilter, sortedItems, gradoFilter]);

    const onRowsPerPageChange = useCallback((e) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    }, []);

    const onSearchChange = useCallback((value) => {
        setFilterValue(value || "");
        setPage(1);
    }, []);

    const onClear = useCallback(() => {
        setFilterValue("");
        setPage(1);
    }, []);

    return {
        filterValue,
        setFilterValue,
        selectedKeys,
        setSelectedKeys,
        visibleColumns,
        setVisibleColumns,
        statusFilter,
        setStatusFilter,
        gradoFilter,
        setGradoFilter,
        programaFilter,
        setProgramaFilter,
        rowsPerPage,
        setRowsPerPage,
        sortDescriptor,
        setSortDescriptor,
        page,
        setPage,
        headerColumns,
        filteredItems,
        sortedItems,
        items,
        pages,
        onRowsPerPageChange,
        onSearchChange,
        onClear,
    };
}
