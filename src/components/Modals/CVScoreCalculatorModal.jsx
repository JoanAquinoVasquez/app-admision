import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Checkbox,
    RadioGroup,
    Radio,
    Input,
    Divider,
} from "@heroui/react";
import { useState, useEffect } from "react";
import { MdCalculate } from "react-icons/md";

const CVScoreCalculatorModal = ({ isOpen, onClose, onApply, initialScore = 0 }) => {
    // 1. Grados Académicos
    const [numBachiller, setNumBachiller] = useState(0);
    const [numMaestria, setNumMaestria] = useState(0);
    const [numDoctorado, setNumDoctorado] = useState(0);


    // 2. Participación en capacitaciones y Diplomados (Comparten máximo de 4 pts)


    // Cantidades de capacitaciones
    const [cap0_30, setCap0_30] = useState(0);
    const [cap31_60, setCap31_60] = useState(0);
    const [cap61_100, setCap61_100] = useState(0);
    const [cap100_plus, setCap100_plus] = useState(0);

    // Cantidades de diplomados
    const [dip0_100, setDip0_100] = useState(0);
    const [dip101_500, setDip101_500] = useState(0);
    const [dip501_800, setDip501_800] = useState(0);
    const [dip801_plus, setDip801_plus] = useState(0);

    // 3. Publicación de revistas
    const [hasPublicacion, setHasPublicacion] = useState(false);

    // Resetear al abrir
    useEffect(() => {
        if (isOpen) {
            setNumBachiller(0);
            setNumMaestria(0);
            setNumDoctorado(0);
            setCap0_30(0); setCap31_60(0); setCap61_100(0); setCap100_plus(0);
            setDip0_100(0); setDip101_500(0); setDip501_800(0); setDip801_plus(0);
            setHasPublicacion(false);
        }

    }, [isOpen]);

    const calcularTotal = () => {
        let total = 0;

        // Grados (13 max)
        const puntosGrados = (numBachiller * 3) + (numMaestria * 5) + (numDoctorado * 5);
        total += Math.min(13, puntosGrados);


        // Suma de capacitaciones y diplomados
        const puntosCap =
            (parseInt(cap0_30) || 0) * 0.2 +
            (parseInt(cap31_60) || 0) * 0.4 +
            (parseInt(cap61_100) || 0) * 0.6 +
            (parseInt(cap100_plus) || 0) * 0.8;


        const puntosDip =
            (parseInt(dip0_100) || 0) * 0.2 +
            (parseInt(dip101_500) || 0) * 0.4 +
            (parseInt(dip501_800) || 0) * 0.6 +
            (parseInt(dip801_plus) || 0) * 0.8;

        total += Math.min(4, puntosCap + puntosDip);

        // Revistas (3 pts)
        if (hasPublicacion) total += 3;

        return parseFloat(total.toFixed(3));
    };

    const handleApply = () => {
        onApply(calcularTotal());
        onClose();
    };



    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="5xl"
            scrollBehavior="inside"
            classNames={{
                wrapper: "flex justify-center items-center p-2 md:p-4",
                base: "max-w-[1300px] h-fit max-h-[88vh] rounded-3xl shadow-2xl overflow-hidden bg-white",
                header: "border-b border-gray-100 bg-slate-50 py-2.5 px-6",
                body: "p-4 md:p-5 bg-white overflow-y-auto",
                footer: "border-t border-gray-200 bg-slate-50 py-2.5 px-6"
            }}
        >



            <ModalContent>
                <ModalHeader>
                    <div className="flex items-center gap-3">
                        <MdCalculate className="text-blue-600" size={28} />
                        <span className="text-xl font-bold text-slate-800">Calculadora de Puntaje de CV</span>
                    </div>
                </ModalHeader>
                <ModalBody>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-6">
                        {/* COLUMNA 1: GRADOS Y REVISTAS */}
                        <div className="flex flex-col h-full">
                            {/* SECCIÓN 1: GRADOS */}
                            <section className="mb-6 flex-grow">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-2">
                                        <span className="bg-blue-600 text-white w-6 h-6 rounded flex items-center justify-center text-[10px] shadow-sm">1</span>
                                        Grados Académicos
                                    </h4>
                                    <div className="text-[10px] bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full font-bold border border-indigo-200">
                                        MÁX. 13 Pts
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2 bg-blue-50/40 p-3 rounded-2xl border border-blue-100 shadow-sm">
                                    <StepperItem label="Bachiller (3 pts)" value={numBachiller} onChange={setNumBachiller} compact />
                                    <StepperItem label="Maestría (5 pts)" value={numMaestria} onChange={setNumMaestria} compact />
                                    <StepperItem label="Doctorado (5 pts)" value={numDoctorado} onChange={setNumDoctorado} compact />
                                </div>
                            </section>

                            {/* SECCIÓN 3: REVISTAS */}
                            <section>
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-2">
                                        <span className="bg-amber-600 text-white w-6 h-6 rounded flex items-center justify-center text-[10px] shadow-sm">3</span>
                                        Publicación en Revistas
                                    </h4>
                                    <div className="text-[10px] bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full font-bold border border-indigo-200">
                                        MÁX. 3 Pts
                                    </div>
                                </div>
                                <div className="bg-amber-50/40 p-4 rounded-2xl border border-amber-100 hover:bg-amber-100/50 transition-all cursor-pointer shadow-sm"
                                    onClick={() => setHasPublicacion(!hasPublicacion)}>
                                    <Checkbox
                                        isSelected={hasPublicacion}
                                        onValueChange={setHasPublicacion}
                                        size="md"
                                        color="warning"
                                        classNames={{ label: "font-black text-amber-900 text-sm" }}
                                    >
                                        Si cuenta con publicación en revistas (3 pts)
                                    </Checkbox>
                                </div>
                            </section>
                        </div>

                        {/* COLUMNA 2: CAPACITACIONES */}
                        <div className="flex flex-col h-full">
                            <section>
                                <h4 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <span className="bg-indigo-600 text-white w-6 h-6 rounded flex items-center justify-center text-[10px] shadow-sm">2.1</span>
                                    Capacitaciones
                                </h4>
                                <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2.5">
                                    <StepperItem label="0 - 30 horas (0.2 pts)" value={cap0_30} onChange={setCap0_30} compact />
                                    <StepperItem label="31 - 60 horas (0.4 pts)" value={cap31_60} onChange={setCap31_60} compact />
                                    <StepperItem label="61 - 100 horas (0.6 pts)" value={cap61_100} onChange={setCap61_100} compact />
                                    <StepperItem label="100 a más (0.8 pts)" value={cap100_plus} onChange={setCap100_plus} compact />
                                </div>
                            </section>
                        </div>

                        {/* COLUMNA 3: DIPLOMADOS */}
                        <div className="flex flex-col h-full">
                            <section>
                                <div className="flex justify-between items-center mb-2.5">
                                    <h4 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-2">
                                        <span className="bg-violet-600 text-white w-6 h-6 rounded flex items-center justify-center text-[10px] shadow-sm">2.2</span>
                                        Diplomados
                                    </h4>
                                    <div className="text-[10px] bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full font-bold border border-indigo-200">
                                        MÁX. 4 Pts
                                    </div>
                                </div>
                                <div className="bg-violet-50/40 p-4 rounded-2xl border border-violet-100 shadow-sm space-y-2.5">
                                    <StepperItem label="0 - 100 horas (0.2 pts)" value={dip0_100} onChange={setDip0_100} compact />
                                    <StepperItem label="101 - 500 horas (0.4 pts)" value={dip101_500} onChange={setDip101_500} compact />
                                    <StepperItem label="501 - 800 horas (0.6 pts)" value={dip501_800} onChange={setDip501_800} compact />
                                    <StepperItem label="801 a más (0.8 pts)" value={dip801_plus} onChange={setDip801_plus} compact />
                                </div>
                            </section>
                        </div>
                    </div>
                </ModalBody>







                <ModalFooter className="flex justify-between items-center bg-gray-50 border-t border-gray-200 py-4 px-10">
                    <div className="text-2xl">
                        <span className="font-bold text-gray-700">Total calculado: </span>
                        <span className="font-black text-blue-700 text-3xl">{calcularTotal()}</span>
                        <span className="text-lg text-blue-600 ml-1 font-bold">pts</span>
                    </div>
                    <div className="flex gap-4">
                        <Button variant="light" onPress={onClose} className="font-bold text-lg px-6">
                            Cancelar
                        </Button>
                        <Button color="primary" onPress={handleApply} className="font-black px-10 h-14 text-xl shadow-lg">
                            Aplicar Nota
                        </Button>
                    </div>
                </ModalFooter>

            </ModalContent >
        </Modal >
    );
};

