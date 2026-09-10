import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { BabyLion } from './BabyLion';
import { sounds } from '../utils/audio';
import { Trophy, Sparkles, Award, Star, ArrowRight, X, Clock, Gamepad2, Heart } from 'lucide-react';

export interface CelebrationData {
  type: 'milestone' | 'coin_threshold';
  title: string;
  subtitle: string;
  badge: string;
  emoji: string;
  bonusStars: number;
  bonusCoins: number;
  actionText?: string;
  onAction?: () => void;
  playTimeSeconds?: number;
  timesPlayed?: number;
}

interface CelebrationModalProps {
  data: CelebrationData | null;
  onClose: () => void;
}

export function formatPlayTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({ data, onClose }) => {
  const [showHearts, setShowHearts] = useState<boolean>(false);
  const [babyReactionText, setBabyReactionText] = useState<string>('“Giggle! You did it! You are the best safari explorer!”');

  useEffect(() => {
    if (!data) return;

    // Trigger celebratory fanfare AND joyful baby sound (baby cheer + happy giggle)
    sounds.playCelebrationWithBabySound(data.type === 'coin_threshold');

    // Trigger grand celebratory confetti cannon
    const end = Date.now() + 1500;
    const colors = ['#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#ec4899', '#fbbf24'];

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 65,
        origin: { x: 0.1, y: 0.7 },
        colors,
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 65,
        origin: { x: 0.9, y: 0.7 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, [data]);

  const handleBabyTickle = () => {
    sounds.playBabyGiggle();
    setShowHearts(true);
    const reactions = [
      '“He-he-he! That tickles! Yay for winning!”',
      '“Giggle! Yaaay! Let’s keep walking!”',
      '“Hehehe! Baby lion is so happy!”',
      '“Purrrr... Roaaar-giggle! We won!”',
    ];
    setBabyReactionText(reactions[Math.floor(Math.random() * reactions.length)]);
    setTimeout(() => setShowHearts(false), 1500);
  };

  if (!data) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn select-none">
      <div className="relative bg-white rounded-3xl border-4 border-amber-300 shadow-2xl max-w-lg w-full overflow-hidden p-6 text-center flex flex-col items-center gap-4 animate-scaleUp">
        {/* Background Sunburst glow */}
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-amber-200/50 rounded-full filter blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-orange-200/50 rounded-full filter blur-3xl pointer-events-none" />

        {/* Close button */}
        <button
          id="celebration-close-btn"
          onClick={() => {
            sounds.playClick();
            onClose();
          }}
          onMouseEnter={() => sounds.playHover()}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header Badge */}
        <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-xs px-3.5 py-1.5 rounded-full shadow-md">
          <Sparkles className="w-4 h-4 animate-spin" />
          <span className="uppercase tracking-wider">
            {data.type === 'coin_threshold' ? 'Golden Coin Milestone!' : 'Safari Trail Milestone!'}
          </span>
        </div>

        {/* Big Animated Emblem with rays */}
        <div className="relative my-1">
          <div className="w-22 h-22 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-amber-400 via-yellow-300 to-orange-500 shadow-xl flex items-center justify-center text-5xl border-4 border-white animate-bounce-subtle">
            {data.emoji}
          </div>
          <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1.5 shadow-md border-2 border-amber-300">
            {data.type === 'coin_threshold' ? (
              <span className="text-xl">🪙</span>
            ) : (
              <Trophy className="w-5 h-5 text-amber-500" />
            )}
          </div>
        </div>

        {/* Title & Subtitle */}
        <div>
          <h3 className="text-2xl sm:text-3xl font-black text-amber-950">
            {data.title}
          </h3>
          <p className="text-sm font-bold text-amber-800 mt-1 max-w-sm">
            {data.subtitle}
          </p>
          <div className="mt-2 inline-block bg-amber-100 text-amber-900 border border-amber-300 font-extrabold text-xs px-3 py-1 rounded-xl shadow-xs">
            Badge Unlocked: {data.badge}
          </div>
        </div>

        {/* Times of Playing & Safari Time Stats */}
        <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
          <div className="flex items-center justify-center gap-2 bg-amber-50 border border-amber-200 py-2 px-3 rounded-2xl shadow-xs">
            <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
            <div className="text-left">
              <span className="text-[10px] font-bold text-amber-700 block uppercase leading-none">Time Playing</span>
              <span className="text-xs sm:text-sm font-black text-amber-950">
                {formatPlayTime(data.playTimeSeconds ?? 0)}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 bg-amber-50 border border-amber-200 py-2 px-3 rounded-2xl shadow-xs">
            <Gamepad2 className="w-4 h-4 text-orange-600" />
            <div className="text-left">
              <span className="text-[10px] font-bold text-amber-700 block uppercase leading-none">Times Played</span>
              <span className="text-xs sm:text-sm font-black text-amber-950">
                {data.timesPlayed ?? 1} {data.timesPlayed === 1 ? 'game' : 'games'}
              </span>
            </div>
          </div>
        </div>

        {/* Reward Bonus Bar */}
        {(data.bonusStars > 0 || data.bonusCoins > 0) && (
          <div className="flex items-center justify-center gap-4 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 px-6 py-2 rounded-2xl w-full max-w-xs shadow-inner">
            {data.bonusStars > 0 && (
              <div className="flex items-center gap-1.5 text-amber-700 font-black text-sm sm:text-base">
                <span className="text-lg sm:text-xl">⭐</span>
                <span>+{data.bonusStars} Stars</span>
              </div>
            )}
            {data.bonusStars > 0 && data.bonusCoins > 0 && (
              <span className="text-amber-300 font-black">|</span>
            )}
            {data.bonusCoins > 0 && (
              <div className="flex items-center gap-1.5 text-orange-700 font-black text-sm sm:text-base">
                <span className="text-lg sm:text-xl">🪙</span>
                <span>+{data.bonusCoins} Coins</span>
              </div>
            )}
          </div>
        )}

        {/* Baby Lion Mascot Cheer with interactive Baby Giggle */}
        <div className="relative flex items-center gap-3 bg-amber-50/90 p-3 rounded-2xl border-2 border-amber-200 w-full text-left">
          {showHearts && (
            <div className="absolute -top-3 left-10 flex gap-1 animate-bounce pointer-events-none">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
              <Sparkles className="w-5 h-5 text-amber-400 animate-spin" />
            </div>
          )}
          <div className="shrink-0 cursor-pointer group" onClick={handleBabyTickle} title="Tap Baby Lion to hear baby giggle!">
            <BabyLion
              state="celebrate"
              scale={0.55}
              onClick={handleBabyTickle}
            />
          </div>
          <div className="flex-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-black text-amber-900">Baby Lion Cub:</span>
              <button
                id="baby-giggle-sound-btn"
                onClick={handleBabyTickle}
                onMouseEnter={() => sounds.playHover()}
                className="text-[11px] font-black text-amber-700 bg-amber-200/70 hover:bg-amber-300 px-2 py-0.5 rounded-lg transition cursor-pointer flex items-center gap-1"
              >
                <span>🦁 Giggle!</span>
              </button>
            </div>
            <p className="font-bold text-amber-850 text-[11px] mt-0.5">
              {babyReactionText}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 w-full mt-1">
          {data.actionText && data.onAction && (
            <button
              id="celebration-action-btn"
              onClick={() => {
                sounds.playSuccess();
                if (data.onAction) data.onAction();
                onClose();
              }}
              onMouseEnter={() => sounds.playHover()}
              className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 active:scale-95 text-white font-black text-sm rounded-2xl shadow-lg cursor-pointer transition flex items-center justify-center gap-2"
            >
              <span>{data.actionText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          <button
            id="celebration-continue-btn"
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            onMouseEnter={() => sounds.playHover()}
            className={`${
              data.actionText ? 'py-3 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700' : 'w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg hover:from-amber-600 hover:to-orange-600'
            } font-black text-sm rounded-2xl active:scale-95 transition cursor-pointer`}
          >
            Keep Exploring! 🐾
          </button>
        </div>
      </div>
    </div>
  );
};
