import React, { useState } from 'react';
import { musicService } from '../services/musicService';

export const MusicUploader = ({ onTrackSelected }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['.mp3', '.wav', '.ogg', '.m4a'];
    const fileName = file.name;
    const ext = fileName.substring(fileName.lastIndexOf('.'));

    if (!validTypes.includes(ext.toLowerCase())) {
      setUploadError('Unsupported audio format. Please use MP3, WAV, OGG, or M4A files.');
      return;
    }

    setIsUploading(true);
    setUploadError('');

    // Create object URL for local playback
    const url = URL.createObjectURL(file);

    const track = {
      name: fileName,
      description: 'Your custom uploaded music',
      customUrl: url
    };

    // Set as current track
    musicService.setCurrentTrack(track);
    setIsUploading(false);

    if (onTrackSelected) onTrackSelected(track);
  };

  const handleRemove = () => {
    musicService.setCurrentTrack(null);
    setUploadError('');
  };

  return (
    <div>
      <h3 className="text-sm font-black text-emerald-900 mb-2">➕ Upload Your Own Music</h3>

      {isUploading ? (
        <p className="text-[10px] text-emerald-500">Processing audio file...</p>
      ) : (
        <p className="text-[10px] text-emerald-500">Drag and drop or click to upload an audio file</p>
      )}

      <input
        type="file"
        accept="audio/mp3, audio/wav, audio/ogg, audio/m4a"
        onChange={handleFileSelect}
        className="w-full rounded-xl border border-emerald-300 px-4 py-2.5 text-sm font-black hover:border-emerald-500 transition-colors cursor-pointer"
        aria-label="Upload audio file for quiz background music"
      />

      {uploadError && (
        <p className="mt-2 text-[10px] text-rose-600">{uploadError}</p>
      )}

      {musicService.getCurrentTrack()?.customUrl && (
        <div className="mt-3 p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-black">
              🎵 {musicService.getCurrentTrack().name}
            </span>
            <button
              onClick={handleRemove}
              className="text-emerald-500 text-sm hover:text-rose-600 transition-colors"
              aria-label="Remove custom track"
            >
              ❌
            </button>
          </div>
          <p className="text-[10px] text-emerald-500 mt-1">Local file - not uploaded to server</p>
          <small className="text-[10px] text-emerald-400">
            Use music that you have permission to use.
          </small>
        </div>
      )}
    </div>
  );
};