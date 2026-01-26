/**
 * Componente de encabezado reutilizable para formularios
 * Muestra logo, título y subtítulo de manera consistente
 */
export const FormHeader = ({ title, subtitle, logoSrc, logoAlt = "Logo" }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
        <div className="flex justify-center md:justify-start">
            <img
                src={logoSrc}
                alt={logoAlt}
                className="w-32 md:w-48 h-auto"
            />
        </div>
        <div className="md:col-span-2 text-center md:text-right">
            <h2 className="text-2xl sm:text-4xl font-bold">
                {title}
            </h2>
            {subtitle && (
                <p className="text-gray-600 text-base">
                    {subtitle}
                </p>
            )}
        </div>
    </div>
);
