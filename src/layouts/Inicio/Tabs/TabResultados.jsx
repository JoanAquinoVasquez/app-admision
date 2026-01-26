// Tabs/TabResultados.jsx
import TableResultados from "../../../components/Table/TableResultados";
import useResumenGeneral from "../../../data/Resultados/dataResumenGeneral";
import GraficoEstadoPorEdad from "../../Resultados/GraficoEstadoPorEdad";
import useHistogramaNotas from "../../../data/Resultados/dataHistogramaNotas";
import useIngresantesPrograma from "../../../data/Resultados/dataIngresantesPrograma";
import useResumenEdad from "../../../data/Resultados/dataResumenEdad";
import ResumenAdmision from "../../Resultados/ResumenAdmision";
import HistogramaNotas from "../../Resultados/HistogramaNotas";

export default function TabResultados({}) {
    const { ingresantesPrograma } = useIngresantesPrograma();
    const { resumenGeneral } = useResumenGeneral();
    const { resumenEdad } = useResumenEdad();
    const { histogramaNotas } = useHistogramaNotas();

    return (
        <div className="space-y-2">
            {/* Grupo 1: Resumen de admisión y tabla */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-2">
                <div className="lg:col-span-4">
                    <div className="bg-white shadow-md rounded-lg">
                        <ResumenAdmision resumenGeneral={resumenGeneral} />
                    </div>
                </div>
                <div className="lg:col-span-8">
                    <div className="bg-white shadow-md rounded-lg p-3">
                        <TableResultados
                            ingresantesPrograma={ingresantesPrograma}
                        />
                    </div>
                </div>
            </div>

            {/* Grupo 2: Gráficos por edad y notas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {/* <div className="bg-white shadow-md rounded-lg p-4">
                    <ResumenGrado resumenGeneral={resumenGeneral} />
                </div> */}

                <div className="bg-white shadow-md rounded-lg p-3">
                    <GraficoEstadoPorEdad resumenEdad={resumenEdad} />
                </div>

                <div className="bg-white shadow-md rounded-lg p-3">
                    <HistogramaNotas histogramaNotas={histogramaNotas} />
                </div>
            </div>
        </div>
    );
}
