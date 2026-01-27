import { Card, CircularProgress, Chip, Spinner } from "@nextui-org/react";

const EstadoGeneralEvaluacion = ({ docenteResumen }) => {
    const totalEvaluados = docenteResumen.reduce(
        (acc, d) => acc + (d.resumen_general.evaluados || 0),
        0
    );

    const totalPendientes = docenteResumen.reduce(
        (acc, d) => acc + (d.resumen_general.pendientes || 0),
        0
    );

    const totalPostulantes = docenteResumen.reduce(
        (acc, d) => acc + (d.resumen_general.total_postulantes || 0),
        0
    );

    const avanceGeneral = totalPostulantes
        ? Math.round((totalEvaluados / totalPostulantes) * 100)
        : 0;

    // Placeholder con el mismo formato que la tarjeta final
    if (!docenteResumen || docenteResumen.length === 0) {
        return (
            <Card
                shadow="sm"
                className="mt-6 rounded-2xl border border-gray-100 p-6 flex flex-col items-center justify-center gap-4 h-[300px]">
                <p className="text-gray-500">No hay datos de evaluación disponibles</p>
            </Card>
        );
    }

    return (
        <div className="flex flex-col">
            <Card
                shadow="sm"
                aria-label="Total CV's Evaluados"
                className="mt-6 rounded-2xl border border-gray-100 hover:shadow-md transition-all p-6 flex flex-col items-center justify-center gap-4"
            >
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
            </Card>
        </div>
    );
};

export default EstadoGeneralEvaluacion;
