import React, { useState, useCallback } from 'react';
import { musicService, playMusic, pauseMusic, setMusicVolume, setMusicLoop, getCurrentTrack } from '../services/musicService';
import { useAudio } from '../context/AudioContext';

export const MusicPlayer = () => {
  const { isMuted, toggleMute, isPlaying, setVolume: audioSetVolume } = useAudio();
  const [isExpanded, setIsExpanded] = useState(false);
  const [customTrackName, setCustomTrackName] = useState('');

  const track = getCurrentTrack();
  const isServicePlaying = musicService.getEnabled() ? musicService.isPlaying : false;
  const serviceVolume = musicService.getVolume();
  const serviceLoop = musicService.getLoop();
  const isServiceEnabled = musicService.getEnabled();

  // Determine current track info
  const trackName = track?.name || (track?.customUrl ? 'Your Audio' : 'Jungle Music');
  const trackDescription = track?.description || '';

  const handlePlayPause = useCallback(() => {
    if (isServiceEnabled) {
      if (isPlaying || isServicePlaying) {
        pauseMusic();
      } else {
        playMusic();
      }
    }
  }, [isPlaying, isServiceEnabled]);

  const handleVolumeChange = useCallback((e) => {
    const val = parseFloat(e.target.value);
    setMusicVolume(val);
    audioSetVolume(val);
  }, [audioSetVolume]);

  const handleLoopChange = useCallback(() => {
    setMusicLoop(!serviceLoop);
  }, [serviceLoop]);

  const handleMuteChange = useCallback(() => {
    toggleMute();
  }, [toggleMute]);

  const handleCustomUpload = useCallback((file) => {
    if (!file) return;

    const validTypes = ['.mp3', '.wav', '.ogg', '.m4a'];
    const fileName = file.name;
    const ext = fileName.substring(fileName.lastIndexOf('.'));

    if (!validTypes.includes(ext.toLowerCase())) {
      alert('Unsupported audio format. Please use MP3, WAV, OGG, or M4A files.');
      return;
    }

    // Create object URL for local playback
    const url = URL.createObjectURL(file);
    const track = {
      name: fileName,
      description: 'Your custom uploaded music',
      fileName: fileName,
      customUrl: url
    };

    musicService.setCurrentTrack(track);
    setCustomTrackName(fileName);
  }, []);

  const handleRemoveCustomTrack = useCallback(() => {
    musicService.setCurrentTrack(null);
    setCustomTrackName('');
    // Revoke the object URL when removing
    if (customTrackName && musicService.getCurrentTrack()?.customUrl) {
      try {
        URL.revokeObjectURL(customTrackName);
      } catch {}
    }
  }, [customTrackName]);

  const handleTrackSelect = useCallback((track) => {
    musicService.setCurrentTrack(track);
    setIsExpanded(false);
  }, []);

  const handleExpand = useCallback(() => {
    setIsExpanded(true);
  }, []);

  const handleCollapse = useCallback(() => {
    setIsExpanded(false);
  }, []);

  // Close on outside click handler wouldn't work in React the same way,
  // but we handle it via collapsing when clicking elsewhere

  return (
    <div className="z-50">
      {/* Floating Music Player - Compact Version */}
      <div
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 bg-emerald-900/95 backdrop-blur-md rounded-2xl p-3 shadow-2xl border border-emerald-500/80 transition-all duration-300 ${
          isExpanded ? 'w-80' : 'w-16'
        } animate-fadeInUp`}
        style={{ maxWidth: '80vw' }}
        onClick={handleExpand}
        role="button"
        aria-label={isExpanded ? 'Collapse music player' : 'Expand music player'}
        onMouseDown={e => e.stopPropagation()}
      >
        {/* Track info when expanded */}
        {isExpanded && (
          <div className="flex flex-col items-start gap-2 pb-2 border-b border-emerald-700/60">
            <div className="text-xs text-emerald-300 font-black">{trackName}</div>
            {trackDescription && <div className="text-[10px] text-emerald-400 font-medium">{trackDescription}</div>}
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-emerald-200 text-sm font-black">{isServicePlaying ? '▶' : '▶️'}</span>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePlayPause}
              className={`p-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 transition-transform active:scale-95 cursor-pointer ${
                isServicePlaying ? 'scale-95' : 'scale-100'
              }`}
              title={isServicePlaying ? 'Pause Music' : 'Play Music'}
              aria-label={isServicePlaying ? 'Pause Music' : 'Play Music'}
            >
              {isServicePlaying ? '⏸️' : '▶️'}
            </button>

            <button
              onClick={handleLoopChange}
              className={`p-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 transition-transform active:scale-95 cursor-pointer ${serviceLoop ? 'scale-95' : 'scale-100'}`}
              title={serviceLoop ? 'Loop OFF' : 'Loop ON'}
              aria-label={serviceLoop ? 'Disable Loop' : 'Enable Loop'}
            >
              {serviceLoop ? '🔁' : '◀︎'}
            </button>
          </div>
        </div>

        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={serviceVolume}
          onChange={handleVolumeChange}
          className="w-24 sm:w-32 h-1.5 bg-emerald-950 rounded-lg appearance-none cursor-pointer accent-amber-400"
          aria-label="Music volume"
        />

        <button
          onClick={handleMuteChange}
          className={`p-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 transition-transform active:scale-95 cursor-pointer ${isMuted || serviceVolume === 0 ? 'scale-95' : 'scale-100'}`}
          title={isMuted || serviceVolume === 0 ? 'Unmute Music' : 'Mute Music'}
          aria-label={isMuted || serviceVolume === 0 ? 'Unmute Music' : 'Mute Music'}
        >
          {isMuted || serviceVolume === 0 ? '🔇' : '🔊'}
        </button>

        {isExpanded && (
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => musicService.setEnabled(!isServiceEnabled)}
              className={`py-1 px-2 rounded-sm text-xs font-black transition-colors ${
                isServiceEnabled ? 'bg-amber-400 text-amber-950' : 'bg-slate-600 text-slate-300'
              }`}
              title={isServiceEnabled ? 'Disable Music' : 'Enable Music'}
              aria-label={isServiceEnabled ? 'Disable Music' : 'Enable Music'}
            >
              {isServiceEnabled ? '🔈' : '🔊'}
            </button>

            {track?.customUrl && (
              <button
                onClick={handleRemoveCustomTrack}
                className="py-1 px-2 rounded-sm text-xs font-black text-rose-600 hover:text-rose-800 border border-rose-400 transition-colors"
                title="Remove custom track"
                aria-label="Remove custom track"
              >
                ❌
              </button>
            )}

            <button
              onClick={() => setIsExpanded(false)}
              className="py-1 px-2 rounded-sm text-xs font-black text-emerald-400 hover:text-emerald-600 transition-colors"
              title="Close"
              aria-label="Close music player"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Music Library - shown when expanded */}
      {isExpanded && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 overflow-y-auto p-4 sm:p-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-4xl mx-auto shadow-2xl border-4 border-emerald-300 animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-emerald-950">🎵 Music Center</h2>
              <button
                onClick={handleCollapse}
                className="text-emerald-400 hover:text-white text-xl transition-colors"
                aria-label="Close Music Center"
              >
                ✕
              </button>
            </div>

            {/* Current Music Display */}
            <div className="mb-6 p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl text-emerald-300">🎵 Current Music</span>
                  <p className="mt-1 text-sm text-emerald-600 font-medium">{trackName}</p>
                </div>
                <button
                  onClick={handlePlayPause}
                  className="px-2 py-1 rounded bg-emerald-600 text-white text-sm hover:bg-emerald-500 transition-colors"
                  title="Play/Pause"
                  aria-label="Play/Pause music"
                >
                  ▶
                </button>
              </div>
              {trackDescription && <p className="mt-1 text-[10px] text-emerald-500 font-medium">{trackDescription}</p>}
            </div>

            {/* Built-in Music Library */}
            <div className="space-y-3 mb-6">
              <p className="text-xs text-emerald-500 font-medium mb-2">Choose Background Music</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {musicTracks.map((t) => (
                  <button
                    key={t.name}
                    onClick={() => handleTrackSelect(t)}
                    className={`p-3 rounded-2xl border transition-all ${
                      t === track ? 'border-emerald-500 bg-emerald-100 shadow-lg' : 'border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50'
                    }`}
                    style={{ minHeight: '60px' }}
                    aria-label={t.description}
                  >
                    <div className="text-center">
                      <span className="text-3xl mb-1">{t.icon}</span>
                      <p className="text-xs font-black truncate line-clamp-1 max-w">{t.name}</p>
                      <p className="text-[10px] text-emerald-500 line-clamp-1 max-w">{t.description}</p>
                    </div>
                    {t === track && (
                      <span className="text-emerald-500 text-xs font-black">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Music Upload */}
            <div className="mb-6 p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
              <h3 className="text-sm font-black text-emerald-900 mb-2">➕ Upload Your Own Music</h3>
              <p className="text-[10px] text-emerald-600 mb-3">Use music that you have permission to use.</p>
              <input
                type="file"
                accept="audio/mp3, audio/wav, audio/ogg, audio/m4a"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleCustomUpload(e.target.files[0]);
                  }
                }}
                className="w-full rounded-xl border border-emerald-300 px-3 py-2 text-sm font-black hover:border-emerald-500 transition-colors"
                aria-label="Upload audio file"
              />
              <p className="text-[10px] text-emerald-600 mt-2">.mp3, .wav, .ogg, .m4a</p>
            </div>

            {/* Music Settings */}
            <div>
              <h3 className="text-sm font-black text-emerald-900 mb-3">Music Settings</h3>
              <div className="space-y-3">
                <div>
                  <label className="flex items-center gap-2 text-sm font-black">
                    <input
                      type="checkbox"
                      checked={serviceLoop}
                      onChange={() => setMusicLoop(!serviceLoop)}
                      className="rounded border emerald-600 cursor-pointer"
                    />
                    🔁 Loop Music
                  </label>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-black">
                    <input
                      type="checkbox"
                      checked={isServiceEnabled}
                      onChange={() => musicService.setEnabled(!isServiceEnabled)}
                      className="rounded border emerald-600 cursor-pointer"
                    />
                    🎵 Background Music
                  </label>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-black">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={Math.round(serviceVolume * 100)}
                      onChange={(e) => setMusicVolume(parseFloat(e.target.value) / 100)}
                      className="w-24 rounded bg-emerald-200 cursor-pointer"
                      aria-label="Music volume 0-100"
                    />
                    🔊 Music Volume
                  </label>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-black">
                    <input
                      type="checkbox"
                      checked={track?.ducking !== false}
                      onChange={() => {}}
                      className="rounded border emerald-600 cursor-pointer hidden"
                    />
                    🎙️ Lower during Voice
                    <span className="text-[10px] text-emerald-500">: Music lowers when narrator speaks</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Built-in music tracks - matching the specification
const musicTracks = [
  { name: '🌿 Jungle Adventure', description: 'Fun exploration music', icon: '🌿', fileName: 'jungle-adventure.mp3' },
  { name: '🚀 Space Adventure', description: 'Countdown to adventure', icon: '🚀', fileName: 'space-adventure.mp3' },
  { name: '🦕 Dinosaur Fun', description: 'Roar-some dinosaur beats', icon: '🦕', fileName: 'dinosaur-fun.mp3' },
  { name: '🌊 Ocean Journey', description: 'Waves of calm', icon: '🌊', fileName: 'ocean-journey.mp3' },
  { name: '✨ Magical Adventure', description: 'Sparkle and shine', icon: '✨', fileName: 'magical-adventure.mp3' },
  { name: '🎈 Happy Kids', description: 'Cheerful and bright', icon: '🎈', fileName: 'happy-kids.mp3' },
  { name: '🧠 Learning Time', description: 'Focus and discover', icon: '🧠', fileName: 'learning-time.mp3' },
  { name: '🎮 Fun Game', description: 'Upbeat game tunes', icon: '🎮', fileName: 'fun-game.mp3' },
  { name: '😌 Calm Background', description: 'Gentle ambient', icon: '😌', fileName: 'calm-background.mp3' }
];