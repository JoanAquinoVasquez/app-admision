import { useState, useCallback } from 'react';

/**
 * Hook para manejar el estado y lógica del formulario de preinscripción
 * Centraliza la gestión del estado del formulario y navegación entre pasos
 */
export const usePreinscripcionForm = (initialData) => {
    const [formData, setFormData] = useState(initialData);
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    /**
     * Actualizar un campo específico del formulario
     */
    const updateField = useCallback((field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    }, []);

    /**
     * Actualizar múltiples campos del formulario
     */
    const updateFields = useCallback((fields) => {
        setFormData(prev => ({ ...prev, ...fields }));
    }, []);

    /**
     * Avanzar al siguiente paso
     */
    const nextStep = useCallback(() => {
        setStep(prev => prev + 1);
    }, []);

    /**
     * Retroceder al paso anterior
     */
    const prevStep = useCallback(() => {
        setStep(prev => prev - 1);
    }, []);

    /**
     * Ir a un paso específico
     */
    const goToStep = useCallback((stepNumber) => {
        setStep(stepNumber);
    }, []);

    /**
     * Resetear el formulario al estado inicial
     */
    const resetForm = useCallback(() => {
        setFormData(initialData);
        setStep(1);
        setLoading(false);
    }, [initialData]);

    return {
        // Estado
        formData,
        step,
        loading,

        // Setters
        setFormData,
        setStep,
        setLoading,

        // Métodos
        updateField,
        updateFields,
        nextStep,
        prevStep,
        goToStep,
        resetForm
    };
};
