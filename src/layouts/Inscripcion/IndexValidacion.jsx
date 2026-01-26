import React, { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import TopLoadingBar from "react-top-loading-bar";
import { toast } from "react-hot-toast";
import LoadingOverlay from "../../components/Loading/LoadingOverlay";
import { Box } from "@mui/material";
import {
    CheckCircleIcon,
    ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";
import { Button } from "@nextui-org/react";

// Componentes personalizados
import Carrusel from "../../components/Carrusel/Carrusel";
import Input from "../../components/Inputs/InputField";
import axios from "../../axios";
import SelectDPD from "../../components/Select/SelectDPD";
import SelectGradoPrograma from "../../components/Select/SelectGradoPrograma";
import FormularioUsuario from "../../components/Inputs/DatosPersonales";
import FileUploadSection from "../../components/FileUploadSection/FileUploadSection";
import cronograma from "../../assets/Img/1.webp";
import fechaPagos from "../../assets/Img/4.webp";
import cronogramaAdmision from "../../assets/Img/3.webp";
import { admissionConfig } from "../../config/admission";

function InscripcionForm({ datosPago }) {
    const navigate = useNavigate();
    const loadingBarRef = useRef(null);

    const [formData, setFormData] = useState(() => {
        const postulante = datosPago?.postulante || {};
        return {
            tipo_doc: "DNI",
            num_iden: datosPago?.num_iden || postulante.num_iden || "",
            nombres: postulante.nombres || datosPago?.nombres || "",
            ap_paterno: postulante.ap_paterno || datosPago?.ap_paterno || "",
            ap_materno: postulante.ap_materno || datosPago?.ap_materno || "",
            email: postulante.email || datosPago?.correo || "",
            celular: postulante.celular || datosPago?.celular || "",
            fecha_nacimiento: postulante.fecha_nacimiento || datosPago?.fecha_nacimiento || "",
            sexo: postulante.sexo || datosPago?.sexo || "",
        };
    });

    const [grado_id, setGrado_id] = useState(datosPago?.grado_id || null);
    const [programa_id, setPrograma_id] = useState(
        datosPago?.programa_id || null
    );
    const [distrito_id, setDistrito_id] = useState(
        datosPago?.distrito_id || null
    );
    const [direccion, setDireccion] = useState("");
    const [files, setFiles] = useState({
        rutaVoucher: null,
        rutaDocIden: null,
        rutaCV: null,
        rutaFoto: null,
    });

    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [progressText, setProgressText] = useState("Iniciando...");
    const [success, setSuccess] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileUpload = (id, file) => {
        setFiles((prev) => ({ ...prev, [id]: file }));
    };

    const validateForm = () => {
        if (!programa_id || !grado_id) return "Selecciona un grado y programa.";
        if (!formData.tipo_doc || !formData.sexo)
            return "Completa todos los datos personales.";
        if (!direccion) return "Debes ingresar una dirección.";
        if (!Object.values(files).every(Boolean))
            return "Sube todos los archivos requeridos.";
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const error = validateForm();
        if (error) return toast.error(error);
        await saveInscripcion();
    };

    const saveInscripcion = useCallback(async () => {
        loadingBarRef.current?.continuousStart();

        const payload = new FormData();
        payload.append("grado_id", grado_id);
        payload.append("programa_id", programa_id);
        payload.append("distrito_id", distrito_id);
        payload.append("direccion", direccion);
        Object.entries(formData).forEach(([key, value]) =>
            payload.append(key, value)
        );
        Object.entries(files).forEach(([key, file]) =>
            payload.append(key, file)
        );
        payload.append("tipo_pago", datosPago.tipo_pago);
        payload.append("cod_voucher", datosPago.voucher?.numero || datosPago.numero); // Usar 'numero' que viene del backend

        setLoading(true);
        setProgressText("Subiendo información...");
        setProgress(0);
        setSuccess(null);

        try {
            const res = await axios.post("/inscripcion", payload, {
                headers: { "Content-Type": "multipart/form-data" },
                onUploadProgress: ({ loaded, total }) => {
                    if (!total) return;
                    const percent = Math.round((loaded * 100) / total);
                    setProgress(percent);
                    setProgressText(
                        percent < 30
                            ? "Enviando datos"
                            : percent < 90
                                ? "Subiendo Archivos..."
                                : "El proceso está en curso, por favor no cierre la página."
                    );
                },
            });

            if (res.data.success) {
                setProgress(100);
                setProgressText(
                    "Inscripción completada 🎉, revise su correo electrónico."
                );
                setSuccess(true);
                toast.success("Inscripción completada correctamente.");
                setTimeout(() => navigate("/", { replace: true }), 5000);
            } else {
                throw new Error(res.data.message || "Error en inscripción");
            }
        } catch (error) {
            console.error(error);
            setSuccess(false);
            setProgressText(
                error.message || "Error al registrar la inscripción."
            );
        } finally {
            loadingBarRef.current?.complete();
            setTimeout(() => setLoading(false), 4000);
        }
    }, [
        formData,
        files,
        grado_id,
        programa_id,
        distrito_id,
        direccion,
        datosPago,
        navigate,
    ]);

    const slides = [
        {
            title: "Cronograma Proceso Admisión",
            text: "Consulta aquí el cronograma de actividades.",
            image: cronograma,
        },
        {
            title: "Cronograma Matrícula",
            text: "Revisa las fechas del proceso de matrícula.",
            image: cronogramaAdmision,
        },
        {
            title: "Conceptos de Pago",
            text: `Conoce los conceptos disponibles desde el ${admissionConfig.cronograma.inicio_conceptos}.`,
            image: fechaPagos,
        },
    ];

    return (
        <div className="flex flex-col lg:flex-row bg-white rounded-lg w-full max-w-8xl mx-auto p-4 sm:p-6 gap-2">
            {/* Formulario principal */}
            <Box sx={{ width: "100%", maxWidth: "100%", flex: 1, justifyContent:"center"}}>
                <h2 className="text-2xl font-bold text-center">
                    ¡Pago Verificado!
                </h2>
                <p className="text-center text-gray-600 mb-4">

                </p>
                <form onSubmit={handleSubmit} className="space-y-2">
                    <SelectGradoPrograma
                        grados={
                            datosPago?.grados ||
                            [...new Map((datosPago?.programas || []).map(p => [p.grado_id, { id: p.grado_id, nombre: p.grado_nombre }])).values()]
                        }
                        programas={datosPago?.programas || []}
                        gradoInicial={grado_id}
                        programaInicial={programa_id}
                        onChangeGrado={setGrado_id}
                        onChangePrograma={setPrograma_id}
                    />

                    <FormularioUsuario
                        defaultValues={formData}
                        onChange={handleChange}
                    />

                    <SelectDPD
                        initialDepartamentoId={
                            datosPago?.departamento_id || null
                        }
                        initialProvinciaId={datosPago?.provincia_id || null}
                        initialDistritoId={distrito_id}
                        onDistritoSeleccionado={setDistrito_id}
                    />

                    <Input
                        name="direccion"
                        label="Dirección"
                        uppercase={true}
                        className="mb-4"
                        value={direccion}
                        isRequired
                        onChange={(e) => setDireccion(e.target.value)}
                    />

                    <FileUploadSection
                        handleFileUpload={handleFileUpload}
                    />

                    <Button type="submit" color="primary" fullWidth name="submit">
                        Enviar Formulario
                    </Button>
                </form>
            </Box>

            {/* Carrusel en lateral (PC) o debajo (móvil) */}
            <div className="w-full lg:w-[40%] flex items-center justify-center lg:px-2">
                <Carrusel slides={slides} autoPlay interval={3000} />
            </div>

            {/* Barra de carga */}
            <TopLoadingBar ref={loadingBarRef} color="#4caf50" height={4} />

            {/* Capa de carga con progreso */}
            <LoadingOverlay
                open={loading || success !== null}
                progress={progress}
                text={progressText}
                success={success}
            />
        </div>
    );
}

export default InscripcionForm;
