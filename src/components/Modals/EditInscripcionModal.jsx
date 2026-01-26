import React, { useRef, useState, useEffect } from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    RadioGroup,
    Radio,
} from "@nextui-org/react";
import { Box, FormControl, Typography } from "@mui/material";
import Select from "../../components/Select/Select";
import RenderFileUpload from "../../components/Inputs/RenderFileUpload";
import Spinner from "../../components/Spinner/Spinner";
import { toast } from "react-hot-toast";
import axios from "../../axios";

export default function EditInscripcionModal({
    isOpen,
    onClose,
    inscripcionId,
    onSuccess,
    grados,
    programas,
    departamentos,
    provincias,
    distritos,
    fetchProvincias,
    fetchDistritos,
}) {
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const formDataRef = useRef(new FormData());
    const [originalData, setOriginalData] = useState({});

    // Form States
    const [grado_id, setGrado_id] = useState("");
    const [programa_id, setPrograma_id] = useState("");
    const [num_iden, setNum_iden] = useState("");
    const [nombres, setNombres] = useState("");
    const [ap_paterno, setAp_paterno] = useState("");
    const [ap_materno, setAp_materno] = useState("");
    const [celular, setCelular] = useState("");
    const [direccion, setDireccion] = useState("");
    const [email, setEmail] = useState("");
    const [fecha_nacimiento, setFecha_nacimiento] = useState("");
    const [departamento_id, setDepartamento_id] = useState("");
    const [provincia_id, setProvincia_id] = useState("");
    const [distrito_id, setDistrito_id] = useState("");
    const [tipo_documento, setTipo_documento] = useState("");
    const [sexo, setSexo] = useState("");
    const [num_voucher, setNum_voucher] = useState("");

    // File URLs
    const [rutaVoucher, setRutaVoucher] = useState("");
    const [rutaDocIden, setRutaDocIden] = useState("");
    const [rutaFoto, setRutaFoto] = useState("");
    const [rutaCV, setRutaCV] = useState("");

    // Lists
    const [gradosPosibles, setGradosPosibles] = useState([]);
    const [programasPosibles, setProgramasPosibles] = useState([]);
    const [programasFiltrados, setProgramasFiltrados] = useState([]);

    const tipo_doc = [
        { id: 1, nombre: "DNI", label: "Número de DNI" },
        { id: 2, nombre: "CE", label: "Número de Carnet de Extranjería" },
        { id: 3, nombre: "PASAPORTE", label: "Número de Pasaporte" },
    ];

    useEffect(() => {
        if (isOpen && inscripcionId) {
            loadData();
        }
    }, [isOpen, inscripcionId]);

    useEffect(() => {
        if (departamento_id) {
            fetchProvincias(departamento_id);
        } else {
            setProvincia_id(null);
            setDistrito_id(null);
        }
    }, [departamento_id]);

    useEffect(() => {
        if (provincia_id) {
            fetchDistritos(provincia_id);
        } else {
            setDistrito_id(null);
        }
    }, [provincia_id]);

    useEffect(() => {
        if (grado_id) {
            const filtrados = programasPosibles.filter(
                (p) => p.grado_id == parseInt(grado_id)
            );
            setProgramasFiltrados(filtrados);
        } else {
            setProgramasFiltrados([]);
        }
    }, [grado_id, programasPosibles]);

    const loadData = async () => {
        setLoadingData(true);
        try {
            const response = await axios.get(`/inscripcion/${inscripcionId}`);
            const data = response.data.data;

            // Set initial values
            setGrado_id(data.programa.grado_id || "");
            setPrograma_id(data.programa.id || "");
            setNum_iden(data.postulante.num_iden || "");
            setNombres(data.postulante.nombres || "");
            setAp_paterno(data.postulante.ap_paterno || "");
            setAp_materno(data.postulante.ap_materno || "");
            setCelular(data.postulante.celular || "");
            setDireccion(data.postulante.direccion || "");
            setEmail(data.postulante.email || "");
            setFecha_nacimiento(data.postulante.fecha_nacimiento || "");
            setNum_voucher(data.codigo || "");
            setDepartamento_id(data.postulante.distrito?.provincia?.departamento_id || "");
            setProvincia_id(data.postulante.distrito?.provincia_id || "");
            setDistrito_id(data.postulante.distrito_id || "");
            setSexo(data.postulante.sexo || "");
            setTipo_documento(data.postulante.tipo_doc || "");

            // Set files
            const docs = data.postulante.documentos || [];
            setRutaVoucher(docs.find(d => d.tipo === "Voucher")?.url || "");
            setRutaDocIden(docs.find(d => d.tipo === "DocumentoIdentidad")?.url || "");
            setRutaCV(docs.find(d => d.tipo === "Curriculum")?.url || "");
            setRutaFoto(docs.find(d => d.tipo === "Foto")?.url || "");

            setGradosPosibles(data.grados_posibles || []);
            setProgramasPosibles(data.programas_posibles || []);

            // Store original data for comparison
            setOriginalData({
                grado_id: data.programa.grado_id,
                programa_id: data.programa.id,
                // ... store other fields as needed for comparison
            });

        } catch (error) {
            toast.error("Error al cargar datos de inscripción");
            onClose();
        } finally {
            setLoadingData(false);
        }
    };

    const handleChange = (field, value) => {
        formDataRef.current.set(field, value);
    };

    const handleFileUpload = (inputId, file) => {
        formDataRef.current.set(inputId, file);
    };

    const handleSubmit = async () => {
        if ([...formDataRef.current.entries()].length === 0) {
            toast.error("No hay cambios para actualizar");
            return;
        }

        setLoading(true);
        try {
            await axios.post(
                `/inscripcion-update/${inscripcionId}`,
                formDataRef.current,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );
            toast.success("Inscripción actualizada correctamente");
            onSuccess();
            onClose();
            formDataRef.current = new FormData();
        } catch (error) {
            toast.error("Error al actualizar inscripción");
        } finally {
            setLoading(false);
        }
    };

    const toggleEditMode = () => setEditMode(!editMode);

    return (
        <Modal
            backdrop="opaque"
            isOpen={isOpen}
            placement="center"
            size="5xl"
            scrollBehavior="inside"
            onClose={onClose}
        >
            <ModalContent>
                {(loading || loadingData) && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 z-50">
                        <Spinner label={loadingData ? "Cargando datos..." : "Guardando..."} />
                    </div>
                )}
                <ModalHeader className="flex flex-col gap-1">
                    Editar Inscripción
                </ModalHeader>

                <ModalBody>
                    <form>
                        <h3 className="font-bold">Seleccionar Grado y Programa a postular</h3>
                        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "1fr 3fr" }, mb: 2 }}>
                            <FormControl>
                                <Select
                                    label="Grado Académico"
                                    variant="flat"
                                    isRequired={true}
                                    value={grado_id ? grado_id.toString() : ""}
                                    defaultItems={gradosPosibles.map(item => ({
                                        key: item.id.toString(),
                                        textValue: item.nombre,
                                        ...item
                                    }))}
                                    selectedKey={grado_id ? grado_id.toString() : null}
                                    onSelectionChange={(key) => {
                                        setGrado_id(key);
                                        setPrograma_id("");
                                        handleChange("grado_id", key);
                                    }}
                                />
                            </FormControl>

                            <FormControl fullWidth>
                                <Select
                                    label="Programa"
                                    defaultItems={programasFiltrados.map(item => ({
                                        key: item.id.toString(),
                                        textValue: item.nombre,
                                        ...item
                                    }))}
                                    value={programa_id ? programa_id.toString() : ""}
                                    selectedKey={programa_id ? programa_id.toString() : null}
                                    onSelectionChange={(key) => {
                                        setPrograma_id(key);
                                        handleChange("programa_id", key);
                                    }}
                                    isRequired={true}
                                    disabled={!grado_id}
                                />
                            </FormControl>
                        </Box>

                        <h3 className="font-bold mb-2">Datos personales</h3>
                        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "2fr 2fr 2fr 2fr 2fr" }, mb: 2 }}>
                            <Select
                                label="Tipo de Documento"
                                variant="flat"
                                disabled={true}
                                value={tipo_documento}
                                isRequired={true}
                                defaultItems={tipo_doc.map(item => ({
                                    key: item.nombre,
                                    textValue: item.nombre,
                                    ...item
                                }))}
                                selectedKey={tipo_documento}
                            />

                            <Input
                                label="Número de Documento"
                                value={num_iden}
                                disabled={true}
                                isRequired={true}
                            />

                            <Input
                                label="Nombres"
                                value={nombres}
                                isRequired={true}
                                onChange={(e) => {
                                    setNombres(e.target.value);
                                    handleChange("nombres", e.target.value);
                                }}
                            />

                            <Input
                                label="Apellido Paterno"
                                value={ap_paterno}
                                isRequired={true}
                                onChange={(e) => {
                                    setAp_paterno(e.target.value);
                                    handleChange("ap_paterno", e.target.value);
                                }}
                            />

                            <Input
                                label="Apellido Materno"
                                value={ap_materno}
                                isRequired={true}
                                onChange={(e) => {
                                    setAp_materno(e.target.value);
                                    handleChange("ap_materno", e.target.value);
                                }}
                            />
                        </Box>

                        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "4fr 2fr 2fr 1fr" }, mb: 2 }}>
                            <Input
                                label="Correo Electrónico"
                                value={email}
                                isRequired={true}
                                type="email"
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    handleChange("email", e.target.value);
                                }}
                            />
                            <Input
                                label="Celular"
                                value={celular}
                                isRequired={true}
                                onChange={(e) => {
                                    setCelular(e.target.value);
                                    handleChange("celular", e.target.value);
                                }}
                            />
                            <Input
                                label="Fecha de Nacimiento"
                                value={fecha_nacimiento}
                                type="date"
                                isRequired={true}
                                onChange={(e) => {
                                    setFecha_nacimiento(e.target.value);
                                    handleChange("fecha_nacimiento", e.target.value);
                                }}
                            />
                            <RadioGroup
                                isRequired
                                value={sexo}
                                orientation="horizontal"
                                onChange={(e) => {
                                    setSexo(e.target.value);
                                    handleChange("sexo", e.target.value);
                                }}
                            >
                                <Radio value="M">M</Radio>
                                <Radio value="F">F</Radio>
                            </RadioGroup>
                        </Box>

                        <h3 className="font-bold mb-2">Lugar de Residencia</h3>
                        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" }, mb: 2 }}>
                            <Select
                                label="Departamento"
                                isRequired={true}
                                selectedKey={departamento_id ? departamento_id.toString() : ""}
                                defaultItems={departamentos.map(item => ({
                                    key: item.id.toString(),
                                    textValue: item.nombre,
                                    ...item
                                }))}
                                onSelectionChange={(key) => {
                                    setDepartamento_id(key);
                                    handleChange("departamento_id", key);
                                }}
                            />
                            <Select
                                label="Provincia"
                                isRequired={true}
                                selectedKey={provincia_id ? provincia_id.toString() : ""}
                                disabled={!departamento_id}
                                defaultItems={provincias.map(item => ({
                                    key: item.id.toString(),
                                    textValue: item.nombre,
                                    ...item
                                }))}
                                onSelectionChange={(key) => {
                                    setProvincia_id(key);
                                    handleChange("provincia_id", key);
                                }}
                            />
                            <Select
                                label="Distrito"
                                isRequired={true}
                                selectedKey={distrito_id ? distrito_id.toString() : ""}
                                disabled={!provincia_id}
                                defaultItems={distritos.map(item => ({
                                    key: item.id.toString(),
                                    textValue: item.nombre,
                                    ...item
                                }))}
                                onSelectionChange={(key) => {
                                    setDistrito_id(key);
                                    handleChange("distrito_id", key);
                                }}
                            />
                        </Box>

                        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(2, 1fr)" }, mb: 2 }}>
                            <Input
                                label="Dirección"
                                value={direccion}
                                isRequired={true}
                                onChange={(e) => {
                                    setDireccion(e.target.value);
                                    handleChange("direccion", e.target.value);
                                }}
                            />
                            <div className="flex flex-wrap md:flex-nowrap gap-4 mt-4 items-center">
                                <Button
                                    aria-label="Editar Archivos"
                                    variant="flat"
                                    color="primary"
                                    onPress={toggleEditMode}
                                    className="flex-1 min-w-200"
                                >
                                    {editMode ? "Cancelar Edición" : "Editar Archivos"}
                                </Button>
                            </div>
                        </Box>

                        {!editMode ? (
                            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2 }}>
                                {rutaVoucher && (
                                    <Typography variant="body2">
                                        <strong>Voucher:</strong> <a href={rutaVoucher} target="_blank" rel="noopener noreferrer" className="text-blue-800 hover:text-blue-400">Ver Comprobante</a>
                                    </Typography>
                                )}
                                {rutaDocIden && (
                                    <Typography variant="body2">
                                        <strong>DNI:</strong> <a href={rutaDocIden} target="_blank" rel="noopener noreferrer" className="text-blue-800 hover:text-blue-400">Ver DNI</a>
                                    </Typography>
                                )}
                                {rutaCV && (
                                    <Typography variant="body2">
                                        <strong>CV:</strong> <a href={rutaCV} target="_blank" rel="noopener noreferrer" className="text-blue-800 hover:text-blue-400">Ver CV</a>
                                    </Typography>
                                )}
                                {rutaFoto && (
                                    <Typography variant="body2">
                                        <strong>Foto:</strong> <a href={rutaFoto} target="_blank" rel="noopener noreferrer" className="text-blue-800 hover:text-blue-400">Ver Foto</a>
                                    </Typography>
                                )}
                            </Box>
                        ) : (
                            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2 }}>
                                <div>
                                    <RenderFileUpload
                                        uploadType="Subir Voucher (PDF)"
                                        allowedFileTypes={["application/pdf"]}
                                        inputId="rutaVoucher"
                                        tamicono={24}
                                        tamletra={14}
                                        required={true}
                                        onFileUpload={handleFileUpload}
                                    />
                                </div>
                                <div>
                                    <RenderFileUpload
                                        uploadType="Subir Copia DNI (PDF)"
                                        allowedFileTypes={["application/pdf"]}
                                        inputId="rutaDocIden"
                                        tamicono={24}
                                        tamletra={14}
                                        onFileUpload={handleFileUpload}
                                    />
                                </div>
                                <div>
                                    <RenderFileUpload
                                        uploadType="Subir CV (PDF)"
                                        allowedFileTypes={["application/pdf"]}
                                        inputId="rutaCV"
                                        tamicono={24}
                                        tamletra={14}
                                        onFileUpload={handleFileUpload}
                                    />
                                </div>
                                <div>
                                    <RenderFileUpload
                                        uploadType="Subir Foto (IMG)"
                                        allowedFileTypes={["image/jpeg", "image/png", "image/jpg"]}
                                        inputId="rutaFoto"
                                        tamicono={24}
                                        tamletra={14}
                                        onFileUpload={handleFileUpload}
                                    />
                                </div>
                            </Box>
                        )}
                    </form>
                </ModalBody>
                <ModalFooter>
                    <Button color="default" variant="flat" onPress={onClose}>
                        Cancelar
                    </Button>
                    <Button color="primary" onPress={handleSubmit}>
                        Guardar Cambios
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
