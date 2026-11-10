// Web Audio API Sound Synthesizer & Music Engine for QuizCraft
// Provides high quality procedural audio + optional /public/audio/*.mp3 support with safe fallbacks.

let audioCtx = null;
let bgMusicInterval = null;
let bgMusicGainNode = null;
let isMusicCurrentlyPlaying = false;
let audioElement = null;

// Get or initialize AudioContext
export const getAudioContext = () => {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
};

// LocalStorage helpers for audio settings
export const isSoundEnabled = () => {
  try {
    const stored = localStorage.getItem('quizcraft_sound_enabled');
    return stored === null ? true : JSON.parse(stored);
  } catch {
    return true;
  }
};

export const setSoundEnabled = (enabled) => {
  try {
    localStorage.setItem('quizcraft_sound_enabled', JSON.stringify(enabled));
  } catch {}
};

export const getStoredMusicVolume = () => {
  try {
    const stored = localStorage.getItem('quizcraft_music_volume');
    return stored === null ? 0.4 : parseFloat(stored);
  } catch {
    return 0.4;
  }
};

export const setStoredMusicVolume = (vol) => {
  try {
    localStorage.setItem('quizcraft_music_volume', vol.toString());
  } catch {}
};

export const isMusicMuted = () => {
  try {
    const stored = localStorage.getItem('quizcraft_music_muted');
    return stored === null ? false : JSON.parse(stored);
  } catch {
    return false;
  }
};

export const setStoredMusicMuted = (muted) => {
  try {
    localStorage.setItem('quizcraft_music_muted', JSON.stringify(muted));
  } catch {}
};

// Safe Audio File Player with Web Audio Fallback
const tryPlayAudioFile = (filepath, fallbackSynth) => {
  try {
    const audio = new Audio(filepath);
    audio.volume = isSoundEnabled() ? 0.7 : 0;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Fallback to Web Audio synthesis if file missing or autoplay blocked
        fallbackSynth();
      });
    }
  } catch {
    fallbackSynth();
  }
};

// -------------------------------------------------------------
// 1. PROCEDURAL JUNGLE ADVENTURE BACKGROUND MUSIC ENGINE
// -------------------------------------------------------------
// Generates a soothing, cheerful tropical kalimba / marimba tune
const JUNGLE_SCALE = [
  261.63, // C4
  293.66, // D4
  329.63, // E4
  392.00, // G4
  440.00, // A4
  523.25, // C5
  587.33, // D5
  659.25  // E5
];

// 16-step happy safari melody pattern (indices into scale)
const SAFARI_PATTERN = [
  0, 2, 4, 2,  3, 5, 4, 2,
  1, 3, 5, 3,  4, 2, 0, 2
];

const BASS_PATTERN = [
  130.81, // C3
  130.81,
  164.81, // E3
  196.00  // G3
];

let currentStep = 0;

const playKalimbaNote = (ctx, dest, freq, time, duration = 0.4, vol = 0.15) => {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(freq, time);

  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(vol, time + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

  osc.connect(gain);
  gain.connect(dest);

  osc.start(time);
  osc.stop(time + duration + 0.05);
};

const playShakerHit = (ctx, dest, time, vol = 0.03) => {
  const bufferSize = ctx.sampleRate * 0.05;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = 5000;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(vol, time);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.04);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(dest);

  noise.start(time);
  noise.stop(time + 0.05);
};

const tickBackgroundMusic = () => {
  const ctx = getAudioContext();
  if (!ctx || !bgMusicGainNode) return;

  const now = ctx.currentTime;
  const scaleIdx = SAFARI_PATTERN[currentStep % SAFARI_PATTERN.length];
  const noteFreq = JUNGLE_SCALE[scaleIdx];

  // Play lead kalimba note
  playKalimbaNote(ctx, bgMusicGainNode, noteFreq, now, 0.45, 0.18);

  // Soft bass accompaniment every 4 steps
  if (currentStep % 4 === 0) {
    const bassFreq = BASS_PATTERN[Math.floor(currentStep / 4) % BASS_PATTERN.length];
    playKalimbaNote(ctx, bgMusicGainNode, bassFreq, now, 0.8, 0.22);
  }

  // Gentle shaker percussion on offbeats
  if (currentStep % 2 === 1) {
    playShakerHit(ctx, bgMusicGainNode, now, 0.04);
  }

  currentStep = (currentStep + 1) % SAFARI_PATTERN.length;
};

// Public Music Controls
export const startBackgroundMusic = (userVolume = null) => {
  const muted = isMusicMuted();
  const volume = userVolume !== null ? userVolume : (muted ? 0 : getStoredMusicVolume());

  // Try file audio first if available
  if (!audioElement) {
    audioElement = new Audio('/audio/background.mp3');
    audioElement.loop = true;
  }

  audioElement.volume = muted ? 0 : volume;

  const filePlayPromise = audioElement.play();
  if (filePlayPromise !== undefined) {
    filePlayPromise
      .then(() => {
        isMusicCurrentlyPlaying = true;
      })
      .catch(() => {
        // If file missing or failed, use procedural Web Audio engine
        startProceduralMusic(volume, muted);
      });
  } else {
    startProceduralMusic(volume, muted);
  }
};

