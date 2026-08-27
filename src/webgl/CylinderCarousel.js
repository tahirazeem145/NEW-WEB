import * as THREE from 'three';
import { gsap } from 'gsap';
import { MovieTextureGenerator } from './MovieTextureGenerator.js';
import { liquidVertexShader, liquidFragmentShader } from './shaders/liquidShader.js';

/**
 * CylinderCarousel
 * Wide concave curved panorama movie showcase matching Jesper Landberg layout
 * with 3D-to-2D morphing unbending plane transition and motion-velocity-modulated GLSL liquid shaders.
 */
export class CylinderCarousel {
  constructor(scene, movies, options = {}) {
    this.scene = scene;
    this.movies = movies;
    this.options = options;

    this.group = new THREE.Group();
    this.cards = [];
    this.radius = options.radius || 19.5;
    this.cardWidth = options.cardWidth || 10.4;
    this.cardHeight = options.cardHeight || 6.2;

    this.itemCount = this.movies.length;
    this.angleStep = (Math.PI * 2) / this.itemCount;

    this.hoveredCard = null;
    this.hoveredUv = new THREE.Vector2(0.5, 0.5);
    this.prevUv = new THREE.Vector2(0.5, 0.5);
    this.mouseSpeed = 0.0;
    this.targetMouseSpeed = 0.0;

    this.selectedIndex = 0;
    this.zoomedCard = null;
    this.isZooming = false;
    this.zoomTimeline = null;

    this.init();
  }

  init() {
    this.scene.add(this.group);
    this.createCards();
  }

  createCards() {
    const segmentsX = 64;
    const segmentsY = 24;
    const baseGeo = new THREE.PlaneGeometry(this.cardWidth, this.cardHeight, segmentsX, segmentsY);

    for (let i = 0; i < this.itemCount; i++) {
      const movie = this.movies[i];
      const texture = MovieTextureGenerator.createMovieTexture(movie);

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
          uMouseSpeed: { value: 0.0 },
          uVelocity: { value: 0.0 },
          uRadius: { value: this.radius },
          uFlatten: { value: 0.0 },
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
        mouseSpeed: 0.0,
        baseScale: 1.0,
        currentScale: 1.0,
        tiltX: 0,
        tiltY: 0,
        offsetZ: 0,
        offsetX: 0,
        customOpacity: 1.0
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
      if (card === this.zoomedCard && this.isZooming) continue;

      const angle = i * this.angleStep - progress;

      let normalizedAngle = ((angle % totalAngle) + totalAngle) % totalAngle;
      if (normalizedAngle > Math.PI) normalizedAngle -= totalAngle;

      const x = Math.sin(normalizedAngle) * this.radius + card.userData.offsetX;
      const z = Math.cos(normalizedAngle) * this.radius - this.radius + card.userData.offsetZ;

      card.position.set(x, 0, z);
      
      card.rotation.y = normalizedAngle + card.userData.tiltY;
      card.rotation.x = card.userData.tiltX;

      // Depth fading towards edges
      const depthDist = Math.abs(normalizedAngle);
      const baseFade = 1.0 - Math.min(Math.max((depthDist - 1.3) / 1.5, 0.0), 0.88);
      card.material.uniforms.uOpacity.value = baseFade * card.userData.customOpacity;

      // Hover scale interpolation
      const isHovered = card === this.hoveredCard && !this.isZooming;
      const targetScale = isHovered ? 1.03 : 1.0;
      card.userData.currentScale += (targetScale - card.userData.currentScale) * 0.15;
      card.scale.setScalar(card.userData.currentScale);
    }

    const activeAngle = ((progress % totalAngle) + totalAngle) % totalAngle;
    const currentItem = Math.round(activeAngle / this.angleStep) % this.itemCount;
    this.selectedIndex = ((currentItem % this.movies.length) + this.movies.length) % this.movies.length;
  }

