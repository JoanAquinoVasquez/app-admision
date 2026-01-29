import { MdPeople } from "react-icons/md";
import { CardBody, Divider, Spinner, Tooltip } from "@nextui-org/react";
import DashboardCard from "../../../components/Cards/DashboardCard";
import CountUp from "react-countup";

const EstadoInscripcion = ({ estadoInscripcion, loading }) => {
    const totalInscritos = estadoInscripcion?.total_inscritos || 0;

    return (
        <DashboardCard
            title="Estado del Proceso de Inscripción"
            icon={<MdPeople className="text-blue-500" />}
        >
            {loading ? (
                <div className="flex flex-col items-center justify-center py-16">
                    <Spinner size="md" color="primary" label="Cargando..." />
                </div>
            ) : (
                <>
                    {/* Total de inscritos */}
                    <CardBody className="grid grid-cols-2 p-0 items-center">
                        <div className="text-center">
                            <Tooltip content="Número total de postulantes registrados">
                                <p className="text-6xl md:text-6xl font-bold text-blue-600">
                                    <CountUp
                                        end={totalInscritos}
                                        duration={1.5}
                                        separator=","
                                    />
                                </p>
                            </Tooltip>
                            <p className="text-gray-600 text-xs md:text-sm">
                                Postulantes Inscritos
                            </p>
                        </div>

                        <div>
                            {[
                                {
                                    icon: "🎓",
                                    label: "DOC",
                                    color: "text-blue-500",
                                    value: estadoInscripcion?.grados?.doc || 0,
                                },
                                {
                                    icon: "📚",
                                    label: "MAE",
                                    color: "text-green-500",
                                    value: estadoInscripcion?.grados?.mae || 0,
                                },
                                {
                                    icon: "🏅",
                                    label: "SEG",
                                    color: "text-purple-500",
                                    value: estadoInscripcion?.grados?.seg || 0,
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
                    </CardBody>

                    <Divider />

                    {/* Sección de Validaciones */}
                    <CardBody className="grid grid-cols-2 gap-4 text-center p-1">
                        <div>
                            <h3 className="font-semibold text-gray-800">
                                Valid. Digital{" "}
                                <CountUp
                                    end={
                                        estadoInscripcion?.validaciones?.digital
                                            ?.porcentaje || 0
                                    }
                                    duration={1.2}
                                    decimals={2}
                                />
                                %
                            </h3>
                            <p className="text-green-600 font-medium">
                                ✅ Validados:{" "}
                                <CountUp
                                    end={
                                        estadoInscripcion?.validaciones?.digital
                                            ?.validados || 0
                                    }
                                    duration={1.2}
                                />
                            </p>
                            <p className="text-red-600 font-medium">
                                ⏳ Pendientes:{" "}
                                <CountUp
                                    end={
                                        estadoInscripcion?.validaciones?.digital
                                            ?.pendientes || 0
                                    }
                                    duration={1.2}
                                />
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-800">
                                Valid. Física{" "}
                                <CountUp
                                    end={
                                        estadoInscripcion?.validaciones?.fisico
                                            ?.porcentaje || 0
                                    }
                                    duration={1.2}
                                    decimals={2}
                                />
                                %
                            </h3>
                            <p className="text-green-600 font-medium">
                                📄 Recepc.:{" "}
                                <CountUp
                                    end={
                                        estadoInscripcion?.validaciones?.fisico
                                            ?.recepcionados || 0
                                    }
                                    duration={1.2}
                                />
                            </p>
                            <p className="text-red-600 font-medium">
                                📂 Faltantes:{" "}
                                <CountUp
                                    end={
                                        estadoInscripcion?.validaciones?.fisico
                                            ?.faltantes || 0
                                    }
                                    duration={1.2}
                                />
                            </p>
                        </div>
                    </CardBody>
                </>
            )}
        </DashboardCard>
    );
};

export default EstadoInscripcion;
