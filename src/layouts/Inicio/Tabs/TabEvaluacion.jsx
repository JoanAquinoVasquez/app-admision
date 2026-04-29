import { useMemo } from "react";
import useResumenEvaluacion from "../../../data/Evaluacion/dataResumenEvaluacion";
import TableEvaluacion from "../../../components/Table/TableEvaluacion";
import GraphicDocenteRanking from "../Graphics/GraphicSummary/GraphicDocenteRanking";
import { Card, Skeleton, CircularProgress } from "@heroui/react";
import { MdGroups, MdAssignment, MdFactCheck } from "react-icons/md";

export default function TabEvaluacion() {
    const { resumenEvaluacion, loading: loadingEvaluacion } = useResumenEvaluacion();

    const metricas = useMemo(() => {
        if (!resumenEvaluacion || !Array.isArray(resumenEvaluacion)) return { aptos: 0, cv: 0, ent: 0, porcCV: 0, porcEnt: 0 };
        let a = 0, c = 0, e = 0;
        resumenEvaluacion.forEach(item => {
            a += Number(item.aptos || 0);
            c += Number(item.evaluados_cv || 0);
            e += Number(item.evaluados_entrevista || 0);
        });
        return { 
            aptos: a, 
            cv: c, 
            ent: e,
            porcCV: a > 0 ? Math.round((c / a) * 100) : 0,
            porcEnt: a > 0 ? Math.round((e / a) * 100) : 0
        };
    }, [resumenEvaluacion]);

    return (
        <div className="flex flex-col gap-3 w-full overflow-hidden p-1" style={{ height: 'calc(100dvh - 160px)', minHeight: '580px' }}>
            {/* 1. FILA DE MÉTRICAS (SUPER COMPACTA) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 shrink-0">
                <Card className="p-3 xl:p-5 border-l-4 border-blue-500 shadow-none border bg-white flex flex-row items-center justify-between h-[75px] xl:h-[110px] 2xl:h-[130px]">
                    <div className="flex flex-col gap-1 xl:gap-2">
                        <p className="text-[10px] xl:text-[12px] font-bold text-blue-600 uppercase">Aptos</p>
                        <h3 className="text-2xl xl:text-4xl 2xl:text-5xl font-black text-slate-800 leading-none">{loadingEvaluacion ? <Skeleton className="h-6 xl:h-10 w-12 xl:w-20" /> : metricas.aptos}</h3>
                    </div>
                    <MdGroups className="text-blue-500 text-2xl xl:text-5xl 2xl:text-6xl opacity-20" />
                </Card>

                <Card className="p-3 xl:p-5 border-l-4 border-indigo-500 shadow-none border bg-white flex flex-row items-center justify-between h-[75px] xl:h-[110px] 2xl:h-[130px]">
                    <div className="flex flex-col gap-1 xl:gap-2">
                        <p className="text-[10px] xl:text-[12px] font-bold text-indigo-600 uppercase">Avance CV</p>
                        <h3 className="text-xl xl:text-3xl 2xl:text-4xl font-black text-slate-800 leading-none">{loadingEvaluacion ? <Skeleton className="h-6 xl:h-9 w-20 xl:w-32" /> : `${metricas.cv}/${metricas.aptos}`}</h3>
                    </div>
                    <CircularProgress size="md" value={metricas.porcCV} color="primary" showValueLabel={true} classNames={{ value: "text-[10px] xl:text-[12px] font-bold" }} />
                </Card>

                <Card className="p-3 xl:p-5 border-l-4 border-green-500 shadow-none border bg-white flex flex-row items-center justify-between h-[75px] xl:h-[110px] 2xl:h-[130px]">
                    <div className="flex flex-col gap-1 xl:gap-2">
                        <p className="text-[10px] xl:text-[12px] font-bold text-green-600 uppercase">Avance Entr.</p>
                        <h3 className="text-xl xl:text-3xl 2xl:text-4xl font-black text-slate-800 leading-none">{loadingEvaluacion ? <Skeleton className="h-6 xl:h-9 w-20 xl:w-32" /> : `${metricas.ent}/${metricas.aptos}`}</h3>
                    </div>
                    <CircularProgress size="md" value={metricas.porcEnt} color="secondary" showValueLabel={true} classNames={{ value: "text-[10px] xl:text-[12px] font-bold" }} />
                </Card>
            </div>

            {/* 2. CUERPO PRINCIPAL: TABLA (72%) + GRÁFICO (28%) */}
            <div className="flex flex-row gap-3 flex-1 min-h-0 w-full">
                {/* Lado Izquierdo: La Tabla (Prioridad Máxima) */}
                <div className="w-[75%] h-full flex flex-col min-w-0">
                    <TableEvaluacion 
                        resumenEvaluacion={resumenEvaluacion || []} 
                        loading={loadingEvaluacion} 
                    />
                </div>

                {/* Lado Derecho: Ranking de Docentes */}
                <div className="w-[25%] h-full shrink-0">
                    <GraphicDocenteRanking />
                </div>
            </div>
        </div>
    );
}
