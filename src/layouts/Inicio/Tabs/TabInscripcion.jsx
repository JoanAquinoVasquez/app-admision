import EstadoPreinscritos from "../EstadoInscripcion/EstadoPreinscritos";
import EstadoInscripcion from "../EstadoInscripcion/EstadoInscripcion";
import Voucher from "../Voucher/Voucher";
import ResumenInscripcion from "../../../components/Table/Table";
import GraphicSummaryInscritos from "../Graphics/GraphicSummary/GraphicSummaryInscritos";
import useInscripcion from "../../../data/Inscripcion/dataInscripcion";
import useResumenPreinscripcion from "../../../data/Preinscripcion/dataResumenPreinscripcion";
import useResumenInscripcion from "../../../data/Inscripcion/dataResumenInscripcion";
import useResumenVouchers from "../../../data/Inscripcion/dataResumenVouchers";
import useEstadoInscripcion from "../../../data/Inscripcion/dataEstadoInscripcion";
import useGraphicInscripcion from "../../../data/Inscripcion/dataGraphicInscripcion";

export default function TabInscripcion({ }) {
    const { graphicInscripcion, loading: loadingGraphic } =
        useGraphicInscripcion();
    const { resumenPreInscripcion, loading: loadingPreInscripcion } =
        useResumenPreinscripcion();
    const { resumenInscripcion, loading: loadingInscripcion } =
        useResumenInscripcion();
    const { resumenVouchers, loading: loadingVouchers } = useResumenVouchers();
    const { estadoInscripcion, loading: loadingEstado } =
        useEstadoInscripcion();
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-3">
            <div className="sm:col-span-2 md:col-span-4 lg:col-span-4">
                <EstadoPreinscritos
                    preinscripciones={resumenPreInscripcion ?? []}
                    loading={loadingPreInscripcion}
                />
            </div>
            <div className="sm:col-span-2 md:col-span-4 lg:col-span-4">
                <EstadoInscripcion
                    estadoInscripcion={estadoInscripcion ?? []}
                    loading={loadingEstado}
                />
            </div>
            <div className="sm:col-span-2 md:col-span-4 lg:col-span-4">
                <Voucher
                    resumenVouchers={resumenVouchers ?? []}
                    loading={loadingVouchers}
                />
            </div>
            <div className="sm:col-span-2 md:col-span-4 lg:col-span-8">
                <ResumenInscripcion
                    resumenInscripcion={resumenInscripcion ?? []}
                    loading={loadingInscripcion}
                />
            </div>
            <div className="sm:col-span-2 md:col-span-4 lg:col-span-4">
                <GraphicSummaryInscritos
                    inscripciones={graphicInscripcion ?? []}
                    loading={loadingGraphic}
                />
            </div>
        </div>
    );
}
