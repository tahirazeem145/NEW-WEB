import { SoundFX } from '../engine/SoundFX.js';

/**
 * Header Component
 * Handles brand logo, sound toggle button with visual equalizer bars,
 * and Profile drawer trigger.
 */
export class Header {
  constructor(container, onProfileClick) {
    this.container = container;
    this.onProfileClick = onProfileClick;
    this.element = null;
    this.soundBtn = null;
    this.init();
  }

  init() {
    this.element = document.createElement('header');
    this.element.className = 'hud-header';
    this.element.innerHTML = `
      <div class="brand-title" id="brand-logo" title="Reset view">
        <span class="brand-dot"></span>
        <span>JESPER LANDBERG</span>
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
        <button class="profile-btn" id="profile-trigger">PROFILE</button>
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

    const profileTrigger = this.element.querySelector('#profile-trigger');
    profileTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      SoundFX.playModalOpen();
      if (this.onProfileClick) this.onProfileClick();
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
