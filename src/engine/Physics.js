/**
 * Physics Engine
 * Handles smooth inertial damping, lerp progression, velocity decay,
 * and snap mechanics for the 3D cylinder carousel.
 */
export class Physics {
  constructor(options = {}) {
    this.target = 0;
    this.current = 0;
    this.velocity = 0;
    this.ease = options.ease || 0.075;
    this.friction = options.friction || 0.92;
    this.dragSensitivity = options.dragSensitivity || 0.0035;
    this.wheelSensitivity = options.wheelSensitivity || 0.0012;
    this.maxVelocity = options.maxVelocity || 0.15;
    this.isDragging = false;
    this.lastDelta = 0;
  }

  update() {
    // Apply smooth linear interpolation towards target
    const diff = this.target - this.current;
    this.velocity = diff * this.ease;
    this.current += this.velocity;
    this.lastDelta = this.velocity;

    return {
      current: this.current,
      target: this.target,
      velocity: this.velocity,
      isMoving: Math.abs(this.velocity) > 0.0001
    };
  }

  applyDelta(delta) {
    this.target += delta;
  }

  applyDrag(dx) {
    const delta = -dx * this.dragSensitivity;
    this.target += delta;
  }

  applyWheel(dy) {
    const delta = dy * this.wheelSensitivity;
    this.target += delta;
  }

  snapToNearest(itemSpacing) {
    const nearestIndex = Math.round(this.target / itemSpacing);
    this.target = nearestIndex * itemSpacing;
    return nearestIndex;
  }

  goToIndex(index, itemSpacing) {
    this.target = index * itemSpacing;
  }

  reset() {
    this.target = 0;
    this.current = 0;
    this.velocity = 0;
  }
}
