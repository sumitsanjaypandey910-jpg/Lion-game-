import React, { useState, useRef, useEffect } from 'react';
import { COLORING_TEMPLATES } from '../data/gameData';
import { ColoringTemplate } from '../types';
import { BabyLion } from './BabyLion';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  Paintbrush,
  PaintBucket,
  RotateCcw,
  Sparkles,
  Download,
  ArrowLeft,
  CheckCircle2,
  Heart,
  Star,
} from 'lucide-react';

interface ColoringGameProps {
  onBackToWalk: () => void;
  onRewardEarned: (stars: number, coins: number) => void;
}

const PALETTE = [
  '#F5B041', '#E59866', '#D35400', '#BA4A00', '#935116',
  '#F4D03F', '#F9E79F', '#FEF9E7', '#FDFEFE', '#BDC3C7',
  '#85929E', '#34495E', '#1C2833', '#58D68D', '#28B463',
  '#5DADE2', '#2E86C1', '#AF7AC5', '#884EA0', '#F1948A',
  '#E74C3C', '#C0392B', '#FF7675', '#FAB1A0',
];

const STICKERS = ['⭐', '🐾', '💖', '🌿', '🌸', '🥭', '👑', '✨'];

export const ColoringGame: React.FC<ColoringGameProps> = ({
  onBackToWalk,
  onRewardEarned,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<ColoringTemplate>(COLORING_TEMPLATES[0]);
  const [activeColor, setActiveColor] = useState<string>('#F5B041');
  const [mode, setMode] = useState<'fill' | 'brush' | 'sticker'>('fill');
  const [brushSize, setBrushSize] = useState<number>(12);
  const [selectedSticker, setSelectedSticker] = useState<string>('⭐');
  
  // Fill colors mapping for each SVG part ID
  const [partColors, setPartColors] = useState<Record<string, string>>({});
  const [history, setHistory] = useState<Record<string, string>[]>([]);
  const [lionCheer, setLionCheer] = useState<boolean>(false);

  // Freehand drawing canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [placedStickers, setPlacedStickers] = useState<{ id: number; x: number; y: number; sticker: string }[]>([]);

  // Initialize default colors when template changes
  useEffect(() => {
    const initialColors: Record<string, string> = {};
    selectedTemplate.parts.forEach((p) => {
      initialColors[p.id] = '#FFFFFF';
    });
    setPartColors(initialColors);
    setHistory([]);
    setPlacedStickers([]);
    clearCanvas();
  }, [selectedTemplate]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const handlePartClick = (partId: string) => {
    if (mode !== 'fill') return;
    sounds.playColorPop();
    setHistory((prev) => [...prev, { ...partColors }]);
    setPartColors((prev) => ({
      ...prev,
      [partId]: activeColor,
    }));
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    sounds.playClick();
    const previous = history[history.length - 1];
    setPartColors(previous);
    setHistory((prev) => prev.slice(0, prev.length - 1));
  };

  const handleReset = () => {
    sounds.playRetry();
    const resetColors: Record<string, string> = {};
    selectedTemplate.parts.forEach((p) => {
      resetColors[p.id] = '#FFFFFF';
    });
    setPartColors(resetColors);
    setHistory([]);
    setPlacedStickers([]);
    clearCanvas();
  };

  // Canvas freehand drawing handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (mode === 'sticker') {
      placeStickerAt(e);
      return;
    }
    if (mode !== 'brush') return;
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing && e.type !== 'mousedown' && e.type !== 'touchstart') return;
    if (mode !== 'brush') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;

    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    const x = (clientX - rect.left) * (canvas.width / rect.width);
    const y = (clientY - rect.top) * (canvas.height / rect.height);

    ctx.fillStyle = activeColor;
    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
    ctx.fill();
  };

  const placeStickerAt = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    sounds.playColorPop();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;

    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;

    setPlacedStickers((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), x, y, sticker: selectedSticker },
    ]);
  };

  const handleShowToLion = () => {
    sounds.playSuccess();
    sounds.playRoar();
    setLionCheer(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
    onRewardEarned(3, 20);

    setTimeout(() => {
      setLionCheer(false);
    }, 3500);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-3 sm:p-5 flex flex-col gap-4">
      {/* Top Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/95 backdrop-blur-sm p-3.5 sm:p-4 rounded-2xl shadow-sm border border-amber-200">
        <div className="flex items-center gap-3">
          <button
            id="back-to-safari-btn"
            onClick={() => {
              sounds.playClick();
              onBackToWalk();
            }}
            onMouseEnter={() => sounds.playHover()}
            className="flex items-center gap-1.5 px-3 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold rounded-xl transition cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Back to Trail</span>
          </button>

          <div>
            <h2 className="text-lg sm:text-2xl font-black text-amber-900 flex items-center gap-2">
              <span>🎨 Safari Coloring Studio</span>
            </h2>
            <p className="text-xs sm:text-sm text-amber-700 font-semibold">
              Color {selectedTemplate.name}! Tap any part to fill or doodle freely.
            </p>
          </div>
        </div>

        {/* Template Selector Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full">
          {COLORING_TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.id}
              id={`tmpl-btn-${tmpl.id}`}
              onClick={() => {
                sounds.playClick();
                setSelectedTemplate(tmpl);
              }}
              onMouseEnter={() => sounds.playHover()}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition cursor-pointer ${
                selectedTemplate.id === tmpl.id
                  ? 'bg-amber-500 text-white shadow-md'
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              <span className="text-base">{tmpl.icon}</span>
              <span>{tmpl.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Studio Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left / Center: The Coloring Canvas Area */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center bg-white rounded-3xl p-4 shadow-sm border-2 border-amber-200 relative overflow-hidden min-h-[440px]">
          {/* Subtle safari decorative background */}
          <div className="absolute inset-0 bg-radial from-amber-50/50 via-white to-amber-50/30 pointer-events-none" />

          {/* Interactive SVG Coloring Canvas */}
          <div className="relative w-full max-w-[420px] aspect-square flex items-center justify-center">
            {/* SVG Base & Colored Paths */}
            <svg
              viewBox={selectedTemplate.viewBox}
              className="w-full h-full filter drop-shadow-md select-none"
            >
              {/* Background soft circle */}
              <circle cx="200" cy="200" r="185" fill="#FFFBF0" stroke="#FCE8B2" strokeWidth="4" />

              {/* Render each animal part as clickable SVG path */}
              {selectedTemplate.parts.map((part) => {
                const fillColor = partColors[part.id] || '#FFFFFF';
                return (
                  <path
                    key={part.id}
                    id={`part-${part.id}`}
                    d={part.path}
                    fill={fillColor}
                    stroke="#2C3E50"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    onClick={() => handlePartClick(part.id)}
                    className={`${
                      mode === 'fill' ? 'cursor-pointer hover:opacity-85 transition-opacity' : ''
                    }`}
                  />
                );
              })}
            </svg>

            {/* Freehand Brush HTML5 Canvas Overlay */}
            <canvas
              ref={canvasRef}
              width={420}
              height={420}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className={`absolute inset-0 w-full h-full ${
                mode === 'brush' ? 'cursor-crosshair z-10' : mode === 'sticker' ? 'cursor-pointer z-10' : 'pointer-events-none'
              }`}
            />

            {/* Placed Stickers Overlay */}
            {placedStickers.map((st) => (
              <div
                key={st.id}
                className="absolute text-3xl pointer-events-none transform -translate-x-1/2 -translate-y-1/2 animate-bounce-subtle select-none z-15"
                style={{ left: `${st.x}%`, top: `${st.y}%` }}
              >
                {st.sticker}
              </div>
            ))}
          </div>

          {/* Canvas action bar: Undo, Reset, Show to Baby Lion */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 z-20">
            <button
              id="undo-color-btn"
              onClick={handleUndo}
              onMouseEnter={() => sounds.playHover()}
              disabled={history.length === 0}
              className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Undo
            </button>

            <button
              id="clear-color-btn"
              onClick={handleReset}
              onMouseEnter={() => sounds.playHover()}
              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 transition cursor-pointer"
            >
              Clear All
            </button>

            <button
              id="show-lion-celebrate-btn"
              onClick={handleShowToLion}
              onMouseEnter={() => sounds.playHover()}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-sm rounded-xl shadow-md transition transform hover:scale-105 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              Show to Baby Lion! 🦁
            </button>
          </div>
        </div>

        {/* Right Column: Palette & Tools & Mascot Cheer Box */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Tool Modes: Tap to Fill vs Free Brush vs Stickers */}
          <div className="bg-white p-3.5 rounded-2xl border border-amber-200 shadow-sm flex flex-col gap-2.5">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-amber-900">Coloring Tools</h3>
            <div className="grid grid-cols-3 gap-2">
              <button
                id="tool-fill-btn"
                onClick={() => {
                  sounds.playClick();
                  setMode('fill');
                }}
                onMouseEnter={() => sounds.playHover()}
                className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl font-bold text-xs gap-1 transition cursor-pointer ${
                  mode === 'fill'
                    ? 'bg-amber-500 text-white shadow'
                    : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                }`}
              >
                <PaintBucket className="w-5 h-5" />
                <span>Tap to Fill</span>
              </button>

              <button
                id="tool-brush-btn"
                onClick={() => {
                  sounds.playClick();
                  setMode('brush');
                }}
                onMouseEnter={() => sounds.playHover()}
                className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl font-bold text-xs gap-1 transition cursor-pointer ${
                  mode === 'brush'
                    ? 'bg-amber-500 text-white shadow'
                    : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                }`}
              >
                <Paintbrush className="w-5 h-5" />
                <span>Magic Pen</span>
              </button>

              <button
                id="tool-sticker-btn"
                onClick={() => {
                  sounds.playClick();
                  setMode('sticker');
                }}
                onMouseEnter={() => sounds.playHover()}
                className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl font-bold text-xs gap-1 transition cursor-pointer ${
                  mode === 'sticker'
                    ? 'bg-amber-500 text-white shadow'
                    : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                }`}
              >
                <Sparkles className="w-5 h-5" />
                <span>Stickers</span>
              </button>
            </div>

            {/* Brush thickness slider when in brush mode */}
            {mode === 'brush' && (
              <div className="flex items-center gap-2 mt-1 px-1">
                <span className="text-xs font-bold text-slate-600">Size:</span>
                <input
                  type="range"
                  min="4"
                  max="32"
                  value={brushSize}
                  onChange={(e) => setBrushSize(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <span className="text-xs font-bold text-slate-700 w-6">{brushSize}px</span>
              </div>
            )}

            {/* Sticker selector when in sticker mode */}
            {mode === 'sticker' && (
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <span className="text-xs font-bold text-slate-600 w-full">Pick a sticker to stamp:</span>
                {STICKERS.map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      sounds.playClick();
                      setSelectedSticker(st);
                    }}
                    onMouseEnter={() => sounds.playHover()}
                    className={`w-9 h-9 text-lg rounded-xl flex items-center justify-center transition cursor-pointer ${
                      selectedSticker === st ? 'bg-amber-200 ring-2 ring-amber-500 scale-110' : 'bg-slate-100 hover:bg-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Color Palette */}
          <div className="bg-white p-3.5 rounded-2xl border border-amber-200 shadow-sm flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-amber-900">Color Palette</h3>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-500">Active:</span>
                <div
                  className="w-6 h-6 rounded-full border-2 border-white shadow-sm ring-2 ring-amber-400"
                  style={{ backgroundColor: activeColor }}
                />
              </div>
            </div>

            {/* Grid of Palette Swatches */}
            <div className="grid grid-cols-6 gap-2 pt-1">
              {PALETTE.map((c) => (
                <button
                  key={c}
                  id={`color-swatch-${c.replace('#', '')}`}
                  onClick={() => {
                    sounds.playClick();
                    setActiveColor(c);
                  }}
                  onMouseEnter={() => sounds.playHover()}
                  className={`w-9 h-9 rounded-xl border-2 transition-transform cursor-pointer shadow-sm ${
                    activeColor.toLowerCase() === c.toLowerCase()
                      ? 'scale-115 ring-2 ring-slate-800 border-white z-10'
                      : 'border-white hover:scale-105'
                  }`}
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
            </div>
          </div>

          {/* Baby Lion Mascot Reaction Box */}
          <div className="bg-gradient-to-br from-amber-100 via-orange-50 to-amber-100 p-4 rounded-3xl border-2 border-amber-300 shadow-sm flex flex-col items-center text-center">
            <BabyLion
              state={lionCheer ? 'celebrate' : 'idle'}
              scale={0.8}
              onClick={() => {
                sounds.playRoar();
                setLionCheer(true);
                setTimeout(() => setLionCheer(false), 2000);
              }}
            />
            <div className="mt-1">
              <h4 className="font-black text-amber-950 text-sm">Baby Lion is watching!</h4>
              <p className="text-xs text-amber-800 font-semibold mt-0.5">
                {lionCheer
                  ? '“I LOVE your colors! You made me so handsome!” ✨'
                  : '“Pick your favorite colors and make us look safari-ready!”'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