const startProceduralMusic = (volume, muted) => {
  const ctx = getAudioContext();
  if (!ctx) return;

  if (bgMusicInterval) {
    clearInterval(bgMusicInterval);
    bgMusicInterval = null;
  }

  if (!bgMusicGainNode) {
    bgMusicGainNode = ctx.createGain();
    bgMusicGainNode.connect(ctx.destination);
  }

  bgMusicGainNode.gain.setValueAtTime(muted ? 0 : volume, ctx.currentTime);

  // 125 BPM -> ~240ms per 8th-note
  bgMusicInterval = setInterval(tickBackgroundMusic, 240);
  isMusicCurrentlyPlaying = true;
};

export const pauseBackgroundMusic = () => {
  if (audioElement && !audioElement.paused) {
    audioElement.pause();
  }
  if (bgMusicInterval) {
    clearInterval(bgMusicInterval);
    bgMusicInterval = null;
  }
  isMusicCurrentlyPlaying = false;
};

export const stopBackgroundMusic = () => {
  pauseBackgroundMusic();
  currentStep = 0;
};

export const setMusicVolume = (volume) => {
  setStoredMusicVolume(volume);
  const muted = isMusicMuted();
  const effectiveVol = muted ? 0 : volume;

  if (audioElement) {
    audioElement.volume = Math.max(0, Math.min(1, effectiveVol));
  }
  if (bgMusicGainNode && audioCtx) {
    bgMusicGainNode.gain.setValueAtTime(Math.max(0, Math.min(1, effectiveVol)), audioCtx.currentTime);
  }
};

export const setMusicMuted = (muted) => {
  setStoredMusicMuted(muted);
  const vol = muted ? 0 : getStoredMusicVolume();

  if (audioElement) {
    audioElement.volume = vol;
  }
  if (bgMusicGainNode && audioCtx) {
    bgMusicGainNode.gain.setValueAtTime(vol, audioCtx.currentTime);
  }
};

let isDuckedState = false;

export const duckMusic = (ducked = true) => {
  isDuckedState = Boolean(ducked);
  const muted = isMusicMuted();
  const baseVol = getStoredMusicVolume();

  // If ducked, reduce to 8% or 20% of standard volume
  const targetVol = muted
    ? 0
    : isDuckedState
    ? Math.min(0.08, baseVol * 0.25)
    : baseVol;

  if (audioElement) {
    audioElement.volume = Math.max(0, Math.min(1, targetVol));
  }
  if (bgMusicGainNode && audioCtx) {
    try {
      bgMusicGainNode.gain.cancelScheduledValues(audioCtx.currentTime);
      bgMusicGainNode.gain.linearRampToValueAtTime(
        Math.max(0, Math.min(1, targetVol)),
        audioCtx.currentTime + 0.15
      );
    } catch {
      bgMusicGainNode.gain.setValueAtTime(targetVol, audioCtx.currentTime);
    }
  }
};

export const isMusicPlaying = () => isMusicCurrentlyPlaying;


// -------------------------------------------------------------
// 2. SOUND EFFECTS (WITH MP3 SUPPORT & SYNTHESIZER FALLBACK)
// -------------------------------------------------------------

// Synth implementation for Correct Answer
const synthCorrectSound = () => {
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

    gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.08);
    gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + idx * 0.08 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.32);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime + idx * 0.08);
    osc.stop(ctx.currentTime + idx * 0.08 + 0.33);
  });
};

export const playCorrectSound = () => {
  if (!isSoundEnabled()) return;
  tryPlayAudioFile('/audio/correct.mp3', synthCorrectSound);
};

// Synth implementation for Wrong Answer
const synthWrongSound = () => {
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [311.13, 261.63]; // Eb4, C4
  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.14);

    gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.14);
    gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + idx * 0.14 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.14 + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime + idx * 0.14);
    osc.stop(ctx.currentTime + idx * 0.14 + 0.26);
  });
};

export const playWrongSound = () => {
  if (!isSoundEnabled()) return;
  tryPlayAudioFile('/audio/wrong.mp3', synthWrongSound);
};

// Synth implementation for Timer Warning
const synthTimerWarningSound = () => {
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'square';
  osc.frequency.setValueAtTime(740, ctx.currentTime);

  gain.gain.setValueAtTime(0.08, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.13);
};

export const playWarningSound = () => {
  if (!isSoundEnabled()) return;
  tryPlayAudioFile('/audio/timer.mp3', synthTimerWarningSound);
};

export const playTickSound = () => {
  if (!isSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(880, ctx.currentTime);

  gain.gain.setValueAtTime(0.1, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.09);
};

export const playClickSound = () => {
  if (!isSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(587.33, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.05);

  gain.gain.setValueAtTime(0.12, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.07);
};

// Synth implementation for Quiz Complete Victory
const synthVictorySound = () => {
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [
    { freq: 523.25, time: 0, dur: 0.15 },     // C5
    { freq: 523.25, time: 0.16, dur: 0.15 },  // C5
    { freq: 523.25, time: 0.32, dur: 0.15 },  // C5
    { freq: 659.25, time: 0.48, dur: 0.28 },  // E5
    { freq: 783.99, time: 0.78, dur: 0.2 },   // G5
    { freq: 1046.5, time: 1.0, dur: 0.6 }     // C6
  ];

  notes.forEach(({ freq, time, dur }) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, ctx.currentTime + time);

    gain.gain.setValueAtTime(0, ctx.currentTime + time);
    gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + time + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + time + dur);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime + time);
    osc.stop(ctx.currentTime + time + dur + 0.02);
  });
};

export const playVictorySound = () => {
  if (!isSoundEnabled()) return;
  tryPlayAudioFile('/audio/complete.mp3', synthVictorySound);
};
