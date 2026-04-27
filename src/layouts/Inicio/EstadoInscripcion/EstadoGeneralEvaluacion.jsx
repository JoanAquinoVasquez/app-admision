import { Card, CircularProgress, Chip, Skeleton } from "@heroui/react";

const EstadoGeneralEvaluacion = ({ docenteResumen, loading }) => {
    // CV Stats
    const cvDocs = docenteResumen?.filter(d => d.docente.tipo !== 'entrevista') || [];
    const cvEvaluados = cvDocs.reduce((acc, d) => acc + (d.resumen_general.evaluados || 0), 0);
    const cvTotal = cvDocs.reduce((acc, d) => acc + (d.resumen_general.total_postulantes || 0), 0);
    const cvAvance = cvTotal ? Math.round((cvEvaluados / cvTotal) * 100) : 0;

    // Entrevista Stats
    const entDocs = docenteResumen?.filter(d => d.docente.tipo === 'entrevista') || [];
    const entEvaluados = entDocs.reduce((acc, d) => acc + (d.resumen_general.evaluados || 0), 0);
    const entTotal = entDocs.reduce((acc, d) => acc + (d.resumen_general.total_postulantes || 0), 0);
    const entAvance = entTotal ? Math.round((entEvaluados / entTotal) * 100) : 0;

    const totalEvaluados = cvEvaluados + entEvaluados;
    const totalPostulantes = cvTotal + entTotal;
    const avanceGeneral = totalPostulantes ? Math.round((totalEvaluados / totalPostulantes) * 100) : 0;

    return (
        <div className="flex flex-col">
            <Card
                shadow="sm"
                className="mt-6 rounded-2xl border border-gray-100 hover:shadow-md transition-all p-6 flex flex-col items-center justify-center gap-4 min-h-[300px]"
            >
                {loading ? (
                    <div className="flex flex-col items-center justify-center gap-4 w-full h-full">
                        <Skeleton className="w-[160px] h-[160px] rounded-full" />
                        <Skeleton className="h-8 w-40 rounded-lg" />
                    </div>
                ) : (
                    <>
                        <h3 className="text-lg font-bold text-slate-700 uppercase tracking-tight">
                            📊 Avance de Evaluación
                        </h3>
                        
                        <div className="flex flex-col items-center gap-6 w-full">
                            {/* Avance General */}
                            <CircularProgress
                                aria-label="Avance de evaluación"
                                color="warning"
                                value={avanceGeneral}
                                valueLabel={`${avanceGeneral}%`}
                                maxValue={100}
                                showValueLabel
                                classNames={{
                                    svg: "w-40 h-40",
                                    value: "text-4xl text-gray-800 font-bold",
                                }}
                            />

                            {/* Desglose CV vs Entrevista */}
                            <div className="grid grid-cols-2 gap-4 w-full px-2">
                                <div className="flex flex-col items-center p-3 rounded-xl bg-blue-50/50 border border-blue-100">
                                    <span className="text-[10px] font-bold text-blue-800 uppercase mb-1">Expediente (CV)</span>
                                    <CircularProgress
                                        size="lg"
                                        aria-label="Avance CV"
                                        color="primary"
                                        value={cvAvance}
                                        showValueLabel={true}
                                        classNames={{
                                            value: "text-xs font-bold"
                                        }}
                                    />
                                    <span className="text-[10px] text-slate-500 mt-1">{cvEvaluados}/{cvTotal}</span>
                                </div>

                                <div className="flex flex-col items-center p-3 rounded-xl bg-purple-50/50 border border-purple-100">
                                    <span className="text-[10px] font-bold text-purple-800 uppercase mb-1">Entrevista</span>
                                    <CircularProgress
                                        size="lg"
                                        aria-label="Avance Entrevista"
                                        color="secondary"
                                        value={entAvance}
                                        showValueLabel={true}
                                        classNames={{
                                            value: "text-xs font-bold"
                                        }}
                                    />
                                    <span className="text-[10px] text-slate-500 mt-1">{entEvaluados}/{entTotal}</span>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </Card>
        </div>
    );
};

export default EstadoGeneralEvaluacion;
