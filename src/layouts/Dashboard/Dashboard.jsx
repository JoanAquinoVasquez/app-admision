import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Spinner from "../../components/Spinner/Spinner";
import NotFound from "../../pages/NotFound/NotFound";
import ProtectedRoute from "../../services/ProtectedRoute";
import DashboardLayout from "./DashboardLayout";

// Lazy loading components
const Inicio = lazy(() => import("../Inicio/Inicio"));
const ListaPreinscritos = lazy(() => import("../Preinscripcion/ListaPreinscritos/ListaPreinscritos"));
const ListaInscritos = lazy(() => import("../Inscripcion/ListaInscritos/ListaInscritos"));
const ListaInscritosFisico = lazy(() => import("../Inscripcion/ListaInscritos/ListaInscritosFisico"));
const ListaInscritosPendientes = lazy(() => import("../Inscripcion/ListaInscritos/ListaInscritosPendientes"));
const PostulantesAptos = lazy(() => import("../Evaluacion/PostulantesAptos/PostulantesAptos"));
const ListaIngresantes = lazy(() => import("../Resultados/ListaIngresantes/ListaIngresantes"));
const GestionUsuarios = lazy(() => import("../Usuarios/GestionUsuarios/GestionUsuarios"));
const Voucher = lazy(() => import("../Inscripcion/Voucher/Voucher"));
const Bitacora = lazy(() => import("../Bitacora/Bitacora"));
const AsignarDocente = lazy(() => import("../Docente/Docente/AsignarDocente"));

// Helper for cleaner JSX
const SuspenseWrapper = ({ children }) => (
    <Suspense fallback={<Spinner label="Cargando..." fullScreen={false} />}>
        {children}
    </Suspense>
);

const Dashboard = () => {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <ProtectedRoute allowedRoles={["super-admin", "admin", "comision"]}>
                        <DashboardLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<Navigate to="inicio" replace />} />
                <Route
                    path="inicio"
                    element={
                        <SuspenseWrapper>
                            <Inicio />
                        </SuspenseWrapper>
                    }
                />

                {/* SUPER ADMIN */}
                <Route
                    path="cargar-vouchers"
                    element={
                        <ProtectedRoute allowedRoles={["super-admin", "admin"]}>
                            <SuspenseWrapper>
                                <Voucher />
                            </SuspenseWrapper>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="bitacora"
                    element={
                        <ProtectedRoute allowedRoles={["super-admin", "admin"]}>
                            <SuspenseWrapper>
                                <Bitacora />
                            </SuspenseWrapper>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="asignar-docentes"
                    element={
                        <ProtectedRoute allowedRoles={["super-admin"]}>
                            <SuspenseWrapper>
                                <AsignarDocente />
                            </SuspenseWrapper>
                        </ProtectedRoute>
                    }
                />

                {/* ADMINISTRATIVO */}
                <Route
                    path="validar-expedientes"
                    element={
                        <ProtectedRoute allowedRoles={["super-admin", "admin"]}>
                            <SuspenseWrapper>
                                <ListaInscritosFisico />
                            </SuspenseWrapper>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="gestionar-evaluaciones"
                    element={
                        <ProtectedRoute allowedRoles={["super-admin", "admin"]}>
                            <SuspenseWrapper>
                                <PostulantesAptos />
                            </SuspenseWrapper>
                        </ProtectedRoute>
                    }
                />

                {/* COMISIÓN */}
                <Route
                    path="inicio"
                    element={
                        <ProtectedRoute allowedRoles={["super-admin", "admin", "comision"]}>
                            <SuspenseWrapper>
                                <Inicio />
                            </SuspenseWrapper>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="preinscripciones"
                    element={
                        <ProtectedRoute allowedRoles={["super-admin", "admin", "comision"]}>
                            <SuspenseWrapper>
                                <ListaPreinscritos />
                            </SuspenseWrapper>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="inscripciones"
                    element={
                        <ProtectedRoute allowedRoles={["super-admin", "admin", "comision"]}>
                            <SuspenseWrapper>
                                <ListaInscritos />
                            </SuspenseWrapper>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="inscripcion-pendiente"
                    element={
                        <ProtectedRoute allowedRoles={["super-admin", "admin", "comision"]}>
                            <SuspenseWrapper>
                                <ListaInscritosPendientes />
                            </SuspenseWrapper>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="resultados"
                    element={
                        <ProtectedRoute allowedRoles={["super-admin", "admin", "comision"]}>
                            <SuspenseWrapper>
                                <ListaIngresantes />
                            </SuspenseWrapper>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="gestionar-usuarios"
                    element={
                        <ProtectedRoute allowedRoles={["super-admin"]}>
                            <SuspenseWrapper>
                                <GestionUsuarios />
                            </SuspenseWrapper>
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
