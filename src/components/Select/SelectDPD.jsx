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
    initialDistritoId,
    initialDepartamentoNombre,
    initialProvinciaNombre,
    initialDistritoNombre
}) {
    const { departamentos } = useDepartamentos();
    const { provincias, setProvincias, fetchProvincias } = useProvincias();
    const { distritos, setDistritos, fetchDistritos } = useDistritos();

    const [departamento_id, setDepartamento_id] = useState(initialDepartamentoId || "");
    const [provincia_id, setProvincia_id] = useState(initialProvinciaId || "");
    const [distrito_id, setDistrito_id] = useState(initialDistritoId || "");

    // 1. Sincronizar estado local con props iniciales (cuando vienen de una carga tardía)
    useEffect(() => {
        if (initialDepartamentoId) setDepartamento_id(initialDepartamentoId);
        if (initialProvinciaId) setProvincia_id(initialProvinciaId);
        if (initialDistritoId) setDistrito_id(initialDistritoId);
    }, [initialDepartamentoId, initialProvinciaId, initialDistritoId]);

    // 2. Carga inicial en paralelo (Mucho más rápido que secuencial)
    useEffect(() => {
        if (initialDepartamentoId) {
            fetchProvincias(initialDepartamentoId);
        }
        if (initialProvinciaId) {
            fetchDistritos(initialProvinciaId);
        }
    }, [initialDepartamentoId, initialProvinciaId, fetchProvincias, fetchDistritos]);

    // 3. Manejar cambios manuales del usuario (Cascada)
    useEffect(() => {
        if (departamento_id) {
            if (departamento_id !== initialDepartamentoId) {
                fetchProvincias(departamento_id);
            }
        } else {
            setProvincias([]);
            setDistritos([]);
            setProvincia_id("");
            setDistrito_id("");
        }
    }, [departamento_id, initialDepartamentoId, fetchProvincias, setProvincias, setDistritos]);

    useEffect(() => {
        if (provincia_id) {
            if (provincia_id !== initialProvinciaId) {
                fetchDistritos(provincia_id);
            }
        } else {
            setDistritos([]);
            setDistrito_id("");
        }
    }, [provincia_id, initialProvinciaId, fetchDistritos, setDistritos]);

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
                defaultItems={departamentos.length > 0
                    ? departamentos.map((item) => ({
                        key: item.id.toString(),
                        textValue: item.nombre,
                        ...item,
                    }))
                    : (initialDepartamentoId && initialDepartamentoNombre
                        ? [{ key: initialDepartamentoId.toString(), textValue: initialDepartamentoNombre }]
                        : [])
                }
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
                defaultItems={provincias.length > 0
                    ? provincias.map((item) => ({
                        key: item.id.toString(),
                        textValue: item.nombre,
                        ...item,
                    }))
                    : (initialProvinciaId && initialProvinciaNombre
                        ? [{ key: initialProvinciaId.toString(), textValue: initialProvinciaNombre }]
                        : [])
                }
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
                defaultItems={distritos.length > 0
                    ? distritos.map((item) => ({
                        key: item.id.toString(),
                        textValue: item.nombre,
                        ...item,
                    }))
                    : (initialDistritoId && initialDistritoNombre
                        ? [{ key: initialDistritoId.toString(), textValue: initialDistritoNombre }]
                        : [])
                }
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
