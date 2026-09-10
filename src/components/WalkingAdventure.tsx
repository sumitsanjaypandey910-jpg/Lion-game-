import React, { useState, useEffect, useRef } from 'react';
import { BabyLion } from './BabyLion';
import { Milestone, CollectibleItem, LionAnimationState, GameScreen } from '../types';
import { SAFARI_FRIENDS } from '../data/gameData';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Play,
  Pause,
  ArrowRight,
  ArrowLeft,
  Volume2,
  ChevronRight,
  MapPin,
  Flame,
  Award,
} from 'lucide-react';

interface WalkingAdventureProps {
  milestones: Milestone[];
  onOpenGame: (game: GameScreen) => void;
  onItemCollected: (type: 'paw' | 'star' | 'mango' | 'flower') => void;
  onMilestoneReached?: (milestone: Milestone) => void;
  onEndReached?: () => void;
  distance: number;
  setDistance: React.Dispatch<React.SetStateAction<number>>;
  stars: number;
  coins: number;
}

export const WalkingAdventure: React.FC<WalkingAdventureProps> = ({
  milestones,
  onOpenGame,
  onItemCollected,
  onMilestoneReached,
  onEndReached,
  distance,
  setDistance,
  stars,
  coins,
}) => {
  const [lionState, setLionState] = useState<LionAnimationState>('idle');
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [autoWalk, setAutoWalk] = useState<boolean>(false);
  const [speed, setSpeed] = useState<'normal' | 'fast'>('normal');
  const [isJumping, setIsJumping] = useState<boolean>(false);
  const [lionY, setLionY] = useState<number>(0);
  const [activeFriendGreeting, setActiveFriendGreeting] = useState<{ name: string; text: string } | null>(null);
  const [activeMilestonePrompt, setActiveMilestonePrompt] = useState<Milestone | null>(null);
  const [celebratedMilestones, setCelebratedMilestones] = useState<string[]>([]);
  const [hasReachedEnd, setHasReachedEnd] = useState<boolean>(false);

  // Generate collectibles scattered along the path
  const [collectibles, setCollectibles] = useState<CollectibleItem[]>([
    { id: 1, type: 'paw', x: 40, y: 15, collected: false },
    { id: 2, type: 'mango', x: 85, y: 35, collected: false },
    { id: 3, type: 'star', x: 140, y: 55, collected: false },
    { id: 4, type: 'paw', x: 180, y: 20, collected: false },
    { id: 5, type: 'flower', x: 230, y: 10, collected: false },
    { id: 6, type: 'star', x: 310, y: 60, collected: false },
    { id: 7, type: 'mango', x: 350, y: 25, collected: false },
    { id: 8, type: 'paw', x: 410, y: 20, collected: false },
    { id: 9, type: 'star', x: 490, y: 50, collected: false },
    { id: 10, type: 'flower', x: 530, y: 15, collected: false },
    { id: 11, type: 'paw', x: 590, y: 20, collected: false },
    { id: 12, type: 'mango', x: 630, y: 40, collected: false },
    { id: 13, type: 'star', x: 680, y: 65, collected: false },
  ]);

  // Handle keyboard inputs
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'd') {
        walkForward();
      } else if (e.key === 'ArrowLeft' || e.key === 'a') {
        walkBackward();
      } else if (e.key === 'ArrowUp' || e.key === ' ' || e.key === 'w') {
        e.preventDefault();
        jump();
      } else if (e.key === 'r' || e.key === 'R') {
        roar();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (['ArrowRight', 'ArrowLeft', 'a', 'd'].includes(e.key) && !autoWalk) {
        setLionState('idle');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [autoWalk, isJumping]);

  // Auto-walk tick loop
  useEffect(() => {
    if (!autoWalk) return;
    const stepSize = speed === 'fast' ? 3.5 : 2;
    const interval = setInterval(() => {
      setDistance((d) => {
        const nextD = Math.min(800, d + stepSize);
        return nextD;
      });
      setDirection('right');
      setLionState(speed === 'fast' ? 'run' : 'walk');
      sounds.playStep(Math.random() > 0.5);
    }, 180);

    return () => clearInterval(interval);
  }, [autoWalk, speed]);

  // Check collision with items and milestones as distance changes
  useEffect(() => {
    // Check item pickup cleanly outside of setState updaters
    const newlyCollected = collectibles.filter(
      (it) => !it.collected && Math.abs(it.x - distance) < 18 && (it.y <= 30 || lionY >= 20)
    );

    if (newlyCollected.length > 0) {
      const hitIds = new Set(newlyCollected.map((c) => c.id));
      setCollectibles((prev) =>
        prev.map((it) => (hitIds.has(it.id) ? { ...it, collected: true } : it))
      );
      newlyCollected.forEach((it) => {
        sounds.playCollect();
        onItemCollected(it.type);
      });
    }

    // Check safari animal friends greetings
    const nearFriend = SAFARI_FRIENDS.find((f) => Math.abs(f.x - distance) < 28);
    if (nearFriend) {
      setActiveFriendGreeting({ name: nearFriend.name, text: `${nearFriend.greeting} ${nearFriend.reaction}` });
    } else {
      setActiveFriendGreeting(null);
    }

    // Check if reached a milestone station
    const hitMilestone = milestones.find(
      (m) => Math.abs(m.distance - distance) < 15 && !m.completed
    );
    if (hitMilestone && !activeMilestonePrompt && !celebratedMilestones.includes(hitMilestone.id)) {
      setCelebratedMilestones((prev) => [...prev, hitMilestone.id]);
      setAutoWalk(false);
      setLionState('celebrate');
      setActiveMilestonePrompt(hitMilestone);
      if (onMilestoneReached) {
        onMilestoneReached(hitMilestone);
      } else {
        sounds.playMilestoneFanfare();
      }
    }

    // Check if reached ultimate Crown Oasis (800m)
    if (distance >= 795 && !hasReachedEnd) {
      setHasReachedEnd(true);
      setAutoWalk(false);
      setLionState('celebrate');
      onEndReached?.();
    }
  }, [distance, lionY, milestones, activeMilestonePrompt, collectibles, onItemCollected, celebratedMilestones, hasReachedEnd, onMilestoneReached, onEndReached]);

  const walkForward = () => {
    setDirection('right');
    setLionState('walk');
    const step = speed === 'fast' ? 6 : 3.5;
    setDistance((d) => Math.min(800, d + step));
    sounds.playStep(true);
  };

  const walkBackward = () => {
    setDirection('left');
    setLionState('walk');
    const step = speed === 'fast' ? 6 : 3.5;
    setDistance((d) => Math.max(0, d - step));
    sounds.playStep(false);
  };

  const jump = () => {
    if (isJumping) return;
    setIsJumping(true);
    setLionState('jump');
    sounds.playJump();

    // Jump parabola
    let start = Date.now();
    const duration = 550;
    const peakHeight = 70;

    const jumpInterval = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = elapsed / duration;
      if (progress >= 1) {
        clearInterval(jumpInterval);
        setLionY(0);
        setIsJumping(false);
        setLionState(autoWalk ? 'walk' : 'idle');
      } else {
        // Parabolic arc: 4 * h * p * (1 - p)
        const currentY = 4 * peakHeight * progress * (1 - progress);
        setLionY(currentY);
      }
    }, 16);
  };

  const roar = () => {
    sounds.playRoar();
    setLionState('roar');
    setTimeout(() => {
      setLionState(autoWalk ? 'walk' : 'idle');
    }, 1200);
  };

  // Parallax offsets calculation based on distance
  const skyOffset = (distance * 0.15) % 800;
  const hillsOffset = (distance * 0.4) % 800;
  const treesOffset = (distance * 0.8) % 800;
  const pathOffset = (distance * 1.5) % 800;

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-4 p-2 sm:p-4">
      {/* Top Safari Milestones Progress Map */}
      <div className="bg-white/95 backdrop-blur-sm p-3.5 sm:p-4 rounded-3xl border-2 border-amber-200 shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-black shadow-sm">
              🐾
            </div>
            <div>
              <h2 className="font-black text-amber-950 text-sm sm:text-base">
                Safari Trail Adventure
              </h2>
              <p className="text-xs text-amber-700 font-semibold">
                Walk the lion cub through the savanna to discover coloring, patterns & puzzles!
              </p>
            </div>
          </div>

          {/* Quick jump to mini-games */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-amber-800 hidden sm:inline">Stations:</span>
            {milestones.map((m) => (
              <button
                key={m.id}
                id={`milestone-jump-${m.id}`}
                onClick={() => {
                  sounds.playClick();
                  onOpenGame(m.game);
                }}
                onMouseEnter={() => sounds.playHover()}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                  distance >= m.distance
                    ? 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
                    : 'bg-slate-100 text-slate-600 hover:bg-amber-50 border border-slate-200'
                }`}
                title={`Jump to ${m.title}`}
              >
                <span>{m.game === 'coloring' ? '🎨' : m.game === 'pattern' ? '🧩' : m.game === 'photo' ? '📸' : '🧠'}</span>
                <span>{m.badge}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Trail Progress Meter */}
        <div className="relative w-full h-4 bg-amber-100 rounded-full overflow-hidden border border-amber-300">
          <div
            className="h-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 transition-all duration-300"
            style={{ width: `${Math.min(100, (distance / 800) * 100)}%` }}
          />
          {/* Milestone markers along the bar */}
          {milestones.map((m) => {
            const pct = (m.distance / 800) * 100;
            return (
              <div
                key={m.id}
                className="absolute top-0 bottom-0 w-2 bg-amber-800 -translate-x-1/2 opacity-70"
                style={{ left: `${pct}%` }}
                title={`${m.title} (${m.distance}m)`}
              />
            );
          })}
        </div>
        <div className="flex justify-between items-center text-[11px] font-bold text-amber-800 px-1">
          <span>Start (0m)</span>
          <span>Distance: {Math.round(distance)}m / 800m</span>
          <span>Crown Oasis (800m)</span>
        </div>
      </div>

      {/* Main Parallax Safari Walking Stage */}
      <div className="relative w-full h-[380px] sm:h-[450px] rounded-3xl overflow-hidden shadow-lg border-4 border-amber-300 bg-gradient-to-b from-sky-300 via-amber-100 to-amber-200 select-none">
        {/* Sun & Clouds */}
        <div className="absolute top-6 right-12 w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-200 shadow-[0_0_50px_rgba(251,191,36,0.8)] animate-pulse" />
        
        {/* Parallax Layer 1: Floating clouds */}
        <div
          className="absolute top-4 left-0 w-[1600px] flex gap-24 opacity-80 pointer-events-none transition-transform ease-out"
          style={{ transform: `translateX(-${skyOffset}px)` }}
        >
          <div className="w-28 h-10 bg-white rounded-full filter blur-[1px]" />
          <div className="w-44 h-12 bg-white rounded-full filter blur-[1px]" />
          <div className="w-36 h-10 bg-white rounded-full filter blur-[1px]" />
          <div className="w-52 h-14 bg-white rounded-full filter blur-[1px]" />
        </div>

        {/* Parallax Layer 2: Distant Savannah Hills & Flat-topped Acacia silhouettes */}
        <svg
          className="absolute bottom-28 left-0 w-[2400px] h-36 opacity-60 pointer-events-none transition-transform ease-out"
          style={{ transform: `translateX(-${hillsOffset}px)` }}
          viewBox="0 0 2400 120"
          preserveAspectRatio="none"
        >
          <path
            d="M 0 80 Q 200 40 400 70 Q 600 90 800 50 Q 1000 30 1200 80 Q 1400 50 1600 75 Q 1800 90 2000 60 Q 2200 40 2400 80 L 2400 120 L 0 120 Z"
            fill="#D4AC0D"
          />
        </svg>

        {/* Parallax Layer 3: Mid-ground Safari Acacia & Baobab Trees */}
        <div
          className="absolute bottom-24 left-0 w-[2400px] flex items-end justify-around pointer-events-none transition-transform ease-out"
          style={{ transform: `translateX(-${treesOffset}px)` }}
        >
          {/* Acacia Tree 1 */}
          <svg width="120" height="120" viewBox="0 0 120 120">
            <path d="M 55 120 L 60 70 L 40 50 M 60 70 L 75 52 M 60 70 L 60 45" stroke="#7E5109" strokeWidth="8" strokeLinecap="round" />
            <ellipse cx="60" cy="40" rx="50" ry="14" fill="#27AE60" />
            <ellipse cx="60" cy="34" rx="42" ry="10" fill="#2ECC71" />
          </svg>

          {/* Baobab Tree */}
          <svg width="140" height="140" viewBox="0 0 140 140">
            <path d="M 50 140 Q 45 80 55 50 Q 65 30 70 25 Q 75 30 85 50 Q 95 80 90 140 Z" fill="#795548" />
            <ellipse cx="70" cy="30" rx="55" ry="18" fill="#1E8449" />
          </svg>

          {/* Acacia Tree 2 */}
          <svg width="110" height="110" viewBox="0 0 110 110">
            <path d="M 50 110 L 55 60 L 35 45 M 55 60 L 70 48" stroke="#7E5109" strokeWidth="7" strokeLinecap="round" />
            <ellipse cx="55" cy="38" rx="45" ry="12" fill="#229954" />
          </svg>
        </div>

        {/* Safari Animal Friends Stationed along the Trail */}
        {SAFARI_FRIENDS.map((f) => {
          // Calculate screen position relative to lion camera
          const relativeX = (f.x - distance) * 4 + 350;
          if (relativeX < -150 || relativeX > 1100) return null;

          return (
            <div
              key={f.id}
              className="absolute bottom-24 flex flex-col items-center cursor-pointer transform hover:scale-110 transition duration-200 z-10"
              style={{ left: `${relativeX}px` }}
              onClick={() => {
                sounds.playSuccess();
                setActiveFriendGreeting({ name: f.name, text: `${f.greeting} ${f.reaction}` });
              }}
              onMouseEnter={() => sounds.playHover()}
              title={`Tap ${f.name}!`}
            >
              <span className="text-5xl filter drop-shadow-md animate-bounce-subtle">
                {f.emoji}
              </span>
              <span className="bg-amber-900/90 text-amber-100 text-[10px] font-black px-2 py-0.5 rounded-full mt-1 whitespace-nowrap shadow">
                {f.name}
              </span>
            </div>
          );
        })}

        {/* Milestone Station Gates along the Trail */}
        {milestones.map((m) => {
          const relativeX = (m.distance - distance) * 4 + 350;
          if (relativeX < -200 || relativeX > 1100) return null;

          return (
            <div
              key={m.id}
              className="absolute bottom-20 flex flex-col items-center z-15"
              style={{ left: `${relativeX}px` }}
            >
              {/* Gate Arch */}
              <div
                onClick={() => {
                  sounds.playClick();
                  onOpenGame(m.game);
                }}
                onMouseEnter={() => sounds.playHover()}
                className="bg-white/95 border-3 border-amber-400 p-2.5 rounded-2xl shadow-xl flex flex-col items-center text-center cursor-pointer hover:scale-105 transition transform animate-pulse"
              >
                <div className="text-2xl">
                  {m.game === 'coloring' ? '🎨' : m.game === 'pattern' ? '🧩' : m.game === 'photo' ? '📸' : '🧠'}
                </div>
                <div className="text-[11px] font-black text-amber-950 uppercase mt-0.5 whitespace-nowrap">
                  {m.title}
                </div>
                <div className="bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-[10px] px-3 py-1 rounded-lg mt-1 shadow-sm flex items-center gap-1">
                  <span>Enter Game</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </div>

              {/* Wooden Post Pillars */}
              <div className="flex gap-16 mt-1">
                <div className="w-2.5 h-14 bg-amber-800 rounded-sm" />
                <div className="w-2.5 h-14 bg-amber-800 rounded-sm" />
              </div>
            </div>
          );
        })}

        {/* Collectible Paw Coins / Mangoes / Stars */}
        {collectibles.map((item) => {
          if (item.collected) return null;
          const relativeX = (item.x - distance) * 4 + 350;
          if (relativeX < -50 || relativeX > 1050) return null;

          let icon = '🐾';
          if (item.type === 'star') icon = '⭐';
          if (item.type === 'mango') icon = '🥭';
          if (item.type === 'flower') icon = '🌺';

          return (
            <div
              key={item.id}
              className="absolute text-2xl sm:text-3xl filter drop-shadow-md animate-bounce cursor-pointer z-10 select-none"
              style={{
                left: `${relativeX}px`,
                bottom: `${95 + item.y}px`,
              }}
              onClick={() => {
                sounds.playCollect();
                onItemCollected(item.type);
                setCollectibles((all) =>
                  all.map((it) => (it.id === item.id ? { ...it, collected: true } : it))
                );
              }}
            >
              {icon}
            </div>
          );
        })}

        {/* The Walking Ground / Safari Road Layer */}
        <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-amber-700 via-amber-600 to-amber-500 border-t-4 border-amber-400">
          {/* Decorative grass blades and paw prints on the road */}
          <div
            className="w-[2400px] h-full flex items-center justify-around opacity-60 pointer-events-none transition-transform ease-out"
            style={{ transform: `translateX(-${pathOffset}px)` }}
          >
            {Array.from({ length: 24 }).map((_, i) => (
              <span key={i} className="text-amber-800 text-lg opacity-40 font-black select-none">
                {i % 2 === 0 ? '🐾' : '🌿'}
              </span>
            ))}
          </div>
        </div>

        {/* THE BABY LION CUB (Centered along the screen with jump offset) */}
        <div
          className="absolute z-20 transition-all duration-75"
          style={{
            left: '350px',
            bottom: `${85 + lionY}px`,
          }}
        >
          <BabyLion
            state={lionState}
            direction={direction}
            scale={0.9}
            onClick={roar}
          />
        </div>

        {/* Speech / Greeting Overlay from nearby Safari Animal Friends */}
        {activeFriendGreeting && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/95 border-2 border-amber-300 px-4 py-2 rounded-2xl shadow-lg flex items-center gap-2 z-30 animate-fadeIn max-w-md text-center">
            <span className="text-xl">💬</span>
            <div className="text-xs font-bold text-amber-950">
              <span className="font-black text-amber-800">{activeFriendGreeting.name}: </span>
              {activeFriendGreeting.text}
            </div>
          </div>
        )}

        {/* Milestone Station Encounter Pop-up Banner */}
        {activeMilestonePrompt && (
          <div className="absolute inset-0 bg-amber-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-40 animate-fadeIn">
            <div className="bg-white p-5 sm:p-6 rounded-3xl border-3 border-amber-400 shadow-2xl max-w-sm text-center flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-3xl shadow-md animate-bounce">
                {activeMilestonePrompt.game === 'coloring'
                  ? '🎨'
                  : activeMilestonePrompt.game === 'pattern'
                  ? '🧩'
                  : activeMilestonePrompt.game === 'photo'
                  ? '📸'
                  : '🧠'}
              </div>

              <div>
                <span className="bg-amber-100 text-amber-800 text-xs font-black px-2.5 py-0.5 rounded-full uppercase">
                  Station Reached!
                </span>
                <h3 className="text-xl font-black text-amber-950 mt-1">
                  {activeMilestonePrompt.title}
                </h3>
                <p className="text-xs text-slate-600 font-semibold mt-1">
                  {activeMilestonePrompt.description}
                </p>
              </div>

              <div className="flex gap-2 w-full mt-2">
                <button
                  id="skip-milestone-btn"
                  onClick={() => {
                    sounds.playClick();
                    setActiveMilestonePrompt(null);
                    setLionState('idle');
                  }}
                  onMouseEnter={() => sounds.playHover()}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer transition"
                >
                  Keep Walking 🐾
                </button>

                <button
                  id="play-milestone-btn"
                  onClick={() => {
                    sounds.playSuccess();
                    const g = activeMilestonePrompt.game;
                    setActiveMilestonePrompt(null);
                    onOpenGame(g);
                  }}
                  onMouseEnter={() => sounds.playHover()}
                  className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs rounded-xl shadow-md cursor-pointer transition flex items-center justify-center gap-1"
                >
                  <span>Play Game!</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* TACTILE WALKING GAME CONTROLS FOR KIDS */}
      <div className="bg-white/95 backdrop-blur-sm p-4 rounded-3xl border-2 border-amber-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        {/* Direction Controls */}
        <div className="flex items-center gap-2">
          <button
            id="walk-left-btn"
            onClick={walkBackward}
            onMouseEnter={() => sounds.playHover()}
            className="flex items-center gap-1.5 px-4 py-3 bg-amber-100 hover:bg-amber-200 active:scale-95 text-amber-950 font-black text-sm rounded-2xl border-2 border-amber-300 shadow-sm cursor-pointer transition"
          >
            <ArrowLeft className="w-5 h-5 text-amber-700" />
            <span>Walk Back</span>
          </button>

          <button
            id="walk-right-btn"
            onClick={walkForward}
            onMouseEnter={() => sounds.playHover()}
            className="flex items-center gap-1.5 px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 active:scale-95 text-white font-black text-sm rounded-2xl shadow-md cursor-pointer transition"
          >
            <span>Walk Forward</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Action Controls: Jump & Roar */}
        <div className="flex items-center gap-2">
          <button
            id="jump-btn"
            onClick={jump}
            onMouseEnter={() => sounds.playHover()}
            className="flex items-center gap-1.5 px-4 py-3 bg-sky-100 hover:bg-sky-200 active:scale-95 text-sky-950 font-black text-sm rounded-2xl border-2 border-sky-300 shadow-sm cursor-pointer transition"
          >
            <span className="text-lg">⬆️</span>
            <span>Jump!</span>
          </button>

          <button
            id="roar-btn"
            onClick={roar}
            onMouseEnter={() => sounds.playHover()}
            className="flex items-center gap-1.5 px-4 py-3 bg-rose-100 hover:bg-rose-200 active:scale-95 text-rose-950 font-black text-sm rounded-2xl border-2 border-rose-300 shadow-sm cursor-pointer transition"
          >
            <span className="text-lg">🦁</span>
            <span>Baby Roar!</span>
          </button>
        </div>

        {/* Auto-walk and Speed Mode */}
        <div className="flex items-center gap-2">
          <button
            id="auto-walk-toggle-btn"
            onClick={() => {
              sounds.playClick();
              setAutoWalk((w) => !w);
            }}
            onMouseEnter={() => sounds.playHover()}
            className={`flex items-center gap-1.5 px-3 py-2.5 rounded-2xl font-black text-xs transition cursor-pointer border-2 ${
              autoWalk
                ? 'bg-emerald-500 text-white border-emerald-600 shadow-md'
                : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
            }`}
          >
            {autoWalk ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>Auto Walk: {autoWalk ? 'ON' : 'OFF'}</span>
          </button>

          <button
            id="speed-toggle-btn"
            onClick={() => {
              sounds.playClick();
              setSpeed((s) => (s === 'normal' ? 'fast' : 'normal'));
            }}
            onMouseEnter={() => sounds.playHover()}
            className="flex items-center gap-1 px-3 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-2xl font-black text-xs transition cursor-pointer"
          >
            <Flame className="w-4 h-4 text-orange-500" />
            <span>Speed: {speed === 'normal' ? 'Walk' : 'Run ⚡'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
