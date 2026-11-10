import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ScreenRecorder from '../ScreenRecorder';
import SettingsModal from '../SettingsModal';
import { voiceService } from '../../services/voiceService';
import { playClickSound } from '../../utils/audio';

export const NavLink = ({ to, children, className = '', ...props }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`font-bold transition-all px-2.5 sm:px-3 py-1.5 rounded-xl text-xs sm:text-sm ${
        isActive
          ? 'bg-emerald-600 text-white shadow-sm'
          : 'text-emerald-100 hover:bg-emerald-800/80 hover:text-white'
      } ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
};

export const Navbar = () => {
  const location = useLocation();
  const [voiceOn, setVoiceOn] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    const vSettings = voiceService.getNarratorSettings();
    setVoiceOn(vSettings.enabled);

    const unsubscribe = voiceService.subscribe((settings, state) => {
      setVoiceOn(settings.enabled);
      setIsSpeaking(state.isSpeaking);
    });

    return () => unsubscribe();
  }, []);

  if (location.pathname === '/play') {
    return null;
  }

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

  return (
    <>
      <header className="sticky top-0 z-40 bg-emerald-900/90 backdrop-blur-md border-b-2 border-emerald-700/50 shadow-md">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 h-16 flex items-center justify-between gap-2">
          {/* Left: Brand */}
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-xl sm:text-2xl shadow-md group-hover:scale-110 transition-transform">
              🌟
            </div>
            <div className="flex flex-col text-left">
              <span className="text-lg sm:text-2xl font-black tracking-tight text-white drop-shadow-sm flex items-center gap-1">
                QuizCraft <span className="text-[10px] sm:text-xs bg-amber-400 text-amber-950 font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider">Kids</span>
              </span>
              <span className="text-[10px] sm:text-xs font-semibold text-emerald-200 -mt-1 hidden sm:inline">
                Learn. Play. Explore.
              </span>
            </div>
          </Link>

          {/* Center: Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <NavLink to="/">
              🌴 Home
            </NavLink>
            <NavLink to="/categories">
              🗺️ Explore
            </NavLink>
            <NavLink to="/create">
              ✏️ Create
            </NavLink>
          </nav>

          {/* Right: Voice, Music, Record Controls, Settings */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Quick Voice Toggle */}
            <button
              onClick={toggleVoice}
              aria-label={voiceOn ? "Mute Voice Narration" : "Enable Voice Narration"}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-2xl text-xs font-black border transition-all active:scale-95 cursor-pointer shadow-sm ${
                voiceOn
                  ? isSpeaking
                    ? 'bg-amber-400 text-amber-950 border-amber-300 animate-pulse ring-2 ring-amber-300'
                    : 'bg-emerald-800/90 hover:bg-emerald-700 text-emerald-100 border-emerald-600/70'
                  : 'bg-slate-800/90 hover:bg-slate-700 text-slate-400 border-slate-600'
              }`}
              title={voiceOn ? "Voice: ON (Click to Mute)" : "Voice: OFF (Click to Enable)"}
            >
              <span>{voiceOn ? (isSpeaking ? "🗣️" : "🔊") : "🔇"}</span>
              <span className="hidden lg:inline">{voiceOn ? "Voice: ON" : "Voice: OFF"}</span>
            </button>

            <ScreenRecorder variant="compact" />

            <button
              onClick={() => setSettingsOpen(true)}
              aria-label="Settings"
              className="w-8 h-8 rounded-2xl bg-emerald-800/80 hover:bg-emerald-700 text-emerald-200 flex items-center justify-center border border-emerald-600/60 shadow-sm transition-transform active:scale-95 cursor-pointer"
              title="Settings"
            >
              <span>⚙️</span>
            </button>
          </div>
        </div>
      </header>

      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onSettingsUpdated={() => {
          const v = voiceService.getNarratorSettings();
          setVoiceOn(v.enabled);
        }}
      />
    </>
  );
};

export default Navbar;