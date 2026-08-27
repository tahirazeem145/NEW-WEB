import * as THREE from 'three';
import { MovieTextureGenerator } from './MovieTextureGenerator.js';
import { liquidVertexShader, liquidFragmentShader } from './shaders/liquidShader.js';

/**
 * CylinderCarousel
 * 3D Curved Cylindrical Movie Showcase with GLSL Liquid Distortion Shader
 * that dynamically ripples and refracts on mouse cursor movement.
 */
export class CylinderCarousel {
  constructor(scene, movies, options = {}) {
    this.scene = scene;
    this.movies = movies;
    this.options = options;

    this.group = new THREE.Group();
    this.cards = [];
    this.radius = options.radius || 12.5;
    this.cardWidth = options.cardWidth || 8.8;
    this.cardHeight = options.cardHeight || 5.4;

    // Distribute all 10 movies around the cylinder circle
    this.itemCount = this.movies.length;
    this.angleStep = (Math.PI * 2) / this.itemCount;

    this.hoveredCard = null;
    this.hoveredUv = new THREE.Vector2(0.5, 0.5);
    this.selectedIndex = 0;

    this.init();
  }

  init() {
    this.scene.add(this.group);
    this.createCards();
  }

  createCards() {
    // Generate curved mesh geometry with high horizontal resolution for smooth cylinder bending
    const segmentsX = 48;
    const segmentsY = 16;
    const baseGeo = new THREE.PlaneGeometry(this.cardWidth, this.cardHeight, segmentsX, segmentsY);

    // Apply concave cylindrical curvature along radius
    const pos = baseGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const angle = x / this.radius;
      const newX = this.radius * Math.sin(angle);
      const newZ = this.radius * (Math.cos(angle) - 1.0);
      pos.setXYZ(i, newX, pos.getY(i), newZ);
    }
    baseGeo.computeVertexNormals();

    for (let i = 0; i < this.itemCount; i++) {
      const movie = this.movies[i];
      const texture = MovieTextureGenerator.createMovieTexture(movie);

      // Create Custom Liquid Distortion Shader Material
      const shaderMaterial = new THREE.ShaderMaterial({
        vertexShader: liquidVertexShader,
        fragmentShader: liquidFragmentShader,
        transparent: true,
        side: THREE.DoubleSide,
        uniforms: {
          uTexture: { value: texture },
          uTime: { value: 0.0 },
          uMouse: { value: new THREE.Vector2(0.5, 0.5) },
          uHover: { value: 0.0 },
          uVelocity: { value: 0.0 },
          uRadius: { value: this.radius },
          uAccentColor: { value: new THREE.Color(movie.accentColor) },
          uOpacity: { value: 1.0 }
        }
      });

      const mesh = new THREE.Mesh(baseGeo.clone(), shaderMaterial);
      mesh.userData = {
        index: i,
        movie,
        targetHover: 0.0,
        currentHover: 0.0,
        targetMouse: new THREE.Vector2(0.5, 0.5),
        currentMouse: new THREE.Vector2(0.5, 0.5),
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
      const angle = i * this.angleStep - progress;

      // Normalize angle to [-PI, PI] relative to viewing plane
      let normalizedAngle = ((angle % totalAngle) + totalAngle) % totalAngle;
      if (normalizedAngle > Math.PI) normalizedAngle -= totalAngle;

      // Position on cylinder circle
      const x = Math.sin(normalizedAngle) * this.radius;
      const z = Math.cos(normalizedAngle) * this.radius - this.radius;

      card.position.set(x, 0, z);
      card.rotation.y = normalizedAngle;

      // Subtle parallax vertical float
      card.position.y = Math.cos(normalizedAngle * 2.0) * 0.12;

      // Depth fading as cards curve towards the back
      const depthDist = Math.abs(normalizedAngle);
      const fade = 1.0 - Math.min(Math.max((depthDist - 1.2) / 1.6, 0.0), 0.88);
      card.material.uniforms.uOpacity.value = fade;

      // Hover scale interpolation
      const isHovered = card === this.hoveredCard;
      const targetScale = isHovered ? 1.035 : 1.0;
      card.userData.currentScale += (targetScale - card.userData.currentScale) * 0.15;
      card.scale.setScalar(card.userData.currentScale);
    }

    // Determine current centered active movie index
    const activeAngle = ((progress % totalAngle) + totalAngle) % totalAngle;
    const currentItem = Math.round(activeAngle / this.angleStep) % this.itemCount;
    this.selectedIndex = ((currentItem % this.movies.length) + this.movies.length) % this.movies.length;
  }

  update(progress, velocity = 0, time = 0) {
    this.updateCardPositions(progress);

    // Update shader uniforms per card
    for (let i = 0; i < this.cards.length; i++) {
      const card = this.cards[i];
      const mat = card.material;
      const isHovered = card === this.hoveredCard;

      // Smooth hover intensity lerp (0 -> 1)
      card.userData.targetHover = isHovered ? 1.0 : 0.0;
      card.userData.currentHover += (card.userData.targetHover - card.userData.currentHover) * 0.12;

      // Smooth mouse coordinate tracking on the card
      if (isHovered) {
        card.userData.targetMouse.copy(this.hoveredUv);
      }
      card.userData.currentMouse.lerp(card.userData.targetMouse, 0.18);

      mat.uniforms.uTime.value = time;
      mat.uniforms.uVelocity.value = velocity;
      mat.uniforms.uHover.value = card.userData.currentHover;
      mat.uniforms.uMouse.value.copy(card.userData.currentMouse);
    }

    // Kinetic carousel tilt & oscillation
    const lean = Math.min(Math.max(velocity * 4.0, -0.15), 0.15);
    this.group.rotation.z = THREE.MathUtils.lerp(this.group.rotation.z, -lean, 0.1);
    this.group.rotation.x = Math.sin(time * 0.5) * 0.015;
  }

  checkIntersection(raycaster) {
    const intersects = raycaster.intersectObjects(this.cards, false);
    if (intersects.length > 0) {
      const hit = intersects[0];
      this.hoveredCard = hit.object;
      if (hit.uv) {
        this.hoveredUv.copy(hit.uv);
      }
      return hit.object.userData.movie;
    } else {
      this.hoveredCard = null;
      return null;
    }
  }

  getActiveMovie() {
    return this.movies[this.selectedIndex];
  }

  destroy() {
    this.cards.forEach(card => {
      this.group.remove(card);
      card.geometry.dispose();
      if (card.material.uniforms.uTexture.value) {
        card.material.uniforms.uTexture.value.dispose();
      }
      card.material.dispose();
    });
    this.scene.remove(this.group);
  }
}
