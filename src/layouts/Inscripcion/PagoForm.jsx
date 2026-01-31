import { useState, useCallback, useEffect } from "react";
import { Checkbox, FormControlLabel, Typography } from "@mui/material";
import { Button } from "@heroui/react";
import Select from "../../components/Select/Select";
import Input from "../../components/Inputs/InputField";
import logo from "../../assets/Isotipos/isotipo_color_epg.webp";
import { toast } from "react-hot-toast";
import axios from "../../axios";
import Spinner from "../../components/Spinner/Spinner";
import { admissionConfig } from "../../config/admission";

const tipos_de_pago = [
    { id: "BN", nombre: "Banco de la Nación" },
    { id: "PY", nombre: "PagaloPe" },
];

function PagoForm({ onTipoPagoChange, onSuccess }) {
    const [formData, setFormData] = useState({
        tipo_pago: "BN",
        num_iden: "",
        numero: "",
        fecha_pago: "",
        agencia: "",
        check1: false,
        check2: false,
        check3: false,
    });

    const [loading, setLoading] = useState(false);
    const [datosPago, setDatosPago] = useState(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const periodo = admissionConfig.cronograma.periodo;

    const validateForm = () => {
        const { tipo_pago, num_iden, numero, fecha_pago, agencia, check1, check2, check3 } = formData;
        if (!tipo_pago) return "Seleccione un método de pago.";
        if(num_iden.length === 0) return "Ingrese su número de DNI";
        if (num_iden.length !== 8) return "DNI no válido.";
        if (tipo_pago === "BN" && numero.length !== 7) return "Voucher BN debe tener 7 dígitos.";
        if (tipo_pago === "PY" && numero.length !== 6) return "Voucher PagaloPe debe tener 6 dígitos.";
        if (agencia.length !== 4) return "Agencia debe tener 4 dígitos.";
        if (!fecha_pago) return "Ingrese la fecha de pago.";
        if (!check1 || !check2 || !check3) return "Acepte los términos y condiciones.";
        return null;
    };

    const handleSubmit = useCallback(async () => {
        const error = validateForm();
        if (error) {
            toast.error(error);
            return;
        }
        setLoading(true);
        try {
            const response = await axios.post("/validar-voucher", formData);
            if (response?.data?.success) {
                toast.success(response.data.message);
                setDatosPago(response.data.data);
            } else {
                toast.error(response?.data?.message || "Error de validación.");
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Error al conectar con el servidor.");
        } finally {
            setLoading(false);
        }
    }, [formData]);

    useEffect(() => {
        if (datosPago) onSuccess(datosPago);
    }, [datosPago, onSuccess]);

    return (
        <div className="w-full h-full flex flex-col justify-between">
            {loading && <Spinner label={"Validando voucher..."} />}

            {/* Encabezado Micro */}
            <div className="flex items-center gap-3 mb-2 lg:mb-4">
                <img src={logo} alt="Logo" className="w-36 lg:w-36" />
                <div>
                    <h2 className="text-4xl lg:text-4xl font-black text-blue-800 leading-none">
                        BIENVENIDO POSTULANTE
                    </h2>
                    <p className="text-md lg:text-md text-gray-500 uppercase tracking-tighter font-bold">
                        Formulario de Inscripción • Admisión {periodo}
                    </p>
                </div>
            </div>

            {/* Aviso breve */}
            <div className="bg-blue-50/50 p-2 lg:p-3 rounded-lg mb-3 border border-blue-100">
                <p className="text-sm lg:text-md text-blue-900 leading-tight">
                     Para avanzar en su proceso de admisión, asegúrese de haber
                completado el pago en el Banco de la Nación o Pagalo.pe. Posteriormente despúes de 24h de su pago, ingrese los datos de su comprobante.
                </p>
            </div>

            {/* Formulario Compacto */}
            <div className="space-y-3">
                <Select
                    label="Método de Pago"
                    variant="bordered"
                    size="sm"
                    className="w-full"
                    selectedKey={formData.tipo_pago}
                    onSelectionChange={(val) => {
                        onTipoPagoChange(val);
                        setFormData(prev => ({ ...prev, tipo_pago: val, numero: "" }));
                    }}
                    defaultItems={tipos_de_pago.map(i => ({ key: i.id, textValue: i.nombre, ...i }))}
                />

                <div className="grid grid-cols-2 gap-3">
                    <Input
                        label="DNI"
                        name="num_iden"
                        size="sm"
                        value={formData.num_iden}
                        maxLength={8}
                        onlyNumbers
                        onChange={handleChange}
                    />
                    <Input
                        label={`Voucher (${formData.tipo_pago === "BN" ? "7" : "6"} dígitos)`}
                        name="numero"
                        size="sm"
                        value={formData.numero}
                        maxLength={formData.tipo_pago === "BN" ? 7 : 6}
                        onlyNumbers
                        onChange={handleChange}
                    />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <Input
                        label="Fecha de Pago"
                        name="fecha_pago"
                        size="sm"
                        value={formData.fecha_pago}
                        type="date"
                        onChange={handleChange}
                    />
                    <Input
                        label="Agencia (4 dígitos)"
                        name="agencia"
                        size="sm"
                        value={formData.agencia}
                        maxLength={4}
                        onlyNumbers
                        onChange={handleChange}
                    />
                </div>

                {/* Declaración Jurada Ultra-Compacta */}
                <div className="bg-gray-50/50 p-2 lg:p-3 rounded-xl border border-gray-100 mt-2">
                    <div className="flex flex-col gap-1">
                        {[1, 2, 3].map((num) => (
                            <div key={num} className="flex items-start gap-1">
                                <Checkbox
                                    name={`check${num}`}
                                    checked={formData[`check${num}`]}
                                    onChange={handleChange}
                                    sx={{
                                        padding: '2px',
                                        color: 'blue',
                                        '&.Mui-checked': { color: 'blue' },
                                        '& .MuiSvgIcon-root': { fontSize: 16 } // Icono más pequeño
                                    }}
                                />
                                <span className="text-sm lg:text-sm leading-[1.1] text-gray-500">
                                    <strong className="text-gray-700">{num === 1 ? 'Art. 97:' : num === 2 ? 'Art. 98:' : ''}</strong> {
                                        num === 1 ? "Los postulantes que consignen información falsa en el momento de la inscripción serán separados del proceso de admisión, sin perjuicio de las acciones legales pertinentes." :
                                            num === 2 ? "El postulante que no registre su inscripción dentro de los plazos establecidos en el cronograma del proceso de admisión, perderá el derecho de rendir el examen y a la devolución de su dinero. La inscripción se realiza de acuerdo al cronograma aprobado por el Consejo Universitario y establecido en cada proceso de admisión." :
                                                "Declaro que conozco las disposiciones del prospecto de admisión publicado en la página web."
                                    }
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <Button
                    fullWidth
                    onPress={handleSubmit}
                    isLoading={loading}
                    size="md"
                    className="h-10 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition-all"
                >
                    Validar y Continuar
                </Button>
            </div>
        </div>
    );
}

export default PagoForm;