/**
 * Cursor Component
 * High-performance fluid magnetic trailing cursor with mode morphing.
 */
export class Cursor {
  constructor() {
    this.dot = null;
    this.follower = null;
    this.textEl = null;

    this.mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    this.pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    this.speed = 0.18;

    this.init();
  }

  init() {
    // Only initialize on devices with fine pointer (mouse)
    if (window.matchMedia('(pointer: coarse)').matches) return;

    this.dot = document.createElement('div');
    this.dot.className = 'custom-cursor';

    this.follower = document.createElement('div');
    this.follower.className = 'custom-cursor-follower';

    this.textEl = document.createElement('span');
    this.textEl.className = 'cursor-text';
    this.textEl.textContent = 'VIEW';
    this.follower.appendChild(this.textEl);

    document.body.appendChild(this.dot);
    document.body.appendChild(this.follower);

    window.addEventListener('pointermove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;

      // Immediate position for center dot
      this.dot.style.transform = `translate(${this.mouse.x}px, ${this.mouse.y}px) translate(-50%, -50%)`;
    });

    this.bindHoverElements();
    this.render = this.render.bind(this);
    requestAnimationFrame(this.render);
  }

  setText(text) {
    if (this.textEl) {
      this.textEl.textContent = text;
    }
  }

  bindHoverElements() {
    const attachHover = () => {
      const hoverables = document.querySelectorAll('button, a, .view-opt, .brand-title, .project-card, .award-item, .social-link-btn');
      hoverables.forEach(el => {
        el.addEventListener('mouseenter', () => {
          document.body.classList.add('cursor-hover');
        });
        el.addEventListener('mouseleave', () => {
          document.body.classList.remove('cursor-hover');
        });
      });
    };

    attachHover();
    // Re-bind when DOM mutations occur
    const observer = new MutationObserver(() => attachHover());
    observer.observe(document.body, { childList: true, subtree: true });
  }

  render() {
    // Lerp trailing follower
    this.pos.x += (this.mouse.x - this.pos.x) * this.speed;
    this.pos.y += (this.mouse.y - this.pos.y) * this.speed;

    if (this.follower) {
      this.follower.style.transform = `translate(${this.pos.x}px, ${this.pos.y}px) translate(-50%, -50%)`;
    }

    requestAnimationFrame(this.render);
  }
}
