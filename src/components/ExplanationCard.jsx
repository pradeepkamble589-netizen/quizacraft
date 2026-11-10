import React from 'react';
import { Button } from './ui/Button';

export const ExplanationCard = ({
  isCorrect = false,
  isTimeout = false,
  explanation = '',
  funFact = '',
  correctAnswerText = '',
  onReplayVoice,
  isSpeaking = false,
  onNext,
  isLastQuestion = false
}) => {
  return (
    <div
      className={`mt-6 p-5 sm:p-6 rounded-3xl border-3 shadow-xl backdrop-blur-md transition-all duration-300 animate-fadeIn ${
        isCorrect
          ? 'bg-gradient-to-br from-emerald-50 to-green-100 border-emerald-400 text-emerald-950'
          : isTimeout
          ? 'bg-gradient-to-br from-amber-50 to-orange-100 border-amber-400 text-amber-950'
          : 'bg-gradient-to-br from-rose-50 to-amber-50 border-rose-300 text-rose-950'
      }`}
    >
      {/* Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl sm:text-4xl">
            {isCorrect ? '🎉' : isTimeout ? '⏰' : '💡'}
          </span>
          <div>
            <h3 className="text-xl sm:text-2xl font-black">
              {isCorrect
                ? 'Awesome! Correct! +1 Star ⭐'
                : isTimeout
                ? 'Time is Up! Good Effort!'
                : 'Good Try! Keep Learning!'}
            </h3>
            {!isCorrect && correctAnswerText && (
              <p className="text-sm font-bold opacity-90">
                The correct answer was: <span className="underline decoration-wavy decoration-emerald-500 font-extrabold">{correctAnswerText}</span>
              </p>
            )}
          </div>
        </div>

        {/* Replay Voice button */}
        {onReplayVoice && (
          <button
            type="button"
            onClick={onReplayVoice}
            className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-2xl text-xs font-black border transition-all cursor-pointer active:scale-95 shadow-sm self-start sm:self-auto ${
              isSpeaking
                ? 'bg-amber-400 text-amber-950 border-amber-500 animate-pulse ring-2 ring-amber-300'
                : 'bg-white hover:bg-emerald-50 text-emerald-900 border-emerald-300'
            }`}
            title="Click to replay narrator reading explanation"
          >
            <span>{isSpeaking ? '🗣️' : '▶'}</span>
            <span>{isSpeaking ? 'Narrating...' : 'Replay Voice'}</span>
          </button>
        )}
      </div>

      {/* Explanation Text */}
      <div className="bg-white/85 rounded-2xl p-4 border border-emerald-200/60 shadow-sm mb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-black uppercase tracking-wider text-emerald-800">
            🔍 Why?
          </span>
        </div>
        <p className="text-base sm:text-lg font-bold text-slate-800 leading-relaxed">
          {explanation}
        </p>

        {funFact && (
          <div className="mt-3 pt-3 border-t border-emerald-100 flex items-start gap-2 text-sm text-emerald-900 font-semibold bg-emerald-50/60 p-2.5 rounded-xl">
            <span className="text-base flex-shrink-0">🌟</span>
            <div>
              <span className="font-extrabold">Fun Fact: </span>
              {funFact}
            </div>
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="flex justify-end">
        <Button
          variant={isLastQuestion ? "accent" : "primary"}
          size="lg"
          onClick={onNext}
          className="w-full sm:w-auto font-black text-lg shadow-lg"
          icon={isLastQuestion ? "🏆" : "👉"}
        >
          {isLastQuestion ? 'See Final Score 🎉' : 'Next Question 🌿'}
        </Button>
      </div>
    </div>
  );
};

export default ExplanationCard;
