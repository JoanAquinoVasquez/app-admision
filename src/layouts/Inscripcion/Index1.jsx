import React, { useState, useEffect, useRef, useCallback } from "react";
import TopLoadingBar from "react-top-loading-bar";
import { toast } from "react-hot-toast";
import { CircularProgress, Backdrop } from "@mui/material";
import ChatBot from "../../layouts/ChatBot/ChatBot";
import {
    CheckCircleIcon,
    ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";
import { Button } from "@nextui-org/react";
import Carrusel from "../../components/Carrusel/Carrusel";
import { Radio, RadioGroup } from "@nextui-org/react";
import { FormControl, FormControlLabel, Box } from "@mui/material";
import Select from "../../components/Select/Select";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import RenderFileUpload from "../../components/Inputs/RenderFileUpload";
import Input from "../../components/Inputs/InputField";
import voucherBN from "../../assets/Img/voucher_bn.webp";
import voucherPagaloPe from "../../assets/Img/voucher_py.webp";
import logoBN from "../../assets/Img/logo_bn.webp";
import logo from "../../assets/Isotipos/isotipo_color_epg.webp";
import fondo_logo_1 from "../../assets/Img/IMG_8791.webp";
import fondo_logo_2 from "../../assets/Img/IMG_8761.webp";
import fondo_logo_3 from "../../assets/Img/IMG_3393.webp";
import topBarImage from "../../assets/Barra/barra_colores_ofic.webp";
import cronograma from "../../assets/Img/1.webp";
import pasos from "../../assets/Img/pasos.webp";
import cronogramaAdmision from "../../assets/Img/3.webp";
import axios from "../../axios";
import useProvincias from "../../data/dataProvincias";
import useDistritos from "../../data/dataDistritos";
import useDepartamentos from "../../data/dataDepartamentos";

function Index() {
    const slides = [
        {
            title: "Pasos para la Inscripción",
            text: "Recuerda seguir los pasos para completar tu inscripción.",
            image: pasos,
        },
        {
            title: "Cronograma Proceso Admisión",
            text: "Consulta aquí el cronograma de actividades para el proceso de admisión.",
            image: cronograma,
        },

        {
            title: "Examen Admisión",
            text: "Completa tu inscripción hasta el 22 de abril.",
            image: cronogramaAdmision,
        },
    ];
    const backgrounds = [fondo_logo_1, fondo_logo_2, fondo_logo_3];
    const [currentBackgroundIndex, setCurrentBackgroundIndex] = useState(0);
    // Manejo de pasos
    const [step, setStep] = useState(1);
    const tipo_doc = [
        { id: 1, nombre: "DNI", label: "Número de DNI" },
        { id: 2, nombre: "CE", label: "Número de Carnet de Extranjería" },
        { id: 3, nombre: "PASAPORTE", label: "Número de Pasaporte" },
    ];
    const tipos_de_pago = [
        { id: "BN", nombre: "Banco de la Nación" },
        { id: "PY", nombre: "PagaloPe" },
    ];

    // FormularioInicial
    const [tipo_pago, setTipo_pago] = useState("BN");
    const [num_iden, setNum_iden] = useState("");
    const [num_voucher, setNum_voucher] = useState("");
    const [fecha_pago, setFecha_pago] = useState("");
    const [agencia, setAgencia] = useState("");
    const [check1, setCheck1] = useState(false);
    const [check2, setCheck2] = useState(false);
    const [check3, setCheck3] = useState(false);

    //Segundo form
    const [grados, setGrados] = useState([]);
    const [programas, setProgramas] = useState([]);
    const [programasFiltrados, setProgramasFiltrados] = useState([]);

    const { departamentos } = useDepartamentos();
    const { provincias, setProvincias, fetchProvincias } = useProvincias();
    const { distritos, setDistritos, fetchDistritos } = useDistritos();

    const [grado_id, setGrado_id] = useState("");
    const [programa_id, setPrograma_id] = useState("");
    const [nombres, setNombres] = useState("");
    const [ap_paterno, setAp_paterno] = useState("");
    const [ap_materno, setAp_materno] = useState("");
    const [celular, setCelular] = useState("");
    const [direccion, setDireccion] = useState("");
    const [correo, setCorreo] = useState("");
    const [fecha_nacimiento, setFecha_nacimiento] = useState("");
    const [departamento_id, setDepartamento_id] = useState("");
    const [provincia_id, setProvincia_id] = useState("");
    const [distrito_id, setDistrito_id] = useState("");
    const [tipo_documento, setTipo_documento] = useState("");
    const [sexo, setSexo] = useState("");
    const [rutaVoucher, setRutaVoucher] = useState("");
    const [rutaDocIden, setRutaDocIden] = useState("");
    const [rutaFoto, setRutaFoto] = useState("");
    const [rutaCV, setRutaCV] = useState("");

    const formData = new FormData();

    // Cargando...
    const [loading, setLoading] = useState(false);

    const [loading_inscripcion, setLoading_inscripcion] = useState(false);
    const [progressText, setProgressText] = useState("Iniciando...");
    const [progress, setProgress] = useState(0);
    const [success, setSuccess] = useState(false); // null: en progreso, true: éxito, false: error
    const loadingBarRef = useRef(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentBackgroundIndex(
                (prevIndex) => (prevIndex + 1) % backgrounds.length
            );
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    // Función para validar el pago en la API
    const handleSubmit = useCallback(async () => {
        if (!tipo_pago) {
            toast.error("Debe seleccionar un método de pago.");
            return;
        }
        if (!num_iden || num_iden.length !== 8) {
            toast.error("Debe ingresar un número de identidad válido.");
            return;
        }

        if (tipo_pago === "BN" && num_voucher.length !== 7) {
            toast.error("El número de voucher debe tener 7 dígitos.");
            return;
        }

        if (tipo_pago === "PY" && num_voucher.length !== 6) {
            toast.error("El número de voucher debe tener 6 dígitos.");
            return;
        }

        if (!agencia || agencia.length !== 4) {
            toast.error("El número de agencia debe tener 4 dígitos.");
            return;
        }

        if (!fecha_pago) {
            toast.error("Debe ingresar la fecha de pago.");
            return;
        }

        if (!check1 || !check2 || !check3) {
            toast.error("Debe aceptar todos los artículos para continuar.");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post("/validar-voucher", {
                num_iden,
                num_voucher,
                fecha_pago,
                agencia,
                tipo_pago,
            });
            // Verifica si la respuesta tiene éxito
            if (response.data.success) {
                toast.success(response.data.message); // Muestra el mensaje de éxito
                // Asignar los datos de la respuesta a formData
                setGrado_id(response.data.data.grado_id || null);
                setPrograma_id(response.data.data.programa_id || null);
                setNombres(response.data.data.nombres || null); // Asigna nombres
                setAp_paterno(response.data.data.ap_paterno || null); // Asigna apellido paterno
                setAp_materno(response.data.data.ap_materno || null); // Asigna apellido materno
                setCelular(response.data.data.celular || null); // Asigna el celular
                setDireccion(response.data.data.direccion || null); // Asigna dirección
                setCorreo(response.data.data.correo || null); // Asigna correo
                setFecha_nacimiento(
                    response.data.data.fecha_nacimiento || null
                ); // Asigna fecha de nacimiento
                setGrados(response.data.data.grados || []); // Asigna grados
                setProgramas(response.data.data.programas || []); // Asigna programas
                setNum_voucher(response.data.data.num_voucher || null); // Asigna número de voucher
                setDepartamento_id(response.data.data.departamento_id || null);
                setProvincia_id(response.data.data.provincia_id || null); // Asigna provincia
                setDistrito_id(response.data.data.distrito_id || null); // Asigna distrito
                setSexo(response.data.data.sexo || null); // Asigna sexo
                setTipo_documento(response.data.data.tipo_doc || "DNI");
                setTimeout(() => {
                    setStep(2);
                }, 300);
            } else {
                toast.error(
                    response.data.message || "Error al procesar la solicitud."
                ); // Muestra el mensaje de error si success es false
            }
        } catch (error) {
            // Maneja los errores si hay una falla en la solicitud
            toast.error(
                error.response?.data?.message ||
                "Hubo un error al procesar la solicitud."
            );
        } finally {
            setLoading(false); // Finaliza el estado de carga
        }
    }, [
        num_iden,
        num_voucher,
        fecha_pago,
        agencia,
        tipo_pago,
        check1,
        check2,
        check3,
        setStep,
    ]);

    const handleFileUpload = (inputId, file) => {
        // Actualizamos directamente formData en lugar de usar variables separadas

        if (inputId === "rutaVoucher") {
            setRutaVoucher(file);
        }

        if (inputId === "rutaDocIden") {
            setRutaDocIden(file);
        }

        if (inputId === "rutaFoto") {
            setRutaFoto(file);
        }

        if (inputId === "rutaCV") {
            setRutaCV(file);
        }
    };

    const handleSubmitInscripcion = async (e) => {
        e.preventDefault();

        if (!grado_id) {
            toast.error("Debes seleccionar un grado y programa.");
            return;
        }
        if (!tipo_documento) {
            toast.error("Debes seleccionar un tipo de documento.");
            return;
        }

        if (!sexo) {
            toast.error("Debes seleccionar un sexo.");
        }
        if (!rutaVoucher || !rutaDocIden || !rutaFoto || !rutaCV) {
            toast.error("Debes subir todos los archivos antes de continuar.");
            return;
        }

        await handleSave();
    };

    const handleSave = async () => {
        // Iniciar barra de carga superior
        if (loadingBarRef.current) loadingBarRef.current.continuousStart();

        formData.append("programa_id", parseInt(programa_id));
        formData.append("tipo_pago", tipo_pago);
        formData.append("nombres", nombres);
        formData.append("ap_paterno", ap_paterno);
        formData.append("ap_materno", ap_materno);
        formData.append("email", correo);
        formData.append("tipo_doc", tipo_documento.toString());
        formData.append("num_iden", num_iden);
        formData.append("celular", celular);
        formData.append("fecha_nacimiento", fecha_nacimiento);
        formData.append("distrito_id", parseInt(distrito_id));
        formData.append("direccion", direccion);
        formData.append("sexo", sexo);
        formData.append("cod_voucher", num_voucher.toString());
        formData.append("rutaVoucher", rutaVoucher);
        formData.append("rutaDocIden", rutaDocIden);
        formData.append("rutaFoto", rutaFoto);
        formData.append("rutaCV", rutaCV);

        setLoading_inscripcion(true);
        setProgressText("Iniciando proceso...");
        setProgress(0);
        setSuccess(null);

        try {
            await axios
                .post("/inscripcion", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    onUploadProgress: (progressEvent) => {
                        if (!progressEvent.total) return;

                        const percent = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );

                        // No permitimos que llegue a 100% hasta recibir la respuesta
                        setProgress((prev) =>
                            percent > prev ? Math.min(percent, 85) : prev
                        );
                        if (percent < 30) setProgressText("Enviando datos");
                        else if (percent < 70)
                            setProgressText("Subiendo Archivos...");
                        else if (percent < 91)
                            setProgressText(
                                "El proceso está en curso, por favor, no cierre esta ventana."
                            );
                        else
                            setProgressText(
                                "El proceso está en curso, por favor, no cierre esta ventana."
                            );
                    },
                })
                .then((response) => {
                    if (response.data.success === false) {
                        setProgress(0);
                        // Verifica si hay errores adicionales
                        const errorMessage = response.data.errors
                            ? Object.values(response.data.errors)
                                .flat()
                                .join(" ") // Convierte errores en un string
                            : response.data.message;

                        setProgressText(`Error: ${errorMessage}`);
                        setSuccess(false);
                        setTimeout(() => setLoading_inscripcion(false), 2500);
                    } else {
                        setProgress(100);
                        setProgressText(
                            "Inscripción completada 🎉, Revise su bandeja de correo electrónico."
                        );
                        setSuccess(true);
                        // Esperar 1.5 segundos antes de recargar la página
                        setTimeout(() => {
                            navigate("/");
                            setLoading_inscripcion(false);
                        }, 1500);
                    }
                });
        } catch (error) {
            setProgressText("Error al registrar la inscripción:");
            setSuccess(false);
            setTimeout(() => setLoading_inscripcion(false), 2500);
        } finally {
            if (loadingBarRef.current) loadingBarRef.current.complete(); // Completa la barra de carga superior
            // setTimeout(() => setLoading_inscripcion(false), 5000); // Ocultar el loader después de 1.5s
        }
    };

    useEffect(() => {
        if (departamento_id) {
            fetchProvincias(departamento_id); // Filtrar provincias por departamento
        } else {
            setProvincias([]); // Limpiar provincias si no hay departamento seleccionado
            setDistritos([]);
            setProvincia_id(null); // Resetear la provincia seleccionada
            setDistrito_id(null); // Resetear distrito_id cuando no hay provincia
        }
    }, [departamento_id]);

    useEffect(() => {
        if (provincia_id) {
            fetchDistritos(provincia_id); // Filtrar distritos por provincia
        } else {
            setDistritos([]); // Limpiar distritos si no hay provincia seleccionada
            setDistrito_id(null); // Resetear distrito_id cuando no hay provincia
        }
    }, [provincia_id]);

    useEffect(() => {
        if (grado_id !== null && programas.length > 0) {
            const filtrados = programas.filter(
                (programa) => programa.grado_id === grado_id
            );
            setProgramasFiltrados(filtrados);
        } else {
            setProgramasFiltrados([]);
        }
    }, [grado_id, programas]);

    return (
        <div
            className="relative min-h-screen flex flex-col items-center bg-gray-100"
            style={{
                backgroundImage: `url(${backgrounds[currentBackgroundIndex]})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <div className="absolute inset-0 bg-black opacity-40"></div>
            <img
                src={topBarImage}
                alt="Top Bar"
                loading="lazy"
                className="w-full h-3 object-cover"
            />

            <ChatBot />

            {step === 1 ? (
                <div
                    key="step1"
                    className="relative flex flex-col items-center bg-white p-6 md:p-6 rounded-lg shadow-lg w-[95%] max-w-7xl mt-5 md:mt-2 mb-5"
                >
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Sección Izquierda: Formulario */}
                        <div className="w-full md:w-1/2">
                            <div className="flex flex-wrap items-center justify-center md:justify-start">
                                <img
                                    src={logo}
                                    alt="Logo"
                                    className="h-24 md:h-20 lg:h-24"
                                />
                                <h2 className="text-2xl md:text-3xl font-bold text-center md:text-left">
                                    BIENVENIDO POSTULANTE
                                </h2>
                            </div>

                            <p className="mb-4 text-gray-600 text-center md:text-left">
                                Para avanzar en su proceso de admisión,
                                asegúrese de haber completado el pago en el
                                Banco de la Nación o por el aplicativo Pagalo.pe
                                y luego ingrese los datos del voucher para
                                verificar el pago.
                            </p>

                            <h3 className="mb-4 text-gray-600 font-semibold">
                                Información de Pago
                            </h3>

                            <form className="space-y-4">
                                <Select
                                    label="Método de Pago"
                                    variant="flat"
                                    className="w-full"
                                    isRequired={true}
                                    defaultItems={tipos_de_pago.map((item) => ({
                                        key: item.id.toString(), // Asegura que sea un string
                                        textValue: item.nombre,
                                        ...item,
                                    }))}
                                    selectedKey={
                                        tipo_pago ? tipo_pago.toString() : ""
                                    } // Evita valores null
                                    onSelectionChange={(tipo_pago_id) => {
                                        setTipo_pago(tipo_pago_id ?? ""); // Manejo seguro de null
                                        setNum_iden("");
                                        setNum_voucher("");
                                        setAgencia("");
                                        setFecha_pago("");
                                    }}
                                />

                                <Input
                                    label="Número de Documento de Identidad"
                                    value={num_iden || ""}
                                    isRequired={true}
                                    maxLength={8}
                                    onlyNumbers={true}
                                    className="w-full"
                                    onChange={(e) =>
                                        setNum_iden(e.target.value)
                                    }
                                />

                                <Input
                                    label="Número de Voucher"
                                    value={num_voucher || ""}
                                    isRequired={true}
                                    maxLength={
                                        tipo_pago === "BN"
                                            ? 7
                                            : tipo_pago === "PY"
                                                ? 6
                                                : 7
                                    }
                                    onlyNumbers={true}
                                    className="w-full"
                                    onChange={(e) =>
                                        setNum_voucher(e.target.value)
                                    }
                                />

                                <Input
                                    label="Fecha de Pago"
                                    value={fecha_pago || ""}
                                    type="date"
                                    isRequired={true}
                                    className="w-full"
                                    onChange={(e) =>
                                        setFecha_pago(e.target.value)
                                    }
                                />

                                <Input
                                    label="Número de Agencia"
                                    value={agencia || ""}
                                    isRequired={true}
                                    onlyNumbers={true}
                                    maxLength={4}
                                    className="w-full"
                                    onChange={(e) => setAgencia(e.target.value)}
                                />

                                {/* Checkboxes */}
                                <div className="space-y-2 text-sm">
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                name="check1"
                                                id="check1"
                                                checked={check1}
                                                onChange={(e) =>
                                                    setCheck1(e.target.checked)
                                                }
                                            />
                                        }
                                        label={
                                            <Typography variant="body2">
                                                <strong>Artículo 97.-</strong>{" "}
                                                Los postulantes que consignen
                                                información falsa en el momento
                                                de la inscripción serán
                                                separados del proceso de
                                                admisión, sin perjuicio de las
                                                acciones legales pertinentes.
                                            </Typography>
                                        }
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                name="check2"
                                                id="check2"
                                                checked={check2}
                                                onChange={(e) =>
                                                    setCheck2(e.target.checked)
                                                }
                                            />
                                        }
                                        label={
                                            <Typography variant="body2">
                                                <strong>Artículo 98.-</strong>{" "}
                                                El postulante que no registre su
                                                inscripción dentro de los plazos
                                                establecidos en el cronograma
                                                del proceso de admisión, perderá
                                                el derecho de rendir el examen y
                                                a la devolución de su dinero. La
                                                inscripción se realiza de
                                                acuerdo al cronograma aprobado
                                                por el Consejo Universitario y
                                                establecido en cada proceso de
                                                admisión.
                                            </Typography>
                                        }
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                name="check3"
                                                id="check3"
                                                checked={check3}
                                                onChange={(e) =>
                                                    setCheck3(e.target.checked)
                                                }
                                            />
                                        }
                                        label={
                                            <Typography variant="body2">
                                                Declaro que conozco las
                                                disposiciones del prospecto de
                                                admisión publicado en la página
                                                web.
                                            </Typography>
                                        }
                                    />
                                </div>

                                {/* Botón de envío */}
                                <Button
                                    fullWidth
                                    color="primary"
                                    onPress={handleSubmit}
                                    disabled={loading}
                                    className="mt-4"
                                >
                                    {loading ? (
                                        <div className="relative flex items-center justify-center w-full h-full">
                                            <Backdrop
                                                sx={{
                                                    color: "#fff",
                                                    zIndex: (theme) =>
                                                        theme.zIndex.drawer + 1,
                                                }}
                                                open={loading}
                                            >
                                                <CircularProgress color="inherit" />
                                                <span
                                                    style={{
                                                        marginLeft: "10px",
                                                        color: "#fff",
                                                    }}
                                                >
                                                    Cargando...
                                                </span>
                                            </Backdrop>
                                        </div>
                                    ) : (
                                        "Ingresar"
                                    )}
                                </Button>
                            </form>
                        </div>

                        {/* Sección Derecha: Información y Voucher */}
                        <div className="w-full md:w-1/2 flex flex-col items-center border-l border-gray-300 pl-6">
                            <div className="flex items-center mb-2">
                                <img
                                    src={logoBN}
                                    alt="Logo"
                                    className="w-12 h-12 mr-2"
                                />
                                <h3 className="text-xl font-bold">
                                    {tipo_pago === "BN"
                                        ? "Banco de la Nación"
                                        : "PagaloPe"}
                                </h3>
                            </div>

                            <h2 className="text-lg font-semibold">
                                Información del Voucher
                            </h2>
                            <div className="flex items-center mb-0">
                                {tipo_pago === "BN" && (
                                    <img
                                        src={voucherBN}
                                        alt="Voucher Banco de la Nación"
                                        className="w-auto h-[90%] mx-auto rounded-lg shadow-md p-5"
                                    />
                                )}
                                {tipo_pago === "PY" && (
                                    <img
                                        src={voucherPagaloPe}
                                        alt="Voucher PagaloPe"
                                        className="w-auto  h-[90%] mx-auto rounded-lg shadow-md p-5"
                                    />
                                )}
                            </div>
                            <p className="text-center text-gray-600 mb-3">
                                Aquí encontrarás información adicional sobre el
                                proceso.
                            </p>
                            {/* Nueva Sección de Enlaces */}
                            <div className="flex flex-col items-center space-y-2">
                                <a
                                    href="https://drive.google.com/drive/folders/1cuChb6BnTGRdKN8TaYyrc--iEu8uUaGy?usp=sharing"
                                    target="_blank"
                                    className="text-blue-600 hover:underline text-lg font-semibold"
                                >
                                    📚 Maestrías
                                </a>
                                <a
                                    href="https://drive.google.com/drive/folders/1TCWjqEyLEHzQhHIVBGbPrjmq5xMOzMJC?usp=sharing"
                                    target="_blank"
                                    className="text-blue-600 hover:underline text-lg font-semibold"
                                >
                                    🎓 Doctorados
                                </a>
                                <a
                                    href="https://drive.google.com/drive/folders/1sQBmpaFEg__yph919-0VbCNSH0MRsdfu?usp=sharing"
                                    target="_blank"
                                    className="text-blue-600 hover:underline text-lg font-semibold"
                                >
                                    🏥 Segundas Especialidades
                                </a>
                                <a
                                    href="https://drive.google.com/drive/folders/1ROMJgaTU0nkmHfaUjSDaw7XGDvkSRAE2?usp=sharing"
                                    target="_blank"
                                    className="text-blue-600 hover:underline text-lg font-semibold"
                                >
                                    📖 Más Información
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div
                    key="step2"
                    className="relative flex flex-col sm:flex-row bg-white px-2 sm:px-4 py-4 rounded-lg shadow-lg w-[90%] h-auto mt-4"
                >
                    <Box
                        sx={{
                            width: "100%", // Asegura que el Box ocupe el 100% del ancho del contenedor
                            maxWidth: "900px",
                            mx: "auto",
                            p: 3,
                        }}
                    >
                        <h2 className="text-2xl font-bold text-center mb-4">
                            ¡Pago Verificado!
                        </h2>
                        <p className="text-center mb-4">
                            Ahora puedes continuar con tu Proceso de
                            Inscripción.
                        </p>

                        <form
                            onSubmit={handleSubmitInscripcion}
                            style={{ marginTop: "20px" }}
                        >
                            <h3 className="font-bold mb-2">
                                Seleccionar Grado y Programa a postular
                            </h3>
                            <Box
                                sx={{
                                    display: "grid",
                                    gap: 2,
                                    gridTemplateColumns: {
                                        xs: "1fr",
                                        md: "1fr 3fr",
                                    },
                                    mb: 2,
                                }}
                            >
                                {/* Grado y Programa */}
                                <FormControl>
                                    <Select
                                        label="Grado Académico"
                                        variant="flat"
                                        className="w-30"
                                        isRequired={true}
                                        value={
                                            grado_id ? grado_id.toString() : ""
                                        } // Usar string en value
                                        defaultItems={grados.map((item) => ({
                                            key: item.id.toString(),
                                            textValue: item.nombre,
                                            ...item,
                                        }))}
                                        selectedKey={
                                            grado_id
                                                ? grado_id.toString()
                                                : null
                                        } // Usar string en selectedKey
                                        onSelectionChange={(grado_id) => {
                                            setGrado_id(
                                                grado_id
                                                    ? parseInt(grado_id)
                                                    : null
                                            ); // Asegúrate de manejar correctamente null
                                            setPrograma_id(null); // Limpiar el programa cuando cambies el grado
                                        }}
                                    />
                                </FormControl>

                                <FormControl fullWidth>
                                    <Select
                                        label="Programa"
                                        className="w-full"
                                        defaultItems={programasFiltrados.map(
                                            (item) => ({
                                                key: item.id.toString(),
                                                textValue: item.nombre,
                                                ...item,
                                            })
                                        )}
                                        value={
                                            programa_id
                                                ? programa_id.toString()
                                                : ""
                                        } // Esto asegura que se pase un valor vacío si programa_id es null
                                        selectedKey={
                                            programa_id
                                                ? programa_id.toString()
                                                : null
                                        } // Esto asegura que el programa seleccionado sea el actual
                                        onSelectionChange={(programaId) => {
                                            setPrograma_id(
                                                programaId
                                                    ? parseInt(programaId)
                                                    : null
                                            );
                                        }}
                                        isRequired={true}
                                        disabled={!grado_id} // Deshabilitar select de programa si no hay grado seleccionado
                                    />
                                </FormControl>
                            </Box>
                            <h3 className="font-bold mb-2">Datos personales</h3>
                            <Box
                                sx={{
                                    display: "grid",
                                    gap: 2,
                                    gridTemplateColumns: {
                                        xs: "1fr",
                                        md: "2fr 2fr 2fr 2fr 2fr",
                                    },
                                    mb: 2,
                                }}
                            >
                                <Select
                                    label="Tipo de Documento"
                                    variant="flat"
                                    className="w-30"
                                    disabled={true}
                                    value={
                                        tipo_documento
                                            ? tipo_documento.toString
                                            : null
                                    }
                                    isRequired={true}
                                    defaultItems={tipo_doc.map((item) => ({
                                        key: item.nombre.toString(),
                                        textValue: item.nombre,
                                        ...item,
                                    }))}
                                    selectedKey={
                                        tipo_documento
                                            ? tipo_documento.toString()
                                            : null
                                    }
                                    onSelectionChange={(tipo_doc_id) => {
                                        setTipo_documento(tipo_doc_id);
                                        setNum_iden(""); // Borrar el número de identidad cuando cambia el tipo de documento
                                    }}
                                />

                                <Input
                                    label={`Número de ${tipo_doc.find(
                                        (item) =>
                                            item.nombre === tipo_documento
                                    )?.nombre || "Documento de Identidad"
                                        }`}
                                    name="num_iden"
                                    optiondisable={true}
                                    value={num_iden ? num_iden : ""}
                                    disabled={true}
                                    isRequired={true}
                                    maxLength={tipo_documento == "DNI" ? 8 : 20} // Máximo de caracteres según el tipo de documento
                                    onlyNumbers={true}
                                    onChange={(e) =>
                                        setNum_iden(e.target.value)
                                    }
                                />

                                <Input
                                    label="Nombres"
                                    name="nombres"
                                    value={nombres ? nombres : ""}
                                    isRequired={true}
                                    maxLength={50} // Máximo de caracteres según el tipo de documento
                                    onlyLetters={true}
                                    onChange={(e) => setNombres(e.target.value)}
                                />

                                <Input
                                    label="Apellido Paterno"
                                    name="ap_paterno"
                                    value={ap_paterno ? ap_paterno : ""}
                                    isRequired={true}
                                    maxLength={50} // Máximo de caracteres según el tipo de documento
                                    onlyLetters={true}
                                    onChange={(e) =>
                                        setAp_paterno(e.target.value)
                                    }
                                />

                                <Input
                                    label="Apellido Materno"
                                    name="ap_materno"
                                    value={ap_materno ? ap_materno : ""}
                                    isRequired={true}
                                    maxLength={50} // Máximo de caracteres según el tipo de documento
                                    onlyLetters={true}
                                    onChange={(e) =>
                                        setAp_materno(e.target.value)
                                    }
                                />
                            </Box>
                            <Box
                                sx={{
                                    display: "grid",
                                    gap: 2,
                                    gridTemplateColumns: {
                                        xs: "1fr",
                                        md: "4fr 2fr 2fr 1fr",
                                    },
                                    mb: 2,
                                }}
                            >
                                <Input
                                    label="Correo Electrónico"
                                    name="correo"
                                    value={correo ? correo : ""}
                                    isRequired={true}
                                    maxLength={50} // Máximo de caracteres según el tipo de documento
                                    onChange={(e) => setCorreo(e.target.value)}
                                    type={"email"}
                                />
                                <Input
                                    label="Celular"
                                    name="celular"
                                    value={celular ? celular : ""}
                                    isRequired={true}
                                    maxLength={9} // Máximo de caracteres según el tipo de documento
                                    onlyNumbers={true}
                                    onChange={(e) => setCelular(e.target.value)}
                                />

                                <Input
                                    label="Fecha de Nacimiento"
                                    value={
                                        fecha_nacimiento ? fecha_nacimiento : ""
                                    }
                                    type="date"
                                    isAgeField={true}
                                    isRequired={true}
                                    onChange={(e) =>
                                        setFecha_nacimiento(e.target.value)
                                    }
                                />

                                <RadioGroup
                                    isRequired
                                    value={sexo ? sexo : ""} // Manejo explícito de null
                                    onChange={(e) => setSexo(e.target.value)}
                                    orientation="horizontal"
                                    classNames={{
                                        wrapper: "gap-1",
                                    }}
                                >
                                    <Radio value="M">Masculino</Radio>
                                    <Radio value="F">Femenino</Radio>
                                </RadioGroup>
                            </Box>
                            <h3 className="font-bold mb-2">
                                Lugar de Residencia
                            </h3>
                            <Box
                                sx={{
                                    display: "grid",
                                    gap: 2,
                                    gridTemplateColumns: {
                                        xs: "1fr",
                                        md: "1fr 1fr 1fr",
                                    },
                                    mb: 2,
                                }}
                            >
                                <Select
                                    label="Departamento"
                                    isRequired={true}
                                    className="flex-1 min-w-200"
                                    selectedKey={
                                        departamento_id
                                            ? departamento_id.toString()
                                            : ""
                                    }
                                    value={
                                        departamento_id ? departamento_id : ""
                                    }
                                    defaultItems={departamentos.map((item) => ({
                                        key: item.id.toString(),
                                        textValue: item.nombre,
                                        ...item,
                                    }))}
                                    onSelectionChange={(departamentoId) => {
                                        setDepartamento_id(
                                            departamentoId
                                                ? parseInt(departamentoId)
                                                : null
                                        );
                                        setProvincia_id(null); // Resetear provincia al cambiar departamento
                                        setDistrito_id(null); // Resetear distrito al cambiar departamento
                                    }}
                                />

                                <Select
                                    label="Provincia"
                                    isRequired={true}
                                    selectedKey={
                                        provincia_id
                                            ? provincia_id.toString()
                                            : ""
                                    }
                                    className="flex-1 min-w-200"
                                    disabled={!departamento_id} // Deshabilitar si no hay departamento
                                    value={provincia_id ? provincia_id : ""}
                                    defaultItems={provincias.map((item) => ({
                                        key: item.id.toString(),
                                        textValue: item.nombre,
                                        ...item,
                                    }))}
                                    onSelectionChange={(provinciaId) => {
                                        setProvincia_id(
                                            provinciaId
                                                ? parseInt(provinciaId)
                                                : null
                                        );
                                        setDistrito_id(null); // Resetear distrito al cambiar provincia
                                    }}
                                />

                                <Select
                                    key={`distrito-${departamento_id}`} // Cambiar el key para forzar re-render
                                    label="Distrito"
                                    disabled={!provincia_id} // Deshabilitar si no hay provincia seleccionada
                                    selectedKey={
                                        distrito_id
                                            ? distrito_id.toString()
                                            : ""
                                    }
                                    isRequired={true}
                                    value={distrito_id ? distrito_id : ""}
                                    className="flex-1 min-w-200"
                                    defaultItems={distritos.map((item) => ({
                                        key: item.id.toString(),
                                        textValue: item.nombre,
                                        ...item,
                                    }))}
                                    onSelectionChange={(distritoId) => {
                                        setDistrito_id(
                                            distritoId
                                                ? parseInt(distritoId)
                                                : null
                                        );
                                    }}
                                />
                            </Box>
                            <Box
                                sx={{
                                    display: "grid",
                                    gap: 2,
                                    gridTemplateColumns: {
                                        xs: "1fr",
                                        sm: "1fr 1fr",
                                        md: "repeat(2, 1fr)",
                                    },
                                    mb: 2,
                                }}
                            >
                                {/* Dirección */}
                                <Input
                                    label="Dirección"
                                    value={direccion ? direccion : ""}
                                    isRequired={true}
                                    onChange={(e) => {
                                        setDireccion(e.target.value);
                                    }}
                                />
                            </Box>

                            {/* <Box
                                sx={{
                                    display: "grid",
                                    gap: 2,
                                    gridTemplateColumns: {
                                        xs: "1fr",
                                        sm: "1fr 1fr",
                                        md: "repeat(2, 1fr)",
                                    },
                                    mb: 4,
                                }}
                            >
                               
                            </Box> */}

                            {/* Archivos PDF */}
                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(2, 1fr)",
                                    gap: 2,
                                    mb: 2,
                                }}
                            >
                                <h3
                                    className="font-bold mb-2"
                                    style={{ gridColumn: "span 2" }}
                                >
                                    Subir Archivos
                                </h3>
                                <input
                                    name="cod_voucher"
                                    defaultValue={
                                        num_voucher ? num_voucher : ""
                                    }
                                    hidden
                                ></input>
                                <div>
                                    <RenderFileUpload
                                        uploadType="Subir Voucher (PDF)"
                                        allowedFileTypes={["application/pdf"]}
                                        inputId="rutaVoucher"
                                        tamicono={24}
                                        tamletra={14}
                                        required={true}
                                        onFileUpload={handleFileUpload} // Ahora se pasa el manejador directamente
                                    />
                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                        sx={{ fontSize: "0.7rem" }}
                                    >
                                        * Suba el comprobante de pago de
                                        inscripción en formato PDF.
                                    </Typography>
                                </div>
                                <div>
                                    <RenderFileUpload
                                        uploadType="Subir Copia DNI (PDF)"
                                        allowedFileTypes={["application/pdf"]}
                                        inputId="rutaDocIden"
                                        tamicono={24}
                                        tamletra={14}
                                        onFileUpload={handleFileUpload} // Ahora se pasa el manejador directamente
                                    />
                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                        sx={{ fontSize: "0.7rem" }}
                                    >
                                        * Suba una copia legible de su DNI
                                        (ambas caras) en formato PDF.
                                    </Typography>
                                </div>
                                <div>
                                    <RenderFileUpload
                                        uploadType="Subir Curriculum Vitae Documentado (PDF)"
                                        allowedFileTypes={["application/pdf"]}
                                        inputId="rutaCV"
                                        tamicono={24}
                                        tamletra={14}
                                        onFileUpload={handleFileUpload} // Ahora se pasa el manejador directamente
                                    />
                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                        sx={{ fontSize: "0.7rem" }}
                                    >
                                        * Suba su Curriculum Vitae en formato
                                        PDF. Tamaño máximo: 10MB.
                                    </Typography>
                                </div>
                                {/* Archivos Imagen */}
                                <div>
                                    <RenderFileUpload
                                        uploadType="Subir Foto Carnet (IMG)"
                                        allowedFileTypes={[
                                            "image/jpeg",
                                            "image/png",
                                            "image/jpg",
                                        ]}
                                        inputId="rutaFoto"
                                        tamicono={24}
                                        tamletra={14}
                                        onFileUpload={handleFileUpload} // Ahora se pasa el manejador directamente
                                    />
                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                        sx={{ fontSize: "0.7rem" }}
                                    >
                                        * Suba una foto tipo carnet en formato
                                        JPG o PNG. Debe ser a color, con fondo
                                        blanco, sin lentes. No escaneado.
                                    </Typography>
                                </div>
                            </Box>

                            {/* Botón de Enviar */}
                            <Box sx={{ gridColumn: "span 2" }}>
                                <Button type="submit" color="primary" fullWidth>
                                    Enviar Formulario
                                </Button>
                            </Box>
                        </form>
                    </Box>
                    <div className="flex flex-col items-center justify-between w-full sm:w-[40%]">
                        <Carrusel
                            slides={slides}
                            autoPlay={true}
                            interval={3000}
                        />
                    </div>

                    <div className="flex flex-col items-center justify-center">
                        {/* Barra de progreso oculta */}
                        <TopLoadingBar
                            color="#4caf50"
                            height={8}
                            ref={loadingBarRef}
                        />

                        {/* Loader Pantalla Completa */}
                        <Backdrop
                            sx={{ color: "#fff", zIndex: 1300 }}
                            open={loading_inscripcion}
                        >
                            <div className="flex flex-col items-center justify-center bg-black/70 p-8 rounded-lg">
                                {success === null ? (
                                    <>
                                        {/* Círculo de progreso */}
                                        <CircularProgress
                                            variant="determinate"
                                            value={progress}
                                            size={100}
                                            thickness={5}
                                            sx={{
                                                color: "#4caf50",
                                                transition:
                                                    "all 0.5s ease-in-out",
                                            }}
                                        />
                                        <p className="text-2xl font-semibold mt-4">
                                            {progress}%
                                        </p>
                                        <p className="text-lg text-gray-300">
                                            {progressText}
                                        </p>
                                    </>
                                ) : success ? (
                                    <>
                                        <CheckCircleIcon className="w-24 h-24 text-green-400" />
                                        <p className="text-2xl font-bold text-green-400">
                                            {progressText}
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <ExclamationTriangleIcon className="w-24 h-24 text-red-400" />
                                        <p className="text-2xl font-bold text-red-400">
                                            {progressText}
                                        </p>
                                    </>
                                )}
                            </div>
                        </Backdrop>
                    </div>
                </div>
            )}
            {/* Imagen inferior */}
            <img
                src={topBarImage}
                alt="Barra de colores inferior"
                loading="lazy"
                className="absolute bottom-0 left-0 w-full h-3 object-cover"
            />
        </div>
    );
}

export default Index;
