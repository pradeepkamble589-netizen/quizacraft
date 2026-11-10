import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { getStoredStats } from '../utils/storage';
import { useAudio } from '../context/AudioContext';
import SettingsModal from '../components/SettingsModal';
import ScreenRecorder from '../components/ScreenRecorder';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { playMusic, isPlaying } = useAudio();
  const [stats, setStats] = useState({ bestScore: 0, bestTotal: 5, quizzesPlayed: 0, totalStars: 0 });
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    setStats(getStoredStats());
  }, []);

  const handleStartQuick = () => {
    // Start background music seamlessly upon user interaction
    if (!isPlaying) {
      playMusic();
    }
    navigate('/play', { state: { category: 'mixed', difficulty: 'medium', count: 5 } });
  };

  const handleChooseCategory = () => {
    if (!isPlaying) {
      playMusic();
    }
    navigate('/categories');
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 max-w-4xl mx-auto w-full">
      {/* Top Controls Bar */}
      <div className="w-full flex justify-between items-center mb-2">
        <ScreenRecorder variant="button" />

        <button
          onClick={() => setSettingsOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 border border-emerald-700/60 text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95 cursor-pointer"
        >
          <span>⚙️</span>
          <span>Settings</span>
        </button>
      </div>

      {/* Main Jungle Hero Card */}
      <div className="w-full bg-gradient-to-b from-white via-emerald-50/90 to-yellow-50/80 backdrop-blur-md rounded-3xl p-6 sm:p-10 shadow-2xl border-4 border-emerald-300 text-center relative overflow-hidden">
        {/* Decorative corner leaves */}
        <div className="absolute top-2 left-3 text-3xl opacity-40 select-none animate-bounce-slow">🌿</div>
        <div className="absolute top-3 right-4 text-3xl opacity-40 select-none animate-bounce-slow" style={{ animationDelay: '1s' }}>🍃</div>

        {/* Mascot & Logo */}
        <div className="inline-flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-amber-300 to-yellow-200 border-4 border-amber-400 shadow-xl mb-4 text-5xl sm:text-6xl animate-bounce-slow">
          🦁
        </div>

        <div className="mb-2">
          <span className="inline-block bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs sm:text-sm font-black px-3.5 py-1 rounded-full uppercase tracking-wider shadow-sm mb-2">
            🌟 Welcome to QuizCraft Kids
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-emerald-950 tracking-tight drop-shadow-sm">
            Jungle Quiz Adventure!
          </h1>
          <p className="text-base sm:text-xl font-bold text-emerald-800 mt-2 max-w-lg mx-auto">
            Explore, answer fun questions, and collect shiny golden stars!
          </p>
        </div>

        {/* 3 Kid-Friendly Feature Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-6 max-w-2xl mx-auto">
          <div className="bg-white/90 border-2 border-emerald-200 rounded-2xl p-3 shadow-md flex items-center gap-3">
            <span className="text-3xl bg-emerald-100 p-2 rounded-xl">🎯</span>
            <div className="text-left">
              <p className="font-extrabold text-sm text-emerald-950">5 Questions</p>
              <p className="text-xs font-semibold text-emerald-700">Quick safari quests</p>
            </div>
          </div>

          <div className="bg-white/90 border-2 border-amber-200 rounded-2xl p-3 shadow-md flex items-center gap-3">
            <span className="text-3xl bg-amber-100 p-2 rounded-xl">⏱️</span>
            <div className="text-left">
              <p className="font-extrabold text-sm text-amber-950">Timed Challenge</p>
              <p className="text-xs font-semibold text-amber-700">20s per question</p>
            </div>
          </div>

          <div className="bg-white/90 border-2 border-yellow-200 rounded-2xl p-3 shadow-md flex items-center gap-3">
            <span className="text-3xl bg-yellow-100 p-2 rounded-xl">⭐</span>
            <div className="text-left">
              <p className="font-extrabold text-sm text-yellow-950">Earn Stars</p>
              <p className="text-xs font-semibold text-yellow-700">Collect & level up</p>
            </div>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto mb-6">
          <Button
            variant="accent"
            size="xl"
            className="w-full text-xl shadow-xl font-black py-4"
            onClick={handleStartQuick}
            icon="🚀"
          >
            Start Adventure
          </Button>

          <Button
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto font-black"
            onClick={handleChooseCategory}
            icon="🗺️"
          >
            Pick Topic
          </Button>
        </div>

        {/* Instruction Note */}
        <div className="bg-emerald-100/80 rounded-2xl p-3 border border-emerald-300/80 max-w-lg mx-auto text-xs sm:text-sm font-bold text-emerald-900 flex items-center justify-center gap-2">
          <span>💡</span>
          <span>Tip: Choose the correct answer before the timer runs out to win stars!</span>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="w-full max-w-4xl mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-emerald-900/80 backdrop-blur-sm border border-emerald-700/60 rounded-2xl p-3 text-center shadow-lg">
          <p className="text-xs font-bold text-emerald-300 uppercase">🏆 Best Score</p>
          <p className="text-xl sm:text-2xl font-black text-amber-400">
            {stats.bestScore} / {stats.bestTotal}
          </p>
        </div>

        <div className="bg-emerald-900/80 backdrop-blur-sm border border-emerald-700/60 rounded-2xl p-3 text-center shadow-lg">
          <p className="text-xs font-bold text-emerald-300 uppercase">🎮 Quizzes Played</p>
          <p className="text-xl sm:text-2xl font-black text-emerald-200">
            {stats.quizzesPlayed}
          </p>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-emerald-900/80 backdrop-blur-sm border border-emerald-700/60 rounded-2xl p-3 text-center shadow-lg">
          <p className="text-xs font-bold text-emerald-300 uppercase">⭐ Stars Collected</p>
          <p className="text-xl sm:text-2xl font-black text-yellow-300">
            {stats.totalStars}
          </p>
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onSettingsUpdated={() => setStats(getStoredStats())}
      />
    </div>
  );
};

export default LandingPage;