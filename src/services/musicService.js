// Music Service for QuizCraft Kids
// Centralizes music logic: current track, play/pause, volume, loop, custom audio, narrator ducking

import {
  getStoredMusicVolume,
  isMusicMuted,
  setMusicMuted,
  startBackgroundMusic,
  pauseBackgroundMusic,
  stopBackgroundMusic,
  setMusicVolume as coreSetMusicVolume,
  duckMusic as coreDuckMusic
} from '../utils/audio';

const STORAGE_KEY = 'quizcraft_music_settings';

class MusicService {
  constructor() {
    this.currentTrack = {
      name: '🌴 Jungle Adventure',
      description: 'Cheerful jungle kalimba adventure music',
      fileName: 'jungle-adventure.mp3'
    };
    this.audioElement = null;
    this.isPlaying = false;
    this.volume = 0.4;
    this.isLoop = true;
    this.isEnabled = true;
    this.customUrl = null;
    this.isDucked = false;
    this.listeners = new Set();

    this.init();
  }

  init() {
    this.loadStoredSettings();
  }

  loadStoredSettings() {
    if (typeof localStorage === 'undefined') return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.volume = parsed.volume !== undefined ? parsed.volume : getStoredMusicVolume();
        this.isLoop = parsed.loop !== undefined ? parsed.loop : true;
        this.isEnabled = parsed.enabled !== undefined ? parsed.enabled : true;
      } else {
        this.volume = getStoredMusicVolume();
      }
    } catch (e) {
      console.warn('Could not load music settings from localStorage', e);
    }
  }

  saveSettings() {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        volume: this.volume,
        loop: this.isLoop,
        enabled: this.isEnabled
      }));
    } catch (e) {
      console.warn('Could not save music settings to localStorage', e);
    }
    this.notifyListeners();
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notifyListeners() {
    this.listeners.forEach(cb => {
      try {
        cb({
          currentTrack: this.currentTrack,
          isPlaying: this.isPlaying,
          volume: this.volume,
          isLoop: this.isLoop,
          isEnabled: this.isEnabled,
          customUrl: this.customUrl
        });
      } catch (e) {
        console.error('Error in music service listener', e);
      }
    });
  }

  setEnabled(enabled) {
    this.isEnabled = Boolean(enabled);
    if (!this.isEnabled) {
      this.stop();
    }
    this.saveSettings();
    this.notifyListeners();
  }

  getEnabled() {
    return this.isEnabled;
  }

  setVolume(volume) {
    const clamped = Math.max(0, Math.min(1, parseFloat(volume) || 0));
    this.volume = clamped;
    coreSetMusicVolume(clamped);
    this.applyVolume();
    this.saveSettings();
  }

  getVolume() {
    return this.volume;
  }

  setLoop(loop) {
    this.isLoop = Boolean(loop);
    if (this.audioElement) {
      this.audioElement.loop = this.isLoop;
    }
    this.saveSettings();
    this.notifyListeners();
  }

  getLoop() {
    return this.isLoop;
  }

  setCurrentTrack(track) {
    this.stop();
    this.currentTrack = track;
    this.customUrl = track?.customUrl || null;
    this.isPlaying = false;
    this.notifyListeners();
  }

  getCurrentTrack() {
    return this.currentTrack;
  }

  togglePlay() {
    if (!this.isEnabled) return;
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  play() {
    if (!this.isEnabled) return;

    this.isPlaying = true;

    if (this.currentTrack?.customUrl) {
      this.cleanupAudioElement();
      this.audioElement = new Audio(this.currentTrack.customUrl);
      this.audioElement.loop = this.isLoop;
      this.audioElement.volume = isMusicMuted() ? 0 : this.volume;
      this.audioElement.play().catch(() => {
        this.isPlaying = false;
        this.notifyListeners();
      });
    } else {
      // Built-in track or procedural synthesis
      if (this.currentTrack?.fileName) {
        this.cleanupAudioElement();
        this.audioElement = new Audio(`/audio/${this.currentTrack.fileName}`);
        this.audioElement.loop = this.isLoop;
        this.audioElement.volume = isMusicMuted() ? 0 : this.volume;
        this.audioElement.play().catch(() => {
          // If mp3 is 0 bytes or playback fails, seamlessly use procedural Web Audio engine
          startBackgroundMusic(this.volume);
        });
      } else {
        startBackgroundMusic(this.volume);
      }
    }

    this.applyVolume();
    this.notifyListeners();
  }

  pause() {
    this.isPlaying = false;
    if (this.audioElement) {
      this.audioElement.pause();
    }
    pauseBackgroundMusic();
    this.notifyListeners();
  }

  stop() {
    this.isPlaying = false;
    this.cleanupAudioElement();
    stopBackgroundMusic();
    this.notifyListeners();
  }

  cleanupAudioElement() {
    if (this.audioElement) {
      this.audioElement.oncanplaythrough = null;
      this.audioElement.onerror = null;
      this.audioElement.pause();
      this.audioElement = null;
    }
  }

  applyVolume() {
    if (!this.isEnabled) return;
    const muted = isMusicMuted();
    const effectiveVol = muted ? 0 : this.volume;

    if (this.audioElement) {
      this.audioElement.volume = effectiveVol;
    }
    coreSetMusicVolume(effectiveVol);
    this.notifyListeners();
  }

  duckMusic() {
    if (!this.isEnabled) return;
    this.isDucked = true;
    coreDuckMusic(true);

    if (this.audioElement) {
      const muted = isMusicMuted();
      const baseVol = getStoredMusicVolume();
      const targetVol = muted ? 0 : Math.min(0.08, baseVol * 0.25);
      this.audioElement.volume = targetVol;
    }
    this.notifyListeners();
  }

  restoreMusic() {
    if (!this.isEnabled) return;
    this.isDucked = false;
    coreDuckMusic(false);

    if (this.audioElement) {
      const muted = isMusicMuted();
      this.audioElement.volume = muted ? 0 : this.volume;
    }
    this.notifyListeners();
  }

  toggleMute() {
    const nextMuted = !isMusicMuted();
    setMusicMuted(nextMuted);
    this.applyVolume();
    this.saveSettings();
    this.notifyListeners();
  }
}

// Export singleton instance
export const musicService = new MusicService();

// Export convenience functions
export const togglePlay = () => musicService.togglePlay();
export const playMusic = () => musicService.play();
export const pauseMusic = () => musicService.pause();
export const stopMusic = () => musicService.stop();
export const setMusicVolume = (vol) => musicService.setVolume(vol);
export const setMusicLoop = (loop) => musicService.setLoop(loop);
export const setMusicEnabled = (enabled) => musicService.setEnabled(enabled);
export const isMusicEnabled = () => musicService.getEnabled();
export const getCurrentTrack = () => musicService.getCurrentTrack();
export const subscribeMusic = (callback) => musicService.subscribe(callback);
export default musicService;
