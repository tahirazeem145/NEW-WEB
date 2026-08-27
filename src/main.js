import './styles/index.css';
import { PROJECTS } from './data/projects.js';
import { Physics } from './engine/Physics.js';
import { InputManager } from './engine/InputManager.js';
import { SoundFX } from './engine/SoundFX.js';
import { World } from './webgl/World.js';
import { Header } from './components/Header.js';
import { Footer } from './components/Footer.js';
import { Cursor } from './components/Cursor.js';
import { CaseStudyModal } from './components/CaseStudyModal.js';
import { ProfileDrawer } from './components/ProfileDrawer.js';
import { NewsletterModal } from './components/NewsletterModal.js';
import { GridView } from './components/GridView.js';

class Application {
  constructor() {
    this.appContainer = document.getElementById('app');
    this.canvas = document.getElementById('webgl-canvas');
    this.dragGuide = document.getElementById('drag-guide');
    this.modalsContainer = document.getElementById('modals-container');

    this.physics = null;
    this.input = null;
    this.world = null;
    this.cursor = null;
    this.header = null;
    this.footer = null;
    this.caseStudyModal = null;
    this.profileDrawer = null;
    this.newsletterModal = null;
    this.gridView = null;

    this.hasInteracted = false;

    this.init();
  }

  init() {
    // 1. Initialize Engines
    this.physics = new Physics({
      ease: 0.075,
      friction: 0.92,
      dragSensitivity: 0.0035,
      wheelSensitivity: 0.0012
    });

    this.input = new InputManager(this.canvas);

    // 2. Initialize 3D WebGL World
    this.world = new World(this.canvas, PROJECTS, this.physics, this.input);

    // 3. Initialize Interactive Components
    this.cursor = new Cursor();
    this.caseStudyModal = new CaseStudyModal(this.modalsContainer);
    this.profileDrawer = new ProfileDrawer(this.modalsContainer);
    this.newsletterModal = new NewsletterModal(this.modalsContainer);

    this.gridView = new GridView(this.appContainer, PROJECTS, (project) => {
      this.caseStudyModal.open(project);
    });

    // 4. Header & Footer
    this.header = new Header(this.appContainer, () => {
      this.profileDrawer.open();
    });

    this.footer = new Footer(this.appContainer, PROJECTS.length, {
      onViewModeChange: (mode) => this.handleViewModeChange(mode),
      onNewsletterClick: () => this.newsletterModal.open(),
      onPrevClick: () => this.world.prevSlide(),
      onNextClick: () => this.world.nextSlide()
    });

    // 5. Connect World Callbacks
    this.world.onCardClick((project) => {
      this.caseStudyModal.open(project);
    });

    this.world.onActiveChange((index, project) => {
      this.footer.updateCounter(index);
    });

    // 6. Bind Global Keyboard & Interaction Hooks
    this.bindGlobalEvents();
  }

  handleViewModeChange(mode) {
    if (mode === 'full') {
      this.gridView.show();
      this.world.pause();
    } else {
      this.gridView.hide();
      this.world.resume();
    }
  }

  bindGlobalEvents() {
    // Hide drag guide on first interaction
    const hideGuide = () => {
      if (!this.hasInteracted) {
        this.hasInteracted = true;
        if (this.dragGuide) {
          this.dragGuide.style.opacity = '0';
          setTimeout(() => this.dragGuide.remove(), 600);
        }
      }
    };

    this.input.on('dragStart', hideGuide);
    this.input.on('wheel', hideGuide);

    // Brand logo click to reset view
    const brandLogo = document.getElementById('brand-logo');
    if (brandLogo) {
      brandLogo.addEventListener('click', () => {
        SoundFX.playTick(600, 0.04);
        this.world.goToProjectIndex(0);
        this.footer.setMode('featured');
        this.handleViewModeChange('featured');
      });
    }

    // Keyboard navigation
    this.input.on('key', ({ key, code }) => {
      if (this.caseStudyModal.isOpen || this.profileDrawer.isOpen || this.newsletterModal.isOpen) {
        return;
      }

      if (key === 'ArrowRight' || key === 'd' || key === 'D') {
        this.world.nextSlide();
        hideGuide();
      } else if (key === 'ArrowLeft' || key === 'a' || key === 'A') {
        this.world.prevSlide();
        hideGuide();
      } else if (key === 'f' || key === 'F') {
        const nextMode = this.footer.currentMode === 'featured' ? 'full' : 'featured';
        this.footer.setMode(nextMode);
        this.handleViewModeChange(nextMode);
      } else if (key === 'p' || key === 'P') {
        this.profileDrawer.open();
      } else if (key === 'n' || key === 'N') {
        this.newsletterModal.open();
      } else if (key === 'm' || key === 'M') {
        SoundFX.toggleMute();
        this.header.updateSoundButtonUI();
      }
    });
  }
}

// Bootstrap on DOM ready
window.addEventListener('DOMContentLoaded', () => {
  new Application();
});
