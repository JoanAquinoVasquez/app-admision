import React from 'react';  // Asegúrate de importar React si es necesario.
import PropTypes from 'prop-types';

// Componente de tarjeta personalizada para mostrar información clave
const CustomCard = ({ icon, iconColor, backgroundColor, title, value }) => {
  return (
    <div className="shadow-md rounded-lg px-4 py-4" style={{ background: backgroundColor }}>
      
      {/* Sección que muestra el icono proporcionado */}
      <div className={`pb-0 px-4 flex-col items-start ${iconColor}`}>
        {icon} 
      </div>

      {/* Sección de contenido que muestra el título y el valor principal */}
      <div className="overflow-visible py-2">
        <p className="text-xs uppercase font-semibold text-gray-600">
          {title}  
        </p>
        <h4 className="font-bold text-xl text-gray-800">
          {value} 
        </h4>
      </div>
    </div>
  );
};

// Definición de los tipos de propiedades esperadas para mayor seguridad
CustomCard.propTypes = {
  icon: PropTypes.element.isRequired,  
  iconColor: PropTypes.string.isRequired, 
  backgroundColor: PropTypes.string.isRequired, 
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,  
};

export default CustomCard;  
