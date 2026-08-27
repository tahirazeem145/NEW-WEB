import { SoundFX } from '../engine/SoundFX.js';

/**
 * GridView Component
 * Renders the full catalog of projects in an editorial grid
 * when user toggles to the "FULL" view mode.
 */
export class GridView {
  constructor(container, projects, onCardClick) {
    this.container = container;
    this.projects = projects;
    this.onCardClick = onCardClick;
    this.element = null;
    this.isVisible = false;
    this.init();
  }

  init() {
    this.element = document.createElement('div');
    this.element.className = 'grid-view-container';
    this.element.id = 'grid-view';

    const cardsHtml = this.projects.map((p, idx) => `
      <div class="project-card ${p.themeClass}" data-id="${p.id}" data-index="${idx}">
        <div class="card-content">
          <div class="card-meta">
            <span>${p.index} / ${p.category}</span>
            <span>${p.year}</span>
          </div>

          <h3 class="card-title">${p.title}</h3>
          <p class="card-description">${p.description}</p>

          ${p.id === 'griflan' ? `
            <div class="confession-card-preview">
              <div class="confession-sticker red">
                “Fusing creativity, empathy, and speed...”
              </div>
              <div class="confession-sticker beige">
                “Exceptional creativity and attention to detail.”
              </div>
            </div>
          ` : ''}

          <div class="card-tags">
            ${p.tags.map(t => `<span class="card-tag">${t}</span>`).join('')}
          </div>
        </div>
      </div>
    `).join('');

    this.element.innerHTML = `
      <div class="grid-view-header">
        <h2 class="grid-view-title">All Works & Experiments</h2>
        <p class="grid-view-subtitle">Selected portfolio index (2023 — 2024)</p>
      </div>
      <div class="grid-view-cards">
        ${cardsHtml}
      </div>
    `;

    this.container.appendChild(this.element);

    // Click handler on cards
    const cardEls = this.element.querySelectorAll('.project-card');
    cardEls.forEach(cardEl => {
      cardEl.addEventListener('click', () => {
        const id = cardEl.dataset.id;
        const project = this.projects.find(p => p.id === id);
        if (project && this.onCardClick) {
          SoundFX.playModalOpen();
          this.onCardClick(project);
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
