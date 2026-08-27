import { SoundFX } from '../engine/SoundFX.js';

/**
 * Footer Component
 * Movie gallery footer with Featured 3D / All Movies switcher,
 * movie counter (01/10), and floating nav chevrons.
 */
export class Footer {
  constructor(container, totalMovies, options = {}) {
    this.container = container;
    this.totalMovies = totalMovies;
    this.onViewModeChange = options.onViewModeChange;
    this.onNewsletterClick = options.onNewsletterClick;
    this.onPrevClick = options.onPrevClick;
    this.onNextClick = options.onNextClick;

    this.currentMode = 'featured'; // 'featured' | 'full'
    this.element = null;
    this.arrowsElement = null;
    this.counterEl = null;

    this.init();
  }

  init() {
    this.element = document.createElement('footer');
    this.element.className = 'hud-footer';
    this.element.innerHTML = `
      <div class="view-mode-toggle" id="view-mode-toggle">
        <span class="view-opt active" data-mode="featured">3D CYLINDER</span>
        <span class="view-divider">/</span>
        <span class="view-opt" data-mode="full">ALL MOVIES</span>
      </div>

      <div class="carousel-counter" id="carousel-counter">
        <span class="carousel-counter-current" id="counter-current">01</span>
        <span>/</span>
        <span class="carousel-counter-total" id="counter-total">${String(this.totalMovies).padStart(2, '0')}</span>
      </div>

      <button class="newsletter-btn" id="newsletter-trigger">UPDATES</button>
    `;

    this.container.appendChild(this.element);

    // Floating Nav Arrows
    this.arrowsElement = document.createElement('div');
    this.arrowsElement.className = 'nav-arrows';
    this.arrowsElement.innerHTML = `
      <button class="nav-arrow-btn" id="nav-prev" title="Previous Movie" aria-label="Previous Movie">
        <svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
      </button>
      <button class="nav-arrow-btn" id="nav-next" title="Next Movie" aria-label="Next Movie">
        <svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
      </button>
    `;

    this.container.appendChild(this.arrowsElement);

    this.counterEl = this.element.querySelector('#counter-current');

    // Bind Listeners
    const viewOptions = this.element.querySelectorAll('.view-opt');
    viewOptions.forEach(opt => {
      opt.addEventListener('click', () => {
        const mode = opt.dataset.mode;
        if (mode === this.currentMode) return;

        viewOptions.forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
        this.currentMode = mode;
        SoundFX.playTick(600, 0.03);

        if (this.onViewModeChange) this.onViewModeChange(mode);
      });
    });

    const newsletterBtn = this.element.querySelector('#newsletter-trigger');
    newsletterBtn.addEventListener('click', () => {
      SoundFX.playModalOpen();
      if (this.onNewsletterClick) this.onNewsletterClick();
    });

    const prevBtn = this.arrowsElement.querySelector('#nav-prev');
    prevBtn.addEventListener('click', () => {
      SoundFX.playTick(480, 0.03);
      if (this.onPrevClick) this.onPrevClick();
    });

    const nextBtn = this.arrowsElement.querySelector('#nav-next');
    nextBtn.addEventListener('click', () => {
      SoundFX.playTick(540, 0.03);
      if (this.onNextClick) this.onNextClick();
    });
  }

  updateCounter(index) {
    if (this.counterEl) {
      this.counterEl.textContent = String(index + 1).padStart(2, '0');
    }
  }

  setMode(mode) {
    this.currentMode = mode;
    const viewOptions = this.element.querySelectorAll('.view-opt');
    viewOptions.forEach(opt => {
      opt.classList.toggle('active', opt.dataset.mode === mode);
    });
  }
}
