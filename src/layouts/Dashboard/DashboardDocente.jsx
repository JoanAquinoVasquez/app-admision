import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import SidebarMenu from "../../components/Sidebar/Sidebar";
import NavbarDocente from "../../components/Navbar/NavbarDocente";
import Notfound from "../../pages/NotFound/NotFound";
import "./Dashboard.css";
import Spinner from "../../components/Spinner/Spinner";
import { DocenteProvider } from "../../services/UserContextDocente";
import InicioDocente from "../Inicio/InicioDocente";

function Dashboard() {
    const location = useLocation();

    // Definimos las rutas de Dashboard dentro de un array usando import() dinámico
    const routes = [
        {
            path: "/docente/inicio",
            element: React.lazy(() => import("../Inicio/InicioDocente")),
        },
    ];

    // Extraemos los paths de las rutas definidas en el array anterior
    const validPaths = routes.map((route) => route.path);
    const isNotFound = !validPaths.includes(location.pathname);

    return isNotFound ? (
        <Notfound /> // Muestra Notfound a pantalla completa
    ) : (
        <div className="flex h-screen overflow-hidden">
            {" "}
            {/* Flex para mantener el sidebar y contenido juntos */}
            {/* <SidebarMenu /> */}
            <div className="flex-1 overflow-x-auto">
                {" "}
                {/* Contenedor del contenido con scroll horizontal */}
                <NavbarDocente />
                <div className="px-4 sm:px-6 md:px-8 contenido-cambiante">
                    {/* Padding adaptable */}
                    <Routes>
                        {routes.map((route, index) => (
                            <Route
                                key={index}
                                path={route.path}
                                element={<route.element />}
                            />
                        ))}
                        <Route path="*" element={<InicioDocente />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
