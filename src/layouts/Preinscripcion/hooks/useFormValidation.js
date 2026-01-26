import { useCallback } from 'react';
import { toast } from 'react-hot-toast';

/**
 * Hook para validación de formularios de preinscripción
 * Centraliza todas las reglas de validación
 */
export const useFormValidation = () => {
    /**
     * Validar el paso 1 (Selección de Programa)
     */
    const validateStep1 = useCallback((formData) => {
        if (!formData.grado_id) {
            toast.error('Debe seleccionar un grado académico');
            return false;
        }
        if (!formData.programa_id) {
            toast.error('Debe seleccionar un programa');
            return false;
        }
        return true;
    }, []);

    /**
     * Validar el paso 2 (Datos Personales)
     */
    const validateStep2 = useCallback((formData) => {
        const requiredFields = [
            { field: 'num_iden', label: 'Número de identificación' },
            { field: 'nombres', label: 'Nombres' },
            { field: 'ap_paterno', label: 'Apellido Paterno' },
            { field: 'ap_materno', label: 'Apellido Materno' },
            { field: 'fecha_nacimiento', label: 'Fecha de Nacimiento' },
            { field: 'sexo', label: 'Género' },
            { field: 'email', label: 'Correo Electrónico' },
            { field: 'celular', label: 'Celular' },
            { field: 'departamento_id', label: 'Departamento' },
            { field: 'provincia_id', label: 'Provincia' },
            { field: 'distrito_id', label: 'Distrito' },
        ];

        const missingFields = requiredFields.filter(
            ({ field }) => !formData[field] || formData[field] === ''
        );

        if (missingFields.length > 0) {
            const labels = missingFields.map(f => f.label).join(', ');
            toast.error(`Debe completar los siguientes campos: ${labels}`);
            return false;
        }

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast.error('El correo electrónico no tiene un formato válido');
            return false;
        }

        // Validar longitud de celular
        if (formData.celular.length !== 9) {
            toast.error('El celular debe tener 9 dígitos');
            return false;
        }

        // Validar DNI si es tipo DNI
        if (formData.tipo_doc === 'DNI' && formData.num_iden.length !== 8) {
            toast.error('El DNI debe tener 8 dígitos');
            return false;
        }

        return true;
    }, []);

    /**
     * Validar el paso 3 (Resumen y Envío)
     * Por ahora solo verifica que todos los datos estén presentes
     */
    const validateStep3 = useCallback((formData) => {
        // Validar que todos los pasos anteriores estén completos
        if (!validateStep1(formData) || !validateStep2(formData)) {
            return false;
        }
        return true;
    }, [validateStep1, validateStep2]);

    /**
     * Validar un campo específico
     */
    const validateField = useCallback((field, value, rules = {}) => {
        if (rules.required && (!value || value === '')) {
            return { valid: false, message: `${field} es requerido` };
        }

        if (rules.minLength && value.length < rules.minLength) {
            return {
                valid: false,
                message: `${field} debe tener al menos ${rules.minLength} caracteres`
            };
        }

        if (rules.maxLength && value.length > rules.maxLength) {
            return {
                valid: false,
                message: `${field} no puede tener más de ${rules.maxLength} caracteres`
            };
        }

        if (rules.pattern && !rules.pattern.test(value)) {
            return {
                valid: false,
                message: rules.patternMessage || `${field} no tiene un formato válido`
            };
        }

        return { valid: true, message: '' };
    }, []);

    return {
        validateStep1,
        validateStep2,
        validateStep3,
        validateField
    };
};
