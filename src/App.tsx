/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { GameScreen, Milestone } from './types';
import { INITIAL_MILESTONES } from './data/gameData';
import { NavigationHeader } from './components/NavigationHeader';
import { WalkingAdventure } from './components/WalkingAdventure';
import { ColoringGame } from './components/ColoringGame';
import { PatternMatchGame } from './components/PatternMatchGame';
import { PhotoDetectiveGame } from './components/PhotoDetectiveGame';
import { MemoryMatchGame } from './components/MemoryMatchGame';
import { CelebrationModal, CelebrationData, formatPlayTime } from './components/CelebrationModal';
import { sounds } from './utils/audio';

interface CoinMilestoneTier {
  threshold: number;
  title: string;
  subtitle: string;
  badge: string;
  emoji: string;
  bonusStars: number;
  bonusCoins: number;
}

const COIN_MILESTONE_TIERS: CoinMilestoneTier[] = [
  {
    threshold: 25,
    title: 'Savanna Scout!',
    subtitle: 'Awesome! You gathered 25 Safari Paw Coins along the trail!',
    badge: '🐾 Savanna Scout',
    emoji: '🎖️',
    bonusStars: 3,
    bonusCoins: 10,
  },
  {
    threshold: 50,
    title: 'Trail Ranger!',
    subtitle: 'Sensational! 50 Coins collected! The wild savanna animals cheer for you!',
    badge: '🌟 Trail Ranger',
    emoji: '🪙',
    bonusStars: 5,
    bonusCoins: 20,
  },
  {
    threshold: 100,
    title: 'Safari Champion!',
    subtitle: 'Remarkable! A full 100 Golden Coins collected in the savanna!',
    badge: '🏆 Safari Champion',
    emoji: '🦁',
    bonusStars: 8,
    bonusCoins: 35,
  },
  {
    threshold: 150,
    title: 'Golden Explorer!',
    subtitle: 'Tremendous! 150 Coins! You unlocked the golden savanna crown!',
    badge: '✨ Golden Explorer',
    emoji: '👑',
    bonusStars: 10,
    bonusCoins: 50,
  },
  {
    threshold: 200,
    title: 'King of the Savanna!',
    subtitle: 'Legendary explorer! 200 Coins! You reign supreme with the Baby Lion!',
    badge: '👑 Savanna King',
    emoji: '🦁',
    bonusStars: 15,
    bonusCoins: 75,
  },
];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('walking');
  const [distance, setDistance] = useState<number>(0);
  const [stars, setStars] = useState<number>(5);
  const [coins, setCoins] = useState<number>(10);
  const [milestones, setMilestones] = useState<Milestone[]>(INITIAL_MILESTONES);
  const [celebrationData, setCelebrationData] = useState<CelebrationData | null>(null);
  const [celebratedCoinTiers, setCelebratedCoinTiers] = useState<number[]>([]);
  const [playTimeSeconds, setPlayTimeSeconds] = useState<number>(0);
  const [timesPlayed, setTimesPlayed] = useState<number>(1);

  // Refs for stabilizing callbacks against 1s interval timer changes
  const playTimeRef = useRef<number>(0);
  const timesPlayedRef = useRef<number>(1);
  const celebratedCoinTiersRef = useRef<number[]>([]);

  useEffect(() => {
    playTimeRef.current = playTimeSeconds;
  }, [playTimeSeconds]);

  useEffect(() => {
    timesPlayedRef.current = timesPlayed;
  }, [timesPlayed]);

  useEffect(() => {
    celebratedCoinTiersRef.current = celebratedCoinTiers;
  }, [celebratedCoinTiers]);

  // Live Adventure Play Session Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setPlayTimeSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const checkCoinMilestones = useCallback((newTotalCoins: number) => {
    // Find uncelebrated tier reached
    const eligibleTier = COIN_MILESTONE_TIERS.find(
      (t) => newTotalCoins >= t.threshold && !celebratedCoinTiersRef.current.includes(t.threshold)
    );

    if (eligibleTier) {
      setCelebratedCoinTiers((prev) => [...prev, eligibleTier.threshold]);
      
      // Award celebratory bonus stars and coins
      setStars((s) => s + eligibleTier.bonusStars);
      setCoins((c) => c + eligibleTier.bonusCoins);

      setCelebrationData({
        type: 'coin_threshold',
        title: eligibleTier.title,
        subtitle: eligibleTier.subtitle,
        badge: eligibleTier.badge,
        emoji: eligibleTier.emoji,
        bonusStars: eligibleTier.bonusStars,
        bonusCoins: eligibleTier.bonusCoins,
        playTimeSeconds: playTimeRef.current,
        timesPlayed: timesPlayedRef.current,
      });
    }
  }, []);

  const handleOpenGame = useCallback((game: GameScreen) => {
    sounds.playClick();
    setTimesPlayed((t) => t + 1);
    setCurrentScreen(game);
  }, []);

  const handleBackToWalk = useCallback(() => {
    sounds.playClick();
    setCurrentScreen('walking');
  }, []);

  const handleRewardEarned = useCallback((starsEarned: number, coinsEarned: number) => {
    setStars((s) => s + starsEarned);
    setCoins((prevCoins) => {
      const nextCoins = prevCoins + coinsEarned;
      checkCoinMilestones(nextCoins);
      return nextCoins;
    });
    
    // Mark corresponding milestone as completed if applicable
    setMilestones((prev) =>
      prev.map((m) => (m.game === currentScreen ? { ...m, completed: true } : m))
    );

    // Trigger celebratory fanfare modal for conquering the station
    const currentMilestone = milestones.find((m) => m.game === currentScreen);
    if (currentMilestone) {
      setCelebrationData({
        type: 'milestone',
        title: `${currentMilestone.title} Conquered!`,
        subtitle: `Incredible work! You solved the ${currentMilestone.title} and brought joy to the savanna!`,
        badge: `${currentMilestone.badge} Master`,
        emoji: '🌟',
        bonusStars: starsEarned,
        bonusCoins: coinsEarned,
        playTimeSeconds: playTimeRef.current,
        timesPlayed: timesPlayedRef.current,
        actionText: 'Return to Safari Trail 🐾',
        onAction: () => {
          setCurrentScreen('walking');
        },
      });
    }
  }, [currentScreen, milestones, checkCoinMilestones]);

  const handleItemCollected = useCallback((type: 'paw' | 'star' | 'mango' | 'flower') => {
    if (type === 'star') {
      setStars((s) => s + 1);
    } else {
      const earned = type === 'mango' ? 5 : type === 'flower' ? 3 : 2;
      setCoins((prevCoins) => {
        const nextCoins = prevCoins + earned;
        checkCoinMilestones(nextCoins);
        return nextCoins;
      });
    }
  }, [checkCoinMilestones]);

  const handleMilestoneReached = useCallback((m: Milestone) => {
    setTimesPlayed((t) => t + 1);
    setCelebrationData({
      type: 'milestone',
      title: `${m.title} Unlocked!`,
      subtitle: `${m.description} You walked across the savanna to this wonder!`,
      badge: m.badge,
      emoji: m.game === 'coloring' ? '🎨' : m.game === 'pattern' ? '🧩' : m.game === 'photo' ? '📸' : '🧠',
      bonusStars: 3,
      bonusCoins: 15,
      playTimeSeconds: playTimeRef.current,
      timesPlayed: timesPlayedRef.current + 1,
      actionText: `Play ${m.title}!`,
      onAction: () => {
        setCurrentScreen(m.game);
      },
    });
    setStars((s) => s + 3);
    setCoins((prevCoins) => {
      const nextCoins = prevCoins + 15;
      checkCoinMilestones(nextCoins);
      return nextCoins;
    });
  }, [checkCoinMilestones]);

  const handleEndReached = useCallback(() => {
    setTimesPlayed((t) => t + 1);
    setCelebrationData({
      type: 'milestone',
      title: 'Crown Oasis Master Explorer! 👑',
      subtitle: 'Congratulations! You walked the baby lion through the entire 800-meter African Savanna!',
      badge: '👑 Savanna King Explorer',
      emoji: '🦁',
      bonusStars: 10,
      bonusCoins: 50,
      playTimeSeconds: playTimeRef.current,
      timesPlayed: timesPlayedRef.current + 1,
      actionText: 'Celebrate with Baby Lion! 🐾',
      onAction: () => {
        sounds.playCelebrationWithBabySound();
      },
    });
    setStars((s) => s + 10);
    setCoins((prevCoins) => {
      const nextCoins = prevCoins + 50;
      checkCoinMilestones(nextCoins);
      return nextCoins;
    });
  }, [checkCoinMilestones]);

  return (
    <div className="min-h-screen flex flex-col bg-amber-50/60 font-['Nunito',sans-serif] text-slate-800">
      {/* Top Universal Safari Header */}
      <NavigationHeader
        currentScreen={currentScreen}
        onNavigate={(screen) => {
          setCurrentScreen(screen);
        }}
        stars={stars}
        coins={coins}
        distance={distance}
        playTimeSeconds={playTimeSeconds}
        timesPlayed={timesPlayed}
      />

      {/* Main Game Screen Router */}
      <main className="flex-1 flex flex-col items-center justify-center p-2 sm:p-4">
        {currentScreen === 'walking' && (
          <WalkingAdventure
            milestones={milestones}
            onOpenGame={handleOpenGame}
            onItemCollected={handleItemCollected}
            onMilestoneReached={handleMilestoneReached}
            onEndReached={handleEndReached}
            distance={distance}
            setDistance={setDistance}
            stars={stars}
            coins={coins}
          />
        )}

        {currentScreen === 'coloring' && (
          <ColoringGame
            onBackToWalk={handleBackToWalk}
            onRewardEarned={handleRewardEarned}
          />
        )}

        {currentScreen === 'pattern' && (
          <PatternMatchGame
            onBackToWalk={handleBackToWalk}
            onRewardEarned={handleRewardEarned}
          />
        )}

        {currentScreen === 'photo' && (
          <PhotoDetectiveGame
            onBackToWalk={handleBackToWalk}
            onRewardEarned={handleRewardEarned}
          />
        )}

        {currentScreen === 'memory' && (
          <MemoryMatchGame
            onBackToWalk={handleBackToWalk}
            onRewardEarned={handleRewardEarned}
          />
        )}
      </main>

      {/* Bottom Footer Credits / Encouragement with Playing Time & Times of Playing */}
      <footer className="py-2.5 px-4 text-center text-xs font-bold text-amber-900 border-t border-amber-200/70 bg-white/70 flex flex-wrap items-center justify-center gap-3">
        <span>Mind GROWUP - JR. 🦁 Adventure</span>
        <span className="text-amber-300">•</span>
        <span className="flex items-center gap-1 text-amber-800">
          <span>⏱️ Safari Time:</span>
          <strong>{formatPlayTime(playTimeSeconds)}</strong>
        </span>
        <span className="text-amber-300">•</span>
        <span className="flex items-center gap-1 text-orange-800">
          <span>🎮 Played:</span>
          <strong>{timesPlayed} {timesPlayed === 1 ? 'game' : 'games'}</strong>
        </span>
        <span className="text-amber-300">•</span>
        <button
          onClick={() => sounds.playBabyGiggle()}
          className="text-rose-600 hover:text-rose-700 underline font-black cursor-pointer"
        >
          Hear Baby Giggle 💕
        </button>
      </footer>

      {/* Global Celebratory Animation Modal */}
      <CelebrationModal
        data={celebrationData}
        onClose={() => setCelebrationData(null)}
      />
    </div>
  );
}
