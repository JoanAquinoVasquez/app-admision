import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";
import { Spinner } from "@heroui/react";

const HistogramaNotas = ({ histogramaNotas, loading }) => {
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <Spinner label="Cargando..." />
            </div>
        );
    }

    if (!histogramaNotas || !histogramaNotas.histograma || histogramaNotas.histograma.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">No hay datos disponibles</p>
            </div>
        );
    }

    const data = histogramaNotas.histograma.map((item) => ({
        rango: item.rango,
        cantidad: item.cantidad,
    }));

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-2 border border-gray-300 rounded shadow text-sm">
                    <p>
                        <strong>Rango:</strong> {label}
                    </p>
                    <p>
                        <strong>Cantidad:</strong> {payload[0].value}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="p-1">
            <h2 className="text-lg font-semibold">
                Distribución de Puntajes Finales
            </h2>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart
                    data={data}
                    margin={{ top: 20, right: 10, bottom: 10 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="rango"
                        angle={-35}
                        textAnchor="end"
                        interval={0}
                        height={60}
                        label={{
                            value: "Rango de Puntajes Finales",
                            position: "insideBottom",
                            offset: 10,
                            style: {
                                textAnchor: "middle",
                                fontSize: 13,
                                fontWeight: "bold",
                            },
                        }}
                        tick={{ fontSize: 12 }}
                    />
                    <YAxis
                        tick={{ fontSize: 12 }}
                        label={{
                            value: "Cantidad de postulantes",
                            angle: -90,
                            position: "insideLeft",
                            offset: 20,
                            style: {
                                textAnchor: "middle",
                                fontSize: 13,
                                fontWeight: "bold",
                            },
                        }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                        dataKey="cantidad"
                        fill="#2563EB"
                        radius={[4, 4, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default HistogramaNotas;
