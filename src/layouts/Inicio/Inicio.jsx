import { useState } from "react";
import { Tabs, Tab, Spinner } from "@heroui/react";

// Tabs
import React, { Suspense } from "react";

// Tabs
const TabEvaluacion = React.lazy(() => import("./Tabs/TabEvaluacion"));
const TabInscripcion = React.lazy(() => import("./Tabs/TabInscripcion"));
const TabResultados = React.lazy(() => import("./Tabs/TabResultados"));
const TabPreinscritos = React.lazy(() => import("./Tabs/TabPreinscritos"));
import { getAdmissionStage } from "../../config/admission";

function Inicio() {
    // Obtenemos la etapa actual una sola vez
    const currentStage = getAdmissionStage();

    // 1. DETERMINAR PESTAÑA INICIAL SEGÚN EL ENV
    const getInitialTab = () => {
        switch (currentStage) {
            case "PREINSCRIPCION":
                return "preinscritos";
            case "INSCRIPCION":
                return "inscritos";
            case "EVALUACION":
                return "evaluacion";
            case "RESULTADOS":
                return "resultados";
            case "FINALIZADO":
                return "resultados"; // Al finalizar, usualmente se quieren ver los resultados
            default:
                return "inscritos"; // Valor por defecto seguro
        }
    };

    // Inicializamos el estado con la función para que corra una sola vez
    const [selectedTab, setSelectedTab] = useState(getInitialTab);

    // Inicializamos visitedTabs incluyendo la pestaña inicial
    const [visitedTabs, setVisitedTabs] = useState(new Set([getInitialTab()]));


    const handleTabChange = (tabKey) => {
        setSelectedTab(tabKey);
        setVisitedTabs((prev) => {
            const newSet = new Set(prev);
            newSet.add(tabKey);
            return newSet;
        });
    };

    // 2. LÓGICA DE DESHABILITACIÓN DE PESTAÑAS
    const isTabDisabled = (tabKey) => {
        // Si el proceso terminó o ya hay resultados, todo es accesible
        if (currentStage === "RESULTADOS" || currentStage === "FINALIZADO")
            return false;

        // Si estamos en Evaluación, los resultados siguen ocultos
        if (currentStage === "EVALUACION") return tabKey === "resultados";

        // Si estamos en Inscripción, los resultados están deshabilitados
        // (Evaluación queda habilitada porque "suelen estar juntos")
        if (currentStage === "INSCRIPCION") return tabKey === "resultados";

        // Si estamos en Preinscripción, todo el resto del proceso está bloqueado
        if (currentStage === "PREINSCRIPCION") {
            return ["inscritos", "evaluacion", "resultados"].includes(tabKey);
        }

        return false;
    };

    return (
        <>
            <Tabs
                selectedKey={selectedTab}
                onSelectionChange={handleTabChange}
                variant="bordered"
                aria-label="Dashboard Tabs"
                color="primary"
                className="w-full max-w-4xl mx-auto text-2xl flex justify-center mb-6"
                size="lg"
            >
                <Tab
                    key="preinscritos"
                    title="Preinscripción"
                    isDisabled={isTabDisabled("preinscritos")}
                >
                    {visitedTabs.has("preinscritos") && (
                        <Suspense fallback={
                            <div className="flex w-full h-[50vh] items-center justify-center">
                                <Spinner size="lg" label="Cargando..." />
                            </div>
                        }>
                            <TabPreinscritos />
                        </Suspense>
                    )}
                </Tab>

                <Tab
                    key="inscritos"
                    title="Inscripción"
                    isDisabled={isTabDisabled("inscritos")}
                >
                    {visitedTabs.has("inscritos") && (
                        <Suspense fallback={
                            <div className="flex w-full h-[50vh] items-center justify-center">
                                <Spinner size="lg" label="Cargando..." />
                            </div>
                        }>
                            <TabInscripcion />
                        </Suspense>
                    )}
                </Tab>

                <Tab
                    key="evaluacion"
                    title="Evaluación"
                    isDisabled={isTabDisabled("evaluacion")}
                >
                    {visitedTabs.has("evaluacion") && (
                        <Suspense fallback={
                            <div className="flex w-full h-[50vh] items-center justify-center">
                                <Spinner size="lg" label="Cargando..." />
                            </div>
                        }>
                            <TabEvaluacion />
                        </Suspense>
                    )}
                </Tab>

                <Tab
                    key="resultados"
                    title="Resultados"
                    isDisabled={isTabDisabled("resultados")}
                >
                    {visitedTabs.has("resultados") && (
                        <Suspense fallback={
                            <div className="flex w-full h-[50vh] items-center justify-center">
                                <Spinner size="lg" label="Cargando..." />
                            </div>
                        }>
                            <TabResultados />
                        </Suspense>
                    )}
                </Tab>
            </Tabs>
        </>
    );
}

export default Inicio;
