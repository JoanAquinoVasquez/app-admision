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

    const grados = useMemo(() => {
        const gradosSet = new Set(
            inscripciones.map(
                (inscripcion) => inscripcion.programa.grado.nombre
            )
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
        const grouped = inscripciones.reduce((acc, inscripcion) => {

            const gradoName = inscripcion.programa?.grado?.nombre;
            // Verificar fecha y nombre del grado.
            if (!inscripcion.created_at || !gradoName) {
                return acc;
            }

            // 🚀 SOLUCIÓN: Usar la cadena ISO directamente en el constructor de Date
            let dateObj = new Date(inscripcion.created_at);

            // 💡 Si tu base de datos guarda la hora en UTC y quieres la hora local
            // Puedes intentar compensar si la fecha es inválida o si necesitas un ajuste específico.
            // PERO la mejor práctica es dejarlo como está si es ISO 8601 válido.

            // Tu código anterior hacía un ajuste de -5 horas. Si ese es tu objetivo:
            dateObj.setHours(dateObj.getHours() - 5);


            if (isNaN(dateObj.getTime())) {
                // Si aún así es inválido (por un formato raro), saltar.
                return acc;
            }

            // Formatear a 'Día/Mes' (Ej: 18/11)
            const date = `${dateObj.getDate()}/${dateObj.getMonth() + 1}`;

            if (!acc[date]) acc[date] = { date, conteo_total: 0 };
            if (!acc[date][gradoName]) acc[date][gradoName] = 0;

            acc[date][gradoName] += 1;
            acc[date].conteo_total += 1;

            return acc;
        }, {});
        // Obtener todas las fechas disponibles antes de ordenar
        const allDates = Object.keys(grouped);

        // Ordena las fechas de manera ascendente
        const dates = allDates.sort((a, b) => {
            const [dayA, monthA] = a.split("/").map(Number);
            const [dayB, monthB] = b.split("/").map(Number);
            return (
                new Date(2025, monthA - 1, dayA) -
                new Date(2025, monthB - 1, dayB)
            );
        });

        // Genera el array final de datos con todas las fechas y programas
        const allGrados = [...grados, "conteo_total"];
        const filledData = fillMissingDates(
            Object.values(grouped),
            dates,
            allGrados
        );

        // Si se selecciona mostrar acumulado, calcular la suma acumulada
        if (showAccumulated) {
            return filledData.map((data, index) => {
                if (index > 0) {
                    // Acumular el conteo total y por grado
                    const previousData = filledData[index - 1];
                    data.conteo_total += previousData.conteo_total;
                    grados.forEach((grado) => {
                        data[grado] += previousData[grado] || 0;
                    });
                }
                return data;
            });
        }

        return filledData;
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
            };

            selectedGrados.forEach((grado) => {
                if (data[grado] !== undefined) {
                    filteredData[grado] = data[grado];
                }
            });

            return filteredData;
        });
    }, [groupedData, selectedGrados]);

    return (
        <DashboardCard
            title={
                showAccumulated
                    ? "Inscripciones Acumuladas"
                    : "Inscripciones por Día"
            }
            icon={<MdSummarize className="text-green-500" />}
        >
            <div className="bg-white flex" style={{ height: "max-content" }}>
                <div className="rounded-lg px-0 w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end space-y-2 sm:space-y-4 sm:space-x-4">
                        <div className="flex items-center justify-end space-x-4">
                            {" "}
                            {/* Añado el espacio entre los botones */}
                            <Dropdown>
                                <DropdownTrigger>
                                    <Button data-testid="filter-button">
                                        <FaFilter />
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu aria-label="Acumulado Selection">
                                    <DropdownItem key="diario" textValue="diario">
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
                                    <DropdownItem key="acumulado" textValue="acumulado">
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
                                    <Button data-testid="grado-filter-button">
                                        <FaFilter />
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
                                            onChange={() =>
                                                handleProgramChange(grado)
                                            }
                                        >
                                            {capitalize(grado)}
                                        </DropdownItem>
                                    ))}
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                    </div>

                    <div className="flex items-center justify-between w-auto h-auto ml-[-40px]">
                        {loading ? (
                            <div className="flex items-center justify-center ml-[60px] w-full h-[400px]">
                                <Spinner color="primary" label="Cargando gráfico..." />
                            </div>
                        ) : inscripciones.length === 0 ? (
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
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="conteo_total"
                                        stroke="#0000FF"
                                        activeDot={{ r: 8 }}
                                    />
                                    {[...selectedGrados].map((grado, index) => (
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
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>
            </div>
        </DashboardCard>
    );
}
