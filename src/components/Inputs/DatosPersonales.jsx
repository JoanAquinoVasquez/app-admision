import React, { useState } from "react";
import { Box } from "@mui/material";
import Select from "../../components/Select/Select";
import Input from "../../components/Inputs/InputField";
import { Radio, RadioGroup } from "@heroui/react";

const FormularioUsuario = ({ defaultValues = {}, onChange }) => {
    const [tipo_doc, setTipo_doc] = useState(
        defaultValues.tipo_doc || "DNI"
    );
    const [num_iden, setNum_iden] = useState(
        defaultValues.num_iden ? defaultValues.num_iden : ""
    );
    const [nombres, setNombres] = useState(
        defaultValues.nombres ? defaultValues.nombres : ""
    );
    const [ap_paterno, setAp_paterno] = useState(
        defaultValues.ap_paterno ? defaultValues.ap_paterno : ""
    );
    const [ap_materno, setAp_materno] = useState(
        defaultValues.ap_materno ? defaultValues.ap_materno : ""
    );
    const [email, setEmail] = useState(
        defaultValues.email ? defaultValues.email : ""
    );
    const [celular, setCelular] = useState(
        defaultValues.celular ? defaultValues.celular : ""
    );
    const [fecha_nacimiento, setFecha_nacimiento] = useState(
        defaultValues.fecha_nacimiento ? defaultValues.fecha_nacimiento : ""
    );
    const [sexo, setSexo] = useState(
        defaultValues.sexo ? defaultValues.sexo : ""
    );

    const handleChange = (campo, valor) => {
        if (onChange) {
            onChange({ target: { name: campo, value: valor } });
        }
    };

    // Sincronizar estado local con defaultValues cuando cambien
    React.useEffect(() => {
        if (defaultValues.tipo_doc) setTipo_doc(defaultValues.tipo_doc);
        if (defaultValues.num_iden) setNum_iden(defaultValues.num_iden);
        if (defaultValues.nombres) setNombres(defaultValues.nombres);
        if (defaultValues.ap_paterno) setAp_paterno(defaultValues.ap_paterno);
        if (defaultValues.ap_materno) setAp_materno(defaultValues.ap_materno);
        if (defaultValues.email) setEmail(defaultValues.email);
        if (defaultValues.celular) setCelular(defaultValues.celular);
        if (defaultValues.fecha_nacimiento) setFecha_nacimiento(defaultValues.fecha_nacimiento);
        if (defaultValues.sexo) setSexo(defaultValues.sexo);
    }, [defaultValues]);

    const tipo_doc_list = [
        { id: 1, nombre: "DNI", label: "Número de DNI" },
        { id: 2, nombre: "CE", label: "Número de Carnet de Extranjería" },
        { id: 3, nombre: "PASAPORTE", label: "Número de Pasaporte" },
    ];

    return (
        <Box
            sx={{
                display: "grid",
                gap: 1.5,
                gridTemplateColumns: {
                    xs: "1fr",
                    md: "repeat(12, 1fr)", // Sistema de 12 columnas para mayor control
                },
                mb: 1,
            }}
        >
            {/* Fila 1 */}
            <Box sx={{ gridColumn: { xs: "1 / -1", md: "span 3" } }}>
                <Select
                    label="Tipo de Documento"
                    name="tipo_doc"
                    variant="flat"
                    className="w-full"
                    disabled={true}
                    value={tipo_doc ? tipo_doc.toString : ""}
                    isRequired={true}
                    defaultItems={tipo_doc_list.map((item) => ({
                        key: item.nombre.toString(),
                        textValue: item.nombre,
                        ...item,
                    }))}
                    selectedKey={tipo_doc ? tipo_doc.toString() : ""}
                    onSelectionChange={(valor) => {
                        setTipo_doc(valor);
                        handleChange("tipo_doc", valor);
                    }}
                />
            </Box>

            <Box sx={{ gridColumn: { xs: "1 / -1", md: "span 3" } }}>
                <Input
                    label={`Número de ${tipo_doc_list.find((item) => item.nombre === tipo_doc)
                        ?.nombre || "Documento de Identidad"
                        }`}
                    name="num_iden"
                    optiondisable={true}
                    value={num_iden ? num_iden : ""}
                    disabled={true}
                    uppercase={true}
                    isRequired={true}
                    maxLength={tipo_doc == "DNI" ? 8 : 20}
                    onlyNumbers={true}
                    onChange={(e) => {
                        setNum_iden(e.target.value);
                        handleChange("num_iden", e.target.value);
                    }}
                />
            </Box>

            <Box sx={{ gridColumn: { xs: "1 / -1", md: "span 6" } }}>
                <Input
                    label="Nombres"
                    name="nombres"
                    value={nombres ? nombres : ""}
                    isRequired={true}
                    uppercase={true}
                    maxLength={50}
                    onlyLetters={true}
                    onChange={(e) => {
                        setNombres(e.target.value);
                        handleChange("nombres", e.target.value);
                    }}
                />
            </Box>

            {/* Fila 2 */}
            <Box sx={{ gridColumn: { xs: "1 / -1", md: "span 4" } }}>
                <Input
                    label="Apellido Paterno"
                    name="ap_paterno"
                    value={ap_paterno ? ap_paterno : ""}
                    isRequired={true}
                    maxLength={50}
                    onlyLetters={true}
                    uppercase={true}
                    onChange={(e) => {
                        setAp_paterno(e.target.value);
                        handleChange("ap_paterno", e.target.value);
                    }}
                />
            </Box>

            <Box sx={{ gridColumn: { xs: "1 / -1", md: "span 4" } }}>
                <Input
                    label="Apellido Materno"
                    name="ap_materno"
                    value={ap_materno ? ap_materno : ""}
                    isRequired={true}
                    uppercase={true}
                    maxLength={50}
                    onlyLetters={true}
                    onChange={(e) => {
                        setAp_materno(e.target.value);
                        handleChange("ap_materno", e.target.value);
                    }}
                />
            </Box>

            <Box sx={{ gridColumn: { xs: "1 / -1", md: "span 4" } }}>
                <Input
                    label="Celular"
                    name="celular"
                    value={celular ? celular : ""}
                    isRequired={true}
                    maxLength={9}
                    onlyNumbers={true}
                    onChange={(e) => {
                        setCelular(e.target.value);
                        handleChange("celular", e.target.value);
                    }}
                />
            </Box>

            {/* Fila 3 */}
            <Box sx={{ gridColumn: { xs: "1 / -1", md: "span 6" } }}>
                <Input
                    label="Correo Electrónico"
                    name="email"
                    value={email ? email : ""}
                    isRequired={true}
                    maxLength={50}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        handleChange("email", e.target.value);
                    }}
                    type={"email"}
                    autocomplete="email"
                />
            </Box>

            <Box sx={{ gridColumn: { xs: "1 / -1", md: "span 3" } }}>
                <Input
                    label="Fecha de Nacimiento"
                    name="fecha_nacimiento"
                    value={fecha_nacimiento ? fecha_nacimiento : ""}
                    type="date"
                    isRequired={true}
                    onChange={(e) => {
                        setFecha_nacimiento(e.target.value);
                        handleChange("fecha_nacimiento", e.target.value);
                    }}
                />
            </Box>

            <Box sx={{ gridColumn: { xs: "1 / -1", md: "span 3" } }}>
                <RadioGroup
                    isRequired
                    name="sexo"
                    value={sexo ? sexo : ""}
                    onChange={(e) => {
                        setSexo(e.target.value);
                        handleChange("sexo", e.target.value);
                    }}
                    orientation="horizontal"
                    classNames={{
                        wrapper: "gap-1",
                    }}
                >
                    <Radio value="M">Masculino</Radio>
                    <Radio value="F">Femenino</Radio>
                </RadioGroup>
            </Box>
        </Box>
    );
};

export default FormularioUsuario;
