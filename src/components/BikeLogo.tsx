import React from 'react';

interface BikeLogoProps {
  className?: string;
  size?: number;
}

export default function BikeLogo({ className = '', size = 56 }: BikeLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 240 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Rich Cherry & Crimson Metallic Gradients */}
        <linearGradient id="cherryChassis" x1="10" y1="20" x2="230" y2="140" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#C4386C" />
          <stop offset="45%" stopColor="#8C254F" />
          <stop offset="85%" stopColor="#581C38" />
          <stop offset="100%" stopColor="#3F1227" />
        </linearGradient>

        <linearGradient id="accentSilver" x1="0" y1="0" x2="240" y2="160" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="50%" stopColor="#F5C2D2" />
          <stop offset="100%" stopColor="#A82B5E" />
        </linearGradient>

        <linearGradient id="wheelRimGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#A82B5E" />
          <stop offset="100%" stopColor="#3F1227" />
        </linearGradient>

        <filter id="superbikeDropShadow" x="-10%" y="-10%" width="125%" height="125%">
          <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#3F1227" floodOpacity="0.35" />
        </filter>
      </defs>

      <g filter="url(#superbikeDropShadow)">
        {/* Front Wheel Rim (Hexagonal Sharp Geometric Rim) */}
        <path
          d="M 50 140 L 22 112 L 22 76 L 50 48 L 78 76 L 78 112 Z"
          stroke="url(#accentSilver)"
          strokeWidth="6.5"
          strokeLinejoin="miter"
          fill="none"
        />

        {/* Front Wheel Brake Disc & Spokes */}
        <polygon points="50,70 60,80 60,108 50,118 40,108 40,80" fill="#8C254F" opacity="0.9" />
        <circle cx="50" cy="94" r="9" fill="#F5C2D2" />

        {/* Rear Wheel Rim (Hexagonal Sharp Geometric Rim) */}
        <path
          d="M 190 140 L 162 112 L 162 76 L 190 48 L 218 76 L 218 112 Z"
          stroke="url(#accentSilver)"
          strokeWidth="6.5"
          strokeLinejoin="miter"
          fill="none"
        />

        {/* Rear Wheel Brake Disc & Spokes */}
        <polygon points="190,70 200,80 200,108 190,118 180,108 180,80" fill="#8C254F" opacity="0.9" />
        <circle cx="190" cy="94" r="9" fill="#F5C2D2" />

        {/* --- Sharp Racing Bodywork (Integrating "R" & "A" Monogram) --- */}

        {/* "R" Front Fairing, Windscreen & Fuel Tank Assembly */}
        <path
          d="M 28 85 L 62 25 L 118 25 L 132 55 L 85 55 L 118 120 L 92 120 L 68 74 L 56 74 L 56 120 L 30 120 Z"
          fill="url(#cherryChassis)"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          strokeLinejoin="miter"
        />

        {/* "R" Inner Loop Cutout */}
        <polygon points="56,42 98,42 84,60 56,60" fill="#FDF0F3" opacity="0.95" />

        {/* "A" Rear Frame & High-Angle Tail Cowl Assembly */}
        <path
          d="M 125 25 L 180 120 L 155 120 L 144 98 L 110 98 L 126 66 L 150 66 L 138 45 L 125 25 Z"
          fill="url(#accentSilver)"
          stroke="#581C38"
          strokeWidth="1.5"
          strokeLinejoin="miter"
        />

        {/* "A" Inner Triangle Cutout */}
        <polygon points="127,72 137,90 117,90" fill="#3F1227" />

        {/* Sharp Windscreen / Front Visor Slash */}
        <polygon points="70,18 122,18 108,30 58,30" fill="#FFFFFF" opacity="0.9" />

        {/* Upswept Sharp Performance Exhaust Pipe */}
        <path
          d="M 85 105 L 165 65 L 175 75 L 95 115 Z"
          fill="url(#cherryChassis)"
          stroke="#F5C2D2"
          strokeWidth="1"
        />

        {/* Sharp Aero Winglets / Speed Slashes */}
        <polygon points="10,94 230,94 215,102 25,102" fill="#C4386C" opacity="0.95" />
      </g>
    </svg>
  );
}
