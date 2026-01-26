import React from "react";
import ProgressBar from "../ProgressBar/ProgressBar";

const ProgramCard = ({ program }) => {
    const { grado, facultad_nombre, programa, vacantes, preinscritos } =
        program;

    // Convierte vacantes y preinscritos a enteros
    const vacantesInt = parseInt(vacantes, 10);
    const preinscritosInt = parseInt(preinscritos, 10);

    // Asegurarse de que no sean NaN
    if (isNaN(vacantesInt) || isNaN(preinscritosInt)) {
        return null; // O mostrar un mensaje de error si no se pudieron parsear correctamente
    }

    // Cálculo de porcentaje
    const progress = (preinscritosInt / vacantesInt) * 100;

    return (
        <div
            style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "16px",
                marginBottom: "16px",
            }}
        >
            <p>{facultad_nombre}</p>
            <p>{grado}</p>
            <h3>{programa}</h3>
            <p>
                Vacantes: {vacantesInt} - Preinscritos: {preinscritosInt}
            </p>
            <ProgressBar value={preinscritosInt} maxValue={vacantesInt} />
            <p>Se ha cubrido el {progress.toFixed(2)}% de las vacantes</p>
        </div>
    );
};

export default ProgramCard;