  update(progress, velocity = 0, time = 0) {
    this.updateCardPositions(progress);

    // Track mouse speed on the card
    const deltaMove = this.hoveredUv.distanceTo(this.prevUv);
    this.prevUv.copy(this.hoveredUv);
    this.targetMouseSpeed = deltaMove * 18.0;

    // Smoothly decay mouse speed to 0 when stationary
    this.mouseSpeed += (this.targetMouseSpeed - this.mouseSpeed) * 0.22;
    this.targetMouseSpeed *= 0.75;

    for (let i = 0; i < this.cards.length; i++) {
      const card = this.cards[i];
      const mat = card.material;
      const isHovered = card === this.hoveredCard;

      card.userData.targetHover = isHovered ? 1.0 : 0.0;
      card.userData.currentHover += (card.userData.targetHover - card.userData.currentHover) * 0.12;

      if (isHovered && !this.isZooming) {
        card.userData.targetMouse.copy(this.hoveredUv);
        card.userData.mouseSpeed = this.mouseSpeed;

        const targetTiltX = -(this.hoveredUv.y - 0.5) * 0.15;
        const targetTiltY = (this.hoveredUv.x - 0.5) * 0.18;
        card.userData.tiltX += (targetTiltX - card.userData.tiltX) * 0.1;
        card.userData.tiltY += (targetTiltY - card.userData.tiltY) * 0.1;
      } else if (!this.isZooming) {
        card.userData.mouseSpeed *= 0.8;
        card.userData.tiltX += (0 - card.userData.tiltX) * 0.1;
        card.userData.tiltY += (0 - card.userData.tiltY) * 0.1;
      }

      card.userData.currentMouse.lerp(card.userData.targetMouse, 0.18);

      mat.uniforms.uTime.value = time;
      mat.uniforms.uVelocity.value = velocity;
      mat.uniforms.uHover.value = card.userData.currentHover;
      mat.uniforms.uMouseSpeed.value = card.userData.mouseSpeed;
      mat.uniforms.uMouse.value.copy(card.userData.currentMouse);
    }

    if (!this.isZooming) {
      const lean = Math.min(Math.max(velocity * 3.5, -0.12), 0.12);
      this.group.rotation.z = THREE.MathUtils.lerp(this.group.rotation.z, -lean, 0.1);
      this.group.rotation.x = Math.sin(time * 0.4) * 0.01;
    }
  }

  /**
   * Jesper Landberg Signature 3D-to-2D Morphing Plane Zoom Transition
   */
  zoomInCard(hitCard, uv, onComplete) {
    this.isZooming = true;
    this.zoomedCard = hitCard;

    if (this.zoomTimeline) this.zoomTimeline.kill();

    this.zoomTimeline = gsap.timeline({
      onComplete: () => {
        if (onComplete) onComplete(hitCard.userData.movie);
      }
    });

    // 1. Unbend the curved 3D mesh into a flat 2D full-bleed plane (uFlatten: 0.0 -> 1.0)
    this.zoomTimeline.to(hitCard.material.uniforms.uFlatten, {
      value: 1.0,
      duration: 1.15,
      ease: 'power4.inOut'
    }, 0);

    // 2. Position card directly in center front of camera
    this.zoomTimeline.to(hitCard.position, {
      x: 0,
      y: 0,
      z: 3.8,
      duration: 1.15,
      ease: 'power4.inOut'
    }, 0);

    // 3. Align card rotation perfectly flat
    this.zoomTimeline.to(hitCard.rotation, {
      x: 0,
      y: 0,
      z: 0,
      duration: 1.15,
      ease: 'power4.inOut'
    }, 0);

    // 4. Scale up smoothly
    this.zoomTimeline.to(hitCard.scale, {
      x: 1.34,
      y: 1.34,
      z: 1.34,
      duration: 1.15,
      ease: 'power4.inOut'
    }, 0);

    // 5. Neighbor cards slide outward and fade away
    this.cards.forEach(card => {
      if (card !== hitCard) {
        const diff = card.userData.index - hitCard.userData.index;
        const dir = diff > 0 ? 1 : -1;
        this.zoomTimeline.to(card.userData, {
          offsetX: dir * 14.0,
          customOpacity: 0.0,
          duration: 0.9,
          ease: 'power3.inOut'
        }, 0);
      }
    });

    return this.zoomTimeline;
  }

  /**
   * Reset Zoom and Morph Back into 3D Curved Cylinder Ribbon
   */
  resetZoom(onComplete) {
    if (!this.zoomedCard) {
      this.isZooming = false;
      if (onComplete) onComplete();
      return;
    }

    const card = this.zoomedCard;
    if (this.zoomTimeline) this.zoomTimeline.kill();

    this.zoomTimeline = gsap.timeline({
      onComplete: () => {
        this.isZooming = false;
        this.zoomedCard = null;
        if (onComplete) onComplete();
      }
    });

    // 1. Morph back from flat 2D plane to curved 3D cylinder (uFlatten: 1.0 -> 0.0)
    this.zoomTimeline.to(card.material.uniforms.uFlatten, {
      value: 0.0,
      duration: 1.15,
      ease: 'power4.inOut'
    }, 0);

    // 2. Scale back to standard scale
    this.zoomTimeline.to(card.scale, {
      x: 1.0,
      y: 1.0,
      z: 1.0,
      duration: 1.15,
      ease: 'power4.inOut'
    }, 0);

    // 3. Restore neighbor cards positions and opacities
    this.cards.forEach(c => {
      this.zoomTimeline.to(c.userData, {
        offsetX: 0,
        customOpacity: 1.0,
        duration: 1.1,
        ease: 'power3.inOut'
      }, 0.05);
    });

    return this.zoomTimeline;
  }

  checkIntersection(raycaster) {
    const intersects = raycaster.intersectObjects(this.cards, false);
    if (intersects.length > 0) {
      const hit = intersects[0];
      this.hoveredCard = hit.object;
      if (hit.uv) {
        this.hoveredUv.copy(hit.uv);
      }
      return {
        movie: hit.object.userData.movie,
        card: hit.object,
        uv: hit.uv || new THREE.Vector2(0.5, 0.5)
      };
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
