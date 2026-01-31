import { Card, CardBody, CircularProgress, Chip } from "@heroui/react";
import { MdEmail } from "react-icons/md";

const DocenteResumenGeneralCard = ({ docente }) => {
    const { docente: info, resumen_general } = docente;

    const avance =
        parseFloat(resumen_general.avance_general.replace("%", "")) || 0;

    return (
        <Card
            shadow="sm"
            className="rounded-2xl border border-gray-100 hover:shadow-md transition-all"
        >
            <CardBody className="flex flex-col">
                {/* Cabecera */}
                <div className="text-center">
                    <h3 className="text-md font-bold text-gray-800 uppercase">
                        {info.nombre}
                    </h3>
                    <p className="text-sm text-gray-500 flex items-center justify-center gap-1">
                        <MdEmail className="text-gray-400" /> {info.email}
                    </p>
                </div>

                {/* Sección de contenido central compacta */}
                <div className="flex items-center justify-center gap-8">
                    {/* Chips */}
                    <div className="flex flex-col gap-1">
                        <Chip variant="bordered" color="success" size="sm" aria-label="CV’s Evaluados por cada docente">
                            Evaluados: {resumen_general.evaluados} /{" "}
                            {resumen_general.total_postulantes}
                        </Chip>
                        <Chip variant="bordered" color="danger" size="sm" aria-label="CV’s Pendientes por cada docente">
                            Pendientes: {resumen_general.pendientes}
                        </Chip>
                    </div>
                    {/* Progreso Circular */}
                    <CircularProgress
                        color="warning"
                        value={avance}
                        valueLabel={`${avance}%`}
                        maxValue={100}
                        showValueLabel
                        classNames={{
                            svg: "w-20 h-20",
                            value: "text-xs text-gray-800 font-semibold",
                        }}
                    />
                </div>
            </CardBody>
        </Card>
    );
};

export default DocenteResumenGeneralCard;
