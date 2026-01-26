import React from "react";
import ModalConfirm from "../../Modal/Confirmation/ModalConfirm";
import ObserveInscripcionModal from "../../Modals/ObserveInscripcionModal";
import EditInscripcionModal from "../../Modals/EditInscripcionModal";

export default function ActionModals({
    isValidarOpen,
    setIsValidarOpen,
    handleValidar,
    validarId,
    isObservarOpen,
    setIsObservarOpen,
    handleObservar,
    observacion,
    isEditarOpen,
    setIsEditarOpen,
    fetchInscripciones,
    grados,
    filteredProgramas,
    departamentos,
    provincias,
    distritos,
    fetchProvincias,
    fetchDistritos,
}) {
    return (
        <>
            <ModalConfirm
                isOpen={isValidarOpen}
                onClose={() => setIsValidarOpen(false)}
                onConfirm={() => handleValidar(validarId)}
                message="¿Confirma la validación? Esta acción es irreversible y se enviará al postulante su constancia de inscripción con los datos validados."
            />

            <ObserveInscripcionModal
                isOpen={isObservarOpen}
                onClose={() => setIsObservarOpen(false)}
                onConfirm={(text) => handleObservar(validarId, text)}
                initialObservation={observacion}
            />

            <EditInscripcionModal
                isOpen={isEditarOpen}
                onClose={() => setIsEditarOpen(false)}
                inscripcionId={validarId}
                onSuccess={fetchInscripciones}
                grados={grados}
                programas={filteredProgramas}
                departamentos={departamentos}
                provincias={provincias}
                distritos={distritos}
                fetchProvincias={fetchProvincias}
                fetchDistritos={fetchDistritos}
            />
        </>
    );
}
