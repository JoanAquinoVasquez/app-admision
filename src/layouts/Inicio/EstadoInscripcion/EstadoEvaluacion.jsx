import { MdPeople } from "react-icons/md";
import DocenteResumenGeneralCard from "../../../components/Cards/DocenteResumenCard";

const EstadoEvaluacion = ({ estadoEvaluacion }) => {
    if (!estadoEvaluacion || estadoEvaluacion.length === 0) {
        return (
            <div className="flex flex-col">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1 px-1">
                    <MdPeople className="text-blue-500" />
                    <span>Docentes Evaluadores</span>
                </div>

                <div className="flex items-center justify-center h-36 border border-gray-200 rounded-lg bg-white shadow-sm">
                    <p className="text-gray-500">No hay docentes asignados</p>
                </div>
            </div>
        );
    }

    return (
        <div
            className="flex flex-col"
            aria-label="Docentes Evaluadores"
        >
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1 px-1">
                <MdPeople className="text-blue-500" />
                <span>Docentes Evaluadores</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {estadoEvaluacion.map((docente, index) => (
                    <DocenteResumenGeneralCard key={index} docente={docente} />
                ))}
            </div>
        </div>
    );
};

export default EstadoEvaluacion;
