import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Skeleton, Select, SelectItem } from "@heroui/react";
import { useState, useEffect } from "react";
import { formatDisplayValue } from "../../components/Select/utils/formatDisplay";

ChartJS.register(ArcElement, Tooltip, Legend);

const ResumenAdmision = ({ resumenGeneral, loading }) => {
    const [gradoSeleccionado, setGradoSeleccionado] = useState(null);
    const [resumenes, setResumenes] = useState([]);

    useEffect(() => {
        if (resumenGeneral && resumenGeneral.length > 0) {
            setResumenes(resumenGeneral);
        }
    }, [resumenGeneral]);

    if (loading) {
        return (
            <div className="flex flex-col items-center gap-4 p-4 h-[400px]">
                <Skeleton className="h-6 w-3/4 rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
                <Skeleton className="w-56 h-56 rounded-full" />
            </div>
        );
    }

    const calcularResumen = () => {
        if (!gradoSeleccionado) {
            return resumenes.reduce(
                (acc, curr) => {
                    acc.inscritos += curr.inscritos || 0;
                    acc.pendientes += curr.pendientes || 0;
                    acc.reserva += curr.reserva || 0;
                    acc.devolucion += curr.devolucion || 0;
                    acc.desiste += curr.desiste || 0;
                    acc.ausentes += curr.ausentes || 0;
                    acc.ingresantes += curr.ingresantes || 0;
                    return acc;
                },
                {
                    inscritos: 0,
                    pendientes: 0,
                    reserva: 0,
                    devolucion: 0,
                    desiste: 0,
                    ausentes: 0,
                    ingresantes: 0,
                }
            );
        } else {
            return resumenes.find((r) => r.grado === gradoSeleccionado);
        }
    };

    const resumen = calcularResumen();



    const {
        inscritos,
        pendientes,
        reserva,
        devolucion,
        desiste,
        ausentes,
        ingresantes,
    } = resumen;

    const total = inscritos || 0;

    const data = {
        labels: [
            "Ingresantes",
            "Ausentes",
            "Pendientes",
            "Devolución",
            "Reserva",
            "Desiste",
        ],
        datasets: [
            {
                data: [
                    ingresantes,
                    ausentes,
                    pendientes,
                    devolucion,
                    reserva,
                    desiste,
                ],
                backgroundColor: [
                    "#10B981",
                    "#EF4444",
                    "#3B82F6",
                    "#FBBF24",
                    "#9CA3AF",
                    "#F472B6",
                ],
                borderColor: "#fff",
                borderWidth: 2,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const value = context.raw;
                        const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : "0.0";
                        return `Distribución: ${value} (${percentage}%)`;
                    },
                },
            },
            legend: {
                display: false, // Ocultamos la leyenda nativa para usar una personalizada
            },
        },
        cutout: "78%", // Un poco más delgada para mayor elegancia
        layout: {
            padding: {
                bottom: 0
            }
        }
    };

    const handleChange = (valor) => {
        setGradoSeleccionado(valor === "" ? null : valor);
    };

    return (
        <div className="flex flex-col h-full w-full max-w-sm mx-auto px-2">
            <h2 className="text-center text-lg font-semibold mt-2 mb-1">
                Estado de Admisión
            </h2>

            <Select
                label="Selecciona el grado"
                selectedKeys={[gradoSeleccionado || ""]}
                onChange={(e) => handleChange(e.target.value)}
                className="w-full mb-4"
                disallowEmptySelection={false}
                placeholder="Todos los grados"
                size="sm"
            >
                <SelectItem key="" value="">
                    Todos
                </SelectItem>
                {resumenes.map((item) => (
                    <SelectItem key={item.grado} value={item.grado}>
                        {formatDisplayValue(item.grado)}
                    </SelectItem>
                ))}
            </Select>

            {/* Contenedor de la Dona - Ahora centrado perfectamente sin la leyenda de Chart.js */}
            <div className="relative w-full h-[320px] flex items-center justify-center">
                <div className="w-full h-full p-2">
                    <Doughnut
                        data={data}
                        options={options}
                        data-testid="doughnut-chart"
                    />
                </div>

                {/* Texto Central - z-10 para estar sobre el gráfico y top-1/2 para centrado real */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none z-10">
                    <p className="text-gray-500 text-sm font-medium leading-none mb-1">Total inscritos</p>
                    <p className="text-6xl font-black text-slate-800 tracking-tighter">{total}</p>
                </div>
            </div>

            {/* Leyenda Personalizada - Pegada abajo y con control total */}
            <div className="mt-auto pt-4 pb-2">
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
                    {data.labels.map((label, index) => (
                        <div key={index} className="flex items-center gap-1.5">
                            <div
                                className="w-3 h-3 rounded-full shadow-sm"
                                style={{ backgroundColor: data.datasets[0].backgroundColor[index] }}
                            />
                            <span className="text-[15px] font-semibold text-slate-600">
                                {label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ResumenAdmision;
