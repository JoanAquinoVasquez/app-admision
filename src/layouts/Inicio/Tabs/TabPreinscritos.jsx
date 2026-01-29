import { MdDashboard } from "react-icons/md";
import GraphicDetail from "../Graphics/GraphicDetail/GraphicDetail";
import GraphicSummary from "../Graphics/GraphicSummary/GraphicSummary";
import TablePreInscritos from "../../../components/Table/TablePreInscritos";
import useResumenTablePreInscripcion from "../../../data/Preinscripcion/dataTablaPreInscripcion";
import usePreInscripcion from "../../../data/Preinscripcion/dataPreInscripcion";
import useProgramaPreinscritos from "../../../data/Preinscripcion/dataProgramasPreinscritos";
import useGrados from "../../../data/dataGrados";

export default function TabPreinscripcion() {
    const { preInscripciones, loading: loadingSummary } = usePreInscripcion();
    const { programasPreinscritos, loading: loadingDetail } =
        useProgramaPreinscritos();
    const { tablePreInscripcion, loading: loadingTable } =
        useResumenTablePreInscripcion();
    const { grados, loading: loadingGrados } = useGrados();
    return (
        <>
            {/* Descripción General - Todo el ancho */}
            <div
                className="mb-2"
                id="preinscritosporgrado"
                name="preinscritosporgrado"
            >
                <p className="flex items-center text-lg font-medium text-gray-800">
                    <MdDashboard className="mr-2" />
                    Descripción General - Preinscritos por Grado
                </p>
                <div className="mt-1">
                    <GraphicDetail
                        programasPreinscritos={programasPreinscritos ?? []}
                        loading={loadingDetail}
                    />
                </div>
            </div>

            {/* Fila inferior */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-2">
                <div className="lg:col-span-8">
                    <TablePreInscritos
                        resumenPreInscripcion={tablePreInscripcion ?? []}
                        loading={loadingTable}
                    />
                </div>
                <div className="lg:col-span-4">
                    <GraphicSummary
                        preInscripciones={preInscripciones ?? []}
                        grados={grados ?? []}
                        loading={loadingSummary || loadingGrados}
                    />
                </div>
            </div>
        </>
    );
}
