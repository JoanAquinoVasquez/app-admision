import { useEffect } from "react";

/**
 * Hook responsable ÚNICAMENTE de cerrar el dropdown al hacer clic fuera.
 * (Single Responsibility Principle)
 *
 * @param {React.RefObject} containerRef - Ref del contenedor principal
 * @param {React.RefObject} dropdownRef  - Ref del dropdown flotante
 * @param {boolean}         isOpen       - Si el dropdown está abierto
 * @param {Function}        onClose      - Callback para cerrar el dropdown
 */
const useClickOutside = (containerRef, dropdownRef, isOpen, onClose) => {
    useEffect(() => {
        if (!isOpen) return;

        const handleMouseDown = (event) => {
            const clickedOutsideContainer =
                containerRef.current && !containerRef.current.contains(event.target);
            const clickedOutsideDropdown =
                dropdownRef.current && !dropdownRef.current.contains(event.target);

            if (clickedOutsideContainer && clickedOutsideDropdown) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleMouseDown);
        return () => document.removeEventListener("mousedown", handleMouseDown);
    }, [isOpen, containerRef, dropdownRef, onClose]);
};

export default useClickOutside;
