import * as THREE from 'three';

/**
 * Particles
 * Ambient floating dust motes and micro-particles in 3D space.
 */
export class Particles {
  constructor(scene, count = 350) {
    this.scene = scene;
    this.count = count;
    this.mesh = null;
    this.init();
  }

  init() {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.count * 3);
    const scales = new Float32Array(this.count);

    for (let i = 0; i < this.count; i++) {
      // Spread in a cylindrical / spatial volume
      const radius = 6 + Math.random() * 20;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 16;

      positions[i * 3] = Math.sin(theta) * radius;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.cos(theta) * radius;

      scales[i] = Math.random() * 0.8 + 0.2;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

    const material = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.05,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending
    });

    this.mesh = new THREE.Points(geometry, material);
    this.scene.add(this.mesh);
  }

  update(time, velocity = 0) {
    if (this.mesh) {
      this.mesh.rotation.y = time * 0.03 + velocity * 0.2;
      this.mesh.rotation.x = Math.sin(time * 0.05) * 0.02;
    }
  }

  destroy() {
    if (this.mesh) {
      this.scene.remove(this.mesh);
      this.mesh.geometry.dispose();
      this.mesh.material.dispose();
    }
  }
}
