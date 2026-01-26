import React, { useState, useEffect } from "react";
import Select from "../../components/Select/Select";
import useProvincias from "../../data/dataProvincias";
import useDistritos from "../../data/dataDistritos";
import useDepartamentos from "../../data/dataDepartamentos";
import { Box } from "@mui/material";

function SelectDPD({
    onDistritoSeleccionado,
    initialDepartamentoId,
    initialProvinciaId,
    initialDistritoId
}) {
    const { departamentos } = useDepartamentos();
    const { provincias, setProvincias, fetchProvincias } = useProvincias();
    const { distritos, setDistritos, fetchDistritos } = useDistritos();

    const [departamento_id, setDepartamento_id] = useState(initialDepartamentoId || "");
    const [provincia_id, setProvincia_id] = useState(initialProvinciaId || "");
    const [distrito_id, setDistrito_id] = useState(initialDistritoId || "");

    // Cargar provincias y distritos si hay valores iniciales
    useEffect(() => {
        if (initialDepartamentoId) {
            fetchProvincias(initialDepartamentoId).then(() => {
                if (initialProvinciaId) {
                    fetchDistritos(initialProvinciaId);
                }
            });
        }
    }, [initialDepartamentoId, initialProvinciaId]);

    useEffect(() => {
        if (departamento_id) {
            fetchProvincias(departamento_id);
        } else {
            setProvincias([]);
            setDistritos([]);
            setProvincia_id(null);
            setDistrito_id(null);
        }
    }, [departamento_id]);

    useEffect(() => {
        if (provincia_id) {
            fetchDistritos(provincia_id);
        } else {
            setDistritos([]);
            setDistrito_id(null);
        }
    }, [provincia_id]);

    return (
        <Box
            sx={{
                display: "grid",
                gap: 1,
                gridTemplateColumns: {
                    xs: "1fr",
                    md: "1fr 1fr 1fr",
                },
                mb: 1,
            }}
        >
            <Select
                label="Departamento"
                selectedKey={departamento_id ? departamento_id.toString() : ""}
                value={departamento_id || ""}
                defaultItems={departamentos.map((item) => ({
                    key: item.id.toString(),
                    textValue: item.nombre,
                    ...item,
                }))}
                onSelectionChange={(departamentoId) => {
                    setDepartamento_id(departamentoId ? parseInt(departamentoId) : null);
                    setProvincia_id(null);
                    setDistrito_id(null);
                }}
            />

            <Select
                label="Provincia"
                selectedKey={provincia_id ? provincia_id.toString() : ""}
                disabled={!departamento_id}
                value={provincia_id || ""}
                defaultItems={provincias.map((item) => ({
                    key: item.id.toString(),
                    textValue: item.nombre,
                    ...item,
                }))}
                onSelectionChange={(provinciaId) => {
                    setProvincia_id(provinciaId ? parseInt(provinciaId) : null);
                    setDistrito_id(null);
                }}
            />

            <Select
                label="Distrito"
                disabled={!provincia_id}
                selectedKey={distrito_id ? distrito_id.toString() : ""}
                value={distrito_id || ""}
                defaultItems={distritos.map((item) => ({
                    key: item.id.toString(),
                    textValue: item.nombre,
                    ...item,
                }))}
                onSelectionChange={(distritoId) => {
                    const selectedId = distritoId ? parseInt(distritoId) : null;
                    setDistrito_id(selectedId);
                    if (onDistritoSeleccionado) onDistritoSeleccionado(selectedId);
                }}
            />
        </Box>
    );
}

export default SelectDPD;
