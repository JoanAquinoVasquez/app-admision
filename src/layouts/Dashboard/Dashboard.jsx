import { Suspense, lazy } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import SidebarMenu from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import Spinner from "../../components/Spinner/Spinner";
import NotFound from "../../pages/NotFound/NotFound";
import ProtectedRoute from "../../services/ProtectedRoute";
import Footer from "../../components/Footer/Footer";

const Inicio = lazy(() => import("../Inicio/Inicio"));
const ListaPreinscritos = lazy(() =>
    import("../Preinscripcion/ListaPreinscritos/ListaPreinscritos")
);
const ListaInscritos = lazy(() =>
    import("../Inscripcion/ListaInscritos/ListaInscritos")
);
const ListaInscritosFisico = lazy(() =>
    import("../Inscripcion/ListaInscritos/ListaInscritosFisico")
);
const ListaInscritosPendientes = lazy(() =>
    import("../Inscripcion/ListaInscritos/ListaInscritosPendientes")
);
const PostulantesAptos = lazy(() =>
    import("../Evaluacion/PostulantesAptos/PostulantesAptos")
);
const ListaIngresantes = lazy(() =>
    import("../Resultados/ListaIngresantes/ListaIngresantes")
);
const GestionUsuarios = lazy(() =>
    import("../Usuarios/GestionUsuarios/GestionUsuarios")
);
const Voucher = lazy(() => import("../Inscripcion/Voucher/Voucher"));
const Bitacora = lazy(() => import("../Bitacora/Bitacora"));
const AsignarDocente = lazy(() => import("../Docente/Docente/AsignarDocente"));

const DashboardLayout = () => (
    <div className="flex h-screen overflow-hidden">
        <SidebarMenu />
        <div className="flex-1 overflow-x-auto h-full flex flex-col">
            <Navbar />
            <div className="px-3 sm:px-3 md:px-3 h-auto flex-1">
                <Outlet />
            </div>
            <Footer />
        </div>
    </div>
);

const Dashboard = () => {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <ProtectedRoute
                        allowedRoles={["super-admin", "admin", "comision"]}
                    >
                        <DashboardLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<Navigate to="inicio" replace />} />
                <Route
                    path="inicio"
                    element={
                        <Suspense fallback={<Spinner label="Cargando..." />}>
                            <Inicio />
                        </Suspense>
                    }
                />

                {/* SUPER ADMIN */}
                <Route
                    path="cargar-vouchers"
                    element={
                        <ProtectedRoute allowedRoles={["super-admin"]}>
                            <Suspense
                                fallback={<Spinner label="Cargando..." />}
                            >
                                <Voucher />
                            </Suspense>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="bitacora"
                    element={
                        <ProtectedRoute allowedRoles={["super-admin"]}>
                            <Suspense
                                fallback={<Spinner label="Cargando..." />}
                            >
                                <Bitacora />
                            </Suspense>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="asignar-docentes"
                    element={
                        <ProtectedRoute allowedRoles={["super-admin"]}>
                            <Suspense
                                fallback={<Spinner label="Cargando..." />}
                            >
                                <AsignarDocente />
                            </Suspense>
                        </ProtectedRoute>
                    }
                />

                {/* ADMINISTRATIVO */}
                <Route
                    path="validar-expedientes"
                    element={
                        <ProtectedRoute allowedRoles={["super-admin", "admin"]}>
                            <Suspense
                                fallback={<Spinner label="Cargando..." />}
                            >
                                <ListaInscritosFisico />
                            </Suspense>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="gestionar-evaluaciones"
                    element={
                        <ProtectedRoute allowedRoles={["super-admin", "admin"]}>
                            <Suspense
                                fallback={<Spinner label="Cargando..." />}
                            >
                                <PostulantesAptos />
                            </Suspense>
                        </ProtectedRoute>
                    }
                />

                {/* COMISIÓN */}
                <Route
                    path="inicio"
                    element={
                        <ProtectedRoute
                            allowedRoles={["super-admin", "admin", "comision"]}
                        >
                            <Suspense
                                fallback={<Spinner label="Cargando..." />}
                            >
                                <Inicio />
                            </Suspense>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="preinscripciones"
                    element={
                        <ProtectedRoute
                            allowedRoles={["super-admin", "admin", "comision"]}
                        >
                            <Suspense
                                fallback={<Spinner label="Cargando..." />}
                            >
                                <ListaPreinscritos />
                            </Suspense>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="inscripciones"
                    element={
                        <ProtectedRoute
                            allowedRoles={["super-admin", "admin", "comision"]}
                        >
                            <Suspense
                                fallback={<Spinner label="Cargando..." />}
                            >
                                <ListaInscritos />
                            </Suspense>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="inscripcion-pendiente"
                    element={
                        <ProtectedRoute
                            allowedRoles={["super-admin", "admin", "comision"]}
                        >
                            <Suspense
                                fallback={<Spinner label="Cargando..." />}
                            >
                                <ListaInscritosPendientes />
                            </Suspense>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="resultados"
                    element={
                        <ProtectedRoute
                            allowedRoles={["super-admin", "admin", "comision"]}
                        >
                            <Suspense
                                fallback={<Spinner label="Cargando..." />}
                            >
                                <ListaIngresantes />
                            </Suspense>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="gestionar-usuarios"
                    element={
                        <ProtectedRoute allowedRoles={["super-admin"]}>
                            <Suspense
                                fallback={<Spinner label="Cargando..." />}
                            >
                                <GestionUsuarios />
                            </Suspense>
                        </ProtectedRoute>
                    }
                />

                {/* DEFAULT */}
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
};

export default Dashboard;
