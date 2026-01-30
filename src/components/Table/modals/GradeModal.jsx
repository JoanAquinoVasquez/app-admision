import React, { useState, useEffect } from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Input,
    Button,
} from "@nextui-org/react";
import { toast } from "react-hot-toast";
import axios from "../../../axios";

const GradeModal = ({
    isOpen,
    onClose,
    validarId,
    initialNota,
    gradoSelected,
    onSuccess
}) => {
    const [nota, setNota] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setNota(initialNota || "");
        }
    }, [isOpen, initialNota]);

    const handleGuardarNota = async () => {
        // Validar que la nota esté dentro del rango permitido
        if (gradoSelected && gradoSelected == 3) {
            if (nota < 0 || nota > 30 || isNaN(nota)) {
                toast.error("La nota debe estar entre 0 y 30.");
                return;
            }
        }

        if (nota < 0 || nota > 40 || isNaN(nota)) {
            toast.error("La nota debe estar entre 0 y 40.");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post("/guardar-nota-entrevista", {
                inscripcion_id: validarId,
                nota_entrevista: nota,
            });
            toast.success("Nota guardada correctamente.");
            onSuccess();
            onClose();
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Hubo un problema al guardar la nota."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                <ModalHeader>Registrar Nota</ModalHeader>
                <ModalBody>
                    <Input
                        type="number"
                        label="Nota"
                        placeholder="Ingrese la nota"
                        min={0}
                        max={gradoSelected && gradoSelected == 3 ? 30 : 40}
                        step="0.01"
                        value={isNaN(Number(nota)) ? "" : nota}
                        onChange={(e) => setNota(e.target.value)}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button
                        color="default"
                        variant="flat"
                        onPress={onClose}
                        isDisabled={loading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        color="success"
                        onPress={handleGuardarNota}
                        isLoading={loading}
                    >
                        Guardar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default GradeModal;
