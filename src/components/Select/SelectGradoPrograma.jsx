import { useState, useEffect } from "react";
import Select from "../../components/Select/Select";
import { Box, FormControl } from "@mui/material";

const SelectGradoPrograma = ({
    grados = [],
    programas = [],
    gradoInicial = null,
    programaInicial = null,
    onChangeGrado,
    onChangePrograma,
}) => {
    const [gradoId, setGradoId] = useState(gradoInicial);
    const [programaId, setProgramaId] = useState(programaInicial);
    const [filteredProgramas, setFilteredProgramas] = useState([]);

    useEffect(() => {
        if (gradoId && Array.isArray(programas)) {
            setFilteredProgramas(
                programas.filter((p) => p.grado_id == gradoId)
            );
        } else {
            setFilteredProgramas([]);
        }
    }, [gradoId, programas]);

    useEffect(() => {
        setGradoId(gradoInicial);
    }, [gradoInicial]);

    useEffect(() => {
        setProgramaId(programaInicial);
    }, [programaInicial]);

    const handleGradoChange = (selectedGradoId) => {
        setGradoId(selectedGradoId);
        setProgramaId(null); // Resetear programa cuando cambia el grado
        if (onChangeGrado) onChangeGrado(selectedGradoId);
    };

    const handleProgramaChange = (selectedProgramaId) => {
        setProgramaId(selectedProgramaId);
        if (onChangePrograma) onChangePrograma(selectedProgramaId);
    };

    return (
        <Box
            sx={{
                display: "grid",
                gap: 1.5,
                gridTemplateColumns: {
                    xs: "1fr",
                    md: "2fr 7fr",
                },
                mb: 1,
            }}
        >
            {/* Validamos que `grados` sea un array antes de mapear */}
            {Array.isArray(grados) && (
                <FormControl fullWidth>
                    <Select
                        label="Seleccionar Grado"
                        defaultItems={grados.map((g) => ({
                            key: g.id.toString(),
                            textValue: g.nombre,
                        }))}
                        selectedKey={gradoId ? gradoId.toString() : ""}
                        onSelectionChange={handleGradoChange}
                        isRequired
                    />
                </FormControl>
            )}

            {/* Validamos que `filteredProgramas` sea un array antes de mapear */}
            {Array.isArray(filteredProgramas) && (
                <FormControl fullWidth>
                    <Select
                        label="Seleccionar Programa"
                        defaultItems={filteredProgramas.map((p) => ({
                            key: p.id.toString(),
                            textValue: p.nombre,
                        }))}
                        selectedKey={programaId ? programaId.toString() : ""}
                        onSelectionChange={handleProgramaChange}
                        isRequired
                        disabled={!gradoId} // Deshabilitar si no hay grado seleccionado
                    />
                </FormControl>
            )}
        </Box>
    );
};

export default SelectGradoPrograma;
