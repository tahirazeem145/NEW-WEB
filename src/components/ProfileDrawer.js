import { GALLERY_INFO, MOVIES } from '../data/movies.js';
import { SoundFX } from '../engine/SoundFX.js';

/**
 * ProfileDrawer / AboutDrawer Component
 * Slide-in drawer revealing cinema curation philosophy,
 * 3D WebGL liquid shader architecture, and movie collection index.
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
    this.backdrop.id = 'about-backdrop';

    this.drawer = document.createElement('div');
    this.drawer.className = 'profile-drawer';
    this.drawer.id = 'about-drawer';

    const movieListHtml = MOVIES.map(m => `
      <div class="award-item" style="padding: 6px 0;">
        <span class="award-title" style="display: flex; align-items: center; gap: 8px;">
          <span style="color: ${m.accentColor}; font-weight: 700; font-family: var(--font-mono); font-size: 11px;">${m.index}</span>
          ${m.title}
        </span>
        <span class="award-count" style="color: #fff;">★ ${m.rating}</span>
      </div>
    `).join('');

    this.drawer.innerHTML = `
      <button class="modal-close-btn" id="about-close" style="position: absolute; top: 24px; right: 24px;" title="Close (Esc)" aria-label="Close">
        <svg viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>

      <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 24px;">
        <div style="width: 64px; height: 64px; border-radius: 50%; background: var(--accent-red); display: flex; align-items: center; justify-content: center; font-family: var(--font-display); font-size: 26px; color: #fff; font-weight: 900; box-shadow: 0 0 24px rgba(234, 46, 21, 0.5);">
          CP
        </div>
        <div>
          <h2 class="profile-name" style="font-family: var(--font-display);">${GALLERY_INFO.title}</h2>
          <div class="profile-title" style="color: var(--accent-red);">${GALLERY_INFO.subtitle}</div>
        </div>
      </div>

      <p class="profile-bio">
        ${GALLERY_INFO.description} Built with real-time Three.js WebGL cylindrical projection, interactive GLSL liquid distortion shaders, chromatic aberration physics, and zero-dependency procedural sound design.
      </p>

      <div class="profile-section-title">THE 10 CURATED MASTERPIECES</div>
      <div class="awards-list" style="margin-bottom: 28px;">
        ${movieListHtml}
      </div>

      <div class="profile-section-title">SPECIAL SHADER EFFECTS</div>
      <ul style="margin-bottom: 32px;">
        <li style="margin-bottom: 8px; color: var(--text-secondary); font-size: 13px; display: flex; align-items: center; gap: 8px;">
          <span style="width: 4px; height: 4px; border-radius: 50%; background: var(--accent-red);"></span>
          GLSL Multi-octave Liquid Ripple Hover Distortion
        </li>
        <li style="margin-bottom: 8px; color: var(--text-secondary); font-size: 13px; display: flex; align-items: center; gap: 8px;">
          <span style="width: 4px; height: 4px; border-radius: 50%; background: var(--accent-red);"></span>
          RGB Optical Chromatic Dispersion & Caustics
        </li>
        <li style="margin-bottom: 8px; color: var(--text-secondary); font-size: 13px; display: flex; align-items: center; gap: 8px;">
          <span style="width: 4px; height: 4px; border-radius: 50%; background: var(--accent-red);"></span>
          Concave Cylindrical Arc Projection in 3D Space
        </li>
        <li style="margin-bottom: 8px; color: var(--text-secondary); font-size: 13px; display: flex; align-items: center; gap: 8px;">
          <span style="width: 4px; height: 4px; border-radius: 50%; background: var(--accent-red);"></span>
          3D Perspective Infinite Wireframe Grid Floor
        </li>
      </ul>

      <div class="profile-section-title">INTERACTION SHORTCUTS</div>
      <div style="font-family: var(--font-mono); font-size: 12px; color: var(--text-secondary); display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 24px;">
        <div><span style="color: #fff;">← / →</span> or <span style="color: #fff;">A / D</span>: Rotate</div>
        <div><span style="color: #fff;">Drag / Wheel</span>: Spin</div>
        <div><span style="color: #fff;">F</span>: Toggle Full View</div>
        <div><span style="color: #fff;">M</span>: Mute / Sound</div>
        <div><span style="color: #fff;">Click Card</span>: Movie Details</div>
        <div><span style="color: #fff;">Esc</span>: Close Modals</div>
      </div>
    `;

    this.container.appendChild(this.backdrop);
    this.container.appendChild(this.drawer);

    // Listeners
    const closeBtn = this.drawer.querySelector('#about-close');
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
