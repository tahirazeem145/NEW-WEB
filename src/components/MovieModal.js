import { gsap } from 'gsap';
import { SoundFX } from '../engine/SoundFX.js';

/**
 * MovieModal Component
 * Immersive cinema lightbox with ultra-smooth GSAP FLIP zoom transitions,
 * staggered content revelation, official 16:9 poster hero, and dialogue quotes.
 */
export class MovieModal {
  constructor(container, options = {}) {
    this.container = container;
    this.onCloseCallback = options.onClose || null;
    this.backdrop = null;
    this.modal = null;
    this.isOpen = false;
    this.currentTimeline = null;
    this.init();
  }

  init() {
    this.backdrop = document.createElement('div');
    this.backdrop.className = 'modal-backdrop';
    this.backdrop.id = 'movie-modal-backdrop';
    this.backdrop.innerHTML = `
      <button class="modal-close-btn" id="movie-modal-close" title="Close Movie Details (Esc)" aria-label="Close">
        <svg viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
      <div class="case-study-modal movie-modal-content" id="movie-modal-content">
        <!-- Injected dynamically -->
      </div>
    `;

    this.container.appendChild(this.backdrop);
    this.modal = this.backdrop.querySelector('#movie-modal-content');

    // Close Listeners
    const closeBtn = this.backdrop.querySelector('#movie-modal-close');
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.close();
    });

    this.backdrop.addEventListener('click', (e) => {
      if (e.target === this.backdrop) {
        this.close();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
  }

  onClose(cb) {
    this.onCloseCallback = cb;
  }

  open(movie) {
    this.isOpen = true;

    const statsHtml = movie.stats.map(s => `
      <div class="meta-item">
        <div class="meta-item-label">${s.label}</div>
        <div class="meta-item-value">${s.value}</div>
      </div>
    `).join('');

    const genrePills = movie.genres.map(g => `
      <span class="card-tag" style="border-color: ${movie.accentColor}44; color: #fff;">${g}</span>
    `).join('');

    const castList = movie.cast.map(c => `
      <span class="card-tag" style="background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.12);">${c}</span>
    `).join('');

    this.modal.innerHTML = `
      <div class="modal-anim-item case-study-media-banner" style="position: relative; width: 100%; aspect-ratio: 16 / 9; max-height: 480px; overflow: hidden; border-radius: var(--radius-lg); margin-bottom: 36px; border: 1px solid ${movie.accentColor}44; box-shadow: 0 24px 60px rgba(0,0,0,0.9);">
        <img src="${movie.posterUrl}" alt="${movie.title} Poster Banner" style="width: 100%; height: 100%; object-fit: cover;" />
        <div style="position: absolute; bottom: 0; left: 0; width: 100%; height: 65%; background: linear-gradient(to top, rgba(14,14,16,0.98), transparent);"></div>
      </div>

      <div class="modal-anim-item case-study-hero">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px; flex-wrap: wrap;">
          <span class="case-study-badge" style="color: ${movie.accentColor}; background: ${movie.accentColor}18; border: 1px solid ${movie.accentColor}44;">
            ${movie.index} • ${movie.certification}
          </span>
          <span style="font-family: var(--font-mono); font-size: 13px; font-weight: 700; color: #fff; background: rgba(0,0,0,0.7); padding: 4px 14px; border-radius: var(--radius-full); border: 1px solid ${movie.accentColor};">
            ★ ${movie.rating} / 10
          </span>
          <span style="font-family: var(--font-mono); font-size: 12px; color: var(--text-secondary);">
            ${movie.year} • ${movie.duration}
          </span>
        </div>

        <h1 class="case-study-title" style="font-family: var(--font-display); letter-spacing: -0.02em; line-height: 1.1; margin-bottom: 8px;">
          ${movie.title}
        </h1>
        <p style="font-family: var(--font-sans); font-size: 13px; letter-spacing: 0.15em; text-transform: uppercase; color: ${movie.accentColor}; margin-bottom: 18px;">
          ${movie.tagline}
        </p>

        <div style="background: rgba(255,255,255,0.03); border-left: 3px solid ${movie.accentColor}; padding: 18px 24px; border-radius: 0 var(--radius-md) var(--radius-md) 0; margin-bottom: 28px;">
          <div style="font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: ${movie.accentColor}; margin-bottom: 6px;">
            ICONIC DIALOGUE & CULT MOMENT
          </div>
          <div style="font-family: var(--font-serif); font-size: 18px; font-style: italic; color: #ffffff; line-height: 1.5;">
            “ ${movie.iconicDialogue} ”
          </div>
        </div>
      </div>

      <div class="modal-anim-item case-study-meta-grid" style="margin-bottom: 32px;">
        ${statsHtml}
      </div>

      <div class="modal-anim-item case-study-section">
        <h2 class="section-title" style="color: ${movie.accentColor};">SYNOPSIS</h2>
        <p class="section-text" style="font-size: 15px; line-height: 1.7; color: var(--text-secondary);">
          ${movie.synopsis}
        </p>
      </div>

      <div class="modal-anim-item case-study-section">
        <h2 class="section-title" style="color: ${movie.accentColor};">GENRES & CATEGORIES</h2>
        <div class="card-tags-row">
          ${genrePills}
        </div>
      </div>

      <div class="modal-anim-item case-study-section">
        <h2 class="section-title" style="color: ${movie.accentColor};">LEAD CAST & PERFORMANCES</h2>
        <div class="card-tags-row">
          ${castList}
        </div>
      </div>

      <div class="modal-anim-item case-study-section">
        <h2 class="section-title" style="color: ${movie.accentColor};">CREATIVE DIRECTORS & COMPOSERS</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px;">
          <div style="padding: 16px; background: rgba(255,255,255,0.03); border-radius: var(--radius-md); border: 1px solid rgba(255,255,255,0.06);">
            <div style="font-family: var(--font-mono); font-size: 11px; color: var(--text-muted); text-transform: uppercase;">Director</div>
            <div style="font-family: var(--font-sans); font-size: 15px; font-weight: 600; color: #fff; margin-top: 4px;">${movie.director}</div>
          </div>
          <div style="padding: 16px; background: rgba(255,255,255,0.03); border-radius: var(--radius-md); border: 1px solid rgba(255,255,255,0.06);">
            <div style="font-family: var(--font-mono); font-size: 11px; color: var(--text-muted); text-transform: uppercase;">Music Director / Score</div>
            <div style="font-family: var(--font-sans); font-size: 15px; font-weight: 600; color: #fff; margin-top: 4px;">${movie.musicDirector}</div>
          </div>
        </div>
      </div>

      <div class="modal-anim-item case-study-cta-row" style="margin-top: 40px;">
        <button class="primary-btn" id="movie-trailer-btn" style="background: ${movie.accentColor}; border-color: ${movie.accentColor}; color: #000; font-weight: 700;">
          <span>WATCH TRAILER & HIGHLIGHTS</span>
          <svg viewBox="0 0 24 24" style="width: 16px; height: 16px; fill: currentColor;"><path d="M8 5v14l11-7z"/></svg>
        </button>
        <button class="secondary-btn" id="movie-close-bottom-btn">
          CLOSE DETAILS
        </button>
      </div>
    `;

    // Bind inner buttons
    const bottomCloseBtn = this.modal.querySelector('#movie-close-bottom-btn');
    if (bottomCloseBtn) {
      bottomCloseBtn.addEventListener('click', () => this.close());
    }

    const trailerBtn = this.modal.querySelector('#movie-trailer-btn');
    if (trailerBtn) {
      trailerBtn.addEventListener('click', () => {
        SoundFX.playClick();
        window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(movie.title + ' official trailer')}`, '_blank');
      });
    }

    // Ultra-Smooth Continuous Zoom Inset Transition
    this.backdrop.classList.add('active');
    this.backdrop.scrollTop = 0;

    if (this.currentTimeline) this.currentTimeline.kill();

    this.currentTimeline = gsap.timeline();

    // 1. Backdrop smoothly fades in with deep blur
    this.currentTimeline.fromTo(this.backdrop, {
      opacity: 0,
      backdropFilter: 'blur(0px)'
    }, {
      opacity: 1,
      backdropFilter: 'blur(24px)',
      duration: 0.75,
      ease: 'power2.out'
    }, 0);

    // 2. Modal card zooms smoothly from card scale (0.75 -> 1.0) into view
    this.currentTimeline.fromTo(this.modal, {
      scale: 0.78,
      y: 60,
      opacity: 0,
      filter: 'blur(16px)'
    }, {
      scale: 1.0,
      y: 0,
      opacity: 1,
      filter: 'blur(0px)',
      duration: 0.85,
      ease: 'power3.out'
    }, 0.05);

    // 3. Stagger inner content upward with silky flow
    const animItems = this.modal.querySelectorAll('.modal-anim-item');
    this.currentTimeline.fromTo(animItems, {
      y: 35,
      opacity: 0
    }, {
      y: 0,
      opacity: 1,
      duration: 0.7,
      stagger: 0.05,
      ease: 'power2.out'
    }, 0.2);
  }

  close() {
    if (!this.isOpen) return;
    this.isOpen = false;
    SoundFX.playModalClose();

    if (this.currentTimeline) this.currentTimeline.kill();

    this.currentTimeline = gsap.timeline({
      onComplete: () => {
        this.backdrop.classList.remove('active');
        if (this.onCloseCallback) {
          this.onCloseCallback();
        }
      }
    });

    // Silky smooth zoom-out contraction
    this.currentTimeline.to(this.modal, {
      scale: 0.82,
      y: 40,
      opacity: 0,
      filter: 'blur(12px)',
      duration: 0.55,
      ease: 'power3.in'
    }, 0);

    this.currentTimeline.to(this.backdrop, {
      opacity: 0,
      backdropFilter: 'blur(0px)',
      duration: 0.55,
      ease: 'power2.in'
    }, 0.05);
  }
}
