import React from "react";

const LogoHexagon = () => (
  <svg width="40" height="40" viewBox="0 0 100 100" aria-label="K.W logo">
    <polygon
      points="50,5 90,27.5 90,72.5 50,95 10,72.5 10,27.5"
      fill="#ffffff"
    />
    <text
      x="50"
      y="58"
      textAnchor="middle"
      fontSize="26"
      fill="#005d55"
      fontFamily="system-ui, sans-serif"
      fontWeight="600"
    >
      K.W
    </text>
  </svg>
);

export default LogoHexagon;