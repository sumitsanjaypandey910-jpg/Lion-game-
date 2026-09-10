import React, { useState } from 'react';
import { GameScreen } from '../types';
import { sounds } from '../utils/audio';
import {
  Sparkles,
  Volume2,
  VolumeX,
  Compass,
  Palette,
  Camera,
  Grid,
  HelpCircle,
  X,
  Clock,
  Gamepad2,
  Heart,
} from 'lucide-react';

interface NavigationHeaderProps {
  currentScreen: GameScreen;
  onNavigate: (screen: GameScreen) => void;
  stars: number;
  coins: number;
  distance: number;
  playTimeSeconds: number;
  timesPlayed: number;
}

export function formatHeaderTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  currentScreen,
  onNavigate,
  stars,
  coins,
  distance,
  playTimeSeconds,
  timesPlayed,
}) => {
  const [isMuted, setIsMuted] = useState<boolean>(sounds.getMuted());
  const [showHelp, setShowHelp] = useState<boolean>(false);
  const [showGiggleEffect, setShowGiggleEffect] = useState<boolean>(false);

  const handleToggleSound = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      sounds.playClick();
    }
  };

  const handleTriggerBabyGiggle = () => {
    sounds.playBabyGiggle();
    setShowGiggleEffect(true);
    setTimeout(() => setShowGiggleEffect(false), 1200);
  };

  const navItems: { id: GameScreen; label: string; icon: string }[] = [
    { id: 'walking', label: 'Safari Trail', icon: '🐾' },
    { id: 'coloring', label: 'Coloring Book', icon: '🎨' },
    { id: 'pattern', label: 'Pattern Match', icon: '🧩' },
    { id: 'photo', label: 'Photo Safari', icon: '📸' },
    { id: 'memory', label: 'Animal Pairs', icon: '🧠' },
  ];

  return (
    <header className="w-full bg-white/95 backdrop-blur-md border-b-2 border-amber-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-3 sm:px-5 py-2.5 flex flex-wrap items-center justify-between gap-2.5">
        {/* Logo & Title */}
        <div
          id="app-logo-brand"
          onClick={() => {
            sounds.playRoar();
            onNavigate('walking');
          }}
          onMouseEnter={() => sounds.playHover()}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-2xl shadow-md border-2 border-amber-300 transform group-hover:scale-105 transition">
            🦁
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-['Fredoka',sans-serif] font-black text-amber-950 text-base sm:text-lg tracking-tight">
                Baby Lion Adventure
              </span>
              <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-1.5 py-0.5 rounded-md border border-amber-300">
                JR.
              </span>
            </div>
            <p className="text-[11px] text-amber-700 font-semibold leading-none">
              Walk & Play Safari Fun
            </p>
          </div>
        </div>

        {/* Center: Main Game Tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto py-0.5">
          {navItems.map((item) => {
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => {
                  sounds.playClick();
                  onNavigate(item.id);
                }}
                onMouseEnter={() => sounds.playHover()}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm transition cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'bg-amber-50/70 text-amber-900 hover:bg-amber-100 border border-amber-200'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Stats, Play Time, Sound & Giggle Controls */}
        <div className="flex items-center gap-2">
          {/* Live Play Time Widget */}
          <div
            id="play-time-widget"
            className="flex items-center gap-1.5 bg-amber-50/90 border border-amber-200 px-2.5 py-1 rounded-xl text-xs font-black text-amber-900 shadow-xs cursor-default"
            title={`Time Playing: ${formatHeaderTime(playTimeSeconds)} | Games Completed: ${timesPlayed}`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            <span>{formatHeaderTime(playTimeSeconds)}</span>
          </div>

          {/* Star & Coin counters */}
          <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-xl text-xs font-black">
            <span className="flex items-center gap-0.5 text-amber-600">
              <span className="text-sm">⭐</span> {stars}
            </span>
            <span className="text-amber-300">|</span>
            <span className="flex items-center gap-0.5 text-orange-600">
              <span className="text-sm">🐾</span> {coins}
            </span>
          </div>

          {/* Baby Lion Interactive Giggle Button */}
          <div className="relative">
            {showGiggleEffect && (
              <span className="absolute -top-4 left-0.5 text-xs font-black text-rose-500 animate-bounce pointer-events-none whitespace-nowrap">
                Hehe! 💕
              </span>
            )}
            <button
              id="header-baby-giggle-btn"
              onClick={handleTriggerBabyGiggle}
              onMouseEnter={() => sounds.playHover()}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-gradient-to-r from-rose-100 to-amber-100 hover:from-rose-200 hover:to-amber-200 text-amber-950 font-black text-xs rounded-xl border border-amber-300 shadow-xs transition cursor-pointer active:scale-95"
              title="Hear baby lion joyful giggle!"
            >
              <span className="text-sm">🦁</span>
              <span className="hidden sm:inline text-[11px]">Giggle!</span>
            </button>
          </div>

          {/* Sound Mute Toggle */}
          <button
            id="sound-toggle-btn"
            onClick={handleToggleSound}
            onMouseEnter={() => sounds.playHover()}
            className="p-2 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl border border-amber-200 transition cursor-pointer"
            title={isMuted ? 'Turn Sound ON' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-amber-600" />}
          </button>

          {/* Help Button */}
          <button
            id="help-btn"
            onClick={() => {
              sounds.playClick();
              setShowHelp(true);
            }}
            onMouseEnter={() => sounds.playHover()}
            className="p-2 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl border border-amber-200 transition cursor-pointer"
            title="Safari Stats & Guide"
          >
            <HelpCircle className="w-4 h-4 text-amber-600" />
          </button>
        </div>
      </div>

      {/* Guide & Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white p-6 rounded-3xl border-2 border-amber-300 shadow-2xl max-w-md w-full flex flex-col gap-4 text-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-amber-950 flex items-center gap-2">
                <span>🦁 Safari Guide & Explorer Stats</span>
              </h3>
              <button
                onClick={() => setShowHelp(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Live Play Time and Times Played summary */}
            <div className="bg-amber-50/80 p-3 rounded-2xl border border-amber-200 grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-700 block">Time Playing</span>
                  <span className="font-black text-sm text-amber-950">{formatHeaderTime(playTimeSeconds)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-orange-600 shrink-0" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-700 block">Times Played</span>
                  <span className="font-black text-sm text-amber-950">{timesPlayed} {timesPlayed === 1 ? 'game' : 'games'}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 text-xs sm:text-sm font-medium text-slate-600">
              <div className="flex items-start gap-2.5">
                <span className="text-xl">🐾</span>
                <div>
                  <strong className="text-amber-900 block font-bold">1. Walk the Baby Lion</strong>
                  Use the Walk Forward/Back, Jump, or Auto-Walk buttons. You can also use Keyboard Arrow Keys and Spacebar!
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="text-xl">🎨</span>
                <div>
                  <strong className="text-amber-900 block font-bold">2. Safari Coloring Studio</strong>
                  Tap animal parts to fill with lovely colors, or use the magic pen and stamp cute stickers. Show your art to the baby lion!
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="text-xl">🧩</span>
                <div>
                  <strong className="text-amber-900 block font-bold">3. Pattern Matching</strong>
                  Inspect animal coats (zebra stripes, cheetah spots, giraffe tiles) and solve repeating rhythm patterns!
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="text-xl">📸</span>
                <div>
                  <strong className="text-amber-900 block font-bold">4. Safari Photo Detective</strong>
                  Read detective clues and animal calls to reveal mystery wild animals!
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowHelp(false)}
              className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-sm rounded-xl shadow cursor-pointer mt-1"
            >
              Let’s Play! 🦁✨
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