export default CVScoreCalculatorModal;

/**
 * Componente auxiliar para aumentar/disminuir cantidades
 * Pensado para facilitar la interacción de adultos mayores
 */
const StepperItem = ({ label, value, onChange, compact = false }) => {
    return (
        <div className={`flex items-center justify-between bg-white rounded-xl shadow-sm border border-gray-100 hover:border-blue-300 transition-colors ${compact ? 'p-2.5' : 'p-4'}`}>
            <span className={`text-gray-800 font-bold leading-tight max-w-[65%] ${compact ? 'text-sm' : 'text-lg'}`}>
                {label}
            </span>
            <div className={`flex items-center bg-gray-50 rounded-full border border-gray-200 ${compact ? 'gap-3 p-0.5' : 'gap-5 p-1'}`}>
                <Button
                    isIconOnly
                    size={compact ? "md" : "lg"}
                    radius="full"
                    variant="flat"
                    className={`bg-white shadow-sm border border-gray-200 ${compact ? 'w-9 h-9 min-w-9' : 'w-12 h-12 min-w-12'}`}
                    onPress={() => onChange(Math.max(0, parseInt(value || 0) - 1))}
                    aria-label="Disminuir"
                >
                    <span className={`${compact ? 'text-xl' : 'text-2xl'} font-black text-gray-600`}>−</span>
                </Button>

                <div className={`text-center font-black text-blue-700 tabular-nums ${compact ? 'w-6 text-lg' : 'w-10 text-2xl'}`}>
                    {value || 0}
                </div>

                <Button
                    isIconOnly
                    size={compact ? "md" : "lg"}
                    radius="full"
                    variant="solid"
                    color="primary"
                    className={`shadow-md ${compact ? 'w-9 h-9 min-w-9' : 'w-12 h-12 min-w-12'}`}
                    onPress={() => onChange(parseInt(value || 0) + 1)}
                    aria-label="Aumentar"
                >
                    <span className={`${compact ? 'text-xl' : 'text-2xl'} font-black text-white`}>+</span>
                </Button>
            </div>
        </div>
    );
};



