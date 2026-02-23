// Tabs/TabResultados.jsx
import TableResultados from "../../../components/Table/TableResultados";
import useResumenGeneral from "../../../data/Resultados/dataResumenGeneral";
import GraficoEstadoPorEdad from "../../Resultados/GraficoEstadoPorEdad";
import useHistogramaNotas from "../../../data/Resultados/dataHistogramaNotas";
import useIngresantesPrograma from "../../../data/Resultados/dataIngresantesPrograma";
import useResumenEdad from "../../../data/Resultados/dataResumenEdad";
import ResumenAdmision from "../../Resultados/ResumenAdmision";
import { Card } from "@heroui/react";
import HistogramaNotas from "../../Resultados/HistogramaNotas";

export default function TabResultados({ }) {
    const { ingresantesPrograma, loading: loadingIngresantes } = useIngresantesPrograma();
    const { resumenGeneral, loading: loadingResumen } = useResumenGeneral();
    const { resumenEdad, loading: loadingEdad } = useResumenEdad();
    const { histogramaNotas, loading: loadingNotas } = useHistogramaNotas();

    const isLoading = loadingIngresantes || loadingResumen || loadingEdad || loadingNotas;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2">
            <div className="lg:col-span-4 min-h-[500px]">
                <Card
                    shadow="sm"
                    className="p-1 rounded-2xl border border-white/40 h-full"
                >
                    <ResumenAdmision
                        resumenGeneral={resumenGeneral}
                        loading={isLoading}
                    />
                </Card>
            </div>
            <div className="lg:col-span-8 min-h-[500px]">
                <TableResultados
                    ingresantesPrograma={ingresantesPrograma}
                    loading={isLoading}
                />
            </div>
            <div className="lg:col-span-6 min-h-[500px]">
                <Card
                    shadow="sm"
                    className="p-4 rounded-2xl border border-white/40 h-full"
                >
                    <GraficoEstadoPorEdad
                        resumenEdad={resumenEdad}
                        loading={isLoading}
                    />
                </Card>
            </div>
            <div className="lg:col-span-6 min-h-[500px]">
                <Card
                    shadow="sm"
                    className="p-4 rounded-2xl border border-white/40 h-full"
                >
                    <HistogramaNotas
                        histogramaNotas={histogramaNotas}
                        loading={isLoading}
                    />
                </Card>
            </div>
        </div>
    );
}
