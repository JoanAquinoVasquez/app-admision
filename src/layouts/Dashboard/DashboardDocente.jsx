import { lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import NavbarDocente from "../../components/Navbar/NavbarDocente";
import Footer from "../../components/Footer/Footer";
import Notfound from "../../pages/NotFound/NotFound";
import "./Dashboard.css";

const InicioDocenteLazy = lazy(() => import("../Inicio/InicioDocente"));

function Dashboard() {
    const location = useLocation();

    // Definimos las rutas de Dashboard dentro de un array usando import() dinámico
    const routes = [
        {
            path: "/docente/inicio",
            element: InicioDocenteLazy,
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
            <div className="flex-1 overflow-auto bg-[#fafafb] h-full flex flex-col relative w-full pt-0">
                {" "}
                {/* Contenedor del contenido con scroll horizontal */}
                <NavbarDocente />
                <div className="px-4 sm:px-6 md:px-8 shrink-0 flex-1 min-w-0 mb-4 contenido-cambiante">
                    {/* Padding adaptable */}
                    <Routes>
                        {routes.map((route, index) => (
                            <Route
                                key={index}
                                path={route.path}
                                element={<route.element />}
                            />
                        ))}
                        <Route path="*" element={<InicioDocenteLazy />} />
                    </Routes>
                </div>
                <div className="mt-auto shrink-0 w-full">
                    <Footer />
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
