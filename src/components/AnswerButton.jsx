import React from 'react';

const LETTER_BADGES = ['A', 'B', 'C', 'D'];
const BADGE_COLORS = [
  'bg-blue-100 text-blue-800 border-blue-300',
  'bg-purple-100 text-purple-800 border-purple-300',
  'bg-amber-100 text-amber-800 border-amber-300',
  'bg-rose-100 text-rose-800 border-rose-300'
];

export const AnswerButton = ({
  index = 0,
  optionText = '',
  isSelected = false,
  isCorrect = false,
  isAnswered = false,
  isRightAnswer = false, // When answered, highlight the correct option
  onClick,
  disabled = false
}) => {
  const letter = LETTER_BADGES[index] || `${index + 1}`;
  const badgeColor = BADGE_COLORS[index % BADGE_COLORS.length];

  // Determine button state style
  let containerStyles = 'bg-white hover:bg-emerald-50 text-slate-800 border-2 border-emerald-200 hover:border-emerald-400 shadow-md hover:-translate-y-1 active:translate-y-0.5';
  let badgeStyle = badgeColor;
  let statusIcon = null;

  if (isAnswered) {
    if (isRightAnswer) {
      containerStyles = 'bg-emerald-500 text-white border-2 border-green-700 shadow-lg shadow-green-200 ring-4 ring-green-300 scale-[1.02]';
      badgeStyle = 'bg-white text-emerald-800 border-green-300';
      statusIcon = '✅';
    } else if (isSelected && !isCorrect) {
      containerStyles = 'bg-rose-500 text-white border-2 border-red-700 shadow-lg shadow-red-200 ring-4 ring-rose-300';
      badgeStyle = 'bg-white text-rose-800 border-rose-300';
      statusIcon = '❌';
    } else {
      containerStyles = 'bg-slate-100/70 text-slate-400 border-2 border-slate-200 opacity-60';
      badgeStyle = 'bg-slate-200 text-slate-500 border-slate-300';
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || isAnswered}
      aria-label={`Option ${letter}: ${optionText}`}
      className={`w-full p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl flex items-center justify-between text-left transition-all duration-200 select-none group cursor-pointer focus:outline-none focus:ring-4 focus:ring-emerald-300 ${containerStyles} ${
        disabled && !isAnswered ? 'cursor-not-allowed opacity-50' : ''
      }`}
    >
      <div className="flex items-center gap-3 sm:gap-4 flex-1">
        {/* Letter Badge */}
        <span
          className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl border-2 flex items-center justify-center font-black text-base sm:text-lg flex-shrink-0 shadow-sm transition-transform group-hover:scale-110 ${badgeStyle}`}
        >
          {letter}
        </span>

        {/* Option Text */}
        <span className="font-bold text-base sm:text-lg leading-snug flex-1">
          {optionText}
        </span>
      </div>

      {/* Result Status Icon */}
      {statusIcon && (
        <span className="text-2xl sm:text-3xl ml-2 flex-shrink-0 animate-bounce">
          {statusIcon}
        </span>
      )}
    </button>
  );
};

export default AnswerButton;
