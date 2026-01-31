import { FaUsers } from "react-icons/fa";
import {
    Card,
    CardHeader,
    CardBody,
    Tooltip,
    Spinner,
} from "@heroui/react";
import PropTypes from "prop-types";
import CountUp from "react-countup";

// CardComponent
const CardComponent = ({
    bgColor,
    iconBgColor,
    textColor,
    title,
    amount,
    isAmountCurrency = false,
    Icon = FaUsers,
    tooltipDetails,
}) => {
    const formattedAmount = isAmountCurrency
        ? parseFloat(amount.replace("S/.", "").replace(",", ""))
        : parseInt(amount.replace(",", ""));

    return (
        <Tooltip
            placement="top"
            content={<div className="px-1 py-2">{tooltipDetails}</div>}
        >
            <Card
                className={`w-[180px] sm:w-[210px] md:w-[210px] lg:w-[240px] xl:w-[270px] ${bgColor} relative overflow-hidden rounded-lg shadow-md py-0`}
            >
                <div
                    className={`absolute top-3 right-4 ${iconBgColor} p-1.5 rounded-md`}
                >
                    <Icon size={18} color="#ffffff" />
                </div>
                <CardHeader className="pb-0 pt-2 px-2 flex-col items-start">
                    <p
                        className={`text-xs sm:text-sm md:text-sm lg:text-sm xl:text-base uppercase font-bold ${textColor}`}
                    >
                        {title}
                    </p>
                </CardHeader>
                <CardBody className="py-1 px-3 items-center">
                    <h2 className="text-base font-bold sm:text-lg md:text-lg lg:text-xl xl:text-2xl text-black">
                        <CountUp
                            start={0}
                            end={formattedAmount}
                            duration={2}
                            separator=","
                            prefix={isAmountCurrency ? "S/." : ""}
                        />
                    </h2>
                </CardBody>
            </Card>
        </Tooltip>
    );
};

CardComponent.propTypes = {
    bgColor: PropTypes.string.isRequired,
    iconBgColor: PropTypes.string.isRequired,
    textColor: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    amount: PropTypes.string.isRequired,
    period: PropTypes.string.isRequired,
    isAmountCurrency: PropTypes.bool,
    Icon: PropTypes.elementType,
    tooltipDetails: PropTypes.node,
};

// PreInscritosCard
const PreInscritosCard = ({ programasPreinscritos, loading }) => {
    const {
        MAESTRIA = 0,
        DOCTORADO = 0,
        "SEGUNDA ESPECIALIDAD": SEGUNDA_ESPECIALIDAD = 0,
        TOTAL = 0,
    } = programasPreinscritos || {};

    const cardData = [
        {
            title: "Total de Preinscritos",
            amount: TOTAL.toString(),
            period: "Periodo 2025 - I",
            bgColor: "bg-[#fff3e6]",
            iconBgColor: "bg-[#ff9c1a]",
            textColor: "text-[#ff9c1a]",
            tooltipDetails: `Total de preinscritos en todos los programas: ${TOTAL}`,
        },
        {
            title: "Maestría",
            amount: MAESTRIA.toString(),
            period: "Periodo 2025 - I",
            bgColor: "bg-[#e5f3ff]",
            iconBgColor: "bg-[#3399ff]",
            textColor: "text-[#3399ff]",
            tooltipDetails: `Total de preinscritos en Maestría: ${MAESTRIA}`,
        },
        {
            title: "Doctorado",
            amount: DOCTORADO.toString(),
            period: "Periodo 2025 - I",
            bgColor: "bg-[#f1fbfd]",
            iconBgColor: "bg-[#23c2d3]",
            textColor: "text-[#23c2d3]",
            tooltipDetails: `Total de preinscritos en Doctorado: ${DOCTORADO}`,
        },
        {
            title: "Segunda Especialidad",
            amount: SEGUNDA_ESPECIALIDAD.toString(),
            period: "Periodo 2025 - I",
            bgColor: "bg-[#f4f4fb]",
            iconBgColor: "bg-[#7d76cf]",
            textColor: "text-[#7d76cf]",
            tooltipDetails: `Total de preinscritos en Segunda Especialidad: ${SEGUNDA_ESPECIALIDAD}`,
        },
    ];

    return (
        <div className="bg-light flex flex-wrap justify-around pt-0 pb-2">
            {loading ? (
                <div className="flex justify-center items-center h-40 w-full bg-white rounded-lg shadow-md ">
                    <Spinner color="primary" size="md" label="Cargando resumen..." />
                </div>
            ) : (
                <div className="cards-docentes flex flex-wrap justify-center gap-6">
                    {cardData.map((card, index) => (
                        <CardComponent key={index} {...card} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default PreInscritosCard;
