import { SoundFX } from '../engine/SoundFX.js';

/**
 * NewsletterModal Component
 * Interactive newsletter subscription modal with email input and feedback animation.
 */
export class NewsletterModal {
  constructor(container) {
    this.container = container;
    this.backdrop = null;
    this.isOpen = false;
    this.init();
  }

  init() {
    this.backdrop = document.createElement('div');
    this.backdrop.className = 'modal-backdrop';
    this.backdrop.id = 'newsletter-backdrop';
    this.backdrop.innerHTML = `
      <div class="newsletter-dialog">
        <button class="modal-close-btn" id="newsletter-close" style="position: absolute; top: 16px; right: 16px;" title="Close" aria-label="Close">
          <svg viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>

        <div class="newsletter-icon">
          <svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
        </div>

        <h2 class="newsletter-title">Stay in the Orbit</h2>
        <p class="newsletter-desc">
          Receive occasional dispatches on WebGL experiments, creative direction case studies, and upcoming digital drops. Zero spam, ever.
        </p>

        <form class="newsletter-form" id="newsletter-form">
          <input 
            type="email" 
            class="newsletter-input" 
            id="newsletter-email" 
            placeholder="Enter your email address" 
            required 
            autocomplete="email"
          />
          <button type="submit" class="newsletter-submit-btn" id="newsletter-submit">
            SUBSCRIBE TO DISPATCHES
          </button>
        </form>

        <div class="newsletter-success-msg" id="newsletter-success">
          ✓ You are on the list! Welcome aboard.
        </div>
      </div>
    `;

    this.container.appendChild(this.backdrop);

    // Event Listeners
    const closeBtn = this.backdrop.querySelector('#newsletter-close');
    closeBtn.addEventListener('click', () => this.close());

    this.backdrop.addEventListener('click', (e) => {
      if (e.target === this.backdrop) this.close();
    });

    const form = this.backdrop.querySelector('#newsletter-form');
    const emailInput = this.backdrop.querySelector('#newsletter-email');
    const successMsg = this.backdrop.querySelector('#newsletter-success');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = emailInput.value.trim();
      if (!email) return;

      SoundFX.playTick(880, 0.08, 0.05);
      form.style.display = 'none';
      successMsg.style.display = 'block';

      setTimeout(() => {
        this.close();
        setTimeout(() => {
          form.style.display = 'flex';
          successMsg.style.display = 'none';
          emailInput.value = '';
        }, 500);
      }, 2200);
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
  }

  open() {
    this.isOpen = true;
    this.backdrop.classList.add('active');
    setTimeout(() => {
      const input = this.backdrop.querySelector('#newsletter-email');
      if (input) input.focus();
    }, 100);
  }

  close() {
    if (!this.isOpen) return;
    this.isOpen = false;
    SoundFX.playModalClose();
    this.backdrop.classList.remove('active');
  }
}
