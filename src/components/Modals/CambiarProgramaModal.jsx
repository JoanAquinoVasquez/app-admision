import { useState, useEffect } from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Select,
    SelectItem,
} from "@heroui/react";

const CambiarProgramaModal = ({
    isOpen,
    onClose,
    onConfirm,
    grados = [],
    programas = [],
    inscripcionId,
    isLoading = false,
}) => {
    const [selectedGrado, setSelectedGrado] = useState("");
    const [selectedPrograma, setSelectedPrograma] = useState("");
    const [filteredProgramas, setFilteredProgramas] = useState([]);

    // Reset selections when modal closes
    useEffect(() => {
        if (!isOpen) {
            setSelectedGrado("");
            setSelectedPrograma("");
            setFilteredProgramas([]);
        }
    }, [isOpen]);

    // Filter programs when grade changes
    useEffect(() => {
        if (selectedGrado && Array.isArray(programas) && programas.length > 0) {
            const filtered = programas.filter(
                (p) => p.grado_id.toString() === selectedGrado.toString()
            );
            setFilteredProgramas(filtered);
        } else {
            setFilteredProgramas([]);
        }
    }, [selectedGrado, programas]);

    const handleGradoChange = (keys) => {
        const value = Array.from(keys)[0];
        setSelectedGrado(value || "");
        setSelectedPrograma(""); // Reset program when grade changes
    };

    const handleProgramaChange = (keys) => {
        const value = Array.from(keys)[0];
        setSelectedPrograma(value || "");
    };

    const handleConfirm = () => {
        if (selectedGrado && selectedPrograma) {
            onConfirm(inscripcionId, selectedGrado, selectedPrograma);
        }
    };

    return (
        <Modal
            size="lg"
            isOpen={isOpen}
            onOpenChange={onClose}
            isDismissable={false}
        >
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <svg
                            className="w-6 h-6 text-primary"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                            />
                        </svg>
                        <span className="text-lg font-semibold">
                            Cambiar Programa
                        </span>
                    </div>
                    <p className="text-sm text-default-500 font-normal">
                        Seleccione el nuevo grado y programa para el postulante.{" "}
                        <span className="font-semibold text-warning">
                            Esta acción es irreversible.
                        </span>
                    </p>
                </ModalHeader>

                <ModalBody className="gap-4">
                    <div className="bg-default-100 p-4 rounded-lg">
                        <p className="text-sm font-medium text-default-700 mb-3">
                            Selección de Programa
                        </p>
                        
                        <div className="flex flex-col gap-4">
                            {/* Select de Grado */}
                            <Select
                                label="Grado Académico"
                                placeholder="Seleccione un grado"
                                selectedKeys={selectedGrado ? [selectedGrado] : []}
                                onSelectionChange={handleGradoChange}
                                isRequired
                                variant="bordered"
                                classNames={{
                                    trigger: "bg-white",
                                }}
                            >
                                {Array.isArray(grados) && grados.length > 0 ? (
                                    grados.map((grado) => (
                                        <SelectItem key={grado.id.toString()} value={grado.id.toString()}>
                                            {grado.nombre}
                                        </SelectItem>
                                    ))
                                ) : (
                                    <SelectItem key="no-data" isDisabled>
                                        No hay grados disponibles
                                    </SelectItem>
                                )}
                            </Select>

                            {/* Select de Programa */}
                            <Select
                                label="Programa"
                                placeholder={
                                    selectedGrado
                                        ? "Seleccione un programa"
                                        : "Primero seleccione un grado"
                                }
                                selectedKeys={selectedPrograma ? [selectedPrograma] : []}
                                onSelectionChange={handleProgramaChange}
                                isRequired
                                isDisabled={!selectedGrado || filteredProgramas.length === 0}
                                variant="bordered"
                                classNames={{
                                    trigger: "bg-white",
                                }}
                            >
                                {filteredProgramas.map((programa) => (
                                    <SelectItem key={programa.id.toString()} value={programa.id.toString()}>
                                        {programa.nombre}
                                    </SelectItem>
                                ))}
                            </Select>
                        </div>
                    </div>
                </ModalBody>

                <ModalFooter className="gap-2">
                    <Button
                        color="default"
                        variant="light"
                        onPress={onClose}
                        isDisabled={isLoading}
                        startContent={
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        }
                    >
                        Cancelar
                    </Button>
                    <Button
                        color="primary"
                        onPress={handleConfirm}
                        isDisabled={!selectedGrado || !selectedPrograma}
                        isLoading={isLoading}
                        startContent={
                            !isLoading && (
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            )
                        }
                    >
                        Confirmar Cambio
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default CambiarProgramaModal;

