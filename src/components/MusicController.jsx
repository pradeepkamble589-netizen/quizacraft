import React, { useState } from 'react';
import { useAudio } from '../context/AudioContext';

export const MusicController = ({ variant = 'floating', className = '' }) => {
  const { isPlaying, volume, isMuted, togglePlay, setVolume, toggleMute } = useAudio();
  const [isExpanded, setIsExpanded] = useState(false);

  // Compact inline variant (used in headers / navbars)
  if (variant === 'inline') {
    return (
      <div className={`flex items-center gap-1.5 bg-emerald-800/80 backdrop-blur-md px-2.5 py-1 rounded-2xl border border-emerald-600/60 shadow-sm text-white ${className}`}>
        <button
          onClick={togglePlay}
          className="p-1 hover:scale-110 active:scale-95 transition-transform text-sm cursor-pointer"
          title={isPlaying ? 'Pause Background Music' : 'Play Jungle Adventure Music'}
          aria-label={isPlaying ? 'Pause Music' : 'Play Music'}
        >
          {isPlaying ? '⏸️' : '▶️'}
        </button>

        <button
          onClick={toggleMute}
          className="p-1 hover:scale-110 active:scale-95 transition-transform text-sm cursor-pointer"
          title={isMuted ? 'Unmute Music' : 'Mute Music'}
          aria-label={isMuted ? 'Unmute Music' : 'Mute Music'}
        >
          {isMuted || volume === 0 ? '🔇' : '🎵'}
        </button>

        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={isMuted ? 0 : volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-14 sm:w-16 h-1.5 bg-emerald-950 rounded-lg appearance-none cursor-pointer accent-amber-400"
          title={`Volume: ${Math.round((isMuted ? 0 : volume) * 100)}%`}
          aria-label="Music volume"
        />
      </div>
    );
  }

  // Floating top-right widget variant
  return (
    <div className={`fixed top-20 right-4 z-40 transition-all duration-300 ${className}`}>
      {isExpanded ? (
        <div className="bg-emerald-900/95 backdrop-blur-md rounded-3xl p-3.5 shadow-2xl border-2 border-emerald-500/80 text-white flex flex-col gap-2.5 min-w-[200px] animate-fadeIn">
          {/* Header */}
          <div className="flex items-center justify-between pb-1 border-b border-emerald-700/60 text-xs font-black">
            <span className="flex items-center gap-1 text-emerald-200">
              <span className="text-sm">🌴</span> Jungle Music
            </span>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-emerald-300 hover:text-white text-xs px-1.5 py-0.5 rounded-lg bg-emerald-800/80 cursor-pointer"
              title="Minimize Music Panel"
            >
              ✕
            </button>
          </div>

          {/* Controls row */}
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={togglePlay}
              className={`flex-1 py-1.5 px-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-transform active:scale-95 cursor-pointer ${
                isPlaying
                  ? 'bg-amber-400 hover:bg-amber-300 text-amber-950 border border-amber-300'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400'
              }`}
            >
              <span>{isPlaying ? '⏸️' : '▶️'}</span>
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>

            <button
              onClick={toggleMute}
              className="w-8 h-8 rounded-xl bg-emerald-800 hover:bg-emerald-700 flex items-center justify-center text-sm border border-emerald-600/70 transition-transform active:scale-95 cursor-pointer"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? '🔇' : '🔊'}
            </button>
          </div>

          {/* Volume Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-bold text-emerald-200">
              <span>Volume</span>
              <span>{Math.round((isMuted ? 0 : volume) * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full h-2 bg-emerald-950 rounded-lg appearance-none cursor-pointer accent-amber-400"
              aria-label="Volume slider"
            />
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsExpanded(true)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl font-black text-xs shadow-xl border-2 transition-all transform hover:scale-105 active:scale-95 cursor-pointer ${
            isPlaying
              ? 'bg-gradient-to-r from-amber-400 to-yellow-300 text-amber-950 border-amber-200 animate-bounce-slow'
              : 'bg-emerald-900/90 text-emerald-100 border-emerald-600/70 hover:bg-emerald-800'
          }`}
          title="Open Jungle Music Controls"
          aria-label="Open Music Controls"
        >
          <span className="text-base">{isPlaying ? '🎶' : '🎵'}</span>
          <span className="hidden sm:inline">{isPlaying ? 'Music: ON' : 'Music'}</span>
        </button>
      )}
    </div>
  );
};

export default MusicController;
