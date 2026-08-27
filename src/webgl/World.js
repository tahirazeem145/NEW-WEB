import * as THREE from 'three';
import { gsap } from 'gsap';
import { CylinderCarousel } from './CylinderCarousel.js';
import { GridFloor } from './GridFloor.js';
import { Particles } from './Particles.js';
import { SpaceBackground } from './SpaceBackground.js';
import { SoundFX } from '../engine/SoundFX.js';

/**
 * World
 * Coordinates the 3D space-level movie gallery environment with:
 * - Deep Space Galactic Nebula Skydome & Twinkling Star Clusters
 * - 3D Curved Panorama Ribbon & GLSL Liquid Distortion
 * - Dynamic Camera Parallax & Smooth Zoom-in Target Focusing
 */
export class World {
  constructor(canvasElement, movies, physics, inputManager) {
    this.canvas = canvasElement;
    this.movies = movies;
    this.physics = physics;
    this.input = inputManager;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.raycaster = new THREE.Raycaster();

    this.spaceBackground = null;
    this.carousel = null;
    this.gridFloor = null;
    this.particles = null;

    this.clock = new THREE.Clock();
    this.isPaused = false;
    this.isZooming = false;
    this.lastActiveIndex = 0;

    this.cameraTarget = new THREE.Vector3(0, 0, 0);
    this.parallaxTarget = { x: 0, y: 0 };
    this.parallaxCurrent = { x: 0, y: 0 };

    this.onMovieClickCallback = null;
    this.onActiveChangeCallback = null;

    this.init();
  }

  init() {
    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#030308');
    this.scene.fog = new THREE.FogExp2('#030308', 0.018);

    // 2. Camera - Eye level wide panorama
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(46, aspect, 0.1, 150);
    this.camera.position.set(0, 0.05, 9.8);
    this.camera.lookAt(this.cameraTarget);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xd4e2ff, 0.9);
    dirLight.position.set(5, 12, 8);
    this.scene.add(dirLight);

    const blueRimLight = new THREE.DirectionalLight(0x4466ff, 0.6);
    blueRimLight.position.set(-8, -4, -6);
    this.scene.add(blueRimLight);

    // 5. 3D Space Modules
    this.spaceBackground = new SpaceBackground(this.scene);
    this.gridFloor = new GridFloor(this.scene);
    this.particles = new Particles(this.scene, 350);
    this.carousel = new CylinderCarousel(this.scene, this.movies, {
      radius: 19.5,
      cardWidth: 10.4,
      cardHeight: 6.2
    });

    // 6. Bind Input
    this.bindInputs();

    // 7. Render Loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  bindInputs() {
    this.input.on('move', ({ ndc }) => {
      if (!this.isZooming) {
        this.parallaxTarget.x = ndc.x * 0.35;
        this.parallaxTarget.y = ndc.y * 0.18;
      }
    });

    this.input.on('drag', ({ dx }) => {
      if (!this.isZooming) {
        this.physics.applyDrag(dx);
      }
    });

    this.input.on('wheel', ({ deltaY }) => {
      if (!this.isZooming) {
        this.physics.applyWheel(deltaY);
      }
    });

    this.input.on('click', ({ ndc }) => {
      if (this.isZooming) return;

      this.raycaster.setFromCamera(ndc, this.camera);
      const hitResult = this.carousel.checkIntersection(this.raycaster);

      if (hitResult && hitResult.movie) {
        SoundFX.playModalOpen();
        this.executeCardZoomIn(hitResult);
      }
    });

    window.addEventListener('resize', this.onResize.bind(this));
  }

  executeCardZoomIn(hitResult) {
    this.isZooming = true;
    const { movie, card, uv } = hitResult;

    gsap.to(this.camera.position, {
      z: 7.8,
      y: 0.0,
      duration: 0.7,
      ease: 'power3.out'
    });

    this.carousel.zoomInCard(card, uv, () => {
      if (this.onMovieClickCallback) {
        this.onMovieClickCallback(movie);
      }
    });
  }

  resetCardZoom() {
    gsap.to(this.camera.position, {
      z: window.innerWidth < 768 ? 11.5 : 9.8,
      y: 0.05,
      duration: 0.6,
      ease: 'power2.inOut',
      onComplete: () => {
        this.isZooming = false;
      }
    });

    this.carousel.resetZoom();
  }

  onResize() {
    if (!this.camera || !this.renderer) return;
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    
    if (width < 768) {
      this.camera.fov = 56;
      this.camera.position.z = 11.5;
    } else {
      this.camera.fov = 46;
      this.camera.position.z = 9.8;
    }

    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  animate() {
    requestAnimationFrame(this.animate);
    if (this.isPaused) return;

    const elapsedTime = this.clock.getElapsedTime();
    const { current, velocity } = this.physics.update();

    this.raycaster.setFromCamera(this.input.mouse, this.camera);
    const hitResult = this.carousel.checkIntersection(this.raycaster);

    if (this.input.isPointerDown) {
      document.body.classList.add('cursor-drag');
      document.body.classList.remove('cursor-hover', 'cursor-view');
    } else if (hitResult) {
      document.body.classList.add('cursor-view');
      document.body.classList.remove('cursor-hover', 'cursor-drag');
    } else {
      document.body.classList.remove('cursor-drag', 'cursor-view');
    }

    // Update Space Environment & 3D Modules
    this.spaceBackground.update(elapsedTime, velocity);
    this.carousel.update(current, velocity, elapsedTime);
    this.gridFloor.update(elapsedTime, velocity);
    this.particles.update(elapsedTime, velocity);

    if (this.carousel.selectedIndex !== this.lastActiveIndex) {
      this.lastActiveIndex = this.carousel.selectedIndex;
      SoundFX.playSlideTick();
      if (this.onActiveChangeCallback) {
        this.onActiveChangeCallback(this.carousel.selectedIndex, this.carousel.getActiveMovie());
      }
    }

    if (!this.isZooming) {
      this.parallaxCurrent.x += (this.parallaxTarget.x - this.parallaxCurrent.x) * 0.05;
      this.parallaxCurrent.y += (this.parallaxTarget.y - this.parallaxCurrent.y) * 0.05;
      this.camera.position.x = this.parallaxCurrent.x;
      this.camera.position.y = 0.05 + this.parallaxCurrent.y;
    }
    
    this.camera.lookAt(this.cameraTarget);
    this.renderer.render(this.scene, this.camera);
  }

  nextSlide() {
    if (this.isZooming) return;
    const spacing = this.carousel.angleStep;
    this.physics.applyDelta(spacing);
  }

  prevSlide() {
    if (this.isZooming) return;
    const spacing = this.carousel.angleStep;
    this.physics.applyDelta(-spacing);
  }

  goToMovieIndex(index) {
    const spacing = this.carousel.angleStep;
    this.physics.goToIndex(index, spacing);
  }

  onMovieClick(cb) {
    this.onMovieClickCallback = cb;
  }

  onActiveChange(cb) {
    this.onActiveChangeCallback = cb;
  }

  pause() {
    this.isPaused = true;
  }

  resume() {
    this.isPaused = false;
    this.clock.start();
  }

  destroy() {
    this.isPaused = true;
    window.removeEventListener('resize', this.onResize);
    this.spaceBackground.destroy();
    this.carousel.destroy();
    this.gridFloor.destroy();
    this.particles.destroy();
    this.renderer.dispose();
  }
}
