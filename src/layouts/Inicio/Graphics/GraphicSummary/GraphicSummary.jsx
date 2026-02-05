import { useState, useEffect, useMemo } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import {
    Dropdown,
    DropdownItem,
    DropdownTrigger,
    DropdownMenu,
    Button,
    Checkbox,
    Spinner,
} from "@heroui/react";
import { FaFilter } from "react-icons/fa";

export function capitalize(s) {
    if (typeof s !== "string") return s;
    return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function GraphicSummary({ preInscripciones, grados }) {
    const [selectedGrados, setSelectedGrados] = useState(new Set());
    const [showAccumulated, setShowAccumulated] = useState(false);

    const COLORS = [
        "#8884d8",
        "#82ca9d",
        "#ffc658",
        "#ff8042",
        "#0088FE",
        "#FFBB28",
        "#FF8042",
        "#00C49F",
        "#FF4500",
        "#8A2BE2",
        "#7CFC00",
        "#D2691E",
    ];

    const groupedData = useMemo(() => {
        if (!preInscripciones || preInscripciones.length === 0) return [];

        const grouped = preInscripciones.reduce((acc, pre) => {
            const dateObj = new Date(pre.created_at);
            if (isNaN(dateObj)) return acc;

            dateObj.setHours(dateObj.getHours() - 5);
            const date = `${dateObj.getDate()}/${dateObj.getMonth() + 1}`;
            const grado = pre.programa?.grado?.nombre ?? "Sin Grado";

            acc[date] ??= { date, conteo_total: 0 };
            acc[date][grado] = (acc[date][grado] || 0) + 1;
            acc[date].conteo_total += 1;

            return acc;
        }, {});

        const dates = Object.keys(grouped).sort((a, b) => {
            const [dA, mA] = a.split("/").map(Number);
            const [dB, mB] = b.split("/").map(Number);
            return new Date(2025, mA - 1, dA) - new Date(2025, mB - 1, dB);
        });

        const gradoNames = grados.map(g => g.nombre || g);
        const allGrados = [...gradoNames, "conteo_total"];
        const filled = dates.map((date) => {
            const data = { ...grouped[date] }; // Evitar mutar el objeto original
            allGrados.forEach((g) => (data[g] ??= 0));
            return data;
        });

        if (showAccumulated) {
            return filled.map((d, i) => {
                if (i === 0) return d;
                const prev = filled[i - 1];
                return {
                    ...d,
                    conteo_total: d.conteo_total + prev.conteo_total,
                    ...Object.fromEntries(
                        gradoNames.map((g) => [g, d[g] + (prev[g] || 0)])
                    ),
                };
            });
        }

        return filled;
    }, [preInscripciones, grados, showAccumulated]);

    const filteredData = useMemo(() => {
        if (selectedGrados.size === 0) return groupedData;

        return groupedData.map((data) => {
            const filtered = {
                date: data.date,
                conteo_total: data.conteo_total,
            };
            selectedGrados.forEach((grado) => {
                if (grado in data) filtered[grado] = data[grado];
            });
            return filtered;
        });
    }, [groupedData, selectedGrados]);

    return (
        <div className="bg-white rounded-lg shadow-md p-1">
            <p className="ml-2 mt-2 text-default-800">
                {showAccumulated
                    ? "Preinscripciones Acumuladas"
                    : "Preinscripciones por día"}
            </p>
            <div className="bg-white flex">
                <div className="rounded-lg px-0 w-full">
                    {/* Filtros */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end space-y-2 sm:space-y-4 sm:space-x-4">
                        <div className="flex items-center justify-end space-x-4">
                            <Dropdown>
                                <DropdownTrigger>
                                    <Button>
                                        <FaFilter />
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu>
                                    <DropdownItem key="diario" textValue="Diario">
                                        <label className="flex items-center cursor-pointer">
                                            <Checkbox
                                                isSelected={!showAccumulated}
                                                onValueChange={() =>
                                                    setShowAccumulated(false)
                                                }
                                            />
                                            <p className="text-sm text-gray-500 ml-2">
                                                Diario
                                            </p>
                                        </label>
                                    </DropdownItem>
                                    <DropdownItem key="acumulado" textValue="Acumulado">
                                        <label className="flex items-center cursor-pointer">
                                            <Checkbox
                                                isSelected={showAccumulated}
                                                onValueChange={() =>
                                                    setShowAccumulated(true)
                                                }
                                            />
                                            <p className="text-sm text-gray-500 ml-2">
                                                Acumulado
                                            </p>
                                        </label>
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                            <Dropdown className="mr-2">
                                <DropdownTrigger>
                                    <Button>
                                        <FaFilter />
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu
                                    selectionMode="multiple"
                                    selectedKeys={selectedGrados}
                                    onSelectionChange={setSelectedGrados}
                                >
                                    {grados.map((grado) => (
                                        <DropdownItem key={grado.nombre} textValue={grado.nombre} className="capitalize">
                                            {capitalize(grado.nombre)}
                                        </DropdownItem>
                                    ))}
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                    </div>

                    {/* Gráfico */}
                    <div className="w-full min-w-0 h-[300px] sm:h-[400px] flex justify-center items-center ml-[-10px]">
                        {preInscripciones.length === 0 ? (
                            <p className="text-gray-500">No hay datos disponibles</p>
                        ) : (
                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                                id="grafico-lineal-preinscripciones_container"
                            >
                                <LineChart
                                    id="grafico-lineal-preinscripciones"
                                    name="grafico-lineal-preinscripciones"
                                    data={filteredData}
                                    margin={{
                                        top: 20,
                                        right: 30,
                                        left: 10,
                                        bottom: 5,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="conteo_total"
                                        stroke="#0000FF"
                                        activeDot={{ r: 6 }}
                                    />
                                    {[...selectedGrados].map((grado, index) => (
                                        <Line
                                            key={grado}
                                            type="monotone"
                                            dataKey={grado}
                                            stroke={
                                                COLORS[index % COLORS.length]
                                            }
                                            activeDot={{ r: 4 }}
                                        />
                                    ))}
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
