/**
 * Componente de indicador de pasos
 * Muestra visualmente en qué paso del formulario se encuentra el usuario
 */
export const StepIndicator = ({ currentStep, totalSteps = 3, stepLabels = [], orientation = 'horizontal' }) => {
    const defaultLabels = [
        'Selección de Programa',
        'Datos Personales',
        'Resumen y Envío'
    ];

    const labels = stepLabels.length > 0 ? stepLabels : defaultLabels;
    const isVertical = orientation === 'vertical';

    return (
        <div className={`w-full ${isVertical ? 'h-full py-6 px-4' : 'py-2 mb-6'}`}>
            <div className={`flex ${isVertical ? 'flex-col items-start justify-center h-full gap-2' : 'items-center justify-center'}`}>
                {Array.from({ length: totalSteps }, (_, index) => {
                    const stepNumber = index + 1;
                    const isActive = stepNumber === currentStep;
                    const isCompleted = stepNumber < currentStep;

                    if (isVertical) {
                        return (
                            <div key={stepNumber} className="flex flex-row items-start relative w-full">
                                {/* Columna Izquierda: Círculo + Línea */}
                                <div className="flex flex-col items-center mr-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 z-10 ${isCompleted ? 'bg-green-500 text-white' :
                                        isActive ? 'bg-blue-600 text-white ring-4 ring-blue-200' :
                                            'bg-gray-200 text-gray-500'
                                        }`}>
                                        {isCompleted ? '✓' : stepNumber}
                                    </div>
                                    {/* Línea conectora vertical */}
                                    {stepNumber < totalSteps && (
                                        <div className={`w-0.5 h-12 transition-all duration-300 my-1 ${isCompleted ? 'bg-green-500' : 'bg-gray-200'
                                            }`} />
                                    )}
                                </div>

                                {/* Columna Derecha: Label */}
                                <div className={`mt-1 text-sm font-medium transition-colors duration-300 ${isActive ? 'text-blue-600' : 'text-gray-500'
                                    }`}>
                                    {labels[index]}
                                </div>
                            </div>
                        );
                    }

                    // Layout Horizontal (Original)
                    return (
                        <div key={stepNumber} className="flex items-center">
                            {/* Contenedor del Círculo y Label */}
                            <div className="flex flex-col items-center relative">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 z-10 ${isCompleted ? 'bg-green-500 text-white' :
                                    isActive ? 'bg-blue-600 text-white ring-4 ring-blue-200' :
                                        'bg-gray-200 text-gray-500'
                                    }`}>
                                    {isCompleted ? '✓' : stepNumber}
                                </div>

                                {/* Label con posición absoluta opcional para no mover la línea */}
                                <span className={`mt-2 text-xs text-center absolute top-11 w-32 -ml-1 ${isActive ? 'text-blue-600 font-semibold' : 'text-gray-500'
                                    }`}>
                                    {labels[index]}
                                </span>
                            </div>

                            {/* Línea conectora */}
                            {stepNumber < totalSteps && (
                                <div className={`w-20 h-1 transition-all duration-300 ${isCompleted ? 'bg-green-500' : 'bg-gray-200'
                                    }`} />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
