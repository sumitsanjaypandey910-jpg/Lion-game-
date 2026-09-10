/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GameScreen, LionAnimationState, Milestone } from './types';
import { INITIAL_MILESTONES } from './data/gameData';
import { NavigationHeader } from './components/NavigationHeader';
import { WalkingAdventure } from './components/WalkingAdventure';
import { ColoringGame } from './components/ColoringGame';
import { PatternMatchGame } from './components/PatternMatchGame';
import { PhotoDetectiveGame } from './components/PhotoDetectiveGame';
import { MemoryMatchGame } from './components/MemoryMatchGame';
import { sounds } from './utils/audio';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('walking');
  const [distance, setDistance] = useState<number>(0);
  const [lionState, setLionState] = useState<LionAnimationState>('idle');
  const [stars, setStars] = useState<number>(5);
  const [coins, setCoins] = useState<number>(10);
  const [milestones, setMilestones] = useState<Milestone[]>(INITIAL_MILESTONES);

  const handleOpenGame = (game: GameScreen) => {
    sounds.playClick();
    setCurrentScreen(game);
  };

  const handleBackToWalk = () => {
    sounds.playClick();
    setCurrentScreen('walking');
  };

  const handleRewardEarned = (starsEarned: number, coinsEarned: number) => {
    setStars((s) => s + starsEarned);
    setCoins((c) => c + coinsEarned);
    
    // Mark corresponding milestone as completed if applicable
    setMilestones((prev) =>
      prev.map((m) => (m.game === currentScreen ? { ...m, completed: true } : m))
    );
  };

  const handleItemCollected = (type: 'paw' | 'star' | 'mango' | 'flower') => {
    if (type === 'star') {
      setStars((s) => s + 1);
    } else {
      setCoins((c) => c + (type === 'mango' ? 5 : type === 'flower' ? 3 : 2));
    }
  };

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
      />

      {/* Main Game Screen Router */}
      <main className="flex-1 flex flex-col items-center justify-center p-2 sm:p-4">
        {currentScreen === 'walking' && (
          <WalkingAdventure
            milestones={milestones}
            onOpenGame={handleOpenGame}
            onItemCollected={handleItemCollected}
            distance={distance}
            setDistance={setDistance}
            lionState={lionState}
            setLionState={setLionState}
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

      {/* Bottom Footer Credits / Encouragement */}
      <footer className="py-2 px-4 text-center text-xs font-bold text-amber-800/80 border-t border-amber-200/60 bg-white/60">
        Mind GROWUP - JR. 🦁 Adventure • Tap the baby lion to hear him roar!
      </footer>
    </div>
  );
}
