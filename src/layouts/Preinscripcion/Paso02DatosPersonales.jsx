import { useEffect, useMemo, useCallback } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// Components
import { FormHeader } from "./components";
import Select from "../../components/Select/Select";
import { RadioGroup, Radio } from "@heroui/react";
import Input from "../../components/Inputs/InputField";
import { Button } from "@heroui/react";

// Hooks
import {
    useFormValidation,
    useDniVerification,
    useUbicacionCascade
} from "./hooks";
import usePreInscripcionRegistrado from "../../data/Preinscripcion/dataPreinscripcionRegistrado";

// Assets
import logoWithTextImage from "../../assets/Isotipos/isotipo_color_epg.webp";
import { admissionConfig } from "../../config/admission";

const tipo_doc_opciones = ["DNI", "CE", "PASAPORTE"];

/**
 * Paso 2: Datos Personales
 * Refactorizado para usar custom hooks y separar responsabilidades
 */
export default function Paso02DatosPersonales({
    formData,
    setFormData,
    setStep,
}) {
    const navigate = useNavigate();

    // Hooks especializados
    const { validateStep2 } = useFormValidation();
    const { dniData } = useDniVerification(formData.num_iden, formData.tipo_doc);
    const { preInscripcion, fetchPreInscripcion } = usePreInscripcionRegistrado();
    const {
        departamentos,
        provincias,
        distritos,
        getDepartamentoNombre,
        getProvinciaNombre,
        getDistritoNombre
    } = useUbicacionCascade(
        formData.departamento_id,
        formData.provincia_id
    );

    // Memoización de opciones
    const departamentoItems = useMemo(
        () =>
            departamentos.map((d) => ({
                key: d.id.toString(),
                textValue: d.nombre,
            })),
        [departamentos]
    );

    const provinciaItems = useMemo(
        () =>
            provincias.map((p) => ({
                key: p.id.toString(),
                textValue: p.nombre,
            })),
        [provincias]
    );

    const distritoItems = useMemo(
        () =>
            distritos.map((d) => ({
                key: d.id.toString(),
                textValue: d.nombre,
            })),
        [distritos]
    );

    // Verificar si ya está preinscrito cuando se completa el DNI
    useEffect(() => {
        if (
            formData.tipo_doc === "DNI" &&
            formData.num_iden.length === 8 &&
            !formData.yaVerificado
        ) {
            fetchPreInscripcion(formData.num_iden);
            setFormData((prev) => ({
                ...prev,
                yaVerificado: true,
            }));
        }
    }, [formData.tipo_doc, formData.num_iden, formData.yaVerificado, fetchPreInscripcion, setFormData]);

    // Validar si ya está preinscrito
    useEffect(() => {
        if (preInscripcion) {
            toast.error(
                `El usuario ${preInscripcion.nombres} ya se encuentra preinscrito.`
            );
            navigate("/");
        }
    }, [preInscripcion, navigate]);

    // Llenar nombres si vino de RENIEC
    useEffect(() => {
        if (dniData && !preInscripcion) {
            setFormData((prev) => ({
                ...prev,
                nombres: dniData.nombres || "",
                ap_paterno: dniData.apellidoPaterno || "",
                ap_materno: dniData.apellidoMaterno || "",
            }));
        }
    }, [dniData, preInscripcion, setFormData]);

    // Handlers
    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
            ...(name === "num_iden" && { yaVerificado: false }),
        }));
    }, [setFormData]);

    const handleTipoDocChange = useCallback((val) => {
        setFormData((prev) => ({
            ...prev,
            tipo_doc: val,
            num_iden: "",
            nombres: "",
            ap_paterno: "",
            ap_materno: "",
            yaVerificado: false,
        }));
    }, [setFormData]);

    const handleDepartamentoChange = useCallback((val) => {
        setFormData((prev) => ({
            ...prev,
            departamento_id: parseInt(val),
            provincia_id: "",
            distrito_id: "",
        }));
    }, [setFormData]);

    const handleProvinciaChange = useCallback((val) => {
        setFormData((prev) => ({
            ...prev,
            provincia_id: parseInt(val),
            distrito_id: "",
        }));
    }, [setFormData]);

    const handleDistritoChange = useCallback((val) => {
        setFormData((prev) => ({
            ...prev,
            distrito_id: parseInt(val),
        }));
    }, [setFormData]);

    const handleNext = useCallback(() => {
        if (!validateStep2(formData)) {
            return;
        }

        // Guardar nombres de ubicación
        setFormData((prev) => ({
            ...prev,
            departamento_nombre: getDepartamentoNombre(formData.departamento_id),
            provincia_nombre: getProvinciaNombre(formData.provincia_id),
            distrito_nombre: getDistritoNombre(formData.distrito_id),
        }));

        setStep(3);
    }, [
        formData,
        validateStep2,
        setFormData,
        setStep,
        getDepartamentoNombre,
        getProvinciaNombre,
        getDistritoNombre
    ]);

    return (
        <div className="flex flex-col gap-5 px-2 sm:px-4">
            {/* Encabezado */}
            {/* Encabezado */}
            {/* <FormHeader
                title={`Admisión ${admissionConfig.cronograma.periodo}`}
                subtitle="Escuela de Posgrado UNPRG"
                logoSrc={logoWithTextImage}
            /> */}

            <h3 className="text-lg font-semibold">2. Información Personal</h3>

            {/* Documento de Identidad */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Select
                    label="Tipo de Documento"
                    defaultItems={tipo_doc_opciones.map((doc) => ({
                        key: doc,
                        textValue: doc,
                    }))}
                    selectedKey={formData.tipo_doc}
                    onSelectionChange={handleTipoDocChange}
                />
                <Input
                    label={`Número ${formData.tipo_doc}`}
                    name="num_iden"
                    value={formData.num_iden}
                    minLength={8}
                    maxLength={
                        formData.tipo_doc === "DNI"
                            ? 8
                            : formData.tipo_doc === "PASAPORTE"
                                ? 9
                                : 20
                    }
                    onlyNumbers={true}
                    onChange={handleChange}
                    required
                />
                <Input
                    label="Nombres"
                    name="nombres"
                    value={formData.nombres}
                    onChange={handleChange}
                    isRequired
                    maxLength={150}
                    onlyLetters
                    uppercase
                />
                <Input
                    label="Apellido Paterno"
                    name="ap_paterno"
                    value={formData.ap_paterno}
                    onChange={handleChange}
                    isRequired
                    maxLength={50}
                    onlyLetters
                    uppercase
                />
                <Input
                    label="Apellido Materno"
                    name="ap_materno"
                    value={formData.ap_materno}
                    onChange={handleChange}
                    isRequired
                    maxLength={50}
                    onlyLetters
                    uppercase
                />
                <Input
                    type="date"
                    label="Fecha de Nacimiento"
                    name="fecha_nacimiento"
                    value={formData.fecha_nacimiento}
                    onChange={handleChange}
                    isRequired
                />
            </div>

            {/* Datos de Contacto */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <RadioGroup
                    isRequired
                    value={formData.sexo}
                    name="sexo"
                    id="sexo"
                    onChange={(e) =>
                        setFormData((prev) => ({
                            ...prev,
                            sexo: e.target.value,
                        }))
                    }
                    orientation="horizontal"
                    size="sm"
                    className="flex flex-col sm:flex-row gap-2 sm:gap-4"
                >
                    <Radio value="F">Femenino</Radio>
                    <Radio value="M">Masculino</Radio>
                </RadioGroup>
                <Input
                    label="Correo Electrónico"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    isRequired
                />
                <Input
                    label="Celular"
                    name="celular"
                    value={formData.celular}
                    onChange={handleChange}
                    isRequired
                    onlyNumbers
                    minLength={9}
                    maxLength={9}
                />
            </div>

            {/* Lugar de Residencia */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold">Lugar de Residencia</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Select
                        label="Departamento"
                        name="Departamento"
                        defaultItems={departamentoItems}
                        selectedKey={formData.departamento_id?.toString() || ""}
                        onSelectionChange={handleDepartamentoChange}
                    />
                    <Select
                        label="Provincia"
                        name="Provincia"
                        defaultItems={provinciaItems}
                        selectedKey={formData.provincia_id?.toString() || ""}
                        onSelectionChange={handleProvinciaChange}
                        disabled={!formData.departamento_id}
                    />
                    <Select
                        label="Distrito"
                        name="Distrito"
                        defaultItems={distritoItems}
                        selectedKey={formData.distrito_id?.toString() || ""}
                        onSelectionChange={handleDistritoChange}
                        disabled={!formData.provincia_id}
                    />
                </div>
            </div>

            {/* Botones de Navegación */}
            <div className="flex justify-center gap-8">
                <Button variant="flat" onPress={() => setStep(1)}>
                    Atrás
                </Button>
                <Button color="primary" onPress={handleNext}>
                    Siguiente
                </Button>
            </div>
        </div>
    );
}
