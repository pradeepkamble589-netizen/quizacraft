import React, { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { getStoredSettings, saveStoredSettings } from '../utils/storage';
import { isSoundEnabled, setSoundEnabled, playClickSound } from '../utils/audio';
import { voiceService } from '../services/voiceService';
import { useAudio } from '../context/AudioContext';

export const SettingsModal = ({ isOpen, onClose, onSettingsUpdated }) => {
  const { isPlaying, isMuted, togglePlay, toggleMute, volume, setVolume } = useAudio();
  const [sound, setSound] = useState(true);
  const [timerEnabled, setTimerEnabled] = useState(true);
  const [duration, setDuration] = useState(20);

  // Voice Settings State
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voiceSpeed, setVoiceSpeed] = useState('normal'); // 'slow' (0.8), 'normal' (0.92), 'fast' (1.1)
  const [autoPlay, setAutoPlay] = useState(true);
  const [availableVoices, setAvailableVoices] = useState([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState('');
  const [isTestingVoice, setIsTestingVoice] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const current = getStoredSettings();
      setSound(isSoundEnabled());
      setTimerEnabled(current.timerEnabled ?? true);
      setDuration(current.defaultDuration ?? 20);

      const vSettings = voiceService.getNarratorSettings();
      setVoiceEnabled(vSettings.enabled);
      setAutoPlay(vSettings.autoPlay);

      if (vSettings.rate <= 0.85) setVoiceSpeed('slow');
      else if (vSettings.rate >= 1.05) setVoiceSpeed('fast');
      else setVoiceSpeed('normal');

      const voices = voiceService.getAvailableVoices();
      setAvailableVoices(voices);
      setSelectedVoiceName(vSettings.voiceName || voiceService.getSelectedVoice()?.name || '');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSpeedChange = (speed) => {
    setVoiceSpeed(speed);
    let rate = 0.92;
    if (speed === 'slow') rate = 0.8;
    if (speed === 'fast') rate = 1.1;
    voiceService.setRate(rate);
  };

  const handleVoiceSelect = (e) => {
    const voiceName = e.target.value;
    setSelectedVoiceName(voiceName);
    voiceService.setVoice(voiceName);
  };

  const handleVoiceToggle = () => {
    const newState = !voiceEnabled;
    setVoiceEnabled(newState);
    voiceService.setEnabled(newState);
  };

  const handleAutoPlayToggle = () => {
    const newState = !autoPlay;
    setAutoPlay(newState);
    voiceService.setAutoPlay(newState);
  };

  const handleTestVoice = () => {
    setIsTestingVoice(true);
    voiceService.speak(
      "Hello explorer! I am your QuizCraft narrator. Let's learn and have fun together!",
      {
        onEnd: () => setIsTestingVoice(false),
        onError: () => setIsTestingVoice(false)
      }
    );
  };

  const handleSave = () => {
    setSoundEnabled(sound);
    voiceService.setEnabled(voiceEnabled);
    voiceService.setAutoPlay(autoPlay);

    let rate = 0.92;
    if (voiceSpeed === 'slow') rate = 0.8;
    if (voiceSpeed === 'fast') rate = 1.1;
    voiceService.setRate(rate);

    if (selectedVoiceName) {
      voiceService.setVoice(selectedVoiceName);
    }

    const updated = {
      soundEnabled: sound,
      timerEnabled,
      defaultDuration: duration,
      voiceEnabled,
      voiceSpeed,
      autoPlay
    };

    saveStoredSettings(updated);
    if (onSettingsUpdated) onSettingsUpdated(updated);
    onClose();
  };

  const handleResetStats = () => {
    if (window.confirm('Are you sure you want to reset your quiz stats and best score?')) {
      localStorage.removeItem('quizcraft_stats');
      if (onSettingsUpdated) onSettingsUpdated(getStoredSettings());
      alert('Stats reset successfully! 🌟');
    }
  };

  const englishVoices = availableVoices.filter(v => v.lang && v.lang.startsWith('en'));
  const otherVoices = availableVoices.filter(v => !v.lang || !v.lang.startsWith('en'));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl p-5 sm:p-7 max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl border-4 border-emerald-300 relative">
        <button
          onClick={onClose}
          aria-label="Close settings"
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-black flex items-center justify-center transition-colors cursor-pointer"
        >
          ✕
        </button>

        <div className="flex items-center gap-2.5 mb-5">
          <span className="text-3xl">⚙️</span>
          <div>
            <h2 className="text-2xl font-black text-emerald-950">QuizCraft Settings</h2>
            <p className="text-xs font-semibold text-emerald-700">Voice narration, audio mixing & quiz options</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* SECTION 1: VOICE NARRATOR */}
          <div className="p-4 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl border-2 border-amber-300 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-amber-200">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{voiceEnabled ? '🔊' : '🔇'}</span>
                <div>
                  <p className="font-black text-amber-950 text-sm sm:text-base">AI Voice Narration</p>
                  <p className="text-[11px] text-amber-800 font-medium">Child-friendly educational narrator</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleVoiceToggle}
                className={`w-14 h-8 rounded-full transition-colors p-1 flex items-center cursor-pointer ${
                  voiceEnabled ? 'bg-amber-500 justify-end' : 'bg-slate-300 justify-start'
                }`}
                title={voiceEnabled ? 'Voice Narration: ON' : 'Voice Narration: OFF'}
              >
                <div className="w-6 h-6 rounded-full bg-white shadow-md transform transition-transform" />
              </button>
            </div>

            {voiceEnabled && (
              <div className="mt-3.5 space-y-3">
                {/* Voice Speed */}
                <div>
                  <label className="block text-xs font-black text-amber-950 mb-1.5">
                    🗣️ Voice Speed
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'slow', label: 'Slow 🐢' },
                      { id: 'normal', label: 'Normal 🌟' },
                      { id: 'fast', label: 'Fast ⚡' }
                    ].map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => handleSpeedChange(s.id)}
                        className={`py-1.5 px-2 rounded-xl text-xs font-black border-2 transition-all cursor-pointer ${
                          voiceSpeed === s.id
                            ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                            : 'bg-white text-amber-900 border-amber-200 hover:bg-amber-100'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Auto-Play Narration Toggle */}
                <div className="flex items-center justify-between p-2.5 bg-white/80 rounded-xl border border-amber-200">
                  <div>
                    <p className="font-bold text-xs text-amber-950">Auto-play Narration</p>
                    <p className="text-[10px] text-amber-700">Read questions automatically</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAutoPlayToggle}
                    className={`w-12 h-6 rounded-full transition-colors p-0.5 flex items-center cursor-pointer ${
                      autoPlay ? 'bg-amber-500 justify-end' : 'bg-slate-300 justify-start'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full bg-white shadow-sm" />
                  </button>
                </div>

                {/* Select Narrator Voice Dropdown */}
                {availableVoices.length > 0 && (
                  <div>
                    <label className="block text-xs font-black text-amber-950 mb-1">
                      🎙️ Narrator Voice
                    </label>
                    <select
                      value={selectedVoiceName}
                      onChange={handleVoiceSelect}
                      className="w-full text-xs font-bold p-2 bg-white text-slate-800 border-2 border-amber-300 rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-amber-400"
                    >
                      <optgroup label="English Voices (Recommended)">
                        {englishVoices.map((v) => (
                          <option key={v.name} value={v.name}>
                            {v.name} ({v.lang})
                          </option>
                        ))}
                      </optgroup>
                      {otherVoices.length > 0 && (
                        <optgroup label="Other Voices">
                          {otherVoices.map((v) => (
                            <option key={v.name} value={v.name}>
                              {v.name} ({v.lang})
                            </option>
                          ))}
                        </optgroup>
                      )}
                    </select>
                  </div>
                )}

                {/* Test Voice Button */}
                <button
                  type="button"
                  onClick={handleTestVoice}
                  disabled={isTestingVoice}
                  className="w-full py-2 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-xs border border-amber-500 shadow-sm flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-transform"
                >
                  <span>{isTestingVoice ? '🗣️ Narrating...' : '▶ Test Voice Sample'}</span>
                </button>
              </div>
            )}
          </div>

          {/* SECTION 2: BACKGROUND MUSIC & AUDIO */}
          <div className="p-4 bg-emerald-50 rounded-2xl border-2 border-emerald-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{isPlaying && !isMuted ? '🎵' : '🔇'}</span>
                <div>
                  <p className="font-black text-emerald-950 text-sm sm:text-base">Background Adventure Music</p>
                  <p className="text-[11px] text-emerald-700 font-medium">Auto-ducks during narration</p>
                </div>
              </div>
              <button
                type="button"
                onClick={togglePlay}
                className={`w-14 h-8 rounded-full transition-colors p-1 flex items-center cursor-pointer ${
                  isPlaying ? 'bg-emerald-500 justify-end' : 'bg-slate-300 justify-start'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-white shadow-md transform transition-transform" />
              </button>
            </div>

            {isPlaying && (
              <div className="space-y-2 pt-2 border-t border-emerald-200">
                <div className="flex justify-between text-xs font-bold text-emerald-900">
                  <span>Music Volume</span>
                  <span>{Math.round((isMuted ? 0 : volume) * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full h-2 bg-emerald-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>
            )}
          </div>

          {/* SECTION 3: SOUND FX & TIMER */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Sound FX */}
            <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">{sound ? '🔔' : '🔕'}</span>
                <div>
                  <p className="font-bold text-xs text-emerald-950">Sound FX</p>
                  <p className="text-[10px] text-emerald-700">Chimes & clicks</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSound(!sound)}
                className={`w-12 h-6 rounded-full transition-colors p-0.5 flex items-center cursor-pointer ${
                  sound ? 'bg-emerald-500 justify-end' : 'bg-slate-300 justify-start'
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-white shadow-sm" />
              </button>
            </div>

            {/* Question Timer */}
            <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">⏱️</span>
                <div>
                  <p className="font-bold text-xs text-emerald-950">Question Timer</p>
                  <p className="text-[10px] text-emerald-700">Timed challenge</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setTimerEnabled(!timerEnabled)}
                className={`w-12 h-6 rounded-full transition-colors p-0.5 flex items-center cursor-pointer ${
                  timerEnabled ? 'bg-emerald-500 justify-end' : 'bg-slate-300 justify-start'
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-white shadow-sm" />
              </button>
            </div>
          </div>

          {/* Timer Duration */}
          {timerEnabled && (
            <div className="p-3 bg-emerald-50/80 rounded-2xl border border-emerald-200">
              <div className="flex justify-between items-center mb-1.5 text-xs font-bold text-emerald-950">
                <span>Timer Duration</span>
                <span className="text-emerald-700 font-black">{duration} seconds</span>
              </div>
              <div className="flex gap-2">
                {[15, 20, 25, 30].map((sec) => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => setDuration(sec)}
                    className={`flex-1 py-1 rounded-xl font-black text-xs border transition-all cursor-pointer ${
                      duration === sec
                        ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                        : 'bg-white text-emerald-900 border-emerald-200 hover:bg-emerald-100'
                    }`}
                  >
                    {sec}s
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Reset Stats */}
          <div className="pt-1 text-center">
            <button
              type="button"
              onClick={handleResetStats}
              className="text-[11px] text-rose-600 hover:text-rose-800 font-bold underline cursor-pointer"
            >
              🗑️ Reset All High Scores & Saved Stats
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-3">
          <Button variant="secondary" className="flex-1 text-xs sm:text-sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" className="flex-1 text-xs sm:text-sm font-black" onClick={handleSave}>
            Save Changes ✨
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
