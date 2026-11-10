import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  musicService,
  playMusic as svcPlayMusic,
  pauseMusic as svcPauseMusic,
  togglePlay as svcTogglePlay,
  stopMusic as svcStopMusic,
  setMusicVolume as svcSetMusicVolume,
} from '../services/musicService';
import { isMusicMuted, getStoredMusicVolume } from '../utils/audio';

const AudioContext = createContext(null);

export const AudioProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(musicService.isPlaying);
  const [volume, setVolumeState] = useState(musicService.getVolume() || getStoredMusicVolume());
  const [isMuted, setIsMutedState] = useState(isMusicMuted());

  useEffect(() => {
    const unsubscribe = musicService.subscribe((state) => {
      setIsPlaying(state.isPlaying);
      setVolumeState(state.volume);
      setIsMutedState(isMusicMuted());
    });
    return () => unsubscribe();
  }, []);

  const playMusic = useCallback(() => {
    svcPlayMusic();
    setIsPlaying(true);
  }, []);

  const pauseMusic = useCallback(() => {
    svcPauseMusic();
    setIsPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    svcTogglePlay();
  }, []);

  const setVolume = useCallback((newVol) => {
    const clamped = Math.max(0, Math.min(1, newVol));
    setVolumeState(clamped);
    svcSetMusicVolume(clamped);
  }, []);

  const toggleMute = useCallback(() => {
    musicService.toggleMute();
    setIsMutedState(isMusicMuted());
  }, []);

  const stopMusic = useCallback(() => {
    svcStopMusic();
    setIsPlaying(false);
  }, []);

  return (
    <AudioContext.Provider
      value={{
        isPlaying,
        volume,
        isMuted,
        playMusic,
        pauseMusic,
        togglePlay,
        setVolume,
        toggleMute,
        stopMusic,
        isMusicEnabled: musicService.getEnabled(),
        getCurrentTrack: () => musicService.getCurrentTrack(),
        setCurrentTrack: (t) => musicService.setCurrentTrack(t),
        subscribeMusic: (cb) => musicService.subscribe(cb),
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

export default AudioContext;
