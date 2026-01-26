import { MdDashboard } from "react-icons/md";
import GraphicDetail from "../Graphics/GraphicDetail/GraphicDetail";
import GraphicSummary from "../Graphics/GraphicSummary/GraphicSummary";
import TablePreInscritos from "../../../components/Table/TablePreInscritos";
import useResumenTablePreInscripcion from "../../../data/Preinscripcion/dataTablaPreInscripcion";
import usePreInscripcion from "../../../data/Preinscripcion/dataPreInscripcion";
import useProgramaPreinscritos from "../../../data/Preinscripcion/dataProgramasPreinscritos";
import useGrados from "../../../data/dataGrados";

export default function TabPreinscripcion() {
    const { preInscripciones } = usePreInscripcion();
    const { programasPreinscritos } = useProgramaPreinscritos();
    const { tablePreInscripcion } = useResumenTablePreInscripcion();
    const { grados } = useGrados();
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
                    />
                </div>
            </div>

            {/* Fila inferior */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-2">
                <div className="lg:col-span-8">
                    <TablePreInscritos
                        resumenPreInscripcion={tablePreInscripcion ?? []}
                    />
                </div>
                <div className="lg:col-span-4">
                    <GraphicSummary
                        preInscripciones={preInscripciones ?? []}
                        grados={grados ?? []}
                    />
                </div>
            </div>
        </>
    );
}
