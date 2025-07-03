import React, { useEffect, useState } from 'react';

const AguardienteIcon = () => {
  const [fillHeight, setFillHeight] = useState(0);

  useEffect(() => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 2;
      setFillHeight(progress);
      if (progress >= 100) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <svg
      viewBox="0 0 100 200"
      width="80"
      height="160"
      xmlns="http://www.w3.org/2000/svg"
      className="animate-pulse"
    >
      {/* Botella */}
      <path
        d="M30,10 Q50,0 70,10 L70,150 Q70,180 50,190 Q30,180 30,150 Z"
        fill="#e0e0e0"
        stroke="#4caf50"
        strokeWidth="2"
      />

      {/* Líquido (llenado animado) */}
      <clipPath id="bottleClip">
        <path d="M30,10 Q50,0 70,10 L70,150 Q70,180 50,190 Q30,180 30,150 Z" />
      </clipPath>
      <rect
        x="30"
        y={150 - (fillHeight * 1.2)}
        width="40"
        height={fillHeight * 1.2}
        fill="#41BC41"
        clipPath="url(#bottleClip)"
      />

      {/* Etiqueta estilo Aguardiente */}
      <rect x="35" y="60" width="30" height="20" rx="2" fill="white" stroke="#ccc" />
      <text x="50" y="72" fontSize="4" fill="black" textAnchor="middle" fontWeight="bold">
        Aguardiente
      </text>
      <text x="50" y="77" fontSize="4" fill="red" textAnchor="middle" fontWeight="bold">
        Antioqueño
      </text>
    </svg>
  );
};

export default AguardienteIcon;
