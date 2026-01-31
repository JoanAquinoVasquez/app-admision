import { MdPeople } from "react-icons/md";
import { CardBody, Divider, Tooltip } from "@heroui/react";
import DashboardCard from "../../components/Cards/DashboardCard";
import CountUp from "react-countup";

const ResumenGrado = ({ resumenGeneral }) => {
    if (!resumenGeneral || resumenGeneral.length === 0) return null;

    // Calcular total de ingresantes
    const totalIngresantes = resumenGeneral.reduce(
        (acc, grado) => acc + (grado.ingresantes || 0),
        0
    );

    // Obtener ingresantes por grado
    const doc =
        resumenGeneral.find((g) => g.grado === "DOCTORADO")?.ingresantes || 0;
    const mae =
        resumenGeneral.find((g) => g.grado === "MAESTRIA")?.ingresantes || 0;
    const seg =
        resumenGeneral.find((g) => g.grado === "SEGUNDA ESPECIALIDAD")
            ?.ingresantes || 0;

    return (
        <DashboardCard
            title="Estado de Ingresantes"
            icon={<MdPeople className="text-blue-500" />}
        >
            {/* Total ingresantes */}
            <CardBody className="grid grid-cols-2 p-0 items-center">
                <div className="text-center">
                    <Tooltip content="Número total de ingresantes admitidos">
                        <p className="text-6xl md:text-6xl font-bold text-green-600">
                            <CountUp
                                end={totalIngresantes}
                                duration={1.5}
                                separator=","
                            />
                        </p>
                    </Tooltip>
                    <p className="text-gray-600 text-xs md:text-sm">
                        Total Ingresantes
                    </p>
                </div>

                {/* Desglose por grado */}
                <div>
                    <div className="flex justify-center items-center space-x-10">
                        <div className="flex items-center space-x-1">
                            <span className="text-xl text-blue-500">🎓</span>
                            <p className="text-lg font-semibold text-blue-500">
                                DOC
                            </p>
                        </div>
                        <p className="text-xl font-bold text-black ml-2">
                            <CountUp end={doc} duration={1.2} />
                        </p>
                    </div>

                    <div className="flex justify-center items-center space-x-10">
                        <div className="flex items-center space-x-1">
                            <span className="text-xl text-green-500">📚</span>
                            <p className="text-lg font-semibold text-green-500">
                                MAE
                            </p>
                        </div>
                        <p className="text-xl font-bold text-black ml-2">
                            <CountUp end={mae} duration={1.2} />
                        </p>
                    </div>

                    <div className="flex justify-center items-center space-x-10">
                        <div className="flex items-center space-x-1">
                            <span className="text-xl text-purple-500">🏅</span>
                            <p className="text-lg font-semibold text-purple-500">
                                SEG
                            </p>
                        </div>
                        <p className="text-xl font-bold text-black ml-2">
                            <CountUp end={seg} duration={1.2} />
                        </p>
                    </div>
                </div>
            </CardBody>

            {/* <Divider /> */}
        </DashboardCard>
    );
};

export default ResumenGrado;
