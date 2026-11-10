import React from 'react';
import { musicService, setMusicLoop, getCurrentTrack } from '../services/musicService';
import { isMusicMuted, setMusicMuted } from '../utils/audio';

const musicTracks = [
  { name: '🌿 Jungle Adventure', description: 'Fun exploration music', icon: '🌿' },
  { name: '🚀 Space Adventure', description: 'Countdown to adventure', icon: '🚀' },
  { name: '🦕 Dinosaur Fun', description: 'Roar-some dinosaur beats', icon: '🦕' },
  { name: '🌊 Ocean Journey', description: 'Waves of calm', icon: '🌊' },
  { name: '✨ Magical Adventure', description: 'Sparkle and shine', icon: '✨' },
  { name: '🎈 Happy Kids', description: 'Cheerful and bright', icon: '🎈' },
  { name: '🧠 Learning Time', description: 'Focus and discover', icon: '🧠' },
  { name: '🎮 Fun Game', description: 'Upbeat game tunes', icon: '🎮' },
  { name: '😌 Calm Background', description: 'Gentle ambient', icon: '😌' }
];

export const MusicLibrary = ({ onTrackSelect, onClose }) => {
  const track = getCurrentTrack();
  const serviceLoop = musicService.getLoop();

  const handleTrackSelect = (trackObj) => {
    musicService.setCurrentTrack(trackObj);
    if (onTrackSelect) onTrackSelect(trackObj);
  };

  const handleLoopToggle = () => {
    setMusicLoop(!serviceLoop);
  };

  const handleMuteToggle = () => {
    setMusicMuted(!isMusicMuted());
  };

  const handleUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'audio/mp3, audio/wav, audio/ogg, audio/m4a';
    input.onchange = (e) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const validTypes = ['.mp3', '.wav', '.ogg', '.m4a'];
        const ext = file.name.substring(file.name.lastIndexOf('.'));

        if (!validTypes.includes(ext.toLowerCase())) {
          alert('Unsupported audio format. Please use MP3, WAV, OGG, or M4A files.');
          return;
        }

        const url = URL.createObjectURL(file);
        const trackObj = {
          name: file.name,
          description: 'Your custom uploaded music',
          customUrl: url
        };

        musicService.setCurrentTrack(trackObj);
        if (onTrackSelect) onTrackSelect(trackObj);
      }
    };
    input.click();
  };

  const handleClose = () => {
    if (onClose) onClose();
  };

  return (
    <div>
      <h2 className="text-xl font-black text-emerald-950">🎵 Music Library</h2>

      {/* Current Track Display */}
      <div className="mb-4 p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎵</span>
          <div>
            <p className="font-black text-emerald-950">Current Track</p>
            <p className="text-[10px] text-emerald-600">{track ? track.name : 'No track selected'}</p>
          </div>
        </div>
      </div>

      {/* Built-in Music Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {musicTracks.map((t) => {
          const trackObj = {
            name: t.name,
            description: t.description,
            icon: t.icon,
            fileName: t.fileName
          };

          const isSelected = track && track.name === t.name && !track.customUrl;

          return (
            <button
              key={t.name}
              onClick={() => handleTrackSelect(trackObj)}
              className={`rounded-2xl p-3 border transition-all cursor-pointer ${
                isSelected ? 'border-emerald-500 bg-emerald-100 shadow-lg' : 'border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50'
              }`}
              style={{ minHeight: '80px' }}
              aria-label={t.name}
            >
              <div className="text-center">
                <span className="text-3xl mb-1">{t.icon}</span>
                <p className="text-xs font-black line-clamp-1">{t.name}</p>
                <p className="text-[10px] text-emerald-500 line-clamp-1">{t.description}</p>
              </div>
              {isSelected && (
                <span className="text-emerald-500 text-xs font-black absolute top-1 right-1">✓</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Upload Section */}
      <div className="mt-4 p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
        <button onClick={handleUpload} className="w-full py-2 rounded-xl text-emerald-600 hover:text-emerald-800 font-black text-sm transition-colors cursor-pointer">
          ➕ Upload Your Own Music
        </button>
        <p className="text-[10px] text-emerald-600 mt-1">.mp3, .wav, .ogg, .m4a</p>
        <small className="text-[10px] text-emerald-500">Use music that you have permission to use.</small>
      </div>

      {/* Controls */}
      <div className="mt-6 flex gap-2">
        <button
          onClick={handleLoopToggle}
          className={`py-1 px-3 rounded-sm text-xs font-black transition-colors ${
            serviceLoop ? 'bg-emerald-200 text-emerald-600' : 'bg-emerald-600 text-white'
          }`}
          aria-label="Loop music"
        >
          {serviceLoop ? '🔁 Loop ON' : '🔁 Loop OFF'}
        </button>
        <button
          onClick={handleMuteToggle}
          className={`py-1 px-3 rounded-sm text-xs font-black transition-colors ${
            isMusicMuted() ? 'bg-emerald-200 text-emerald-400' : 'bg-emerald-600 text-white'
          }`}
          aria-label="Mute music"
        >
          {isMusicMuted() ? '🔇 Muted' : '🔊 Unmute'}
        </button>
      </div>

      <button
        onClick={handleClose}
        className="mt-4 py-2 px-4 rounded-xl text-emerald-600 hover:text-white font-black text-sm transition-colors cursor-pointer"
        aria-label="Close Music Library"
      >
        Close
      </button>
    </div>
  );
};