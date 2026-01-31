import propsTypes from "prop-types";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
} from "@heroui/react";

export default function ModalConfirm({
    isOpen,
    onClose,
    onConfirm,
    message,
    children,
}) {
    // Verificar si el mensaje contiene "cambio"
    const isCambio = message.includes("cambio");

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size={children ? "2xl" : "md"} // Cambiar a 'lg' si hay contenido adicional
            css={{
                height: isCambio ? "900px" : "auto", // Se ajusta al contenido
                maxWidth: isCambio ? "80vw" : "50vw", // Ajuste de ancho según contenido (opcional)
            }}
        >
            <ModalContent>
                <ModalHeader>
                    <h3>Confirmar acción</h3>
                </ModalHeader>
                <ModalBody>
                    {/* Si se pasa contenido adicional (children), lo mostramos, sino mostramos el mensaje */}
                    {children || <p>{message}</p>}
                </ModalBody>
                <ModalFooter>
                    <Button color="default" variant="flat" onPress={onClose} aria-label="Cancelando">
                        Cancelar
                    </Button>
                    <Button color="danger" onPress={onConfirm} aria-label="Confirmando">
                        Confirmar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

ModalConfirm.propTypes = {
    isOpen: propsTypes.bool.isRequired,
    onClose: propsTypes.func.isRequired,
    onConfirm: propsTypes.func.isRequired,
    message: propsTypes.string.isRequired,
    children: propsTypes.node, // Añadimos 'children' como una propiedad opcional
};
