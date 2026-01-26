import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Spinner, Select, SelectItem } from "@nextui-org/react";
import { useState, useEffect } from "react";

ChartJS.register(ArcElement, Tooltip, Legend);

const ResumenAdmision = ({ resumenGeneral }) => {
    const [gradoSeleccionado, setGradoSeleccionado] = useState(null);
    const [resumenes, setResumenes] = useState([]);

    useEffect(() => {
        if (resumenGeneral && resumenGeneral.length > 0) {
            setResumenes(resumenGeneral);
        }
    }, [resumenGeneral]);

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

    if (!resumen || resumenes.length === 0) {
        return (
            <div className="flex items-center justify-center h-[425px]">
                <Spinner color="primary" />
            </div>
        );
    }

    const {
        inscritos,
        pendientes,
        reserva,
        devolucion,
        desiste,
        ausentes,
        ingresantes,
    } = resumen;

    const total = inscritos || 1; // evitar división por 0

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
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const value = context.raw;
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `Distribución: ${value} (${percentage}%)`;
                    },
                },
            },
            legend: {
                position: "bottom",
                labels: {
                    font: { size: 12 },
                },
            },
        },
        cutout: "70%",
    };

    const handleChange = (valor) => {
        // Si se selecciona vacío, mostramos el resumen combinado
        setGradoSeleccionado(valor === "" ? null : valor);
    };

    return (
        <div className="relative max-w-xs mx-auto p-2">
            <h2 className="text-center text-lg font-semibold mb-1">
                Estado de Admisión
            </h2>

            <Select
                label="Selecciona el grado"
                selectedKeys={[gradoSeleccionado || ""]}
                onChange={(e) => handleChange(e.target.value)}
                className="mb-2"
                disallowEmptySelection={false}
                placeholder="Todos los grados"
            >
                {resumenes.map((item) => (
                    <SelectItem key={item.grado} value={item.grado}>
                        {item.grado}
                    </SelectItem>
                ))}
            </Select>

            <Doughnut
                data={data}
                options={options}
                data-testid="doughnut-chart"
            />
            <div style={{ display: "none" }} data-testid="no-admitidos-labels">
                {data.labels.map((label, index) => (
                    <span key={label}>{label}</span>
                ))}
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                <p className="text-sm text-gray-500">Total inscritos</p>
                <p className="text-xl font-bold text-gray-800">{total}</p>
            </div>
        </div>
    );
};

export default ResumenAdmision;
