import { useState, useEffect } from "react";
import useProgramaInscritos from "../../../data/dataProgramasInscritos";
import Spinner from "../../../components/Spinner/Spinner";
import DashboardCard from "../../../components/Cards/DashboardCard";
import { MdDashboard } from "react-icons/md";

const InscritosCard = () => {
    const { programasInscritos, fetchProgramasInscritos } =
        useProgramaInscritos();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProgramasInscritos()
            .then(() => setLoading(false))
            .catch(() => setLoading(false));
    }, [fetchProgramasInscritos]);

    if (loading) return <Spinner />;

    const conteoInscritos = (grado) =>
        programasInscritos
            .filter((p) => p.grado === grado)
            .reduce((total, p) => total + parseInt(p.inscritos || 0), 0);

    const inscritosPorGrado = [
        {
            nombre: "DOC",
            icono: "🎓",
            color: "#23c2d3",
            cantidad: conteoInscritos("DOCTORADO"),
        },
        {
            nombre: "MAE",
            icono: "📚",
            color: "#3399ff",
            cantidad: conteoInscritos("MAESTRIA"),
        },
        {
            nombre: "SEG",
            icono: "🏅",
            color: "#7d76cf",
            cantidad: conteoInscritos("SEGUNDA ESPECIALIDAD"),
        },
    ];

    return (
        <DashboardCard
            title="Inscritos por Grado"
            icon={<MdDashboard className="text-blue-500" />}
        >
            <div className="grid grid-cols-1 sm:grid-cols-1">
                {inscritosPorGrado.map(({ nombre, icono, color, cantidad }) => (
                    <div
                        key={nombre}
                        className="grid grid-cols-2 p-2 items-center"
                    >
                        {/* Columna izquierda: Nombre e ícono */}
                        <div className="flex items-center">
                            <span className="text-xl" style={{ color }}>
                                {icono}
                            </span>
                            <p
                                className="text-lg font-semibold"
                                style={{ color }}
                            >
                                {nombre}
                            </p>
                        </div>

                        {/* Columna derecha: Cantidad y porcentaje */}
                        <div className="text-right">
                            <p className="text-xl font-bold">{cantidad}</p>
                        </div>
                    </div>
                ))}
            </div>
        </DashboardCard>
    );
};

export default InscritosCard;
