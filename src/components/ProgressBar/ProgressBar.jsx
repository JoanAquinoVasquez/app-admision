import React from "react";

const ProgressBar = ({ value, maxValue }) => {
  const percentage = Math.min((value / maxValue) * 100, 100); // Asegura que no exceda el 100%

  return (
    <div style={{ width: "100%", backgroundColor: "#e0e0e0", borderRadius: "10px", height: "10px" }}>
      <div
        style={{
          width: `${percentage}%`,
          backgroundColor: "#4caf50",
          height: "100%",
          borderRadius: "10px",
        }}
      />
    </div>
  );
};

export default ProgressBar;
