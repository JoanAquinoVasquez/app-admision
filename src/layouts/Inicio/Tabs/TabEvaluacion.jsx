import { Tabs, Tab, Chip } from "@heroui/react";
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

    const cvData = docenteResumen?.filter(d => d.docente.tipo !== 'entrevista') || [];
    const entrevistaData = docenteResumen?.filter(d => d.docente.tipo === 'entrevista') || [];

    const Content = ({ data, type }) => (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-3 mt-4">
            <div className="sm:col-span-2 md:col-span-8 lg:col-span-8">
                <EstadoEvaluacion
                    estadoEvaluacion={data}
                    loading={loadingDocente}
                />
            </div>
            <div className="sm:col-span-2 md:col-span-4 lg:col-span-4">
                <EstadoGeneralEvaluacion
                    docenteResumen={data}
                    loading={loadingDocente}
                    type={type}
                />
            </div>
            <div className="sm:col-span-2 md:col-span-4 lg:col-span-8">
                <TablaEvaluacion
                    resumenEvaluacion={resumenEvaluacion?.map(r => ({
                        ...r,
                        programas: r.programas?.filter(p => {
                            const isEntrevista = type === 'entrevista';
                            return true;
                        }) || []
                    })) || []}
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

    return (
        <div className="flex flex-col w-full">
            <Tabs 
                aria-label="Fases de Evaluación" 
                color="primary" 
                variant="underlined"
                classNames={{
                    tabList: "gap-6 w-full relative rounded-none border-b border-divider",
                    cursor: "w-full bg-blue-600",
                    tab: "max-w-fit px-0 h-12",
                    tabContent: "group-data-[selected=true]:text-blue-600 font-bold"
                }}
            >
                <Tab
                    key="expediente"
                    title={
                        <div className="flex items-center space-x-2">
                            <span>Evaluación de Expedientes (CV)</span>
                            <Chip size="sm" variant="flat" color="primary">{cvData.length}</Chip>
                        </div>
                    }
                >
                    <Content data={cvData} type="cv" />
                </Tab>
                <Tab
                    key="entrevista"
                    title={
                        <div className="flex items-center space-x-2">
                            <span>Evaluación de Entrevistas</span>
                            <Chip size="sm" variant="flat" color="secondary">{entrevistaData.length}</Chip>
                        </div>
                    }
                >
                    <Content data={entrevistaData} type="entrevista" />
                </Tab>
            </Tabs>
        </div>
    );
}
