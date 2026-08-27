import { PROFILE_INFO } from '../data/projects.js';
import { SoundFX } from '../engine/SoundFX.js';

/**
 * ProfileDrawer Component
 * Slide-in drawer revealing creative profile, awards, philosophy,
 * and contact links.
 */
export class ProfileDrawer {
  constructor(container) {
    this.container = container;
    this.drawer = null;
    this.backdrop = null;
    this.isOpen = false;
    this.init();
  }

  init() {
    this.backdrop = document.createElement('div');
    this.backdrop.className = 'modal-backdrop';
    this.backdrop.id = 'profile-backdrop';

    this.drawer = document.createElement('div');
    this.drawer.className = 'profile-drawer';
    this.drawer.id = 'profile-drawer';

    const awardsHtml = PROFILE_INFO.awards.map(a => `
      <div class="award-item">
        <span class="award-title">${a.title}</span>
        <span class="award-count">${a.count}</span>
      </div>
    `).join('');

    const servicesHtml = PROFILE_INFO.services.map(s => `
      <li style="margin-bottom: 8px; color: var(--text-secondary); font-size: 13px; display: flex; align-items: center; gap: 8px;">
        <span style="width: 4px; height: 4px; border-radius: 50%; background: var(--accent-red);"></span>
        ${s}
      </li>
    `).join('');

    const socialsHtml = PROFILE_INFO.socials.map(s => `
      <a href="${s.url}" target="_blank" rel="noopener noreferrer" class="social-link-btn">
        ${s.name}
      </a>
    `).join('');

    this.drawer.innerHTML = `
      <button class="modal-close-btn" id="profile-close" style="position: absolute; top: 24px; right: 24px;" title="Close Profile (Esc)" aria-label="Close">
        <svg viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>

      <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 24px;">
        <div style="width: 64px; height: 64px; border-radius: 50%; background: var(--accent-red); display: flex; align-items: center; justify-content: center; font-family: var(--font-serif); font-size: 28px; color: #fff; font-weight: 700; box-shadow: 0 0 20px rgba(234, 46, 21, 0.4);">
          JL
        </div>
        <div>
          <h2 class="profile-name">${PROFILE_INFO.name}</h2>
          <div class="profile-title">${PROFILE_INFO.role}</div>
        </div>
      </div>

      <p class="profile-bio">${PROFILE_INFO.bio}</p>

      <div class="profile-section-title">AWARDS & RECOGNITION</div>
      <div class="awards-list">
        ${awardsHtml}
      </div>

      <div class="profile-section-title">CORE CAPABILITIES</div>
      <ul style="margin-bottom: 32px;">
        ${servicesHtml}
      </ul>

      <div class="profile-section-title">GET IN TOUCH</div>
      <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.6; margin-bottom: 16px;">
        Available for select creative direction, interactive 3D WebGL contracts, and architectural digital design.
      </p>
      
      <a href="mailto:hello@jesperlandberg.dev" class="social-link-btn" style="display: inline-block; background: var(--accent-red); border-color: var(--accent-red); text-align: center; width: 100%; padding: 14px; margin-bottom: 20px;">
        HELLO@JESPERLANDBERG.DEV
      </a>

      <div class="social-links" style="flex-wrap: wrap;">
        ${socialsHtml}
      </div>
    `;

    this.container.appendChild(this.backdrop);
    this.container.appendChild(this.drawer);

    // Listeners
    const closeBtn = this.drawer.querySelector('#profile-close');
    closeBtn.addEventListener('click', () => this.close());
    this.backdrop.addEventListener('click', () => this.close());

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
  }

  open() {
    this.isOpen = true;
    this.backdrop.classList.add('active');
    this.drawer.classList.add('active');
  }

  close() {
    if (!this.isOpen) return;
    this.isOpen = false;
    SoundFX.playModalClose();
    this.backdrop.classList.remove('active');
    this.drawer.classList.remove('active');
  }
}
