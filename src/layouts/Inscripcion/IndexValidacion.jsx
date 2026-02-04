import React, { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import TopLoadingBar from "react-top-loading-bar";
import { toast } from "react-hot-toast";
import LoadingOverlay from "../../components/Loading/LoadingOverlay";
import { Box } from "@mui/material";
import { Button } from "@heroui/react";

// Componentes personalizados
import Carrusel from "../../components/Carrusel/Carrusel";
import Input from "../../components/Inputs/InputField";
import axios from "../../axios";
import SelectDPD from "../../components/Select/SelectDPD";
import SelectGradoPrograma from "../../components/Select/SelectGradoPrograma";
import FormularioUsuario from "../../components/Inputs/DatosPersonales";
import FileUploadSection from "../../components/FileUploadSection/FileUploadSection";
import cronograma from "../../assets/Img/cronograma.webp";
import pasos from "../../assets/Img/pasos.webp";
import fecha_examen from "../../assets/Img/fecha_examen.webp";
import conceptos_inscripcion from "../../assets/Img/conceptos_inscripcion.webp";
import { admissionConfig } from "../../config/admission";

function InscripcionForm({ datosPago }) {
    const navigate = useNavigate();
    const loadingBarRef = useRef(null);

    const [formData, setFormData] = useState(() => {
        const postulante = datosPago?.postulante || {};
        return {
            tipo_doc: postulante.tipo_doc || datosPago?.tipo_doc || "DNI",
            num_iden: postulante.num_iden || datosPago?.num_iden || "",
            nombres: postulante.nombres || "",
            ap_paterno: postulante.ap_paterno || "",
            ap_materno: postulante.ap_materno || "",
            email: postulante.email || "",
            celular: postulante.celular || "",
            fecha_nacimiento: postulante.fecha_nacimiento || "",
            sexo: postulante.sexo || "",
        };
    });

    const [grado_id, setGrado_id] = useState(datosPago?.grado_id || null);
    const [programa_id, setPrograma_id] = useState(
        datosPago?.programa_id || null
    );
    const [distrito_id, setDistrito_id] = useState(
        datosPago?.distrito_id || datosPago?.postulante?.distrito_id || null
    );
    const [direccion, setDireccion] = useState(datosPago?.postulante?.direccion || "");
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

        // Validar datos personales básicos
        const fields = ["nombres", "ap_paterno", "ap_materno", "email", "celular", "sexo", "tipo_doc"];
        for (const field of fields) {
            if (!formData[field]) {
                return `El campo ${field.replace("_", " ")} es obligatorio.`;
            }
        }

        if (formData.fecha_nacimiento) {
            const birth = new Date(formData.fecha_nacimiento);
            const today = new Date();
            let age = today.getFullYear() - birth.getFullYear();
            const m = today.getMonth() - birth.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
                age--;
            }
            if (age < 15 || age > 99) {
                return "La edad debe estar entre 15 y 99 años.";
            }
        } else {
            return "Ingresa tu fecha de nacimiento.";
        }

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

            let errorMessage = "Error al registrar la inscripción.";

            if (error.response && error.response.data) {
                // Error desde el servidor (Laravel)
                const { message, errors } = error.response.data;

                if (errors) {
                    // Si hay errores de validación de campos, mostramos el primero
                    const firstError = Object.values(errors).flat()[0];
                    errorMessage = firstError || message;
                } else if (message) {
                    errorMessage = message;
                }
            } else if (error.message) {
                errorMessage = error.message;
            }

            setProgressText(errorMessage);
            toast.error(errorMessage);
        } finally {
            loadingBarRef.current?.complete();
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
            title: "Pasos del Proceso Admisión",
            text: "Consulta aquí el paso a paso del proceso de admisión.",
            image: pasos,
        },
        {
            title: "Prepárate para el examen de admisión",
            text: "Revisa las fechas del examen de admisión.",
            image: fecha_examen,
        },
        {
            title: `Cronograma de Admisión ${admissionConfig.cronograma.periodo}`,
            text: `Conoce el cronograma de admisión ${admissionConfig.cronograma.periodo}.`,
            image: cronograma,
        },
        {
            title: "Conceptos de Pago de Inscripción",
            text: "Revisa los conceptos de pago para el proceso de inscripción.",
            image: conceptos_inscripcion,
        }
    ];

    const handleCloseOverlay = () => {
        setLoading(false);
        setSuccess(null);
    };

    return (
        <div className="flex flex-col lg:flex-row bg-white rounded-lg w-full max-w-8xl mx-auto p-4 sm:p-6 gap-2">
            {/* Formulario principal */}
            <Box sx={{ width: "100%", maxWidth: "100%", flex: 1, justifyContent: "center" }}>
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
                        initialDepartamentoId={datosPago?.postulante?.departamento_id}
                        initialProvinciaId={datosPago?.postulante?.provincia_id}
                        initialDistritoId={distrito_id}
                        initialDepartamentoNombre={datosPago?.postulante?.departamento_nombre}
                        initialProvinciaNombre={datosPago?.postulante?.provincia_nombre}
                        initialDistritoNombre={datosPago?.postulante?.distrito_nombre}
                        onDistritoSeleccionado={(id) => {
                            setDistrito_id(id);
                        }}
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
                isVisible={loading}
                progress={progress}
                text={progressText}
                success={success}
                onClose={handleCloseOverlay}
            />
        </div>
    );
}

export default InscripcionForm;
