import React, { useEffect, useState } from 'react';
import { LionAnimationState } from '../types';

interface BabyLionProps {
  state: LionAnimationState;
  direction?: 'left' | 'right';
  scale?: number;
  className?: string;
  onClick?: () => void;
  showBadge?: boolean;
}

export const BabyLion: React.FC<BabyLionProps> = ({
  state = 'idle',
  direction = 'right',
  scale = 1,
  className = '',
  onClick,
  showBadge = false,
}) => {
  const [blink, setBlink] = useState(false);
  const [tailWag, setTailWag] = useState(0);

  // Periodic blinking effect for life-like cute expression
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 180);
    }, 3200 + Math.random() * 1500);

    return () => clearInterval(blinkInterval);
  }, []);

  // Tail wagging animation loop
  useEffect(() => {
    let animFrame: number;
    let t = 0;
    const loop = () => {
      t += 0.05;
      setTailWag(Math.sin(t) * 12);
      animFrame = requestAnimationFrame(loop);
    };
    animFrame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrame);
  }, []);

  const isWalking = state === 'walk' || state === 'run';
  const isJumping = state === 'jump';
  const isRoaring = state === 'roar';
  const isCelebrating = state === 'celebrate';

  return (
    <div
      id="baby-lion-character"
      onClick={onClick}
      className={`relative inline-block select-none cursor-pointer transition-transform duration-200 ${className}`}
      style={{
        transform: `scaleX(${direction === 'left' ? -scale : scale}) scaleY(${scale})`,
        transformOrigin: 'bottom center',
      }}
      title="Tap me to hear my roar!"
    >
      {/* Visual celebration particles / roar shockwaves */}
      {isRoaring && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex items-center gap-1.5 animate-bounce z-20 pointer-events-none">
          <span className="bg-amber-500 text-white font-black text-xs px-2.5 py-1 rounded-full shadow-md border-2 border-amber-300 tracking-wider">
            ROAAAR! 🦁✨
          </span>
        </div>
      )}

      {isCelebrating && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex gap-1 z-20 pointer-events-none animate-pulse">
          <span className="text-xl">⭐</span>
          <span className="text-lg">💖</span>
          <span className="text-xl">✨</span>
        </div>
      )}

      {/* SVG Cartoon Baby Lion closely matching the user's reference photo */}
      <svg
        viewBox="0 0 240 250"
        width={180 * scale}
        height={187.5 * scale}
        className={`overflow-visible filter drop-shadow-md ${
          isWalking ? 'animate-bounce-subtle' : ''
        } ${isJumping ? '-translate-y-8 transition-transform duration-300' : ''}`}
      >
        <defs>
          {/* Gradients for rich cartoon depth */}
          <radialGradient id="lionManeGrad" cx="50%" cy="45%" r="60%">
            <stop offset="0%" stopColor="#D35400" />
            <stop offset="70%" stopColor="#BA4A00" />
            <stop offset="100%" stopColor="#933500" />
          </radialGradient>

          <linearGradient id="lionFurGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FAD7A0" />
            <stop offset="40%" stopColor="#F5B041" />
            <stop offset="100%" stopColor="#E59866" />
          </linearGradient>

          <linearGradient id="lionChestGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#FFF2D6" />
          </linearGradient>

          <radialGradient id="innerEarGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F9D7C4" />
            <stop offset="100%" stopColor="#EAA585" />
          </radialGradient>

          <filter id="lionGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#B85316" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Shadow underneath */}
        <ellipse
          cx="120"
          cy="236"
          rx={isJumping ? 35 : isWalking ? 48 : 55}
          ry={isJumping ? 8 : 14}
          fill="#000000"
          fillOpacity={isJumping ? 0.12 : 0.22}
          className="transition-all duration-300"
        />

        {/* Optional decorative Growup Jr. circle badge style if requested */}
        {showBadge && (
          <circle
            cx="120"
            cy="125"
            r="115"
            fill="none"
            stroke="#2E7D32"
            strokeWidth="3"
            strokeDasharray="4 2"
            opacity="0.25"
          />
        )}

        {/* TAIL */}
        <g
          id="lion-tail"
          style={{
            transformOrigin: '78px 185px',
            transform: `rotate(${tailWag + (isWalking ? 15 : 0)}deg)`,
            transition: 'transform 0.15s ease-out',
          }}
        >
          {/* Tail curve curving to the right */}
          <path
            d="M 155 185 Q 200 180 205 140 Q 208 120 195 110"
            fill="none"
            stroke="#F5B041"
            strokeWidth="10"
            strokeLinecap="round"
          />
          {/* Fluffy tail tuft with caramel brown */}
          <path
            d="M 195 112 C 185 105 180 90 192 82 C 205 75 220 92 215 108 C 212 118 202 122 195 112 Z"
            fill="url(#lionManeGrad)"
            stroke="#6E2C00"
            strokeWidth="2"
          />
          {/* Tail tuft hair detail */}
          <path
            d="M 192 98 Q 202 96 208 106"
            stroke="#E59866"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </g>

        {/* BACK LEGS / HIPS */}
        <g id="lion-back-legs">
          {/* Left Back Leg */}
          <path
            d="M 68 175 C 50 178 45 200 52 220 C 56 228 68 232 82 230 C 95 228 98 215 92 195 C 88 180 78 174 68 175 Z"
            fill="url(#lionFurGrad)"
            stroke="#B85316"
            strokeWidth="2.5"
          />
          {/* Left Back Paw Toes */}
          <path d="M 62 230 Q 64 220 68 230 M 74 231 Q 76 220 80 230" stroke="#B85316" strokeWidth="2" fill="none" />

          {/* Right Back Leg */}
          <path
            d="M 172 175 C 190 178 195 200 188 220 C 184 228 172 232 158 230 C 145 228 142 215 148 195 C 152 180 162 174 172 175 Z"
            fill="url(#lionFurGrad)"
            stroke="#B85316"
            strokeWidth="2.5"
          />
          {/* Right Back Paw Toes */}
          <path d="M 178 230 Q 176 220 172 230 M 166 231 Q 164 220 160 230" stroke="#B85316" strokeWidth="2" fill="none" />
        </g>

        {/* MAIN BODY */}
        <g id="lion-body">
          {/* Chubby round body */}
          <ellipse
            cx="120"
            cy="176"
            rx="52"
            ry="46"
            fill="url(#lionFurGrad)"
            stroke="#B85316"
            strokeWidth="2.5"
          />
          {/* Light cream tummy patch */}
          <path
            d="M 95 158 C 95 140 145 140 145 158 C 148 185 142 215 120 216 C 98 215 92 185 95 158 Z"
            fill="url(#lionChestGrad)"
            opacity="0.95"
          />
        </g>

        {/* FRONT PAWS (Animated for walking cycle) */}
        <g id="lion-front-paws">
          {/* Left Front Leg & Paw */}
          <g
            id="left-paw"
            className={isWalking ? 'animate-paw-left' : ''}
            style={{ transformOrigin: '92px 170px' }}
          >
            <path
              d="M 86 168 L 84 220 C 84 228 92 234 102 234 C 112 234 118 228 116 220 L 110 168 Z"
              fill="url(#lionFurGrad)"
              stroke="#B85316"
              strokeWidth="2.5"
            />
            {/* Paw toes */}
            <path d="M 91 233 L 91 224 M 99 234 L 99 223 M 107 233 L 107 224" stroke="#B85316" strokeWidth="2" strokeLinecap="round" />
            {/* Cute soft toe cushions */}
            <ellipse cx="100" cy="226" rx="9" ry="5" fill="#FFF2D6" opacity="0.6" />
          </g>

          {/* Right Front Leg & Paw */}
          <g
            id="right-paw"
            className={isWalking ? 'animate-paw-right' : ''}
            style={{ transformOrigin: '148px 170px' }}
          >
            <path
              d="M 154 168 L 156 220 C 156 228 148 234 138 234 C 128 234 122 228 124 220 L 130 168 Z"
              fill="url(#lionFurGrad)"
              stroke="#B85316"
              strokeWidth="2.5"
            />
            {/* Paw toes */}
            <path d="M 149 233 L 149 224 M 141 234 L 141 223 M 133 233 L 133 224" stroke="#B85316" strokeWidth="2" strokeLinecap="round" />
            {/* Cute soft toe cushions */}
            <ellipse cx="140" cy="226" rx="9" ry="5" fill="#FFF2D6" opacity="0.6" />
          </g>
        </g>

        {/* HEAD & MANE GROUP (Subtle head tilt or bob) */}
        <g
          id="lion-head-group"
          className={`${isWalking ? 'animate-head-bob' : ''} ${isRoaring ? 'scale-105' : ''}`}
          style={{ transformOrigin: '120px 105px', transition: 'transform 0.2s' }}
        >
          {/* EARS (Behind the front mane layer) */}
          <g id="lion-ears">
            {/* Left Ear */}
            <g id="left-ear">
              <ellipse
                cx="64"
                cy="64"
                rx="24"
                ry="24"
                fill="url(#lionFurGrad)"
                stroke="#B85316"
                strokeWidth="2.5"
              />
              <ellipse
                cx="66"
                cy="64"
                rx="15"
                ry="15"
                fill="url(#innerEarGrad)"
                stroke="#D35400"
                strokeWidth="1.5"
              />
            </g>

            {/* Right Ear */}
            <g id="right-ear">
              <ellipse
                cx="176"
                cy="64"
                rx="24"
                ry="24"
                fill="url(#lionFurGrad)"
                stroke="#B85316"
                strokeWidth="2.5"
              />
              <ellipse
                cx="174"
                cy="64"
                rx="15"
                ry="15"
                fill="url(#innerEarGrad)"
                stroke="#D35400"
                strokeWidth="1.5"
              />
            </g>
          </g>

          {/* FLUFFY MANE (Warm reddish-caramel cloud of tufts framing head like reference photo) */}
          <path
            id="lion-mane"
            d="
              M 120 18
              C 134 18 144 26 154 28
              C 168 30 180 40 186 52
              C 194 62 195 72 202 82
              C 210 94 212 110 205 124
              C 198 138 194 148 186 158
              C 176 170 160 178 146 182
              C 135 185 125 186 120 186
              C 115 186 105 185 94 182
              C 80 178 64 170 54 158
              C 46 148 42 138 35 124
              C 28 110 30 94 38 82
              C 45 72 46 62 54 52
              C 60 40 72 30 86 28
              C 96 26 106 18 120 18 Z
            "
            fill="url(#lionManeGrad)"
            stroke="#873600"
            strokeWidth="3"
            filter="url(#lionGlow)"
          />

          {/* Additional fluffy locks / mane texture points */}
          <g fill="#A04000" opacity="0.35">
            <path d="M 60 46 Q 72 40 85 45 Q 70 54 60 46 Z" />
            <path d="M 180 46 Q 168 40 155 45 Q 170 54 180 46 Z" />
            <path d="M 36 105 Q 46 112 40 125 Q 32 115 36 105 Z" />
            <path d="M 204 105 Q 194 112 200 125 Q 208 115 204 105 Z" />
          </g>

          {/* Golden tuft hair on top */}
          <path
            d="M 112 36 C 114 26 126 26 128 36 C 132 28 140 32 138 42 C 130 42 120 44 112 36 Z"
            fill="#F5B041"
          />

          {/* ROUND LION FACE */}
          <ellipse
            id="lion-face"
            cx="120"
            cy="104"
            rx="56"
            ry="52"
            fill="url(#lionFurGrad)"
            stroke="#B85316"
            strokeWidth="2.5"
          />

          {/* SOFT CHEEKS (Blush) */}
          <ellipse cx="80" cy="116" rx="10" ry="6" fill="#F1948A" opacity="0.45" />
          <ellipse cx="160" cy="116" rx="10" ry="6" fill="#F1948A" opacity="0.45" />

          {/* EYES */}
          <g id="lion-eyes">
            {/* Left Eye */}
            <g id="left-eye">
              {blink ? (
                // Blinking curved line
                <path
                  d="M 84 96 Q 95 106 106 96"
                  fill="none"
                  stroke="#2C3E50"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              ) : (
                <>
                  {/* Eye socket / background */}
                  <ellipse cx="95" cy="94" rx="13" ry="15" fill="#1C2833" />
                  {/* Iris warm ring */}
                  <ellipse cx="95" cy="94" rx="11" ry="13" fill="#2E4053" />
                  <ellipse cx="95" cy="94" rx="8" ry="10" fill="#17202A" />
                  {/* Big cute top highlight */}
                  <circle cx="91" cy="88" r="4.5" fill="#FFFFFF" />
                  {/* Smaller bottom sparkle */}
                  <circle cx="100" cy="98" r="2.2" fill="#FFFFFF" />
                </>
              )}
              {/* Eyebrow */}
              <path
                d="M 85 78 Q 95 72 105 77"
                fill="none"
                stroke="#7E5109"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </g>

            {/* Right Eye */}
            <g id="right-eye">
              {blink ? (
                <path
                  d="M 134 96 Q 145 106 156 96"
                  fill="none"
                  stroke="#2C3E50"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              ) : (
                <>
                  <ellipse cx="145" cy="94" rx="13" ry="15" fill="#1C2833" />
                  <ellipse cx="145" cy="94" rx="11" ry="13" fill="#2E4053" />
                  <ellipse cx="145" cy="94" rx="8" ry="10" fill="#17202A" />
                  <circle cx="141" cy="88" r="4.5" fill="#FFFFFF" />
                  <circle cx="150" cy="98" r="2.2" fill="#FFFFFF" />
                </>
              )}
              {/* Eyebrow */}
              <path
                d="M 135 77 Q 145 72 155 78"
                fill="none"
                stroke="#7E5109"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </g>
          </g>

          {/* CREAM MUZZLE & NOSE (Exactly like the smiling cub in photo) */}
          <g id="lion-muzzle">
            {/* White/cream heart-shaped muzzle pad */}
            <path
              d="
                M 120 106
                C 108 106 95 112 95 125
                C 95 137 108 144 120 144
                C 132 144 145 137 145 125
                C 145 112 132 106 120 106 Z
              "
              fill="url(#lionChestGrad)"
              stroke="#E59866"
              strokeWidth="1.5"
            />

            {/* Cute black/dark brown nose */}
            <path
              d="M 112 110 C 112 106 128 106 128 110 C 128 117 122 121 120 121 C 118 121 112 117 112 110 Z"
              fill="#212F3D"
            />
            {/* Nose shine */}
            <ellipse cx="118" cy="109" rx="3" ry="1.2" fill="#FFFFFF" opacity="0.6" />

            {/* Smiling mouth line */}
            {isRoaring ? (
              // Open mouth roar!
              <g>
                <path
                  d="M 112 122 Q 120 142 128 122 Z"
                  fill="#922B21"
                  stroke="#212F3D"
                  strokeWidth="2"
                />
                <ellipse cx="120" cy="132" rx="4" ry="3" fill="#F1948A" />
              </g>
            ) : (
              // Sweet warm smile
              <path
                d="M 120 121 L 120 127 M 120 127 Q 112 135 106 128 M 120 127 Q 128 135 134 128"
                fill="none"
                stroke="#2C3E50"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            )}

            {/* Whiskers dots */}
            <circle cx="105" cy="122" r="1" fill="#7E5109" />
            <circle cx="102" cy="126" r="1" fill="#7E5109" />
            <circle cx="135" cy="122" r="1" fill="#7E5109" />
            <circle cx="138" cy="126" r="1" fill="#7E5109" />
          </g>
        </g>
      </svg>
    </div>
  );
};
