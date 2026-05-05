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
    Brush,
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
import { MdSummarize } from "react-icons/md";
import DashboardCard from "../../../../components/Cards/DashboardCard";

export function capitalize(s) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

const COLORS = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff7300",
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
];

export default function GraphicSummaryInscritos({ inscripciones, loading }) {
    const [selectedGrados, setSelectedGrados] = useState(new Set()); // Cambiado a Set
    const [showAccumulated, setShowAccumulated] = useState(false); // Estado para mostrar acumulados
    const [showInscriptions, setShowInscriptions] = useState(true); // Estado para mostrar inscritos
    const [showPayments, setShowPayments] = useState(false); // Estado para mostrar pagos

    const grados = useMemo(() => {
        const gradosSet = new Set(
            inscripciones
                .filter((i) => i.type === "inscripcion" && i.programa?.grado?.nombre)
                .map((inscripcion) => inscripcion.programa.grado.nombre)
        );
        return Array.from(gradosSet);
    }, [inscripciones]);

    // Manejar el cambio de selección de programas
    const handleProgramChange = (key) => {
        setSelectedGrados((prevSelected) => {
            const newSelected = new Set(prevSelected);
            if (newSelected.has(key)) {
                newSelected.delete(key);
            } else {
                newSelected.add(key);
            }
            return newSelected;
        });
    };

    // Rellenar datos para garantizar que todas las fechas tengan valores (incluso si es 0)
    const fillMissingDates = (data, dates, grados) => {
        return dates.map((date) => {
            const existingData = data.find((d) => d.date === date) || { date };
            grados.forEach((grado) => {
                if (!(grado in existingData)) {
                    existingData[grado] = 0; // Si no hay datos, establecer a 0
                }
            });
            return existingData;
        });
    };

    const groupedData = useMemo(() => {
        if (inscripciones.length === 0) return [];

        // Agrupamos las inscripciones por fecha (`created_at`) y por programa
        const grouped = inscripciones.reduce((acc, item) => {
            const dateObj = new Date(item.created_at);
            if (isNaN(dateObj.getTime())) return acc;

            const dateKey = `${dateObj.getFullYear()}-${String(
                dateObj.getMonth() + 1
            ).padStart(2, "0")}-${String(dateObj.getDate()).padStart(
                2,
                "0"
            )}`;

            if (!acc[dateKey]) acc[dateKey] = { date: dateKey, conteo_total: 0, total_pagos: 0 };

            if (item.type === "pago") {
                acc[dateKey].total_pagos += 1;
            } else {
                const gradoName = item.programa?.grado?.nombre;
                if (gradoName) {
                    if (!acc[dateKey][gradoName]) acc[dateKey][gradoName] = 0;
                    acc[dateKey][gradoName] += 1;
                    acc[dateKey].conteo_total += 1;
                }
            }

            return acc;
        }, {});

        // Obtener todas las fechas disponibles y ordenarlas cronológicamente
        const dates = Object.keys(grouped).sort(
            (a, b) => new Date(a) - new Date(b)
        );

        // Genera el array final de datos con todas las fechas y programas
        const allGrados = [...grados, "conteo_total", "total_pagos"];
        const filled = dates.map((date) => {
            const data = { ...grouped[date] };
            allGrados.forEach((g) => (data[g] ??= 0));
            return data;
        });

        if (showAccumulated) {
            let runningTotal = 0;
            let runningPagos = 0;
            const runningGrados = Object.fromEntries(grados.map((g) => [g, 0]));

            return filled.map((d) => {
                runningTotal += d.conteo_total;
                runningPagos += d.total_pagos || 0;
                grados.forEach((g) => (runningGrados[g] += d[g] || 0));

                return {
                    ...d,
                    conteo_total: runningTotal,
                    total_pagos: runningPagos,
                    ...Object.fromEntries(
                        grados.map((g) => [g, runningGrados[g]])
                    ),
                };
            });
        }

        return filled;
    }, [inscripciones, grados, showAccumulated]);

    // Filtrar datos según grados seleccionados
    const filteredData = useMemo(() => {
        if (selectedGrados.size === 0) {
            return groupedData;
        }

        return groupedData.map((data) => {
            const filteredData = {
                date: data.date,
                conteo_total: data.conteo_total,
                total_pagos: data.total_pagos,
            };

            selectedGrados.forEach((grado) => {
                if (data[grado] !== undefined) {
                    filteredData[grado] = data[grado];
                }
            });

            return filteredData;
        });
    }, [groupedData, selectedGrados]);

    const actions = (
        <div className="flex gap-1">
            <Dropdown placement="bottom-end" shouldBlockScroll={false}>
                <DropdownTrigger>
                    <Button isIconOnly variant="light" size="sm" data-testid="filter-button">
                        <FaFilter className="text-default-500" />
                    </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Filtros de Gráfico">
                    <DropdownItem key="inscritos" textValue="Ver Inscritos">
                        <label className="flex items-center cursor-pointer">
                            <Checkbox
                                isSelected={showInscriptions}
                                onValueChange={setShowInscriptions}
                            />
                            <p className="text-sm text-gray-500 ml-2">Ver Inscritos</p>
                        </label>
                    </DropdownItem>
                    <DropdownItem key="pagos" textValue="Ver Pagos">
                        <label className="flex items-center cursor-pointer">
                            <Checkbox
                                isSelected={showPayments}
                                onValueChange={setShowPayments}
                            />
                            <p className="text-sm text-gray-500 ml-2">Ver Pagos</p>
                        </label>
                    </DropdownItem>
                    <DropdownItem key="separator" isReadOnly className="opacity-50">
                        <hr className="my-1 border-gray-200" />
                    </DropdownItem>
                    <DropdownItem key="diario" textValue="diario">
                        <label className="flex items-center cursor-pointer">
                            <Checkbox
                                isSelected={!showAccumulated}
                                onValueChange={() => setShowAccumulated(false)}
                            />
                            <p className="text-sm text-gray-500 ml-2">Vista Diaria</p>
                        </label>
                    </DropdownItem>
                    <DropdownItem key="acumulado" textValue="Acumulado">
                        <label className="flex items-center cursor-pointer">
                            <Checkbox
                                isSelected={showAccumulated}
                                onValueChange={setShowAccumulated}
                            />
                            <p className="text-sm text-gray-500 ml-2">
                                Vista Acumulada
                            </p>
                        </label>
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
            <Dropdown placement="bottom-end" shouldBlockScroll={false}>
                <DropdownTrigger>
                    <Button isIconOnly variant="light" size="sm" data-testid="grado-filter-button">
                        <FaFilter className="text-default-500" />
                    </Button>
                </DropdownTrigger>
                <DropdownMenu
                    aria-label="Grado Selection"
                    selectionMode="multiple"
                    selectedKeys={selectedGrados}
                    onSelectionChange={setSelectedGrados}
                >
                    {grados.map((grado) => (
                        <DropdownItem
                            key={grado}
                            data-testid={`grado-${grado}-option`}
                            textValue={grado}
                            className="focus:outline-none"
                            onChange={() => handleProgramChange(grado)}
                        >
                            {capitalize(grado)}
                        </DropdownItem>
                    ))}
                </DropdownMenu>
            </Dropdown>
        </div>
    );

    return (
        <DashboardCard
            title={showAccumulated ? "Inscripciones Acumuladas" : "Inscripciones por Día"}
            icon={<MdSummarize className="text-blue-500" />}
            actions={actions}
            className="p-1 h-full flex flex-col"
        >
            {loading ? (
                <div className="p-4 flex-1 min-h-[300px] sm:min-h-0">
                    <Skeleton className="w-full h-full rounded-xl" />
                </div>
            ) : (
                <div className="w-full flex-1 min-h-[300px] sm:min-h-0">
                    {inscripciones.length === 0 ? (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-gray-500">No hay datos disponibles</p>
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={filteredData}
                                margin={{
                                    top: 10,
                                    right: 10,
                                    left: -20,
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
                                    tickFormatter={(str) => {
                                        const date = new Date(str + "T12:00:00"); // Use noon to avoid day shifts
                                        const day = date.getDate().toString().padStart(2, "0");
                                        const month = (date.getMonth() + 1).toString().padStart(2, "0");
                                        return `${day}/${month}`;
                                    }}
                                />
                                <YAxis
                                    allowDecimals={false}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    labelFormatter={(str) => {
                                        const date = new Date(str + "T12:00:00");
                                        const day = date.getDate().toString().padStart(2, "0");
                                        const month = (date.getMonth() + 1).toString().padStart(2, "0");
                                        return `${day}/${month}`;
                                    }}
                                />
                                <Legend iconType="circle" />
                                <Brush
                                    dataKey="date"
                                    height={30}
                                    stroke="#3b82f6"
                                    startIndex={Math.max(0, filteredData.length - 15)}
                                    tickFormatter={(str) => {
                                        const date = new Date(str + "T12:00:00");
                                        const day = date.getDate().toString().padStart(2, "0");
                                        const month = (date.getMonth() + 1).toString().padStart(2, "0");
                                        return `${day}/${month}`;
                                    }}
                                />
                                {showInscriptions && (
                                    <Line
                                        type="monotone"
                                        dataKey="conteo_total"
                                        name="Inscritos"
                                        stroke="#3b82f6"
                                        strokeWidth={3}
                                        dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                                        activeDot={{ r: 6, strokeWidth: 0 }}
                                    />
                                )}
                                {showPayments && (
                                    <Line
                                        type="monotone"
                                        dataKey="total_pagos"
                                        name="Pagos"
                                        stroke="#10b981"
                                        strokeWidth={3}
                                        dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
                                        activeDot={{ r: 6, strokeWidth: 0 }}
                                    />
                                )}
                                {[...selectedGrados].map((grado, index) => (
                                    <Line
                                        key={grado}
                                        type="monotone"
                                        dataKey={grado}
                                        stroke={COLORS[index % COLORS.length]}
                                        strokeWidth={2}
                                        dot={{ r: 4, fill: COLORS[index % COLORS.length], strokeWidth: 2, stroke: '#fff' }}
                                        activeDot={{ r: 6, strokeWidth: 0 }}
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
