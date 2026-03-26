import React, { useState, useEffect } from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Input,
    Button,
} from "@heroui/react";
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
        const maxEntrevista = 35;
        if (nota < 0 || nota > maxEntrevista || isNaN(nota)) {
            toast.error(`La nota debe estar entre 0 y ${maxEntrevista}.`);
            return;
        }

        setLoading(true);
        const promise = axios.post("/guardar-nota-entrevista", {
            inscripcion_id: validarId,
            nota_entrevista: nota,
        });

        toast.promise(promise, {
            loading: "Guardando nota...",
            success: (response) => {
                onSuccess();
                onClose();
                return response.data.message || "Nota guardada correctamente.";
            },
            error: (error) =>
                error.response?.data?.message ||
                "Hubo un problema al guardar la nota."
        });

        try {
            await promise;
        } catch (error) {
            // Error managed by toast.promise
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} shouldBlockScroll={false}>
            <ModalContent>
                <ModalHeader>Registrar Nota</ModalHeader>
                <ModalBody>
                    <Input
                        type="number"
                        label="Nota"
                        placeholder="Ingrese la nota"
                        min={0}
                        max={35}
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
