import { FaUsers } from "react-icons/fa";
import {
    Card,
    CardHeader,
    CardBody,
    Tooltip,
    Skeleton,
} from "@heroui/react";
import PropTypes from "prop-types";
import CountUp from "react-countup";
import { admissionConfig } from "../../../../config/admission";

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
            <div className="w-full h-full block">
                <Card
                    className={`w-full h-full min-h-[160px] relative overflow-hidden rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 border border-white/40 group`}
                    style={{
                        background: `linear-gradient(135deg, ${bgColor.replace('bg-[', '').replace(']', '')} 0%, white 100%)`
                    }}
                >
                    {/* Elemento decorativo de fondo */}
                    <div
                        className={`absolute -right-6 -bottom-6 w-32 h-32 rounded-full opacity-10 blur-2xl group-hover:scale-150 transition-transform duration-500`}
                        style={{ backgroundColor: iconBgColor.replace('bg-[', '').replace(']', '') }}
                    />

                    <div
                        className={`absolute top-4 right-4 ${iconBgColor} p-3 rounded-2xl shadow-sm opacity-90 backdrop-blur-sm`}
                    >
                        <Icon size={26} color="#ffffff" />
                    </div>

                    <CardHeader className="pb-0 pt-4 px-7 flex-col items-start z-10 relative">
                        <p
                            className={`text-xs sm:text-sm md:text-sm lg:text-sm xl:text-[13px] uppercase font-extrabold tracking-widest opacity-80 ${textColor}`}
                        >
                            {title}
                        </p>
                    </CardHeader>

                    <CardBody className="py-2 px-7 pb-4 flex flex-row items-center justify-center sm:justify-start z-10 relative">
                        <h2 className={`text-xl font-black sm:text-5xl md:text-3xl lg:text-5xl tracking-tighter drop-shadow-sm ${textColor}`}>
                            <CountUp
                                start={0}
                                end={formattedAmount}
                                duration={2.5}
                                separator=","
                                prefix={isAmountCurrency ? "S/." : ""}
                            />
                        </h2>
                    </CardBody>
                </Card>
            </div>
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

    const periodo = `Periodo ${admissionConfig.cronograma.periodo}`;

    const cardData = [
        {
            title: "Total de Preinscritos",
            amount: TOTAL.toString(),
            period: periodo,
            bgColor: "bg-[#fff3e6]",
            iconBgColor: "bg-[#ff9c1a]",
            textColor: "text-[#ff9c1a]",
            tooltipDetails: `Total de preinscritos en todos los programas: ${TOTAL}`,
        },
        {
            title: "Maestría",
            amount: MAESTRIA.toString(),
            period: periodo,
            bgColor: "bg-[#e5f3ff]",
            iconBgColor: "bg-[#3399ff]",
            textColor: "text-[#3399ff]",
            tooltipDetails: `Total de preinscritos en Maestría: ${MAESTRIA}`,
        },
        {
            title: "Doctorado",
            amount: DOCTORADO.toString(),
            period: periodo,
            bgColor: "bg-[#f1fbfd]",
            iconBgColor: "bg-[#23c2d3]",
            textColor: "text-[#23c2d3]",
            tooltipDetails: `Total de preinscritos en Doctorado: ${DOCTORADO}`,
        },
        {
            title: "Segunda Especialidad",
            amount: SEGUNDA_ESPECIALIDAD.toString(),
            period: periodo,
            bgColor: "bg-[#f4f4fb]",
            iconBgColor: "bg-[#7d76cf]",
            textColor: "text-[#7d76cf]",
            tooltipDetails: `Total de preinscritos en Segunda Especialidad: ${SEGUNDA_ESPECIALIDAD}`,
        },
    ];

    return (
        <div className="w-full pt-2 pb-4">
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="w-full h-[160px] rounded-xl" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full">
                    {cardData.map((card, index) => (
                        <CardComponent key={index} {...card} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default PreInscritosCard;
