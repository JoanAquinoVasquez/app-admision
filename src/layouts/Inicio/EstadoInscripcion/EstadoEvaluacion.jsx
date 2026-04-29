import { MdPeople } from "react-icons/md";
import { Skeleton } from "@heroui/react";
import DocenteResumenGeneralCard from "../../../components/Cards/DocenteResumenCard";

const EstadoEvaluacion = ({ estadoEvaluacion, loading }) => {
    return (
        <div
            className="flex flex-col h-full"
            aria-label="Docentes Evaluadores"
        >
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1 px-1">
                <MdPeople className="text-blue-500" />
                <span>Docentes Evaluadores</span>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 h-[420px]">
                    <Skeleton className="h-full w-full rounded-xl" />
                    <Skeleton className="h-full w-full rounded-xl" />
                </div>
            ) : (
                <div className="flex-1 h-[420px] overflow-y-auto pr-2 w-full custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pb-2">
                        {estadoEvaluacion && estadoEvaluacion.length > 0 ? (
                            estadoEvaluacion.map((docente, index) => (
                                <DocenteResumenGeneralCard key={index} docente={docente} />
                            ))
                        ) : (
                            <>
                                {[1, 2, 3, 4].map((i) => (
                                    <DocenteResumenGeneralCard
                                        key={i}
                                        docente={{
                                            docente: {
                                                nombre: "Sin Docentes Asignados",
                                                email: "---",
                                            },
                                            resumen_general: {
                                                avance_general: "0%",
                                                evaluados: 0,
                                                total_postulantes: 0,
                                                pendientes: 0,
                                            },
                                        }}
                                    />
                                ))}
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default EstadoEvaluacion;
