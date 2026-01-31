import React, { useState, useEffect } from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Textarea,
    Spinner,
} from "@heroui/react";
import PropTypes from "prop-types";

export default function ObserveInscripcionModal({
    isOpen,
    onClose,
    onConfirm,
    initialObservation = "",
    isLoading = false,
}) {
    const [observacion, setObservacion] = useState(initialObservation);

    useEffect(() => {
        if (isOpen) {
            setObservacion(initialObservation || "");
            console.log("initialObservation", initialObservation);
        }
    }, [isOpen, initialObservation]);

    const handleConfirm = () => {
        onConfirm(observacion);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                <ModalHeader>Observar Inscripción</ModalHeader>
                <ModalBody>
                    {isLoading ? (
                        <div className="flex justify-center items-center py-10">
                            <Spinner label="Guardando observación..." />
                        </div>
                    ) : (
                        <Textarea
                            label="Motivo de la observación"
                            placeholder="Ingrese el motivo..."
                            value={observacion}
                            onValueChange={setObservacion}
                        />
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose} isDisabled={isLoading}>
                        Cancelar
                    </Button>
                    <Button 
                        color="primary" 
                        onPress={handleConfirm} 
                        isDisabled={!observacion.trim() || isLoading}
                        isLoading={isLoading}
                    >
                        Guardar Observación
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

ObserveInscripcionModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    initialObservation: PropTypes.string,
    isLoading: PropTypes.bool,
};
