import ReactDOM from "react-dom/client";
import { StrictMode, lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NextUIProvider } from "@nextui-org/react";
import "./index.css";
import "./bootstrap";
import Spinner from "./components/Spinner/Spinner.jsx";
import { Toaster, toast } from "react-hot-toast";

// Lazy load route components for code splitting
const Index = lazy(() => import("./layouts/Index/Index.jsx"));
const Login = lazy(() => import("./layouts/Login/Login.jsx"));
const LoginDocente = lazy(() => import("./layouts/Login/LoginDocente.jsx"));
const IndexPreInscripcion = lazy(() => import("./layouts/Preinscripcion/FormPreinscripcion.jsx"));
const IndexInscripcion = lazy(() => import("./layouts/Inscripcion/Index.jsx"));
const IndexValidacion = lazy(() => import("./layouts/Inscripcion/IndexValidacion.jsx"));
const Dashboard = lazy(() => import("./layouts/Dashboard/Dashboard"));
const DashboardDocente = lazy(() => import("./layouts/Dashboard/DashboardDocente.jsx"));
const Footer = lazy(() => import("./components/Footer/Footer.jsx"));
const Notfound = lazy(() => import("./pages/NotFound/NotFound.jsx"));
const ProtectedRouteDocente = lazy(() => import("./services/ProtectedRouteDocente.jsx"));

// Landing pages de posgrado
const Maestrias = lazy(() => import("./layouts/Maestrias/Maestrias.jsx"));
const Doctorados = lazy(() => import("./layouts/Doctorados/Doctorados.jsx"));
const Prospecto = lazy(() => import("./layouts/Prospecto/Prospecto.jsx"));
const SegundasEspecialidades = lazy(() => import("./layouts/SegundasEspecialidades/SegundasEspecialidades.jsx"));

// Import providers (keep these eager as they're needed immediately)
import { DocenteProvider } from "./services/UserContextDocente.jsx";
import { UserProvider } from "./services/UserContext.jsx";

const rootElement = document.getElementById("root");
const App = () => {

    return (
        <StrictMode>
            <Toaster position="top-center" containerStyle={{ zIndex: 99999 }} />
            <NextUIProvider>
                <BrowserRouter basename="/admision-epg">
                    <UserProvider>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                minHeight: "100vh",
                            }}
                        >
                            <main style={{ flex: 1 }}>
                                <Suspense fallback={<Spinner />}>
                                    <Routes>
                                        {/* Rutas públicas */}
                                        <Route path="/" element={<Index />} />
                                        <Route path="/login" element={<Login />} />
                                        <Route
                                            path="/inscripcion"
                                            element={<IndexInscripcion />}
                                        />
                                        <Route
                                            path="/preinscripcion"
                                            element={<IndexPreInscripcion />}
                                        />
                                        <Route
                                            path="/inscripcion/confirmacion"
                                            element={<IndexValidacion />}
                                        />

                                        {/* Landing pages de posgrado */}
                                        <Route path="/maestrias" element={<Maestrias />} />
                                        <Route path="/doctorados" element={<Doctorados />} />
                                        <Route path="/prospecto" element={<Prospecto />} />
                                        <Route path="/segundas-especialidades" element={<SegundasEspecialidades />} />

                                        {/* Rutas de docente (login y protegidas) */}
                                        <Route
                                            path="/iniciar-sesion"
                                            element={
                                                <DocenteProvider>
                                                    <LoginDocente />
                                                </DocenteProvider>
                                            }
                                        />
                                        <Route
                                            path="/docente/*"
                                            element={
                                                <DocenteProvider>
                                                    <Suspense fallback={<Spinner />}>
                                                        <ProtectedRouteDocente>
                                                            <DashboardDocente />
                                                            <Footer />
                                                        </ProtectedRouteDocente>
                                                    </Suspense>
                                                </DocenteProvider>
                                            }
                                        />

                                        {/* Rutas protegidas generales */}
                                        <Route
                                            path="/auth/*"
                                            element={
                                                <Dashboard />
                                            }
                                        />

                                        {/* Página 404 al final */}
                                        <Route path="*" element={<Notfound />} />
                                    </Routes>
                                </Suspense>
                            </main>
                        </div>
                    </UserProvider>
                </BrowserRouter>
            </NextUIProvider>
        </StrictMode>
    );
};

if (rootElement) {
    if (!window._root) {
        window._root = ReactDOM.createRoot(rootElement);
    }
    window._root.render(<App />);
}

