import React, { useState } from 'react';
import { PHOTO_DETECTIVE_ITEMS } from '../data/gameData';
import { AnimalIllustration } from './AnimalIllustration';
import { BabyLion } from './BabyLion';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  Camera,
  CheckCircle,
  HelpCircle,
  Volume2,
  Sparkles,
  Info,
  Award,
} from 'lucide-react';

interface PhotoDetectiveGameProps {
  onBackToWalk: () => void;
  onRewardEarned: (stars: number, coins: number) => void;
}

export const PhotoDetectiveGame: React.FC<PhotoDetectiveGameProps> = ({
  onBackToWalk,
  onRewardEarned,
}) => {
  const [itemIndex, setItemIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [revealPhoto, setRevealPhoto] = useState<boolean>(false);
  const [lionCheer, setLionCheer] = useState<boolean>(false);

  const currentItem = PHOTO_DETECTIVE_ITEMS[itemIndex];

  const handleSelectOption = (optId: string) => {
    if (selectedOption !== null && isCorrect) return;

    setSelectedOption(optId);
    if (optId === currentItem.correctOptionId) {
      sounds.playSuccess();
      setIsCorrect(true);
      setRevealPhoto(true);
      setLionCheer(true);
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 },
      });
      onRewardEarned(currentItem.starsReward, 25);
    } else {
      sounds.playRetry();
      setIsCorrect(false);
    }
  };

  const handleNextItem = () => {
    sounds.playClick();
    setSelectedOption(null);
    setIsCorrect(null);
    setRevealPhoto(false);
    setLionCheer(false);
    setItemIndex((prev) => (prev + 1) % PHOTO_DETECTIVE_ITEMS.length);
  };

  const handleHearCall = () => {
    sounds.playColorPop();
    if (currentItem.id === 'photo-lion') {
      sounds.playRoar();
    } else if (currentItem.id === 'photo-elephant') {
      sounds.playJump();
    } else {
      sounds.playSuccess();
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-3 sm:p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/95 backdrop-blur-sm p-4 rounded-2xl shadow-sm border border-amber-200">
        <div className="flex items-center gap-3">
          <button
            id="photo-back-btn"
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
              <Camera className="w-6 h-6 text-amber-600" />
              <span>Safari Photo Detective</span>
            </h2>
            <p className="text-xs sm:text-sm text-amber-700 font-semibold">
              Can you guess the wild animal hiding behind the safari camera lens?
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
          <span className="text-xs font-bold text-amber-800">
            Card {itemIndex + 1} of {PHOTO_DETECTIVE_ITEMS.length}
          </span>
        </div>
      </div>

      {/* Main Game Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Polaroid Camera Photo Card */}
        <div className="lg:col-span-5 flex flex-col items-center bg-white p-5 rounded-3xl border-2 border-amber-200 shadow-sm text-center">
          {/* Polaroid style frame */}
          <div className="bg-amber-50 p-4 pb-6 rounded-2xl shadow-md border border-amber-200 w-full max-w-[300px] flex flex-col items-center transform -rotate-1 hover:rotate-0 transition duration-300">
            <div className="relative w-full aspect-square bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center border-2 border-amber-300">
              {/* Silhouette or full color animal */}
              <div
                className={`transition-all duration-700 ${
                  revealPhoto ? 'filter-none scale-100' : 'brightness-0 contrast-200 scale-95 opacity-80'
                }`}
              >
                <AnimalIllustration type={currentItem.photoSvg} size={220} />
              </div>

              {/* Mystery Question Overlay if not yet solved */}
              {!revealPhoto && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-amber-900/30 backdrop-blur-[2px]">
                  <span className="text-5xl animate-bounce">🔍</span>
                  <span className="text-xs font-black text-white bg-amber-600/90 px-3 py-1 rounded-full mt-2 tracking-wider">
                    WHO IS THIS?
                  </span>
                </div>
              )}

              {/* Solved celebration badge */}
              {revealPhoto && (
                <div className="absolute top-2 right-2 bg-emerald-500 text-white p-1 rounded-full shadow-lg">
                  <CheckCircle className="w-5 h-5" />
                </div>
              )}
            </div>

            {/* Polaroid caption text */}
            <div className="mt-3 font-['Fredoka',sans-serif] text-base font-bold text-slate-800">
              {revealPhoto ? currentItem.animalName : 'Wild Mystery Animal'}
            </div>
            <div className="text-xs text-amber-700 font-medium">
              Safari Expedition #0{itemIndex + 1}
            </div>
          </div>

          {/* Sound Call Button */}
          <button
            id="animal-sound-btn"
            onClick={handleHearCall}
            onMouseEnter={() => sounds.playHover()}
            className="mt-4 flex items-center gap-2 px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 font-extrabold text-xs rounded-xl transition cursor-pointer border border-amber-300"
          >
            <Volume2 className="w-4 h-4 text-amber-700" />
            <span>Animal Sound: "{currentItem.soundText}"</span>
          </button>
        </div>

        {/* Right Column: Detective Clues and Multiple Choices */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="bg-white p-5 rounded-3xl border-2 border-amber-200 shadow-sm flex flex-col gap-4">
            {/* Clue Box */}
            <div className="bg-amber-50/80 p-4 rounded-2xl border border-amber-200">
              <div className="flex items-center gap-2 text-xs font-black text-amber-900 uppercase tracking-wider mb-1">
                <Info className="w-4 h-4 text-amber-600" />
                <span>Detective Field Clue:</span>
              </div>
              <p className="text-sm sm:text-base font-bold text-slate-800 italic">
                “{currentItem.clue}”
              </p>
            </div>

            {/* Multiple Choice Animal Options */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-black text-amber-900 uppercase tracking-wider">
                Select the correct safari animal:
              </span>

              <div className="grid grid-cols-2 gap-3">
                {currentItem.options.map((opt) => {
                  const isThisSelected = selectedOption === opt.id;
                  const isThisCorrect = opt.id === currentItem.correctOptionId;

                  let btnStyle = 'bg-amber-50/70 border-amber-200 hover:bg-amber-100 text-slate-800';
                  if (isThisSelected) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-500 text-white border-emerald-600 shadow-md scale-102';
                    } else {
                      btnStyle = 'bg-rose-100 text-rose-800 border-rose-300';
                    }
                  } else if (revealPhoto && isThisCorrect) {
                    btnStyle = 'bg-emerald-100 text-emerald-800 border-emerald-400';
                  }

                  return (
                    <button
                      key={opt.id}
                      id={`photo-opt-${opt.id}`}
                      onClick={() => handleSelectOption(opt.id)}
                      onMouseEnter={() => sounds.playHover()}
                      className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 font-black text-sm sm:text-base transition cursor-pointer ${btnStyle}`}
                    >
                      <span className="text-3xl">{opt.emoji}</span>
                      <span>{opt.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Answer Result & Fun Fact Card */}
            {isCorrect !== null && (
              <div
                className={`p-4 rounded-2xl border ${
                  isCorrect
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                    : 'bg-amber-50 border-amber-300 text-amber-950'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-black text-sm sm:text-base">
                    {isCorrect ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                        <span>Bingo! You solved the mystery!</span>
                      </>
                    ) : (
                      <>
                        <HelpCircle className="w-5 h-5 text-amber-600 shrink-0" />
                        <span>Not quite! Reread the clue and try another guess!</span>
                      </>
                    )}
                  </div>

                  {isCorrect && (
                    <button
                      id="next-photo-item-btn"
                      onClick={handleNextItem}
                      onMouseEnter={() => sounds.playHover()}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow transition cursor-pointer"
                    >
                      Next Animal ➔
                    </button>
                  )}
                </div>

                {isCorrect && (
                  <div className="mt-3 pt-3 border-t border-emerald-200/80 text-xs sm:text-sm font-medium">
                    <span className="font-black text-emerald-800">Did you know? </span>
                    {currentItem.funFact}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Baby Lion Mascot Companion */}
          <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-4 rounded-3xl border border-amber-300 flex items-center justify-between gap-3">
            <div>
              <h4 className="font-black text-amber-950 text-sm">Baby Lion Explorer</h4>
              <p className="text-xs text-amber-800 font-semibold mt-0.5">
                {lionCheer
                  ? '“You have sharp eyes, safari detective! Let’s keep exploring!” 🌟'
                  : '“Look at the silhouettes and read the clues together!”'}
              </p>
            </div>
            <BabyLion
              state={lionCheer ? 'celebrate' : 'idle'}
              scale={0.65}
              onClick={() => {
                sounds.playRoar();
                setLionCheer(true);
                setTimeout(() => setLionCheer(false), 2000);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
