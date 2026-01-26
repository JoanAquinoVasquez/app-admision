import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import PropTypes from "prop-types";

export default function ModalSessionExpiration({ isOpen, onClose, onKeepSession, onLogout, type }) {
  const isInactivityWarning = type === "inactividad";
  return (
    <Modal backdrop="opaque" isOpen={isOpen} onOpenChange={onClose} placement="top-center" size="lg">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">{isInactivityWarning ? "Inactividad Detectada" : "Sesión a punto de Expirar"}</ModalHeader>
        <ModalBody>
          <p className="text-center text-lg">{isInactivityWarning ? "¿Desea mantener su sesión activa?" : "Su sesión está a punto de expirar. ¿Desea mantener su sesión o cerrar sesión?"}</p>
        </ModalBody>
        <ModalFooter>
          {type === "expiracion" && (
            <Button aria-label="cerrar_sesion" color="danger" variant="flat" onPress={() => { onLogout(); onClose(); }}>Cerrar Sesión</Button>
          )}
          <Button aria-label="mantener_sesion" color="primary" onPress={() => { onKeepSession(); onClose(); }}>Mantener Sesión</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

ModalSessionExpiration.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onKeepSession: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  type: PropTypes.oneOf(["inactividad", "expiracion"]).isRequired,
};
