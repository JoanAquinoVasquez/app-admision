import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';

/**
 * Generic hook for form handling with validation
 * Reduces boilerplate in form components
 */
export const useForm = (initialValues = {}, onSubmit = null) => {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = useCallback((name, value) => {
        setValues((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: null,
            }));
        }
    }, [errors]);

    const handleBlur = useCallback((name) => {
        setTouched((prev) => ({
            ...prev,
            [name]: true,
        }));
    }, []);

    const handleSubmit = useCallback(async (e) => {
        if (e) e.preventDefault();

        if (!onSubmit) return;

        try {
            setIsSubmitting(true);
            await onSubmit(values);
        } catch (err) {
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            } else {
                toast.error(err.message || 'Error al enviar formulario');
            }
        } finally {
            setIsSubmitting(false);
        }
    }, [values, onSubmit]);

    const reset = useCallback(() => {
        setValues(initialValues);
        setErrors({});
        setTouched({});
        setIsSubmitting(false);
    }, [initialValues]);

    const setFieldValue = useCallback((name, value) => {
        setValues((prev) => ({
            ...prev,
            [name]: value,
        }));
    }, []);

    const setFieldError = useCallback((name, error) => {
        setErrors((prev) => ({
            ...prev,
            [name]: error,
        }));
    }, []);

    return {
        values,
        errors,
        touched,
        isSubmitting,
        handleChange,
        handleBlur,
        handleSubmit,
        reset,
        setFieldValue,
        setFieldError,
        setValues,
    };
};
