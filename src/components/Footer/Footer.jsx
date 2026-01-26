import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear(); // Obtiene el año actual

  return (
    <footer
      style={{
        backgroundColor: "#f4f4f4",
        padding: "10px 20px",
        textAlign: "center",
        fontSize: "14px",
        color: "#747474",
        borderTop: "1px solid #ddd",
      }}
    >
      <p style={{ margin: 0 }}>
        © {currentYear} | Desarrollado por Joan Edinson Aquino Vasquez y Alexander Rojas Falen
      </p>
    </footer>
  );
};

export default Footer;
