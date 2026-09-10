import React from 'react';

interface AnimalIllustrationProps {
  type: string;
  className?: string;
  size?: number;
}

export const AnimalIllustration: React.FC<AnimalIllustrationProps> = ({
  type,
  className = '',
  size = 200,
}) => {
  switch (type) {
    case 'stripes':
    case 'zebra_pattern':
      return (
        <svg viewBox="0 0 200 200" width={size} height={size} className={`rounded-2xl border-4 border-white shadow-lg overflow-hidden ${className}`}>
          <rect width="200" height="200" fill="#FFFFFF" />
          <path d="M -20 20 Q 80 40 220 10 L 220 35 Q 80 65 -20 45 Z" fill="#1C2833" />
          <path d="M -20 70 Q 100 80 220 60 L 220 85 Q 100 105 -20 95 Z" fill="#1C2833" />
          <path d="M -20 120 Q 90 140 220 115 L 220 145 Q 90 165 -20 145 Z" fill="#1C2833" />
          <path d="M -20 170 Q 110 180 220 165 L 220 195 Q 110 205 -20 195 Z" fill="#1C2833" />
          <circle cx="100" cy="100" r="95" fill="none" stroke="#F1C40F" strokeWidth="6" opacity="0.3" />
        </svg>
      );

    case 'cheetah_spots':
    case 'spots':
      return (
        <svg viewBox="0 0 200 200" width={size} height={size} className={`rounded-2xl border-4 border-white shadow-lg overflow-hidden ${className}`}>
          <rect width="200" height="200" fill="#F4D03F" />
          <g fill="#1A1A1A">
            <circle cx="35" cy="35" r="10" />
            <circle cx="85" cy="25" r="8" />
            <circle cx="145" cy="35" r="11" />
            <circle cx="185" cy="45" r="7" />
            <circle cx="45" cy="85" r="12" />
            <circle cx="105" cy="75" r="9" />
            <circle cx="165" cy="90" r="11" />
            <circle cx="30" cy="140" r="8" />
            <circle cx="80" cy="135" r="12" />
            <circle cx="135" cy="130" r="9" />
            <circle cx="180" cy="145" r="10" />
            <circle cx="50" cy="180" r="10" />
            <circle cx="115" cy="180" r="11" />
            <circle cx="165" cy="185" r="8" />
          </g>
        </svg>
      );

    case 'giraffe_mesh':
    case 'mesh':
      return (
        <svg viewBox="0 0 200 200" width={size} height={size} className={`rounded-2xl border-4 border-white shadow-lg overflow-hidden ${className}`}>
          <rect width="200" height="200" fill="#FDEBD0" />
          {/* Giraffe geometric polygonal patches */}
          <polygon points="20,15 75,10 80,60 15,65" fill="#BA4A00" rx="6" />
          <polygon points="95,15 185,20 180,65 90,60" fill="#A04000" />
          <polygon points="20,80 80,75 85,130 15,125" fill="#A04000" />
          <polygon points="100,75 185,80 180,135 95,130" fill="#BA4A00" />
          <polygon points="20,145 80,145 75,190 20,190" fill="#BA4A00" />
          <polygon points="95,145 185,150 180,195 90,190" fill="#A04000" />
        </svg>
      );

    case 'tiger_stripes':
      return (
        <svg viewBox="0 0 200 200" width={size} height={size} className={`rounded-2xl border-4 border-white shadow-lg overflow-hidden ${className}`}>
          <rect width="200" height="200" fill="#E67E22" />
          <path d="M 0 30 Q 80 50 120 40 Q 80 25 0 20 Z" fill="#1C2833" />
          <path d="M 200 60 Q 120 70 80 60 Q 120 85 200 80 Z" fill="#1C2833" />
          <path d="M 0 110 Q 70 130 130 115 Q 70 100 0 100 Z" fill="#1C2833" />
          <path d="M 200 140 Q 110 155 70 145 Q 110 165 200 160 Z" fill="#1C2833" />
          <path d="M 0 175 Q 90 190 140 180 Q 90 165 0 170 Z" fill="#1C2833" />
        </svg>
      );

    case 'peacock_feathers':
    case 'feathers':
      return (
        <svg viewBox="0 0 200 200" width={size} height={size} className={`rounded-2xl border-4 border-white shadow-lg overflow-hidden ${className}`}>
          <rect width="200" height="200" fill="#117864" />
          <g transform="translate(100, 100)">
            {/* Peacock eye feather detail */}
            <ellipse cx="0" cy="0" rx="75" ry="90" fill="#16A085" />
            <ellipse cx="0" cy="0" rx="55" ry="68" fill="#F4D03F" />
            <ellipse cx="0" cy="0" rx="38" ry="46" fill="#2980B9" />
            <ellipse cx="0" cy="5" rx="20" ry="24" fill="#1B2631" />
            <circle cx="4" cy="-3" r="5" fill="#FFFFFF" opacity="0.8" />
          </g>
        </svg>
      );

    case 'elephant':
      return (
        <svg viewBox="0 0 200 200" width={size} height={size} className={className}>
          <rect width="200" height="200" rx="24" fill="#E8F8F5" />
          <circle cx="100" cy="90" r="45" fill="#95A5A6" />
          <ellipse cx="60" cy="85" rx="22" ry="32" fill="#7F8C8D" />
          <ellipse cx="62" cy="85" rx="14" ry="20" fill="#FADBD8" />
          <path d="M 120 95 C 135 110 150 145 130 165 C 115 175 105 155 112 142 C 115 135 110 125 105 125" fill="none" stroke="#7F8C8D" strokeWidth="14" strokeLinecap="round" />
          <circle cx="112" cy="80" r="5" fill="#2C3E50" />
          <circle cx="114" cy="78" r="1.5" fill="#FFFFFF" />
          {/* Tusk */}
          <path d="M 112 110 Q 128 115 132 105 Q 124 102 112 106 Z" fill="#FCF3CF" />
        </svg>
      );

    case 'giraffe':
      return (
        <svg viewBox="0 0 200 200" width={size} height={size} className={className}>
          <rect width="200" height="200" rx="24" fill="#FEF9E7" />
          {/* Long neck */}
          <path d="M 90 60 L 80 180 L 120 180 L 110 60 Z" fill="#F9E79F" />
          {/* Giraffe head */}
          <ellipse cx="100" cy="50" rx="25" ry="18" fill="#F9E79F" />
          {/* Ossicones */}
          <line x1="95" y1="36" x2="92" y2="20" stroke="#BA4A00" strokeWidth="4" strokeLinecap="round" />
          <circle cx="92" cy="18" r="4" fill="#BA4A00" />
          <line x1="108" y1="36" x2="111" y2="20" stroke="#BA4A00" strokeWidth="4" strokeLinecap="round" />
          <circle cx="111" cy="18" r="4" fill="#BA4A00" />
          {/* Eye */}
          <circle cx="110" cy="46" r="4" fill="#2C3E50" />
          <circle cx="111" cy="44" r="1.5" fill="#FFFFFF" />
          {/* Spots */}
          <ellipse cx="98" cy="80" rx="8" ry="12" fill="#BA4A00" />
          <ellipse cx="102" cy="115" rx="9" ry="14" fill="#BA4A00" />
          <ellipse cx="96" cy="150" rx="11" ry="15" fill="#BA4A00" />
        </svg>
      );

    case 'zebra':
      return (
        <svg viewBox="0 0 200 200" width={size} height={size} className={className}>
          <rect width="200" height="200" rx="24" fill="#F2F4F4" />
          <circle cx="100" cy="95" r="46" fill="#FDFEFE" stroke="#BDC3C7" strokeWidth="2" />
          {/* Stripes on face */}
          <path d="M 75 75 Q 95 85 95 60" fill="none" stroke="#2C3E50" strokeWidth="5" strokeLinecap="round" />
          <path d="M 125 75 Q 105 85 105 60" fill="none" stroke="#2C3E50" strokeWidth="5" strokeLinecap="round" />
          <path d="M 70 100 Q 90 105 85 120" fill="none" stroke="#2C3E50" strokeWidth="5" strokeLinecap="round" />
          <path d="M 130 100 Q 110 105 115 120" fill="none" stroke="#2C3E50" strokeWidth="5" strokeLinecap="round" />
          {/* Spiky mane */}
          <path d="M 90 50 L 93 30 L 98 48 L 103 28 L 107 48" fill="none" stroke="#17202A" strokeWidth="4" strokeLinecap="round" />
          {/* Cute muzzle */}
          <ellipse cx="100" cy="118" rx="18" ry="12" fill="#566573" />
          <circle cx="88" cy="90" r="5" fill="#1C2833" />
          <circle cx="89" cy="88" r="1.5" fill="#FFFFFF" />
          <circle cx="112" cy="90" r="5" fill="#1C2833" />
          <circle cx="113" cy="88" r="1.5" fill="#FFFFFF" />
        </svg>
      );

    case 'monkey':
      return (
        <svg viewBox="0 0 200 200" width={size} height={size} className={className}>
          <rect width="200" height="200" rx="24" fill="#FEF5E7" />
          {/* Ears */}
          <circle cx="55" cy="90" r="18" fill="#795548" />
          <circle cx="55" cy="90" r="10" fill="#FFCCBC" />
          <circle cx="145" cy="90" r="18" fill="#795548" />
          <circle cx="145" cy="90" r="10" fill="#FFCCBC" />
          {/* Head */}
          <circle cx="100" cy="95" r="45" fill="#795548" />
          {/* Face mask */}
          <ellipse cx="100" cy="100" rx="32" ry="26" fill="#FFE0B2" />
          <circle cx="88" cy="94" r="5" fill="#3E2723" />
          <circle cx="112" cy="94" r="5" fill="#3E2723" />
          <ellipse cx="100" cy="112" rx="4" ry="2.5" fill="#5D4037" />
          <path d="M 94 116 Q 100 124 106 116" fill="none" stroke="#3E2723" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    default: // lion
      return (
        <svg viewBox="0 0 200 200" width={size} height={size} className={className}>
          <rect width="200" height="200" rx="24" fill="#FEF9E7" />
          {/* Lion mane */}
          <circle cx="100" cy="95" r="58" fill="#D35400" />
          {/* Lion face */}
          <circle cx="100" cy="95" r="40" fill="#F5B041" />
          <ellipse cx="100" cy="108" rx="18" ry="14" fill="#FEF9E7" />
          {/* Nose */}
          <polygon points="95,102 105,102 100,108" fill="#1C2833" />
          {/* Eyes */}
          <circle cx="86" cy="90" r="5" fill="#1C2833" />
          <circle cx="87" cy="88" r="1.5" fill="#FFFFFF" />
          <circle cx="114" cy="90" r="5" fill="#1C2833" />
          <circle cx="115" cy="88" r="1.5" fill="#FFFFFF" />
          {/* Smile */}
          <path d="M 95 112 Q 100 117 105 112" fill="none" stroke="#1C2833" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
  }
};
