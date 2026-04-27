import { Card, CardBody, CircularProgress, Chip } from "@heroui/react";
import { MdEmail } from "react-icons/md";

const DocenteResumenGeneralCard = ({ docente }) => {
    const { docente: info, resumen_general } = docente;

    const avance =
        parseFloat(resumen_general.avance_general.replace("%", "")) || 0;

    const isEntrevista = info.tipo === 'entrevista';

    return (
        <Card
            shadow="sm"
            className={`rounded-2xl border transition-all hover:shadow-md ${isEntrevista ? 'border-purple-100 bg-purple-50/10' : 'border-blue-100 bg-blue-50/10'}`}
        >
            <CardBody className="flex flex-col">
                {/* Cabecera */}
                <div className="text-center relative">
                    <div className="absolute top-0 right-0">
                        <Chip 
                            size="sm" 
                            variant="shadow" 
                            color={isEntrevista ? "secondary" : "primary"}
                            className="text-[9px] font-bold h-4"
                        >
                            {isEntrevista ? 'ENTREVISTA' : 'CV'}
                        </Chip>
                    </div>
                    <h3 className="text-md font-bold text-gray-800 uppercase pr-8">
                        {info.nombre}
                    </h3>
                    <p className="text-sm text-gray-500 flex items-center justify-center gap-1">
                        <MdEmail className="text-gray-400" /> {info.email}
                    </p>
                </div>

                {/* Sección de contenido central compacta */}
                <div className="flex items-center justify-center gap-8 mt-2">
                    {/* Chips */}
                    <div className="flex flex-col gap-1">
                        <Chip variant="bordered" color={isEntrevista ? "secondary" : "success"} size="sm" aria-label="Postulantes Evaluados">
                            Evaluados: {resumen_general.evaluados} /{" "}
                            {resumen_general.total_postulantes}
                        </Chip>
                        <Chip variant="bordered" color="danger" size="sm" aria-label="Postulantes Pendientes">
                            Pendientes: {resumen_general.pendientes}
                        </Chip>
                    </div>
                    {/* Progreso Circular */}
                    <CircularProgress
                        aria-label={`Avance de evaluación: ${avance}%`}
                        color={isEntrevista ? "secondary" : "warning"}
                        value={avance}
                        showValueLabel={true}
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
