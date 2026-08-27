import * as THREE from 'three';
import { TextureGenerator } from './TextureGenerator.js';

/**
 * CylinderCarousel
 * Implements the 3D Curved Cylindrical showcase inspired by Jesper Landberg.
 * Curves meshes along a cylindrical arc with high-performance WebGL rendering.
 */
export class CylinderCarousel {
  constructor(scene, projects, options = {}) {
    this.scene = scene;
    this.projects = projects;
    this.options = options;

    this.group = new THREE.Group();
    this.cards = [];
    this.radius = options.radius || 12.0;
    this.cardWidth = options.cardWidth || 8.8;
    this.cardHeight = options.cardHeight || 5.4;
    
    // We duplicate projects to create an infinite, dense cylindrical loop (e.g. 12 cards)
    this.itemCount = this.projects.length * 2;
    this.angleStep = (Math.PI * 2) / this.itemCount;

    this.hoveredCard = null;
    this.selectedIndex = 0;

    this.init();
  }

  init() {
    this.scene.add(this.group);
    this.createCards();
  }

  createCards() {
    // Generate base curved geometry
    const segmentsX = 36;
    const segmentsY = 1;
    const baseGeo = new THREE.PlaneGeometry(this.cardWidth, this.cardHeight, segmentsX, segmentsY);
    
    // Apply cylindrical concave curvature to vertex positions
    const pos = baseGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const angle = x / this.radius;
      // Bend along cylinder
      const newX = this.radius * Math.sin(angle);
      const newZ = this.radius * (Math.cos(angle) - 1.0);
      pos.setXYZ(i, newX, pos.getY(i), newZ);
    }
    baseGeo.computeVertexNormals();

    for (let i = 0; i < this.itemCount; i++) {
      const projectIndex = i % this.projects.length;
      const project = this.projects[projectIndex];

      const texture = TextureGenerator.createCardTexture(project);

      const material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.96
      });

      const mesh = new THREE.Mesh(baseGeo.clone(), material);
      mesh.userData = {
        index: i,
        projectIndex,
        project,
        baseScale: 1.0,
        currentScale: 1.0
      };

      this.group.add(mesh);
      this.cards.push(mesh);
    }

    this.updateCardPositions(0);
  }

  updateCardPositions(progress) {
    const totalAngle = Math.PI * 2;

    for (let i = 0; i < this.cards.length; i++) {
      const card = this.cards[i];
      // Compute angular position along the cylinder
      const angle = i * this.angleStep - progress;
      
      // Normalize angle to [-PI, PI] relative to camera (which is at z = radius + cameraDistance)
      let normalizedAngle = ((angle % totalAngle) + totalAngle) % totalAngle;
      if (normalizedAngle > Math.PI) normalizedAngle -= totalAngle;

      // Position on cylinder circle
      const x = Math.sin(normalizedAngle) * this.radius;
      const z = Math.cos(normalizedAngle) * this.radius - this.radius;

      card.position.set(x, 0, z);
      // Orient normal towards the center of curvature
      card.rotation.y = normalizedAngle;

      // Subtle parallax vertical float based on angle
      card.position.y = Math.cos(normalizedAngle * 2.0) * 0.15;

      // Depth fading / opacity falloff as cards curve away to the back
      const depthDist = Math.abs(normalizedAngle);
      const fade = 1.0 - Math.min(Math.max((depthDist - 1.2) / 1.5, 0.0), 0.85);
      card.material.opacity = fade;

      // Smooth scale interpolation on hover
      const targetScale = card === this.hoveredCard ? 1.03 : 1.0;
      card.userData.currentScale += (targetScale - card.userData.currentScale) * 0.15;
      card.scale.setScalar(card.userData.currentScale);
    }

    // Determine current active center card index
    const activeAngle = ((progress % totalAngle) + totalAngle) % totalAngle;
    const currentItem = Math.round(activeAngle / this.angleStep) % this.itemCount;
    this.selectedIndex = ((currentItem % this.projects.length) + this.projects.length) % this.projects.length;
  }

  update(progress, velocity = 0, time = 0) {
    this.updateCardPositions(progress);

    // Apply kinetic lean/tilt on drag velocity
    const lean = Math.min(Math.max(velocity * 4.0, -0.15), 0.15);
    this.group.rotation.z = THREE.MathUtils.lerp(this.group.rotation.z, -lean, 0.1);
    this.group.rotation.x = Math.sin(time * 0.5) * 0.015;
  }

  checkIntersection(raycaster) {
    const intersects = raycaster.intersectObjects(this.cards, false);
    if (intersects.length > 0) {
      const hitCard = intersects[0].object;
      this.hoveredCard = hitCard;
      return hitCard.userData.project;
    } else {
      this.hoveredCard = null;
      return null;
    }
  }

  getActiveProject() {
    return this.projects[this.selectedIndex];
  }

  destroy() {
    this.cards.forEach(card => {
      this.group.remove(card);
      card.geometry.dispose();
      if (card.material.map) card.material.map.dispose();
      card.material.dispose();
    });
    this.scene.remove(this.group);
  }
}
