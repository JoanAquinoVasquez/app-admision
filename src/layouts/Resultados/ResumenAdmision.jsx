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
                    acc.no_evaluado += curr.no_evaluado || 0;
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
                    no_evaluado: 0,
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
        no_evaluado,
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
            "Falta Evaluar",
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
                    no_evaluado || 0,
                ],
                backgroundColor: [
                    "#10B981",
                    "#EF4444",
                    "#3B82F6",
                    "#FBBF24",
                    "#9CA3AF",
                    "#F472B6",
                    "#8B5CF6",
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
        <div className="flex flex-col justify-center h-full w-full max-w-sm mx-auto px-2 gap-4">
            <h2 className="text-center text-lg font-semibold mt-2 mb-1">
                Estado de Admisión
            </h2>

            <Select
                label="Selecciona el grado"
                selectedKeys={[gradoSeleccionado || ""]}
                onChange={(e) => handleChange(e.target.value)}
                className="w-full"
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

            {/* Contenedor de la Dona - Altura reducida para ahorrar espacio */}
            <div className="relative w-full h-[210px] flex items-center justify-center">
                <div className="w-full h-full p-1">
                    <Doughnut
                        data={data}
                        options={options}
                        data-testid="doughnut-chart"
                    />
                </div>

                {/* Texto Central ajustado a menor tamaño */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none z-10">
                    <p className="text-gray-500 text-[11px] font-semibold leading-none mb-0.5 uppercase tracking-wider">Total</p>
                    <p className="text-4xl font-black text-slate-800 tracking-tighter">{total}</p>
                </div>
            </div>

            {/* Leyenda Personalizada - Distribuida en 2 Columnas para compactar el espacio */}
            <div className="pt-3 pb-2 px-1 border-t border-slate-100/60">
                <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                    {data.labels.map((label, index) => {
                        const val = data.datasets[0].data[index] || 0;
                        const pct = total > 0 ? ((val / total) * 100).toFixed(1) : "0.0";
                        return (
                            <div key={index} className="flex items-center justify-between py-0.5 text-xs">
                                <div className="flex items-center gap-1.5 min-w-0">
                                    <div
                                        className="w-2.5 h-2.5 rounded-full shadow-sm flex-shrink-0"
                                        style={{ backgroundColor: data.datasets[0].backgroundColor[index] }}
                                    />
                                    <span className="font-semibold text-slate-600 truncate">
                                        {label}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1 text-right flex-shrink-0 ml-1">
                                    <span className="font-bold text-slate-800">
                                        {val}
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-medium">
                                        ({pct}%)
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ResumenAdmision;
