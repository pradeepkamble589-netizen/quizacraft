// QuizCraft Kids - AI Voice Narration Service
// Centralized, consistent, child-friendly speech synthesis system

import { musicService } from './musicService';

const STORAGE_KEY = 'quizcraft_voice_settings';

// Preferred high-quality English voice names (friendly, clear, natural)
const PREFERRED_VOICE_NAMES = [
  'Google UK English Female',
  'Google US English',
  'Samantha',
  'Victoria',
  'Microsoft Jenny Online (Natural) - English (United States)',
  'Microsoft Aria Online (Natural) - English (United States)',
  'Microsoft Zira - English (United States)',
  'Microsoft Hazel - English (United Kingdom)',
  'Karen',
  'Serena',
  'Moira',
  'Tessa',
  'Alex'
];

class VoiceService {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.voices = [];
    this.isInitialized = false;
    this.currentUtterance = null;
    this.isSpeaking = false;
    this.isPaused = false;
    this.listeners = new Set();

    // Default centralized narrator configuration
    this.settings = {
      voiceName: '',
      rate: 0.92, // Friendly, clear, calm speed
      pitch: 1.05, // Slightly cheerful, warm child-friendly tone
      volume: 1.0,
      enabled: true,
      autoPlay: true,
    };

    this.loadStoredSettings();
    this.initVoices();
  }

  loadStoredSettings() {
    if (typeof localStorage === 'undefined') return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.settings = { ...this.settings, ...parsed };
      }
    } catch (e) {
      console.warn('Could not load voice settings from localStorage', e);
    }
  }

  saveSettings() {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings));
    } catch (e) {
      console.warn('Could not save voice settings to localStorage', e);
    }
    this.notifyListeners();
  }

  initVoices() {
    if (!this.synth) return;

    const populateVoices = () => {
      const allVoices = this.synth.getVoices() || [];
      if (allVoices.length > 0) {
        this.voices = allVoices;
        this.isInitialized = true;
        this.selectBestConsistentVoice();
        this.notifyListeners();
      }
    };

    populateVoices();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = populateVoices;
    }
  }

  selectBestConsistentVoice() {
    if (this.voices.length === 0) return null;

    // 1. If user previously chose a specific voice that exists in current browser, keep it
    if (this.settings.voiceName) {
      const existing = this.voices.find(v => v.name === this.settings.voiceName);
      if (existing) return existing;
    }

    // 2. Filter English voices
    const englishVoices = this.voices.filter(v => v.lang && v.lang.startsWith('en'));

    // 3. Look for preferred natural / child-friendly voice names
    for (const name of PREFERRED_VOICE_NAMES) {
      const found = englishVoices.find(v => v.name.toLowerCase().includes(name.toLowerCase()));
      if (found) {
        this.settings.voiceName = found.name;
        this.saveSettings();
        return found;
      }
    }

    // 4. Look for any natural / neural / female English voice
    const naturalVoice = englishVoices.find(v =>
      v.name.toLowerCase().includes('natural') ||
      v.name.toLowerCase().includes('female') ||
      v.name.toLowerCase().includes('google')
    );
    if (naturalVoice) {
      this.settings.voiceName = naturalVoice.name;
      this.saveSettings();
      return naturalVoice;
    }

    // 5. Fallback to first English voice or default voice
    const fallback = englishVoices[0] || this.voices.find(v => v.default) || this.voices[0];
    if (fallback) {
      this.settings.voiceName = fallback.name;
      this.saveSettings();
      return fallback;
    }

    return null;
  }

  getSelectedVoice() {
    if (!this.synth || this.voices.length === 0) return null;
    if (this.settings.voiceName) {
      const match = this.voices.find(v => v.name === this.settings.voiceName);
      if (match) return match;
    }
    return this.selectBestConsistentVoice();
  }

  getAvailableVoices() {
    if (!this.synth) return [];
    if (this.voices.length === 0) {
      this.voices = this.synth.getVoices() || [];
    }
    return this.voices;
  }

  getEnglishVoices() {
    const all = this.getAvailableVoices();
    return all.filter(v => v.lang && v.lang.toLowerCase().startsWith('en'));
  }

  setVoice(voiceOrName) {
    const name = typeof voiceOrName === 'string' ? voiceOrName : voiceOrName?.name;
    if (name) {
      this.settings.voiceName = name;
      this.saveSettings();
    }
  }

  setRate(rate) {
    const clamped = Math.max(0.5, Math.min(2.0, parseFloat(rate) || 0.92));
    this.settings.rate = clamped;
    this.saveSettings();
  }

  setPitch(pitch) {
    const clamped = Math.max(0.5, Math.min(1.8, parseFloat(pitch) || 1.05));
    this.settings.pitch = clamped;
    this.saveSettings();
  }

  setVolume(volume) {
    const clamped = Math.max(0, Math.min(1.0, parseFloat(volume) || 1.0));
    this.settings.volume = clamped;
    this.saveSettings();
  }

  setEnabled(enabled) {
    this.settings.enabled = Boolean(enabled);
    if (!this.settings.enabled) {
      this.stopSpeaking();
    }
    this.saveSettings();
  }

  setAutoPlay(autoPlay) {
    this.settings.autoPlay = Boolean(autoPlay);
    this.saveSettings();
  }

  getNarratorSettings() {
    return { ...this.settings };
  }

  // Subscribe to voice changes & state updates
  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notifyListeners() {
    this.listeners.forEach(cb => {
      try {
        cb(this.getNarratorSettings(), {
          isSpeaking: this.isSpeaking,
          isPaused: this.isPaused,
          selectedVoice: this.getSelectedVoice()
        });
      } catch (e) {
        console.error('Error in voiceService listener', e);
      }
    });
  }

  /**
   * Speak the provided text using the consistent narrator configuration.
   * Automatically ducks background music during speech and restores it when finished.
   * Returns a promise that resolves when speech ends.
   */
  speak(text, { onStart, onEnd, onError, ducking = true } = {}) {
    return new Promise((resolve) => {
      if (!this.synth || !this.settings.enabled || !text) {
        if (onEnd) onEnd();
        resolve(false);
        return;
      }

      // Stop any ongoing speech cleanly
      this.stopSpeaking(false);

      const cleanText = text
        .replace(/[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '') // strip emojis for cleaner pronunciation
        .replace(/([.?!])\s*(?=[A-Za-z])/g, '$1 ')
        .trim();

      if (!cleanText) {
        if (onEnd) onEnd();
        resolve(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(cleanText);
      const selectedVoice = this.getSelectedVoice();
      if (selectedVoice) {
        utterance.voice = selectedVoice;
        utterance.lang = selectedVoice.lang || 'en-US';
      }

      utterance.rate = this.settings.rate;
      utterance.pitch = this.settings.pitch;
      utterance.volume = this.settings.volume;

      // Keep strong reference to prevent garbage collection in Chromium
      this.currentUtterance = utterance;

      utterance.onstart = () => {
        this.isSpeaking = true;
        this.isPaused = false;
        if (ducking) {
          musicService.duckMusic();
        }
        this.notifyListeners();
        if (onStart) onStart();
      };

      const cleanup = () => {
        this.isSpeaking = false;
        this.isPaused = false;
        this.currentUtterance = null;
        if (ducking) {
          musicService.restoreMusic();
        }
        this.notifyListeners();
      };

      utterance.onend = () => {
        cleanup();
        if (onEnd) onEnd();
        resolve(true);
      };

      utterance.onerror = (event) => {
        // 'interrupted' or 'canceled' are normal during navigation / stop
        cleanup();
        if (onError && event.error !== 'interrupted' && event.error !== 'canceled') {
          onError(event);
        }
        resolve(false);
      };

      try {
        this.synth.speak(utterance);
      } catch (err) {
        console.error('Speech synthesis speak error:', err);
        cleanup();
        resolve(false);
      }
    });
  }

  stopSpeaking(unduck = true) {
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (e) {
        console.warn('Error cancelling speech synthesis', e);
      }
    }
    this.isSpeaking = false;
    this.isPaused = false;
    this.currentUtterance = null;
    if (unduck) {
      musicService.restoreMusic();
    }
    this.notifyListeners();
  }

  pauseSpeaking() {
    if (this.synth && this.isSpeaking) {
      try {
        this.synth.pause();
        this.isPaused = true;
        this.notifyListeners();
      } catch (e) {
        console.warn('Error pausing speech', e);
      }
    }
  }

  resumeSpeaking() {
    if (this.synth && this.isPaused) {
      try {
        this.synth.resume();
        this.isPaused = false;
        this.notifyListeners();
      } catch (e) {
        console.warn('Error resuming speech', e);
      }
    }
  }
}

// Export singleton instance
export const voiceService = new VoiceService();

// Export standalone convenience functions matching requirement specs
export const speak = (text, options) => voiceService.speak(text, options);
export const stopSpeaking = () => voiceService.stopSpeaking();
export const pauseSpeaking = () => voiceService.pauseSpeaking();
export const resumeSpeaking = () => voiceService.resumeSpeaking();
export const getAvailableVoices = () => voiceService.getAvailableVoices();
export const setVoice = (voice) => voiceService.setVoice(voice);
export const setRate = (rate) => voiceService.setRate(rate);
export const setPitch = (pitch) => voiceService.setPitch(pitch);
export const setVolume = (volume) => voiceService.setVolume(volume);

export default voiceService;
