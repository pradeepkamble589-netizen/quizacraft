import React, { useEffect } from 'react';
import { playTickSound, playWarningSound } from '../utils/audio';

export const Timer = ({ timeLeft = 20, maxTime = 20, isPaused = false, isEnabled = true }) => {
  const isUrgent = isEnabled && timeLeft <= 5 && timeLeft > 0;
  const isExpired = isEnabled && timeLeft === 0;

  useEffect(() => {
    if (!isEnabled || isPaused) return;

    if (timeLeft <= 5 && timeLeft > 0) {
      playWarningSound();
    }
  }, [timeLeft, isUrgent, isPaused, isEnabled]);

  if (!isEnabled) {
    return (
      <div className="flex items-center gap-1.5 bg-emerald-100 text-emerald-900 border-2 border-emerald-300 font-bold px-3 py-1.5 rounded-2xl text-xs sm:text-sm shadow-sm">
        <span>⏳</span>
        <span>Untimed Mode</span>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-2xl font-black text-sm sm:text-base border-2 transition-all duration-300 shadow-sm ${
        isUrgent
          ? 'bg-rose-500 text-white border-rose-300 animate-pulse-warning shadow-rose-400/50'
          : isExpired
          ? 'bg-red-800 text-white border-red-900 opacity-90'
          : 'bg-amber-100 text-amber-950 border-amber-300 shadow-amber-200'
      }`}
      aria-label={`Time remaining: ${timeLeft} seconds`}
    >
      <span className={`text-base ${isUrgent ? 'animate-bounce' : ''}`}>
        {isUrgent ? '⏰' : '⏱️'}
      </span>
      <div className="flex items-baseline gap-0.5">
        <span className="font-extrabold tabular-nums text-lg leading-none">{timeLeft}</span>
        <span className="text-xs opacity-80">s</span>
      </div>
    </div>
  );
};

export default Timer;
