import React, { useState, useEffect } from 'react';
import { MEMORY_ANIMALS } from '../data/gameData';
import { MemoryCard } from '../types';
import { BabyLion } from './BabyLion';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';
import { ArrowLeft, RotateCcw, Trophy, Sparkles } from 'lucide-react';

interface MemoryMatchGameProps {
  onBackToWalk: () => void;
  onRewardEarned: (stars: number, coins: number) => void;
}

export const MemoryMatchGame: React.FC<MemoryMatchGameProps> = ({
  onBackToWalk,
  onRewardEarned,
}) => {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchesCount, setMatchesCount] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [isWon, setIsWon] = useState<boolean>(false);
  const [lionState, setLionState] = useState<'idle' | 'celebrate' | 'roar'>('idle');

  // Initialize deck (6 pairs = 12 cards)
  const initializeGame = () => {
    sounds.playClick();
    const selectedPairs = MEMORY_ANIMALS.slice(0, 6);
    const deck: MemoryCard[] = [];

    selectedPairs.forEach((item, index) => {
      // Add pair 1
      deck.push({
        id: index * 2,
        pairId: item.name,
        name: item.name,
        emoji: item.emoji,
        color: item.color,
        sound: item.sound,
        isFlipped: false,
        isMatched: false,
      });
      // Add pair 2
      deck.push({
        id: index * 2 + 1,
        pairId: item.name,
        name: item.name,
        emoji: item.emoji,
        color: item.color,
        sound: item.sound,
        isFlipped: false,
        isMatched: false,
      });
    });

    // Shuffle deck
    const shuffled = deck.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlippedIndices([]);
    setMatchesCount(0);
    setMoves(0);
    setIsWon(false);
    setLionState('idle');
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const handleCardClick = (index: number) => {
    if (cards[index].isFlipped || cards[index].isMatched) return;
    if (flippedIndices.length === 2) return;

    sounds.playClick();

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [firstIdx, secondIdx] = newFlipped;
      const firstCard = newCards[firstIdx];
      const secondCard = newCards[secondIdx];

      if (firstCard.pairId === secondCard.pairId) {
        // MATCH!
        sounds.playSuccess();
        newCards[firstIdx].isMatched = true;
        newCards[secondIdx].isMatched = true;
        setCards(newCards);
        setFlippedIndices([]);
        setMatchesCount((c) => {
          const nextCount = c + 1;
          if (nextCount === 6) {
            // GAME WON!
            handleGameWon();
          }
          return nextCount;
        });
      } else {
        // NO MATCH -> Flip back after delay
        sounds.playRetry();
        setTimeout(() => {
          const resetCards = [...cards];
          resetCards[firstIdx].isFlipped = false;
          resetCards[secondIdx].isFlipped = false;
          setCards(resetCards);
          setFlippedIndices([]);
        }, 900);
      }
    }
  };

  const handleGameWon = () => {
    sounds.playSuccess();
    sounds.playRoar();
    setIsWon(true);
    setLionState('celebrate');
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
    });
    onRewardEarned(4, 30);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-3 sm:p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/95 backdrop-blur-sm p-4 rounded-2xl shadow-sm border border-amber-200">
        <div className="flex items-center gap-3">
          <button
            id="memory-back-btn"
            onClick={() => {
              sounds.playClick();
              onBackToWalk();
            }}
            className="flex items-center gap-1.5 px-3 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold rounded-xl transition cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Back to Trail</span>
          </button>
          <div>
            <h2 className="text-lg sm:text-2xl font-black text-amber-900 flex items-center gap-2">
              <span>🧠 Safari Animal Memory Match</span>
            </h2>
            <p className="text-xs sm:text-sm text-amber-700 font-semibold">
              Find the matching pairs of safari animal friends!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-900 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
            <span>Pairs: {matchesCount} / 6</span>
            <span className="text-amber-300">|</span>
            <span>Moves: {moves}</span>
          </div>

          <button
            id="reset-memory-btn"
            onClick={initializeGame}
            className="p-2 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl transition cursor-pointer"
            title="Shuffle & Restart"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Win Banner */}
      {isWon && (
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-4 rounded-3xl shadow-lg flex items-center justify-between gap-4 animate-bounce-subtle">
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-amber-300 shrink-0" />
            <div>
              <h3 className="font-black text-base sm:text-lg">Outstanding Memory, Explorer!</h3>
              <p className="text-xs sm:text-sm text-emerald-100 font-semibold">
                You paired all 6 animal families in {moves} moves! +4 Stars & 30 Coins!
              </p>
            </div>
          </div>
          <button
            id="play-again-memory-btn"
            onClick={initializeGame}
            className="px-4 py-2 bg-white text-emerald-800 font-black text-xs rounded-xl shadow hover:bg-emerald-50 transition cursor-pointer whitespace-nowrap"
          >
            Play Again ↺
          </button>
        </div>
      )}

      {/* Cards Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4 p-4 bg-white rounded-3xl border-2 border-amber-200 shadow-sm">
        {cards.map((card, idx) => (
          <button
            key={card.id}
            id={`mem-card-${idx}`}
            onClick={() => handleCardClick(idx)}
            className={`aspect-square rounded-2xl flex flex-col items-center justify-center p-2 transition-all duration-300 transform select-none cursor-pointer border-2 ${
              card.isMatched
                ? 'bg-emerald-50 border-emerald-400 opacity-90 scale-95 shadow-inner'
                : card.isFlipped
                ? 'bg-amber-100 border-amber-400 shadow-md rotate-0 scale-100'
                : 'bg-gradient-to-br from-amber-400 to-orange-500 border-amber-300 hover:scale-102 shadow-md hover:shadow-lg'
            }`}
          >
            {card.isFlipped || card.isMatched ? (
              <div className="flex flex-col items-center justify-center animate-fadeIn">
                <span className="text-4xl sm:text-5xl filter drop-shadow-sm">{card.emoji}</span>
                <span className="text-xs font-black text-slate-800 mt-1 truncate max-w-[80px]">
                  {card.name}
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-white">
                <span className="text-3xl sm:text-4xl opacity-90">🐾</span>
                <span className="text-[10px] sm:text-xs font-bold tracking-widest mt-1 opacity-80 uppercase">
                  Safari
                </span>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Mascot Cheer footer */}
      <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-4 rounded-3xl border border-amber-300 flex items-center justify-between gap-3">
        <div>
          <h4 className="font-black text-amber-950 text-sm">Baby Lion is Cheering You On!</h4>
          <p className="text-xs text-amber-800 font-semibold mt-0.5">
            “Remember where each friend is hiding! My elephant and giraffe friends are waiting for you!”
          </p>
        </div>
        <BabyLion
          state={lionState}
          scale={0.65}
          onClick={() => {
            sounds.playRoar();
            setLionState('roar');
            setTimeout(() => setLionState('idle'), 1800);
          }}
        />
      </div>
    </div>
  );
};
