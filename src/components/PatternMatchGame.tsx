import React, { useState } from 'react';
import { PATTERN_QUESTIONS, SEQUENCE_LEVELS } from '../data/gameData';
import { AnimalIllustration } from './AnimalIllustration';
import { BabyLion } from './BabyLion';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';
import { ArrowLeft, CheckCircle, Sparkles, HelpCircle, Award, Star } from 'lucide-react';

interface PatternMatchGameProps {
  onBackToWalk: () => void;
  onRewardEarned: (stars: number, coins: number) => void;
}

export const PatternMatchGame: React.FC<PatternMatchGameProps> = ({
  onBackToWalk,
  onRewardEarned,
}) => {
  const [tab, setTab] = useState<'skin_pattern' | 'sequence'>('skin_pattern');
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [sequenceIndex, setSequenceIndex] = useState<number>(0);

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [lionState, setLionState] = useState<'idle' | 'celebrate' | 'roar'>('idle');

  const currentQ = PATTERN_QUESTIONS[questionIndex];
  const currentSeq = SEQUENCE_LEVELS[sequenceIndex];

  const handleSelectOption = (optionId: string) => {
    if (selectedOption !== null && isCorrect) return; // already solved

    setSelectedOption(optionId);
    if (optionId === currentQ.correctOptionId) {
      sounds.playSuccess();
      setIsCorrect(true);
      setLionState('celebrate');
      setFeedbackMessage(`🎉 Hooray! That is the ${currentQ.animalName}!`);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
      onRewardEarned(2, 15);
    } else {
      sounds.playRetry();
      setIsCorrect(false);
      setFeedbackMessage('Oops, not quite! Look closely at the pattern and try again! 🔍');
    }
  };

  const handleNextQuestion = () => {
    sounds.playClick();
    setSelectedOption(null);
    setIsCorrect(null);
    setFeedbackMessage('');
    setLionState('idle');
    setQuestionIndex((prev) => (prev + 1) % PATTERN_QUESTIONS.length);
  };

  const handleSequenceOption = (optionId: string) => {
    if (selectedOption !== null && isCorrect) return;

    setSelectedOption(optionId);
    if (optionId === currentSeq.correctId) {
      sounds.playSuccess();
      setIsCorrect(true);
      setLionState('celebrate');
      setFeedbackMessage('🌟 Perfect rhythm! You found the next safari friend!');
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
      });
      onRewardEarned(3, 20);
    } else {
      sounds.playRetry();
      setIsCorrect(false);
      setFeedbackMessage('Listen to the beat: tap the friend that repeats next!');
    }
  };

  const handleNextSequence = () => {
    sounds.playClick();
    setSelectedOption(null);
    setIsCorrect(null);
    setFeedbackMessage('');
    setLionState('idle');
    setSequenceIndex((prev) => (prev + 1) % SEQUENCE_LEVELS.length);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-3 sm:p-5 flex flex-col gap-4">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/95 backdrop-blur-sm p-4 rounded-2xl shadow-sm border border-amber-200">
        <div className="flex items-center gap-3">
          <button
            id="pattern-back-btn"
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
              <span>🧩 Animal Pattern Challenge</span>
            </h2>
            <p className="text-xs sm:text-sm text-amber-700 font-semibold">
              Examine the wild animal patterns and match them to their owners!
            </p>
          </div>
        </div>

        {/* Mode switcher tabs */}
        <div className="flex items-center gap-1 bg-amber-50 p-1 rounded-xl border border-amber-200">
          <button
            id="tab-skin-pattern"
            onClick={() => {
              sounds.playClick();
              setTab('skin_pattern');
              setSelectedOption(null);
              setIsCorrect(null);
              setFeedbackMessage('');
            }}
            className={`px-3 py-1.5 rounded-lg font-bold text-xs sm:text-sm transition cursor-pointer ${
              tab === 'skin_pattern'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-amber-800 hover:bg-amber-100'
            }`}
          >
            Coat & Skin Patterns
          </button>
          <button
            id="tab-sequence"
            onClick={() => {
              sounds.playClick();
              setTab('sequence');
              setSelectedOption(null);
              setIsCorrect(null);
              setFeedbackMessage('');
            }}
            className={`px-3 py-1.5 rounded-lg font-bold text-xs sm:text-sm transition cursor-pointer ${
              tab === 'sequence'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-amber-800 hover:bg-amber-100'
            }`}
          >
            Pattern Sequences
          </button>
        </div>
      </div>

      {/* Mode 1: Coat & Skin Patterns */}
      {tab === 'skin_pattern' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Pattern Card (Left Column) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center bg-white p-6 rounded-3xl border-2 border-amber-200 shadow-sm text-center">
            <div className="flex items-center justify-between w-full mb-3">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider bg-amber-100 px-2.5 py-1 rounded-full">
                Question {questionIndex + 1} of {PATTERN_QUESTIONS.length}
              </span>
              <span className="flex items-center gap-1 text-xs font-bold text-amber-600">
                <Sparkles className="w-4 h-4 text-amber-500" /> +2 Stars
              </span>
            </div>

            {/* Rendered SVG Animal Pattern Box */}
            <div className="relative my-2 transform hover:scale-102 transition">
              <AnimalIllustration
                type={currentQ.patternSvgSnippet}
                size={220}
                className="shadow-xl"
              />
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-amber-900 text-amber-100 text-xs font-black px-3 py-1 rounded-full shadow-md whitespace-nowrap">
                {currentQ.patternName}
              </div>
            </div>

            <p className="text-sm text-slate-600 font-semibold mt-6 max-w-xs">
              “{currentQ.animalDescription}”
            </p>

            <h3 className="text-base font-black text-slate-800 mt-2">
              Whose pattern is this?
            </h3>
          </div>

          {/* Answer Options & Animal Facts (Right Column) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="bg-white p-5 rounded-3xl border-2 border-amber-200 shadow-sm flex flex-col gap-3">
              <h4 className="font-extrabold text-amber-900 text-sm flex items-center gap-2">
                <span>Select the matching animal:</span>
              </h4>

              <div className="grid grid-cols-2 gap-3">
                {currentQ.options.map((opt) => {
                  const isThisSelected = selectedOption === opt.id;
                  const isThisCorrect = opt.id === currentQ.correctOptionId;

                  let btnStyle = 'bg-amber-50/70 border-amber-200 hover:bg-amber-100 text-slate-800';
                  if (isThisSelected) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-500 text-white border-emerald-600 shadow-md scale-102';
                    } else {
                      btnStyle = 'bg-rose-100 text-rose-800 border-rose-300';
                    }
                  } else if (isCorrect && isThisCorrect) {
                    btnStyle = 'bg-emerald-100 text-emerald-800 border-emerald-400';
                  }

                  return (
                    <button
                      key={opt.id}
                      id={`pattern-opt-${opt.id}`}
                      onClick={() => handleSelectOption(opt.id)}
                      className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 font-black text-sm sm:text-base transition cursor-pointer ${btnStyle}`}
                    >
                      <span className="text-3xl filter drop-shadow-sm">{opt.emoji}</span>
                      <div className="text-left">
                        <div>{opt.name}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Feedback Alert */}
              {feedbackMessage && (
                <div
                  className={`p-3.5 rounded-2xl font-bold text-sm flex items-center justify-between gap-2 mt-2 ${
                    isCorrect
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      : 'bg-amber-100 text-amber-900 border border-amber-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                    ) : (
                      <HelpCircle className="w-5 h-5 text-amber-600 shrink-0" />
                    )}
                    <span>{feedbackMessage}</span>
                  </div>

                  {isCorrect && (
                    <button
                      id="next-pattern-btn"
                      onClick={handleNextQuestion}
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl shadow cursor-pointer transition whitespace-nowrap"
                    >
                      Next Pattern ➔
                    </button>
                  )}
                </div>
              )}

              {/* Fun Animal Fact revealed after correct answer */}
              {isCorrect && (
                <div className="bg-amber-50 p-4 rounded-2xl border border-amber-300 text-xs sm:text-sm text-amber-950 font-medium animate-fadeIn">
                  <div className="font-extrabold text-amber-800 mb-1 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-600" />
                    <span>Safari Explorer Fact:</span>
                  </div>
                  <p>{currentQ.fact}</p>
                </div>
              )}
            </div>

            {/* Baby Lion Helper Box */}
            <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-4 rounded-3xl border border-amber-300 flex items-center justify-between gap-4">
              <div className="text-left">
                <h4 className="font-black text-amber-900 text-sm">Baby Lion's Hint:</h4>
                <p className="text-xs text-amber-800 font-semibold mt-0.5">
                  “Animals use their coats to hide in the grass or recognize their family! Look at the colors closely!”
                </p>
              </div>
              <BabyLion
                state={lionState}
                scale={0.65}
                onClick={() => {
                  sounds.playRoar();
                  setLionState('roar');
                  setTimeout(() => setLionState('idle'), 1500);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: Sequence Pattern Rhythm */}
      {tab === 'sequence' && (
        <div className="bg-white p-6 rounded-3xl border-2 border-amber-200 shadow-sm flex flex-col items-center gap-5">
          <div className="text-center">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider bg-amber-100 px-3 py-1 rounded-full">
              Sequence {sequenceIndex + 1} of {SEQUENCE_LEVELS.length}
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-amber-950 mt-2">
              What comes next in the safari rhythm?
            </h3>
            <p className="text-sm text-slate-600 font-semibold mt-0.5">
              Say each animal out loud and find the repeating friend!
            </p>
          </div>

          {/* Visual Sequence Card Chain */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap p-4 bg-amber-50 rounded-2xl border border-amber-200 w-full max-w-2xl">
            {currentSeq.sequence.map((item, idx) => (
              <div
                key={idx}
                className={`w-16 h-20 sm:w-20 sm:h-24 rounded-2xl flex flex-col items-center justify-center border-2 shadow-sm ${
                  idx === currentSeq.missingIndex
                    ? 'bg-amber-200/80 border-dashed border-amber-500 animate-pulse'
                    : 'bg-white border-amber-200'
                }`}
              >
                <span className="text-3xl sm:text-4xl">{item.emoji}</span>
                <span className="text-[10px] sm:text-xs font-bold text-slate-700 mt-1 truncate px-1">
                  {item.name}
                </span>
              </div>
            ))}
          </div>

          {/* Answer Choice Options */}
          <div className="flex flex-col items-center gap-3 w-full max-w-md">
            <span className="text-xs font-black text-amber-900 uppercase tracking-wider">
              Choose the missing friend:
            </span>
            <div className="grid grid-cols-3 gap-3 w-full">
              {currentSeq.options.map((opt) => (
                <button
                  key={opt.id}
                  id={`seq-opt-${opt.id}`}
                  onClick={() => handleSequenceOption(opt.id)}
                  className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition cursor-pointer ${
                    selectedOption === opt.id
                      ? isCorrect
                        ? 'bg-emerald-500 text-white border-emerald-600 shadow-md scale-105'
                        : 'bg-rose-100 text-rose-800 border-rose-300'
                      : 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-slate-800'
                  }`}
                >
                  <span className="text-3xl">{opt.emoji}</span>
                  <span className="text-xs font-black">{opt.name}</span>
                </button>
              ))}
            </div>

            {feedbackMessage && (
              <div
                className={`p-3.5 rounded-2xl font-bold text-sm w-full flex items-center justify-between gap-2 mt-2 ${
                  isCorrect
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    : 'bg-amber-100 text-amber-900 border border-amber-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{feedbackMessage}</span>
                </div>
                {isCorrect && (
                  <button
                    id="next-seq-btn"
                    onClick={handleNextSequence}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl shadow cursor-pointer"
                  >
                    Next ➔
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
