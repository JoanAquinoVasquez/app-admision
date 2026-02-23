import { useState } from "react";
import { useGraphicSummaryData, capitalize } from "../../../../hooks/useGraphicSummaryData";
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
    Skeleton,
} from "@heroui/react";
import { FaFilter } from "react-icons/fa";

import DashboardCard from "../../../../components/Cards/DashboardCard";
import { MdSummarize } from "react-icons/md";

export default function GraphicSummary({ preInscripciones, grados, loading }) {
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

    const { filteredData } = useGraphicSummaryData(preInscripciones, grados, showAccumulated, selectedGrados);

    const actions = (
        <>
            <Dropdown placement="bottom-end" shouldBlockScroll={false}>
                <DropdownTrigger>
                    <Button isIconOnly variant="light" size="sm">
                        <FaFilter className="text-default-500" />
                    </Button>
                </DropdownTrigger>
                <DropdownMenu>
                    <DropdownItem key="diario" textValue="Diario">
                        <label className="flex items-center cursor-pointer">
                            <Checkbox
                                isSelected={!showAccumulated}
                                onValueChange={() => setShowAccumulated(false)}
                            />
                            <p className="text-sm text-gray-500 ml-2">Diario</p>
                        </label>
                    </DropdownItem>
                    <DropdownItem key="acumulado" textValue="Acumulado">
                        <label className="flex items-center cursor-pointer">
                            <Checkbox
                                isSelected={showAccumulated}
                                onValueChange={() => setShowAccumulated(true)}
                            />
                            <p className="text-sm text-gray-500 ml-2">Acumulado</p>
                        </label>
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
            <Dropdown placement="bottom-end" shouldBlockScroll={false}>
                <DropdownTrigger>
                    <Button isIconOnly variant="light" size="sm">
                        <FaFilter className="text-default-500" />
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
        </>
    );

    return (
        <DashboardCard
            title={showAccumulated ? "Preinscripciones Acumuladas" : "Preinscripciones por día"}
            icon={<MdSummarize className="text-blue-500" />}
            actions={actions}
            className="p-1 h-full flex flex-col"
        >
            {loading ? (
                <div className="p-4 flex-1">
                    <Skeleton className="w-full h-full rounded-xl" />
                </div>
            ) : (
                <div className="w-full flex-1 min-h-0">
                    {preInscripciones.length === 0 ? (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-gray-500">No hay datos disponibles</p>
                        </div>
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
                                    top: 10,
                                    right: 10,
                                    left: -20, // Reduce espacio lateral izquierdo
                                    bottom: 0,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                                    dy={10}
                                />
                                <YAxis
                                    allowDecimals={false}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend iconType="circle" />
                                <Line
                                    type="monotone"
                                    dataKey="conteo_total"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                />
                                {[...selectedGrados].map((grado, index) => (
                                    <Line
                                        key={grado}
                                        type="monotone"
                                        dataKey={grado}
                                        stroke={COLORS[index % COLORS.length]}
                                        strokeWidth={2}
                                        dot={{ r: 3, fill: COLORS[index % COLORS.length], strokeWidth: 2, stroke: '#fff' }}
                                        activeDot={{ r: 5, strokeWidth: 0 }}
                                    />
                                ))}
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </div>
            )}
        </DashboardCard>
    );
}
