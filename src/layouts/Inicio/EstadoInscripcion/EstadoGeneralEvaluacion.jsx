import { Card, CircularProgress, Chip, Skeleton } from "@heroui/react";

const EstadoGeneralEvaluacion = ({ docenteResumen, loading }) => {
    const totalEvaluados = docenteResumen?.reduce(
        (acc, d) => acc + (d.resumen_general.evaluados || 0),
        0
    ) || 0;

    const totalPendientes = docenteResumen?.reduce(
        (acc, d) => acc + (d.resumen_general.pendientes || 0),
        0
    ) || 0;

    const totalPostulantes = docenteResumen?.reduce(
        (acc, d) => acc + (d.resumen_general.total_postulantes || 0),
        0
    ) || 0;

    const avanceGeneral = totalPostulantes
        ? Math.round((totalEvaluados / totalPostulantes) * 100)
        : 0;

    return (
        <div className="flex flex-col">
            <Card
                shadow="sm"
                aria-label="Total CV's Evaluados"
                className="mt-6 rounded-2xl border border-gray-100 hover:shadow-md transition-all p-6 flex flex-col items-center justify-center gap-4 min-h-[300px]"
            >


                {loading ? (
                    <div className="flex flex-col items-center justify-center gap-4 w-full h-full">
                        <Skeleton className="w-[160px] h-[160px] rounded-full" />
                        <div className="flex gap-2 mt-2">
                            <Skeleton className="h-8 w-24 rounded-lg" />
                            <Skeleton className="h-8 w-32 rounded-lg" />
                        </div>
                    </div>
                ) : (
                    <>
                        <p className="text-lg font-semibold text-gray-700">
                            📊 Total CV's Evaluados
                        </p>
                        <CircularProgress
                            color="primary"
                            value={avanceGeneral}
                            valueLabel={`${avanceGeneral}%`}
                            maxValue={100}
                            showValueLabel
                            classNames={{
                                svg: "w-40 h-40",
                                value: "text-4xl text-gray-800 font-bold",
                            }}
                        />

                        <div className="flex flex-col sm:flex-row gap-2 mt-2">
                            <Chip variant="bordered" color="success" size="md">
                                Evaluados: {totalEvaluados} / {totalPostulantes}
                            </Chip>
                            <Chip variant="bordered" color="danger" size="md">
                                Pendientes: {totalPendientes}
                            </Chip>
                        </div>
                    </>
                )}
            </Card>
        </div>
    );
};

export default EstadoGeneralEvaluacion;
