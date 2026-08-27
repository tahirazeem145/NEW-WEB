import { SoundFX } from '../engine/SoundFX.js';

/**
 * MovieModal Component
 * Immersive cinematic lightbox showing in-depth movie details,
 * official poster banner, iconic dialogues, cast & crew, metrics, and trailer actions.
 */
export class MovieModal {
  constructor(container) {
    this.container = container;
    this.backdrop = null;
    this.modal = null;
    this.isOpen = false;
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
        <!-- Injected via open(movie) -->
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

  open(movie) {
    this.isOpen = true;

    // Render Stats
    const statsHtml = movie.stats.map(s => `
      <div class="meta-item">
        <div class="meta-item-label">${s.label}</div>
        <div class="meta-item-value">${s.value}</div>
      </div>
    `).join('');

    // Render Genres
    const genrePills = movie.genres.map(g => `
      <span class="card-tag" style="border-color: ${movie.accentColor}33; color: #fff;">${g}</span>
    `).join('');

    // Render Cast Members
    const castList = movie.cast.map(c => `
      <span class="card-tag" style="background: rgba(255,255,255,0.06);">${c}</span>
    `).join('');

    this.modal.innerHTML = `
      <!-- Official High-Res Poster Hero Banner -->
      <div class="case-study-media-banner" style="position: relative; width: 100%; aspect-ratio: 16 / 9; max-height: 460px; overflow: hidden; border-radius: var(--radius-lg); margin-bottom: 36px; border: 1px solid ${movie.accentColor}33; box-shadow: 0 20px 50px rgba(0,0,0,0.8);">
        <img src="${movie.posterUrl}" alt="${movie.title} Poster Banner" style="width: 100%; height: 100%; object-fit: cover;" />
        <div style="position: absolute; bottom: 0; left: 0; width: 100%; height: 60%; background: linear-gradient(to top, rgba(14,14,16,0.95), transparent);"></div>
      </div>

      <div class="case-study-hero">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
          <span class="case-study-badge" style="color: ${movie.accentColor}; background: ${movie.accentColor}18; border: 1px solid ${movie.accentColor}33;">
            ${movie.index} • ${movie.certification}
          </span>
          <span style="font-family: var(--font-mono); font-size: 13px; font-weight: 700; color: #fff; background: rgba(0,0,0,0.6); padding: 4px 12px; border-radius: var(--radius-full); border: 1px solid ${movie.accentColor};">
            ★ ${movie.rating} / 10
          </span>
          <span style="font-family: var(--font-mono); font-size: 12px; color: var(--text-secondary);">
            ${movie.year} • ${movie.duration}
          </span>
        </div>

        <h1 class="case-study-title" style="font-family: var(--font-display); letter-spacing: -0.02em;">
          ${movie.title}
        </h1>
        <p style="font-family: var(--font-sans); font-size: 14px; letter-spacing: 0.15em; text-transform: uppercase; color: ${movie.accentColor}; margin-top: -8px; margin-bottom: 16px;">
          ${movie.tagline}
        </p>
        <p class="case-study-subtitle">${movie.synopsis}</p>
      </div>

      <!-- Iconic Dialogue Card -->
      <div style="background: linear-gradient(135deg, ${movie.accentColor}18 0%, rgba(0,0,0,0.4) 100%); border: 1px solid ${movie.accentColor}44; border-radius: var(--radius-md); padding: 24px 28px; margin-bottom: 32px; position: relative;">
        <div style="font-family: var(--font-mono); font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: ${movie.accentColor}; margin-bottom: 8px;">
          ⚡ ICONIC DIALOGUE / MOMENT
        </div>
        <div style="font-family: var(--font-serif); font-size: clamp(1.1rem, 2.5vw, 1.4rem); font-style: italic; color: #ffffff; line-height: 1.5;">
          “ ${movie.iconicDialogue} ”
        </div>
      </div>

      <div class="case-study-meta-grid">
        <div class="meta-item">
          <div class="meta-item-label">Director</div>
          <div class="meta-item-value">${movie.director}</div>
        </div>
        <div class="meta-item">
          <div class="meta-item-label">Music Director</div>
          <div class="meta-item-value" style="color: ${movie.accentColor};">${movie.musicDirector}</div>
        </div>
        <div class="meta-item">
          <div class="meta-item-label">Release Year</div>
          <div class="meta-item-value">${movie.year}</div>
        </div>
        <div class="meta-item">
          <div class="meta-item-label">Duration</div>
          <div class="meta-item-value">${movie.duration}</div>
        </div>
      </div>

      <div class="case-study-section">
        <h2 class="case-study-section-title">Starring Cast</h2>
        <div class="card-tags" style="margin-top: 12px;">
          ${castList}
        </div>
      </div>

      <div class="case-study-section">
        <h2 class="case-study-section-title">Box Office & Critical Acclaim</h2>
        <div class="case-study-meta-grid" style="margin: 16px 0; padding: 20px 0;">
          ${statsHtml}
        </div>
      </div>

      <div class="case-study-section">
        <h2 class="case-study-section-title">Genres & Categorization</h2>
        <div class="card-tags" style="margin-top: 12px;">
          ${genrePills}
        </div>
      </div>

      <!-- Action Bar -->
      <div style="margin-top: 48px; padding-top: 24px; border-top: 1px solid var(--bg-glass-border); display: flex; flex-wrap: wrap; gap: 16px; justify-content: space-between; align-items: center;">
        <span style="font-family: var(--font-mono); font-size: 11px; color: var(--text-tertiary); letter-spacing: 0.1em; text-transform: uppercase;">
          GLSL Liquid Refraction Engine
        </span>
        <div style="display: flex; gap: 12px;">
          <button class="social-link-btn" style="background: ${movie.accentColor}; border-color: ${movie.accentColor}; color: #000; font-weight: 700;" onclick="alert('Playing trailer preview for ${movie.title}...')">
            ▶ WATCH TRAILER
          </button>
          <button class="social-link-btn" onclick="alert('Added ${movie.title} to your cinema watchlist!')">
            + WATCHLIST
          </button>
        </div>
      </div>
    `;

    this.backdrop.classList.add('active');
  }

  close() {
    if (!this.isOpen) return;
    this.isOpen = false;
    SoundFX.playModalClose();
    this.backdrop.classList.remove('active');
  }
}
