import EstadoEvaluacion from "../EstadoInscripcion/EstadoEvaluacion";
import EstadoGeneralEvaluacion from "../EstadoInscripcion/EstadoGeneralEvaluacion";
import TablaEvaluacion from "../../../components/Table/TableEvaluacion";
import GraphicSummaryEvaluacion from "../Graphics/GraphicSummary/GraphicSummaryEvaluacion";
import useDocenteResumen from "../../../data/Evaluacion/dataDocenteResumen";
import useGrados from "../../../data/dataGrados";
import useResumenEvaluacion from "../../../data/Evaluacion/dataResumenEvaluacion";
import useResumenNotasDiarias from "../../../data/Evaluacion/dataResumenNotasDiarias";

export default function TabEvaluacion() {
    const { docenteResumen, loading: loadingDocente } = useDocenteResumen();
    const { resumenEvaluacion, loading: loadingEvaluacion } =
        useResumenEvaluacion();
    const { resumenNotasDiarias, loading: loadingNotas } =
        useResumenNotasDiarias();
    const { grados } = useGrados();

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-3">
            <div className="sm:col-span-2 md:col-span-8 lg:col-span-8">
                <EstadoEvaluacion
                    estadoEvaluacion={docenteResumen ?? []}
                    loading={loadingDocente}
                />
            </div>
            <div className="sm:col-span-2 md:col-span-4 lg:col-span-4">
                <EstadoGeneralEvaluacion
                    docenteResumen={docenteResumen ?? []}
                    loading={loadingDocente}
                />
            </div>
            <div className="sm:col-span-2 md:col-span-4 lg:col-span-8">
                <TablaEvaluacion
                    resumenEvaluacion={resumenEvaluacion ?? []}
                    grados={grados ?? []}
                    loading={loadingEvaluacion}
                />
            </div>
            <div className="sm:col-span-2 md:col-span-4 lg:col-span-4">
                <GraphicSummaryEvaluacion
                    notasDiariasCV={resumenNotasDiarias ?? []}
                    loading={loadingNotas}
                />
            </div>
        </div>
    );
}
