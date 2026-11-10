import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isSoundEnabled, setSoundEnabled, playClickSound } from '../utils/audio';
import { voiceService } from '../services/voiceService';
import ScreenRecorder from './ScreenRecorder';
import SettingsModal from './SettingsModal';

export const Header = ({ stars = 0, categoryName = '', onQuit, showScore = false, score = 0, totalQuestions = 5 }) => {
  const [soundOn, setSoundOn] = useState(true);
  const [voiceOn, setVoiceOn] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setSoundOn(isSoundEnabled());
    const vSettings = voiceService.getNarratorSettings();
    setVoiceOn(vSettings.enabled);

    const unsubscribe = voiceService.subscribe((settings, state) => {
      setVoiceOn(settings.enabled);
      setIsSpeaking(state.isSpeaking);
    });

    return () => unsubscribe();
  }, []);

  const toggleSound = () => {
    const newState = !soundOn;
    setSoundOn(newState);
    setSoundEnabled(newState);
    if (newState) {
      playClickSound();
    }
  };

  const toggleVoice = () => {
    const newState = !voiceOn;
    setVoiceOn(newState);
    voiceService.setEnabled(newState);
    if (newState) {
      playClickSound();
      voiceService.speak("Voice narration enabled!");
    } else {
      voiceService.stopSpeaking();
    }
  };

  const handleQuit = () => {
    voiceService.stopSpeaking();
    if (onQuit) {
      onQuit();
    } else {
      navigate('/');
    }
  };

  return (
    <>
      <header className="w-full bg-emerald-900/90 backdrop-blur-md border-b-2 border-emerald-700/50 text-white py-2.5 px-3 sm:px-4 shadow-lg sticky top-0 z-30">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
          {/* Left: Logo & Category */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link to="/" className="flex items-center gap-2 group">
              <span className="text-2xl sm:text-3xl group-hover:scale-110 transition-transform">🌟</span>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-lg font-black tracking-tight leading-none">QuizCraft</span>
                <span className="text-[10px] text-emerald-300 font-semibold tracking-wide">Learn. Play. Explore.</span>
              </div>
            </Link>

            {categoryName && (
              <div className="bg-emerald-800/90 text-emerald-200 border border-emerald-600/50 text-xs sm:text-sm font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                <span>🌴</span>
                <span className="truncate max-w-[100px] sm:max-w-[150px]">{categoryName}</span>
              </div>
            )}
          </div>

          {/* Right: Stars, Voice, Music, Recorder, Sound FX, Settings, Exit */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {showScore && (
              <div className="bg-emerald-800/90 text-emerald-100 font-black px-2.5 sm:px-3 py-1 rounded-2xl flex items-center gap-1 shadow-md border border-emerald-600/70 text-xs sm:text-sm">
                <span>🏆</span>
                <span>{score}/{totalQuestions}</span>
              </div>
            )}

            {/* Star Counter Pill */}
            <div className="bg-amber-400 text-amber-950 font-black px-2.5 sm:px-3 py-1 rounded-2xl flex items-center gap-1 shadow-md border-2 border-amber-300 text-xs sm:text-base animate-bounce-slow">
              <span className="text-sm sm:text-base">⭐</span>
              <span>{stars}</span>
            </div>

            {/* Voice Toggle Button with Speaking animation */}
            <button
              onClick={toggleVoice}
              aria-label={voiceOn ? "Turn Voice Narration OFF" : "Turn Voice Narration ON"}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-2xl text-xs sm:text-sm font-black border transition-all active:scale-95 cursor-pointer shadow-sm ${
                voiceOn
                  ? isSpeaking
                    ? 'bg-amber-400 text-amber-950 border-amber-300 animate-pulse ring-2 ring-amber-300'
                    : 'bg-emerald-800/90 hover:bg-emerald-700 text-emerald-100 border-emerald-600/70'
                  : 'bg-slate-800/90 hover:bg-slate-700 text-slate-400 border-slate-600'
              }`}
              title={voiceOn ? (isSpeaking ? "Narrator Speaking..." : "Voice: ON (Click to Mute)") : "Voice: OFF (Click to Enable)"}
            >
              <span className="text-sm sm:text-base">{voiceOn ? (isSpeaking ? "🗣️" : "🔊") : "🔇"}</span>
              <span className="hidden md:inline">{voiceOn ? "Voice: ON" : "Voice: OFF"}</span>
            </button>

            {/* Screen Recorder Control */}
            <ScreenRecorder variant="compact" />

            {/* Sound FX Toggle */}
            <button
              onClick={toggleSound}
              aria-label={soundOn ? "Mute sound effects" : "Unmute sound effects"}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-emerald-800/80 hover:bg-emerald-700 text-white flex items-center justify-center border border-emerald-600/60 shadow-sm transition-transform active:scale-95 cursor-pointer"
              title={soundOn ? "Sound Effects: ON" : "Sound Effects: MUTED"}
            >
              <span className="text-sm sm:text-base">{soundOn ? "🔔" : "🔕"}</span>
            </button>

            {/* Settings Button */}
            <button
              onClick={() => setSettingsOpen(true)}
              aria-label="Open settings"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-emerald-800/80 hover:bg-emerald-700 text-emerald-200 flex items-center justify-center border border-emerald-600/60 shadow-sm transition-transform active:scale-95 cursor-pointer"
              title="Settings"
            >
              <span className="text-sm sm:text-base">⚙️</span>
            </button>

            {/* Exit / Home Button */}
            <button
              onClick={handleQuit}
              aria-label="Exit quiz to home"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-rose-900/60 hover:bg-rose-800 text-rose-200 flex items-center justify-center border border-rose-700/60 shadow-sm transition-transform active:scale-95 cursor-pointer"
              title="Exit to Home"
            >
              <span className="text-sm sm:text-base">✕</span>
            </button>
          </div>
        </div>
      </header>

      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onSettingsUpdated={() => {
          setSoundOn(isSoundEnabled());
          const v = voiceService.getNarratorSettings();
          setVoiceOn(v.enabled);
        }}
      />
    </>
  );
};

export default Header;
