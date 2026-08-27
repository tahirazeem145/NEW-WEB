import { SoundFX } from '../engine/SoundFX.js';

/**
 * Header Component
 * Movie gallery header with brand logo, sound visualizer equalizer,
 * and Cinema About drawer trigger.
 */
export class Header {
  constructor(container, onAboutClick) {
    this.container = container;
    this.onAboutClick = onAboutClick;
    this.element = null;
    this.soundBtn = null;
    this.init();
  }

  init() {
    this.element = document.createElement('header');
    this.element.className = 'hud-header';
    this.element.innerHTML = `
      <div class="brand-title" id="brand-logo" title="Reset to first movie">
        <span class="brand-dot"></span>
        <span>CINEPULSE 3D</span>
      </div>
      <div class="header-right">
        <button class="sound-toggle-btn" id="sound-toggle" aria-label="Toggle Sound FX">
          <div class="sound-bars">
            <span class="sound-bar"></span>
            <span class="sound-bar"></span>
            <span class="sound-bar"></span>
          </div>
          <span class="sound-label">SOUND</span>
        </button>
        <button class="profile-btn" id="about-trigger">ABOUT</button>
      </div>
    `;

    this.container.appendChild(this.element);

    this.soundBtn = this.element.querySelector('#sound-toggle');
    this.updateSoundButtonUI();

    // Event Listeners
    this.soundBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isMuted = SoundFX.toggleMute();
      this.updateSoundButtonUI();
    });

    const aboutTrigger = this.element.querySelector('#about-trigger');
    aboutTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      SoundFX.playModalOpen();
      if (this.onAboutClick) this.onAboutClick();
    });
  }

  updateSoundButtonUI() {
    if (!this.soundBtn) return;
    if (SoundFX.isMuted) {
      this.soundBtn.classList.remove('sound-active');
      this.soundBtn.querySelector('.sound-label').textContent = 'MUTED';
    } else {
      this.soundBtn.classList.add('sound-active');
      this.soundBtn.querySelector('.sound-label').textContent = 'SOUND ON';
    }
  }
}
