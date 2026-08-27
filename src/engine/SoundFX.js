/**
 * SoundFX - Procedural Web Audio API Cinematic Melody & SFX Synthesizer
 * Provides lush background ambient music chords, celestial melodic chimes,
 * and crisp tactile UI click SFX without external audio file dependencies.
 */
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.lastTickTime = 0;
    this.initialized = false;
    this.isMelodyPlaying = false;
    this.melodyTimer = null;
    this.padTimer = null;
    
    // Master gain node for volume control
    this.masterGain = null;
    this.ambientGain = null;
    this.sfxGain = null;

    // Check saved mute state
    const saved = localStorage.getItem('cinepulse_muted');
    if (saved !== null) {
      this.isMuted = saved === 'true';
    }
  }

  init() {
    if (this.initialized) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
        
        // Master Gain
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.85, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);

        // Ambient Music Bus
        this.ambientGain = this.ctx.createGain();
        this.ambientGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
        this.ambientGain.connect(this.masterGain);

        // SFX Bus
        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
        this.sfxGain.connect(this.masterGain);

        this.initialized = true;

        if (!this.isMuted) {
          this.startMelody();
        }
      }
    } catch (e) {
      console.warn('Web Audio API not supported', e);
    }
  }

  ensureContext() {
    if (!this.initialized) this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.ensureContext();
    this.isMuted = !this.isMuted;
    localStorage.setItem('cinepulse_muted', this.isMuted);

    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : 0.85, this.ctx.currentTime, 0.08);
    }

    if (!this.isMuted) {
      this.playButtonClick();
      this.startMelody();
    } else {
      this.stopMelody();
    }

    return this.isMuted;
  }

  /**
   * Continuous Cinematic Ambient Melody Generator
   * Generates polyphonic harmonic chords + celestial arpeggiated piano/bell notes.
   */
  startMelody() {
    if (this.isMelodyPlaying || !this.ctx || this.isMuted) return;
    this.isMelodyPlaying = true;

    // Cinematic chord progressions (E Major 9 / C#m7 / A Maj7 / B Sus4)
    const chords = [
      [164.81, 246.94, 329.63, 392.00, 493.88], // E maj9 / G#m
      [138.59, 207.65, 277.18, 329.63, 440.00], // C#m7 / E
      [110.00, 164.81, 220.00, 277.18, 329.63], // A maj7
      [123.47, 185.00, 246.94, 329.63, 369.99]  // B sus4
    ];

    const melodyNotes = [
      329.63, 392.00, 440.00, 493.88, 587.33, 659.25, 783.99, 987.77
    ];

    let chordIdx = 0;

    const playChordPad = () => {
      if (!this.isMelodyPlaying || !this.ctx) return;
      const currentChord = chords[chordIdx % chords.length];
      chordIdx++;

      currentChord.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = i % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(600 + i * 80, this.ctx.currentTime);

        const now = this.ctx.currentTime;
        const padDuration = 6.5;

        // Slow cinematic swell
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.045 / (i + 1), now + 2.5);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + padDuration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ambientGain);

        osc.start(now);
        osc.stop(now + padDuration);
      });
    };

    const playMelodicChime = () => {
      if (!this.isMelodyPlaying || !this.ctx) return;
      const noteFreq = melodyNotes[Math.floor(Math.random() * melodyNotes.length)];
      
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(noteFreq, this.ctx.currentTime);

      const now = this.ctx.currentTime;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.06, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

      osc.connect(gain);
      gain.connect(this.ambientGain);

      osc.start(now);
      osc.stop(now + 2.2);

      // Schedule next celestial note randomly between 1.6s and 3.2s
      const nextDelay = 1600 + Math.random() * 1600;
      this.melodyTimer = setTimeout(playMelodicChime, nextDelay);
    };

    // Initial chord and chime loops
    playChordPad();
    this.padTimer = setInterval(playChordPad, 5800);
    this.melodyTimer = setTimeout(playMelodicChime, 1200);
  }

  stopMelody() {
    this.isMelodyPlaying = false;
    if (this.padTimer) clearInterval(this.padTimer);
    if (this.melodyTimer) clearTimeout(this.melodyTimer);
  }

  /**
   * Tactile Button Click SFX (Crisp Bubble Pop / Glass Resonance)
   */
  playButtonClick(freq = 880) {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.8, now + 0.035);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.055);
  }

  playClick() {
    this.playButtonClick(960);
  }

  playSlideTick() {
    const now = performance.now();
    if (now - this.lastTickTime < 70) return;
    this.lastTickTime = now;

    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const curTime = this.ctx.currentTime;
    osc.frequency.setValueAtTime(480, curTime);
    osc.frequency.exponentialRampToValueAtTime(180, curTime + 0.03);

    gain.gain.setValueAtTime(0.06, curTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, curTime + 0.035);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(curTime);
    osc.stop(curTime + 0.04);
  }

  playHover() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(680, now);
    osc.frequency.exponentialRampToValueAtTime(840, now + 0.02);

    gain.gain.setValueAtTime(0.025, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.03);
  }

  /**
   * Ascending Ethereal Chord on Modal / Detail Reveal
   */
  playModalOpen() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const notes = [329.63, 440.00, 659.25, 880.00];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        const now = this.ctx.currentTime;
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.08, now + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.5);
      }, idx * 45);
    });
  }

  /**
   * Descending Soft Harmonic Chord on Modal Close
   */
  playModalClose() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const notes = [659.25, 440.00, 329.63];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        const now = this.ctx.currentTime;
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.35);
      }, idx * 40);
    });
  }
}

export const SoundFX = new SoundEngine();
