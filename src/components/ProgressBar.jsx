import React from 'react';

export const ProgressBar = ({ current = 1, total = 5, categoryIcon = '🦁' }) => {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1.5 text-xs sm:text-sm font-extrabold text-emerald-100">
        <span className="flex items-center gap-1.5 bg-emerald-900/60 px-2.5 py-1 rounded-xl border border-emerald-700/50">
          <span>{categoryIcon || '🌿'}</span> Question {current} of {total}
        </span>
        <span className="bg-amber-400/90 text-amber-950 px-2.5 py-0.5 rounded-xl font-black text-xs shadow-sm">
          {percentage}%
        </span>
      </div>

      <div className="relative h-4 bg-emerald-950/80 rounded-full border-2 border-emerald-600/60 p-0.5 shadow-inner overflow-hidden">
        {/* Animated Green Progress Fill */}
        <div
          className="h-full bg-gradient-to-r from-emerald-400 via-green-400 to-amber-300 rounded-full transition-all duration-500 ease-out shadow-sm relative"
          style={{ width: `${Math.max(5, percentage)}%` }}
        >
          {/* Shimmer light effect */}
          <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
