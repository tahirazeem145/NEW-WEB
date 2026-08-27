/**
 * InputManager
 * Coordinates pointer, touch, scroll wheel, and keyboard interactions
 * with drag thresholds and raycasting NDC coordinates.
 */
export class InputManager {
  constructor(domElement, options = {}) {
    this.domElement = domElement || window;
    this.options = options;
    
    this.isPointerDown = false;
    this.startX = 0;
    this.startY = 0;
    this.lastX = 0;
    this.lastY = 0;
    this.dragDistance = 0;
    this.dragThreshold = 6; // px threshold before registering as drag instead of click
    
    // Normalized Device Coordinates (-1 to 1) for 3D Raycasting & Parallax
    this.mouse = { x: 0, y: 0 };
    this.rawMouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    // Event callbacks
    this.listeners = {
      drag: [],
      dragStart: [],
      dragEnd: [],
      wheel: [],
      click: [],
      move: [],
      key: []
    };

    this.bindEvents();
  }

  on(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event].push(callback);
    }
  }

  emit(event, payload) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(payload));
    }
  }

  bindEvents() {
    // Pointer Events
    window.addEventListener('pointerdown', this.handlePointerDown.bind(this), { passive: false });
    window.addEventListener('pointermove', this.handlePointerMove.bind(this), { passive: false });
    window.addEventListener('pointerup', this.handlePointerUp.bind(this), { passive: false });
    window.addEventListener('pointercancel', this.handlePointerUp.bind(this), { passive: false });

    // Wheel Event
    window.addEventListener('wheel', this.handleWheel.bind(this), { passive: false });

    // Keyboard
    window.addEventListener('keydown', this.handleKeyDown.bind(this));

    // Window Resize
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  handlePointerDown(e) {
    // Ignore clicks on HUD buttons or modal overlays
    if (e.target.closest('.hud-header, .hud-footer, .modal-backdrop, .profile-drawer, .grid-view-container')) {
      return;
    }

    this.isPointerDown = true;
    this.startX = e.clientX;
    this.startY = e.clientY;
    this.lastX = e.clientX;
    this.lastY = e.clientY;
    this.dragDistance = 0;

    this.emit('dragStart', { x: e.clientX, y: e.clientY });
  }

  handlePointerMove(e) {
    this.rawMouse.x = e.clientX;
    this.rawMouse.y = e.clientY;
    this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    this.emit('move', {
      raw: this.rawMouse,
      ndc: this.mouse,
      event: e
    });

    if (!this.isPointerDown) return;

    const dx = e.clientX - this.lastX;
    const dy = e.clientY - this.lastY;
    this.dragDistance += Math.hypot(dx, dy);

    this.lastX = e.clientX;
    this.lastY = e.clientY;

    this.emit('drag', { dx, dy, x: e.clientX, y: e.clientY, distance: this.dragDistance });
  }

  handlePointerUp(e) {
    if (!this.isPointerDown) return;
    this.isPointerDown = false;

    const wasClick = this.dragDistance < this.dragThreshold;
    this.emit('dragEnd', {
      x: e.clientX,
      y: e.clientY,
      distance: this.dragDistance,
      wasClick
    });

    if (wasClick) {
      this.emit('click', {
        x: e.clientX,
        y: e.clientY,
        ndc: this.mouse,
        event: e
      });
    }
  }

  handleWheel(e) {
    // If inside an active modal or drawer, allow normal scroll
    if (e.target.closest('.case-study-modal, .profile-drawer, .grid-view-container')) {
      return;
    }

    this.emit('wheel', {
      deltaY: e.deltaY,
      deltaX: e.deltaX,
      originalEvent: e
    });
  }

  handleKeyDown(e) {
    this.emit('key', {
      key: e.key,
      code: e.code,
      event: e
    });
  }

  handleResize() {
    this.rawMouse.x = window.innerWidth / 2;
    this.rawMouse.y = window.innerHeight / 2;
  }

  destroy() {
    window.removeEventListener('pointerdown', this.handlePointerDown);
    window.removeEventListener('pointermove', this.handlePointerMove);
    window.removeEventListener('pointerup', this.handlePointerUp);
    window.removeEventListener('pointercancel', this.handlePointerUp);
    window.removeEventListener('wheel', this.handleWheel);
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('resize', this.handleResize);
  }
}
