import { GALLERY_INFO } from '../data/movies.js';
import { SoundFX } from '../engine/SoundFX.js';

/**
 * GridView Component
 * Renders the complete 10-movie cinema catalog with dynamic genre filtering
 * when user toggles to the "ALL MOVIES" view mode.
 */
export class GridView {
  constructor(container, movies, onMovieClick) {
    this.container = container;
    this.movies = movies;
    this.onMovieClick = onMovieClick;
    this.activeFilter = 'All';
    this.element = null;
    this.isVisible = false;
    this.init();
  }

  init() {
    this.element = document.createElement('div');
    this.element.className = 'grid-view-container';
    this.element.id = 'grid-view';

    this.render();
    this.container.appendChild(this.element);
  }

  render() {
    const filteredMovies = this.activeFilter === 'All' 
      ? this.movies 
      : this.movies.filter(m => m.genres.some(g => g.toLowerCase().includes(this.activeFilter.toLowerCase())));

    const filterButtonsHtml = GALLERY_INFO.genres.map(g => `
      <button class="social-link-btn filter-btn ${this.activeFilter === g ? 'active' : ''}" data-genre="${g}" style="${this.activeFilter === g ? 'background: var(--accent-red); border-color: var(--accent-red);' : ''}">
        ${g}
      </button>
    `).join('');

    const cardsHtml = filteredMovies.map((m, idx) => `
      <div class="project-card" data-id="${m.id}" data-index="${idx}" style="background: linear-gradient(135deg, ${m.accentColor}15 0%, #121214 100%); border-color: ${m.accentColor}33;">
        <div class="card-content">
          <div class="card-meta">
            <span style="color: ${m.accentColor}; font-weight: 700;">${m.index} / ${m.certification}</span>
            <span style="color: #fff; font-weight: 700;">★ ${m.rating}</span>
          </div>

          <h3 class="card-title" style="font-family: var(--font-display); font-size: 26px;">${m.title}</h3>
          
          <p style="font-family: var(--font-sans); font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: ${m.accentColor}; font-weight: 600;">
            ${m.tagline}
          </p>

          <p class="card-description">${m.synopsis}</p>

          <div style="background: rgba(0, 0, 0, 0.4); border-left: 3px solid ${m.accentColor}; padding: 10px 14px; border-radius: 4px; margin: 8px 0; font-family: var(--font-serif); font-size: 13px; font-style: italic; color: #f0e6d2;">
            “ ${m.iconicDialogue} ”
          </div>

          <div class="card-tags">
            ${m.genres.map(t => `<span class="card-tag" style="border-color: ${m.accentColor}22;">${t}</span>`).join('')}
          </div>
        </div>
      </div>
    `).join('');

    this.element.innerHTML = `
      <div class="grid-view-header">
        <h2 class="grid-view-title">${GALLERY_INFO.title}</h2>
        <p class="grid-view-subtitle">${GALLERY_INFO.subtitle} — ${GALLERY_INFO.totalMovies} Selected Iconic Masterpieces</p>
        
        <!-- Genre Filter Bar -->
        <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 24px;">
          ${filterButtonsHtml}
        </div>
      </div>

      <div class="grid-view-cards">
        ${cardsHtml}
      </div>
    `;

    // Click handler on filter buttons
    const filterBtns = this.element.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.activeFilter = btn.dataset.genre;
        SoundFX.playTick(600, 0.03);
        this.render();
      });
    });

    // Click handler on movie cards
    const cardEls = this.element.querySelectorAll('.project-card');
    cardEls.forEach(cardEl => {
      cardEl.addEventListener('click', () => {
        const id = cardEl.dataset.id;
        const movie = this.movies.find(m => m.id === id);
        if (movie && this.onMovieClick) {
          SoundFX.playModalOpen();
          this.onMovieClick(movie);
        }
      });
    });
  }

  show() {
    this.isVisible = true;
    this.element.classList.add('active');
  }

  hide() {
    this.isVisible = false;
    this.element.classList.remove('active');
  }
}
