/**
 * SoundFX - Procedural Web Audio API Sound Synthesizer
 * Provides crisp tactile audio feedback without external MP3 dependencies.
 */
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.lastTickTime = 0;
    this.initialized = false;
    
    // Check saved mute state
    const saved = localStorage.getItem('jesper_portfolio_muted');
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
        this.initialized = true;
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
    this.isMuted = !this.isMuted;
    localStorage.setItem('jesper_portfolio_muted', this.isMuted);
    if (!this.isMuted) {
      this.ensureContext();
      this.playTick(500, 0.04);
    }
    return this.isMuted;
  }

  playTick(freq = 440, duration = 0.03, gainVal = 0.04) {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.4, this.ctx.currentTime + duration);

    gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  playSlideTick() {
    const now = performance.now();
    if (now - this.lastTickTime < 60) return; // Debounce rapid ticks
    this.lastTickTime = now;
    this.playTick(520, 0.035, 0.03);
  }

  playHover() {
    this.playTick(720, 0.025, 0.02);
  }

  playModalOpen() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const notes = [330, 440, 660];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.3);
      }, idx * 40);
    });
  }

  playModalClose() {
    this.playTick(280, 0.06, 0.04);
  }
}

export const SoundFX = new SoundEngine();
