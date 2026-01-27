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
} from "@nextui-org/react";
import { FaFilter } from "react-icons/fa";
import { MdSummarize } from "react-icons/md";
import DashboardCard from "../../../../components/Cards/DashboardCard";

export function capitalize(s) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

export default function GraphicSummaryEvaluacion({ notasDiariasCV }) {
    const [selectedGrados, setSelectedGrados] = useState(new Set());
    const [showAccumulated, setShowAccumulated] = useState(false);
    const [selectedDocentes, setSelectedDocentes] = useState(new Set());

    const grados = useMemo(() => {
        const setGrados = new Set(notasDiariasCV.map((n) => n.grado_nombre));
        return Array.from(setGrados);
    }, [notasDiariasCV]);

    const docentes = useMemo(() => {
        const setDocentes = new Set(
            notasDiariasCV.map(
                (n) => `${n.docente_nombres} ${n.docente_apellidos}`
            )
        );
        return Array.from(setDocentes);
    }, [notasDiariasCV]);

    const handleProgramChange = (key) => {
        setSelectedGrados((prev) => {
            const newSelected = new Set(prev);
            if (newSelected.has(key)) {
                newSelected.delete(key);
            } else {
                newSelected.add(key);
            }
            return newSelected;
        });
    };

    const fillMissingDates = (data, allDates, allGrados) => {
        return allDates.map((date) => {
            const found = data.find((d) => d.date === date) || { date };
            allGrados.forEach((grado) => {
                if (!(grado in found)) {
                    found[grado] = 0;
                }
            });
            if (!("conteo" in found)) found.conteo = 0;
            return found;
        });
    };

    const groupedData = useMemo(() => {
        if (notasDiariasCV.length === 0) return [];

        const grouped = notasDiariasCV.reduce((acc, curr) => {
            // Extract date part (YYYY-MM-DD) from ISO string or use as is if already date
            const dateObj = new Date(curr.created_at);
            let date = curr.created_at;
            if (!isNaN(dateObj.getTime())) {
                date = dateObj.toISOString().split('T')[0];
            }

            const grado = curr.grado_nombre;
            const docente = `${curr.docente_nombres} ${curr.docente_apellidos}`;

            if (!acc[date]) acc[date] = { date, conteo: 0 };

            if (!acc[date][grado]) acc[date][grado] = 0;
            acc[date][grado]++;

            if (!acc[date][docente]) acc[date][docente] = 0;
            acc[date][docente]++;

            acc[date].conteo++;

            return acc;
        }, {});

        const allDates = Object.keys(grouped).sort(
            (a, b) => new Date(a) - new Date(b)
        );

        const allDocentes = docentes;
        const allKeys = [...grados, ...allDocentes, "conteo"];

        const filledData = fillMissingDates(
            Object.values(grouped),
            allDates,
            allKeys
        );

        if (showAccumulated) {
            return filledData.reduce((acc, curr, i) => {
                if (i === 0) {
                    acc.push({ ...curr });
                } else {
                    const prev = acc[i - 1];
                    const newEntry = { ...curr };
                    grados.forEach((grado) => {
                        newEntry[grado] =
                            (prev[grado] || 0) + (curr[grado] || 0);
                    });
                    newEntry.conteo = (prev.conteo || 0) + (curr.conteo || 0);
                    acc.push(newEntry);
                }
                return acc;
            }, []);
        }

        return filledData;
    }, [notasDiariasCV, grados, showAccumulated]);

    const filteredData = useMemo(() => {
        if (selectedGrados.size === 0 && selectedDocentes.size === 0)
            return groupedData;

        return groupedData.map((d) => {
            const filtered = { date: d.date, conteo: d.conteo };

            selectedGrados.forEach((grado) => {
                if (d[grado] !== undefined) filtered[grado] = d[grado];
            });

            selectedDocentes.forEach((docente) => {
                if (d[docente] !== undefined) filtered[docente] = d[docente];
            });

            return filtered;
        });
    }, [groupedData, selectedGrados, selectedDocentes]);

    return (
        <DashboardCard
            title={showAccumulated ? "Notas Acumuladas" : "Notas por Día"}
            icon={<MdSummarize className="text-green-500" />}
        >
            <div className="bg-white flex" style={{ height: "max-content" }}>
                <div className="rounded-lg px-0 w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end space-y-2 sm:space-y-4 sm:space-x-4">
                        <div className="flex items-center justify-end space-x-4">
                            <Dropdown>
                                <DropdownTrigger>
                                    <Button aria-label="filter-tipo">
                                        <FaFilter />
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu aria-label="Modo de vista">
                                    <DropdownItem key="diario" textValue="Diario">
                                        <label className="flex items-center cursor-pointer">
                                            <Checkbox
                                                isSelected={!showAccumulated}
                                                onValueChange={() =>
                                                    setShowAccumulated(false)
                                                }
                                            />
                                            <span className="text-sm text-gray-500 ml-2">
                                                Diario
                                            </span>
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
                                            <span className="text-sm text-gray-500 ml-2">
                                                Acumulado
                                            </span>
                                        </label>
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>

                            <Dropdown className="mr-2">
                                <DropdownTrigger>
                                    <Button aria-label="filter-grado">
                                        <FaFilter />
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu
                                    aria-label="Filtrar por grado"
                                    selectionMode="multiple"
                                    selectedKeys={selectedGrados}
                                    onSelectionChange={setSelectedGrados}
                                >
                                    {grados.map((grado) => (
                                        <DropdownItem
                                            key={grado}
                                            textValue={grado}
                                            data-testid={`grado-${grado}-option`}
                                        >
                                            {capitalize(grado)}
                                        </DropdownItem>
                                    ))}
                                </DropdownMenu>
                            </Dropdown>
                            <Dropdown className="mr-2">
                                <DropdownTrigger>
                                    <Button aria-label="filter-docente">
                                        <FaFilter />
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu
                                    aria-label="Filtrar por docente"
                                    selectionMode="multiple"
                                    onSelectionChange={setSelectedDocentes}
                                >
                                    {docentes.map((docente) => (
                                        <DropdownItem
                                            key={docente}
                                            textValue={docente}
                                            data-testid={`docente-${docente}-option`}
                                        >
                                            {docente}
                                        </DropdownItem>
                                    ))}
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                    </div>

                    <div className="flex items-center justify-between w-auto h-auto ml-[-40px]">
                        {notasDiariasCV.length === 0 ? (
                            <div className="flex items-center justify-center ml-[60px] w-full h-[400px]">
                                <p className="text-gray-500">No hay datos disponibles</p>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height={400}>
                                <LineChart
                                    data={filteredData}
                                    margin={{
                                        top: 20,
                                        right: 30,
                                        left: 20,
                                        bottom: 5,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="date"
                                        tickFormatter={(str) => {
                                            const date = new Date(str);
                                            const day = date
                                                .getDate()
                                                .toString()
                                                .padStart(2, "0");
                                            const month = (date.getMonth() + 1)
                                                .toString()
                                                .padStart(2, "0");
                                            return `${day}/${month}`;
                                        }}
                                    />

                                    <YAxis />
                                    <Tooltip
                                        labelFormatter={(str) => {
                                            const date = new Date(str);
                                            const day = date
                                                .getDate()
                                                .toString()
                                                .padStart(2, "0");
                                            const month = (date.getMonth() + 1)
                                                .toString()
                                                .padStart(2, "0");
                                            return `${day}/${month}`;
                                        }}
                                    />

                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="conteo"
                                        stroke="#0000FF"
                                        activeDot={{ r: 8 }}
                                    />
                                    {(selectedGrados.size === 0
                                        ? []
                                        : [...selectedGrados]
                                    ).map((grado, index) => (
                                        <Line
                                            key={grado}
                                            type="monotone"
                                            dataKey={grado}
                                            stroke={
                                                COLORS[index % COLORS.length]
                                            }
                                            activeDot={{ r: 8 }}
                                        />
                                    ))}
                                    {(selectedDocentes.size === 0
                                        ? []
                                        : [...selectedDocentes]
                                    ).map((docente, index) => (
                                        <Line
                                            key={`docente-${docente}`}
                                            type="monotone"
                                            dataKey={docente}
                                            stroke={
                                                COLORS[
                                                (index +
                                                    selectedGrados.size) %
                                                COLORS.length
                                                ]
                                            }
                                            strokeDasharray="5 5"
                                            activeDot={{ r: 8 }}
                                        />
                                    ))}
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>
            </div>
        </DashboardCard>
    );
}
