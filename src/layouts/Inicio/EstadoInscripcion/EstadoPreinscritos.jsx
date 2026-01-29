import { MdPeople } from "react-icons/md";
import { Divider, Spinner, Tooltip } from "@nextui-org/react";
import DashboardCard from "../../../components/Cards/DashboardCard";
import CountUp from "react-countup";

const EstadoPreinscritos = ({ preinscripciones, loading }) => {
    const totalPre_inscritos = preinscripciones?.totalPre_inscritos ?? 0;
    const doctorado = preinscripciones?.doctorado || 0;
    const maestria = preinscripciones?.maestria || 0;
    const segunda_especialidad = preinscripciones?.segunda_especialidad || 0;
    const preInscritosPagados = preinscripciones?.preInscritosPagados || 0;
    const preInscritosNoPagados = preinscripciones?.preInscritosNoPagados || 0;

    const totalPagadosNoPagados = preInscritosPagados + preInscritosNoPagados;

    const porcetajeInscritos = totalPagadosNoPagados
        ? ((totalPre_inscritos / totalPagadosNoPagados) * 100).toFixed(2)
        : "0.00";

    const porcentajePagados = totalPagadosNoPagados
        ? ((preInscritosPagados / totalPagadosNoPagados) * 100).toFixed(2)
        : "0.00";

    const porcentajeNoPagados = totalPagadosNoPagados
        ? ((preInscritosNoPagados / totalPagadosNoPagados) * 100).toFixed(2)
        : "0.00";

    return (
        <DashboardCard
            title="Preinscripción"
            icon={<MdPeople className="text-blue-500" />}
        >
            {loading ? (
                <div className="flex flex-col items-center justify-center py-16">
                    <Spinner size="md" color="primary" label="Cargando..." />
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-2 p-0 items-center">
                        <div className="text-center">
                            <Tooltip content="Número total de preinscritos que ya se inscribieron">
                                <p className="text-6xl font-bold text-blue-600">
                                    <CountUp
                                        end={totalPre_inscritos}
                                        duration={1.5}
                                        separator=","
                                    />
                                </p>
                            </Tooltip>
                            <p className="text-gray-600 text-xs md:text-sm">
                                Inscritos{" "}
                                <span className="text-sm">
                                    ({porcetajeInscritos}% de {totalPagadosNoPagados})
                                </span>
                            </p>
                        </div>

                        <div>
                            {[
                                {
                                    icon: "🎓",
                                    label: "DOC",
                                    color: "text-blue-500",
                                    value: doctorado,
                                },
                                {
                                    icon: "📚",
                                    label: "MAE",
                                    color: "text-green-500",
                                    value: maestria,
                                },
                                {
                                    icon: "🏅",
                                    label: "SEG",
                                    color: "text-purple-500",
                                    value: segunda_especialidad,
                                },
                            ].map((item, idx) => (
                                <div
                                    key={idx}
                                    className="flex justify-center items-center space-x-10"
                                >
                                    <div className="flex items-center space-x-1">
                                        <span className={`text-xl ${item.color}`}>
                                            {item.icon}
                                        </span>
                                        <p
                                            className={`text-lg font-semibold ${item.color}`}
                                        >
                                            {item.label}
                                        </p>
                                    </div>
                                    <p className="text-xl font-bold text-black ml-2">
                                        <CountUp end={item.value} duration={1.2} />
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Divider />

                    <div className="grid grid-cols-2 gap-4 text-center p-3">
                        <div>
                            <h3 className="font-semibold text-lg text-gray-700">
                                Han pagado
                            </h3>
                            <p className="text-green-600 text-xl font-medium">
                                <CountUp end={preInscritosPagados} duration={1.2} />{" "}
                                <span className="text-sm">({porcentajePagados}%)</span>
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg text-gray-700">
                                No han pagado
                            </h3>
                            <p className="text-red-600 text-xl font-medium">
                                <CountUp end={preInscritosNoPagados} duration={1.2} />{" "}
                                <span className="text-sm">
                                    ({porcentajeNoPagados}%)
                                </span>
                            </p>
                        </div>
                    </div>
                </>
            )}
        </DashboardCard>
    );
};

export default EstadoPreinscritos;
