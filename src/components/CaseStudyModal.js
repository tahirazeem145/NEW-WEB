import { SoundFX } from '../engine/SoundFX.js';

/**
 * CaseStudyModal Component
 * Immersive detailed case study sheet with client confessions, project brief,
 * performance metrics, and technological breakdown.
 */
export class CaseStudyModal {
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
    this.backdrop.id = 'case-study-backdrop';
    this.backdrop.innerHTML = `
      <button class="modal-close-btn" id="case-study-close" title="Close case study (Esc)" aria-label="Close">
        <svg viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
      <div class="case-study-modal" id="case-study-content">
        <!-- Injected via open(project) -->
      </div>
    `;

    this.container.appendChild(this.backdrop);
    this.modal = this.backdrop.querySelector('#case-study-content');

    // Close Listeners
    const closeBtn = this.backdrop.querySelector('#case-study-close');
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

  open(project) {
    this.isOpen = true;

    // Render stats
    const statsHtml = project.stats.map(s => `
      <div class="meta-item">
        <div class="meta-item-label">${s.label}</div>
        <div class="meta-item-value">${s.value}</div>
      </div>
    `).join('');

    // Render technologies
    const techTagsHtml = project.technologies.map(t => `
      <span class="card-tag">${t}</span>
    `).join('');

    // Render client confessions / testimonials
    const testimonialsHtml = project.confessions ? project.confessions.map(c => `
      <div class="modal-testimonial-card ${c.color}">
        <div class="quote-mark">“</div>
        <div class="quote-body">${c.quote}</div>
        <div class="quote-author">${c.author}</div>
        <div class="quote-role">${c.role}</div>
      </div>
    `).join('') : '';

    this.modal.innerHTML = `
      <div class="case-study-hero">
        <div class="case-study-badge">${project.index} / ${project.category}</div>
        <h1 class="case-study-title">${project.title}</h1>
        <p class="case-study-subtitle">${project.description}</p>
      </div>

      <div class="case-study-meta-grid">
        <div class="meta-item">
          <div class="meta-item-label">Client</div>
          <div class="meta-item-value">${project.client}</div>
        </div>
        <div class="meta-item">
          <div class="meta-item-label">Year</div>
          <div class="meta-item-value">${project.year}</div>
        </div>
        <div class="meta-item">
          <div class="meta-item-label">Role</div>
          <div class="meta-item-value">${project.role}</div>
        </div>
        <div class="meta-item">
          <div class="meta-item-label">Status</div>
          <div class="meta-item-value" style="color: ${project.accentColor}">Live Production</div>
        </div>
      </div>

      <div class="case-study-section">
        <h2 class="case-study-section-title">The Project Brief</h2>
        <p class="case-study-body-text">${project.brief}</p>
      </div>

      <div class="case-study-section">
        <h2 class="case-study-section-title">Key Performance & Impact</h2>
        <div class="case-study-meta-grid" style="margin: 16px 0; padding: 20px 0;">
          ${statsHtml}
        </div>
      </div>

      ${testimonialsHtml ? `
        <div class="case-study-section">
          <h2 class="case-study-section-title">Partner & Client Testimonials</h2>
          <div class="modal-testimonials-grid">
            ${testimonialsHtml}
          </div>
        </div>
      ` : ''}

      <div class="case-study-section">
        <h2 class="case-study-section-title">Technologies & Architecture</h2>
        <div class="card-tags" style="margin-top: 12px;">
          ${techTagsHtml}
        </div>
      </div>

      <div style="margin-top: 48px; padding-top: 24px; border-top: 1px solid var(--bg-glass-border); display: flex; justify-content: space-between; align-items: center;">
        <span style="font-family: var(--font-mono); font-size: 11px; color: var(--text-tertiary); letter-spacing: 0.1em; text-transform: uppercase;">
          Crafted with Three.js & Custom WebGL
        </span>
        <button class="social-link-btn" style="background: var(--accent-red); border-color: var(--accent-red);" onclick="alert('Launching live production preview...')">
          LAUNCH LIVE DEMO
        </button>
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
