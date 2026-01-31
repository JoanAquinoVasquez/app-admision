import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";
import { Spinner } from "@heroui/react";

// Componente personalizado de Tooltip
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const data = payload.reduce(
            (acc, item) => {
                acc[item.dataKey] = item.value;
                acc.total += item.value;
                return acc;
            },
            { total: 0 }
        );

        return (
            <div className="bg-white p-3 border rounded shadow-md text-sm">
                <p className="font-semibold">Rango de Edad: {label}</p>

                <p>Ingresantes: {data.ingresantes || 0}</p>
                <p>Ausentes: {data.ausentes || 0}</p>
                <p>
                    Pend: {data.pendientes || 0} | Dev:
                    {data.devolucion || 0} | Res:{data.reserva || 0}
                </p>
                <p>Desiste: {data.desiste || 0}</p>
                <hr className="my-1" />
                <p className="font-bold">Total: {data.total}</p>
            </div>
        );
    }

    return null;
};

const GraficoEstadoPorEdad = ({ resumenEdad, loading }) => {
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <Spinner label="Cargando..." />
            </div>
        );
    }

    if (!resumenEdad || resumenEdad.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">No hay datos disponibles</p>
            </div>
        );
    }

    // Ordenar los datos por rango de edad
    const parseRangoEdad = (rango) => {
        const match = rango.match(/\d+/);
        return match ? parseInt(match[0], 10) : 0;
    };

    const dataOrdenada = [...resumenEdad].sort(
        (a, b) => parseRangoEdad(a.rango_edad) - parseRangoEdad(b.rango_edad)
    );

    return (
        <div style={{ width: "100%", height: 400 }}>
            <h2 className="text-xl font-semibold mb-4">
                Distribución de postulantes por rango de edad
            </h2>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={dataOrdenada}
                    margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="rango_edad"
                        angle={-35}
                        textAnchor="end"
                        interval={0}
                        tick={{ fontSize: 12 }}
                        height={60}
                        label={{
                            value: "Rango de Edad",
                            position: "insideBottom",
                            offset: 10,
                            style: {
                                textAnchor: "middle",
                                fontSize: 13,
                                fontWeight: "bold",
                            },
                        }}
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
                    <Legend />
                    <Bar
                        dataKey="ingresantes"
                        fill="#10B981"
                        stackId="b"
                        name="Ingresantes"
                    />
                    <Bar
                        dataKey="ausentes"
                        stackId="b"
                        fill="#EF4444"
                        name="Ausentes"
                    />
                    <Bar
                        dataKey="pendientes"
                        stackId={"a"}
                        fill="#3B82F6"
                        name="Pendientes"
                    />
                    <Bar
                        dataKey="devolucion"
                        stackId={"a"}
                        fill="#FBBF24"
                        name="Devolución"
                    />
                    <Bar
                        dataKey="reserva"
                        stackId={"a"}
                        fill="#9CA3AF"
                        name="Reserva"
                    />
                    <Bar
                        dataKey="desiste"
                        stackId={"a"}
                        fill="#F472B6"
                        name="Desiste"
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default GraficoEstadoPorEdad;
