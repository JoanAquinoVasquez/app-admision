import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Accordion, AccordionItem } from "@nextui-org/react";
import { motion } from "framer-motion";
import { FaBars, FaChevronDown, FaChevronRight } from "react-icons/fa";
import imgcollapsed from "../../assets/Isotipos/isotipo_color_epg.webp";
import "./Sidebar.css";
import useRoutes from "./RoutesSidebar.jsx";
import Spinner from "../Spinner/Spinner.jsx";
import RoleGuard from "../../services/RoleGuard.jsx";
import { useUser } from "../../services/UserContext.jsx";

const SidebarMenu = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { userData } = useUser();
    const [isLgScreen, setIsLgScreen] = useState(false);
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const {
        menuItems,
        preInscripcionItems,
        inscripcionItems,
        evaluacionItems,
        registrosItems,
        resultadosItems,
        gestionItems,
        loading,
    } = useRoutes();

    const sections = {
        preInscripcion: preInscripcionItems,
        inscripcion: inscripcionItems,
        evaluacion: evaluacionItems,
        resultados: resultadosItems,
        usuarios: gestionItems,
        registros: registrosItems,
    };

    const getExpandedState = () => {
        const expanded = {};
        for (const key in sections) {
            expanded[key] = sections[key]?.some((item) => {
                if (item.subLinks) {
                    return item.subLinks.some((sub) =>
                        pathname.includes(sub.to)
                    );
                }
                return pathname.includes(item.to);
            });
        }
        return expanded;
    };

    const [expandedSections, setExpandedSections] = useState(getExpandedState);

    useEffect(() => {
        const handleResize = () => {
            const isLarge = window.innerWidth >= 1024;
            setIsLgScreen(isLarge);
            if (isLarge) setIsExpanded(false);
        };

        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        setExpandedSections(getExpandedState());
    }, [pathname]);

    const toggleSidebar = () => setIsExpanded(!isExpanded);
    const toggleSection = (section) =>
        setExpandedSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));

    const renderMenuItems = (items) =>
        items.map(({ to, icon, text, subLinks, roles }, index) => {
            const match = pathname.includes(`/${to}`);
            const isActive = Boolean(match);

            return (
                <RoleGuard key={`guard-${index}-${to}`} allowedRoles={roles}>
                    {!subLinks ? (
                        <li
                            role="menuitem"
                            key={`menu-item-${index}-${to}`}
                            className={`li-sidebar w-full block px-6 py-2 rounded cursor-pointer transition-colors ${
                                isActive
                                    ? "bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200 hover:text-blue-700"
                                    : "text-gray-600 hover:bg-gray-100 bg-white hover:text-gray-700"
                            }`}
                            onClick={() => navigate(to)}
                        >
                            <div className="flex items-center w-full">
                                {icon}
                                <span className="ml-3 truncate">{text}</span>
                            </div>
                        </li>
                    ) : (
                        <li className="w-full list-none">
                            <Accordion
                                disableAnimation={false}
                                className="accordion-sidebar w-full"
                            >
                                <AccordionItem
                                    key={`accordion-item-${index}`}
                                    aria-label={`Toggle ${text}`}
                                    isCompact
                                    className="w-full"
                                    variant="light"
                                    title={
                                        <div
                                            className={`li-sidebar px-3 py-2 w-full flex items-center ${
                                                match
                                                    ? "text-blue-600 font-semibold"
                                                    : "text-gray-600"
                                            }`}
                                        >
                                            {icon}
                                            <span className="ml-3 truncate">
                                                {text}
                                            </span>
                                        </div>
                                    }
                                >
                                    <ul
                                        role="menu"
                                        className="ml-6 flex flex-col w-full space-y-2"
                                    >
                                        {subLinks.map((subLink, subIndex) => (
                                            <RoleGuard
                                                key={`sub-link-${subIndex}-${subLink.to}`}
                                                allowedRoles={subLink.roles}
                                            >
                                                <li
                                                    role="menuitem"
                                                    className={`li-sidebar w-full block px-2 py-1 rounded cursor-pointer ${
                                                        pathname.includes(
                                                            `/${subLink.to}`
                                                        )
                                                            ? "bg-blue-100 text-blue-600 font-semibold"
                                                            : "text-gray-600 hover:bg-gray-100"
                                                    }`}
                                                    onClick={() =>
                                                        navigate(subLink.to)
                                                    }
                                                >
                                                    <span className="truncate">
                                                        {subLink.text}
                                                    </span>
                                                </li>
                                            </RoleGuard>
                                        ))}
                                    </ul>
                                </AccordionItem>
                            </Accordion>
                        </li>
                    )}
                </RoleGuard>
            );
        });

    const renderSection = (title, items, sectionKey) => {
        const visibleItems = items.filter((item) => {
            const userRoles = userData?.roles || [];
            if (!item.roles || item.roles.length === 0) return true;
            return item.roles.some((role) => userRoles.includes(role));
        });

        if (visibleItems.length === 0) return null;

        return (
            <li key={sectionKey} className="mt-0 list-none w-full h-full">
                <div className="flex flex-col w-full">
                    <button
                        onClick={() => toggleSection(sectionKey)}
                        aria-expanded={expandedSections[sectionKey]}
                        aria-controls={`submenu-${sectionKey}`}
                        className="w-full flex items-center justify-between px-4 py-1 mb-1 text-gray-600 font-semibold rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <span>{title.toUpperCase()}</span>
                        {expandedSections[sectionKey] ? (
                            <FaChevronDown />
                        ) : (
                            <FaChevronRight />
                        )}
                    </button>

                    <motion.ul
                        id={`submenu-${sectionKey}`}
                        role="menu"
                        initial={{ height: 0, opacity: 0 }}
                        animate={
                            expandedSections[sectionKey]
                                ? { height: "auto", opacity: 1 }
                                : { height: 0, opacity: 0 }
                        }
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden flex flex-col w-full pl-3 space-y-0"
                        style={{ willChange: "height, opacity" }}
                    >
                        {renderMenuItems(visibleItems)}
                    </motion.ul>
                </div>
            </li>
        );
    };

    return (
        <div>
            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 z-50">
                    <Spinner label={"Generando Reporte..."} />
                </div>
            )}
            {!isLgScreen && (
                <button
                    onClick={toggleSidebar}
                    className="fixed top-4 left-4 z-50 p-3 bg-gray-100 rounded-full shadow-lg hover:bg-gray-200 lg:hidden"
                    aria-label="Toggle Sidebar"
                >
                    <FaBars />
                </button>
            )}

            <div
                className={`fixed top-0 left-0 h-screen z-40 bg-white shadow-lg w-60 ${
                    isExpanded ? "translate-x-0" : "-translate-x-full"
                } transition-transform duration-300 lg:relative lg:translate-x-0`}
            >
                <div className="flex items-center justify-center p-2">
                    <img
                        src={imgcollapsed}
                        alt="Logo EPG"
                        fetchpriority="high"
                        decoding="async"
                        loading="eager"
                        width="228"
                        height="120"
                        className="h-24 w-auto"
                    />
                </div>

                <div className="px-6">
                    <h2 className="text-md font-semibold text-gray-600">
                        Aplicación Admisión-EPG
                    </h2>
                </div>

                <nav
                    className="flex-1 mt-8 overflow-y-auto lg:max-h-[calc(100vh-200px)] max-h-screen"
                    aria-label="Menú principal"
                >
                    <ul className="flex flex-col w-full space-y-1 px-2">
                        {/* Items principales */}
                        <li className="w-full">
                            <ul
                                role="menu"
                                className="flex flex-col w-full space-y-0 pl-2"
                            >
                                {renderMenuItems(menuItems)}
                            </ul>
                        </li>

                        {/* Secciones */}
                        {Object.keys(sections).map((section) =>
                            renderSection(section, sections[section], section)
                        )}
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default SidebarMenu;
