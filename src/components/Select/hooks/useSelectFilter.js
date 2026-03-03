import { useState, useEffect } from "react";

/**
 * Hook responsable ÚNICAMENTE de filtrar opciones por texto.
 * (Single Responsibility Principle)
 *
 * @param {Array} items - Lista original de opciones [{ key, textValue }]
 * @returns {{ filteredItems, searchQuery, setSearchQuery, resetFilter }}
 */
const useSelectFilter = (items = []) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredItems, setFilteredItems] = useState(items);

    // Re-sincronizar cuando la lista externa cambia
    useEffect(() => {
        const lower = searchQuery.toLowerCase();
        setFilteredItems(
            items.filter((item) =>
                item.textValue.toLowerCase().includes(lower)
            )
        );
    }, [items, searchQuery]);

    const resetFilter = () => setSearchQuery("");

    return { filteredItems, searchQuery, setSearchQuery, resetFilter };
};

export default useSelectFilter;
