import React, { useState, useEffect } from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Textarea,
} from "@nextui-org/react";
import PropTypes from "prop-types";

export default function ObserveInscripcionModal({
    isOpen,
    onClose,
    onConfirm,
    initialObservation = "",
}) {
    const [observacion, setObservacion] = useState(initialObservation);

    useEffect(() => {
        if (isOpen) {
            setObservacion(initialObservation);
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
                    <Textarea
                        label="Motivo de la observación"
                        placeholder="Ingrese el motivo..."
                        value={observacion}
                        onValueChange={setObservacion}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                        Cancelar
                    </Button>
                    <Button color="primary" onPress={handleConfirm} isDisabled={!observacion.trim()}>
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
};
