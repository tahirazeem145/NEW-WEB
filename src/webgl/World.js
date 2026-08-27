import * as THREE from 'three';
import { CylinderCarousel } from './CylinderCarousel.js';
import { GridFloor } from './GridFloor.js';
import { Particles } from './Particles.js';
import { SoundFX } from '../engine/SoundFX.js';

/**
 * World
 * Orchestrates the Three.js 3D movie gallery scene, camera, lights, rendering loop,
 * and passes physics & raycasting data between modules.
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

    this.carousel = null;
    this.gridFloor = null;
    this.particles = null;

    this.clock = new THREE.Clock();
    this.isPaused = false;
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
    this.scene.background = new THREE.Color('#080808');
    this.scene.fog = new THREE.FogExp2('#080808', 0.032);

    // 2. Camera
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(48, aspect, 0.1, 100);
    this.camera.position.set(0, 0.35, 9.4);
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

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 10, 7);
    this.scene.add(dirLight);

    // 5. 3D Modules
    this.gridFloor = new GridFloor(this.scene);
    this.particles = new Particles(this.scene, 350);
    this.carousel = new CylinderCarousel(this.scene, this.movies, {
      radius: 12.5,
      cardWidth: 8.8,
      cardHeight: 5.4
    });

    // 6. Bind Input
    this.bindInputs();

    // 7. Render Loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  bindInputs() {
    this.input.on('move', ({ ndc }) => {
      this.parallaxTarget.x = ndc.x * 0.4;
      this.parallaxTarget.y = ndc.y * 0.2;
    });

    this.input.on('drag', ({ dx }) => {
      this.physics.applyDrag(dx);
    });

    this.input.on('wheel', ({ deltaY }) => {
      this.physics.applyWheel(deltaY);
    });

    this.input.on('click', ({ ndc }) => {
      this.raycaster.setFromCamera(ndc, this.camera);
      const clickedMovie = this.carousel.checkIntersection(this.raycaster);
      if (clickedMovie && this.onMovieClickCallback) {
        SoundFX.playModalOpen();
        this.onMovieClickCallback(clickedMovie);
      }
    });

    window.addEventListener('resize', this.onResize.bind(this));
  }

  onResize() {
    if (!this.camera || !this.renderer) return;
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    
    if (width < 768) {
      this.camera.fov = 58;
      this.camera.position.z = 11.2;
    } else {
      this.camera.fov = 48;
      this.camera.position.z = 9.4;
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

    // Raycast hover check to pass UVs to liquid distortion shader
    this.raycaster.setFromCamera(this.input.mouse, this.camera);
    const hoveredMovie = this.carousel.checkIntersection(this.raycaster);

    // Update body cursor class based on state
    if (this.input.isPointerDown) {
      document.body.classList.add('cursor-drag');
      document.body.classList.remove('cursor-hover', 'cursor-view');
    } else if (hoveredMovie) {
      document.body.classList.add('cursor-view');
      document.body.classList.remove('cursor-hover', 'cursor-drag');
    } else {
      document.body.classList.remove('cursor-drag', 'cursor-view');
    }

    // Update 3D Modules
    this.carousel.update(current, velocity, elapsedTime);
    this.gridFloor.update(elapsedTime, velocity);
    this.particles.update(elapsedTime, velocity);

    // Track active movie index
    if (this.carousel.selectedIndex !== this.lastActiveIndex) {
      this.lastActiveIndex = this.carousel.selectedIndex;
      SoundFX.playSlideTick();
      if (this.onActiveChangeCallback) {
        this.onActiveChangeCallback(this.carousel.selectedIndex, this.carousel.getActiveMovie());
      }
    }

    // Smooth camera parallax
    this.parallaxCurrent.x += (this.parallaxTarget.x - this.parallaxCurrent.x) * 0.05;
    this.parallaxCurrent.y += (this.parallaxTarget.y - this.parallaxCurrent.y) * 0.05;
    this.camera.position.x = this.parallaxCurrent.x;
    this.camera.position.y = 0.35 + this.parallaxCurrent.y;
    this.camera.lookAt(this.cameraTarget);

    this.renderer.render(this.scene, this.camera);
  }

  nextSlide() {
    const spacing = this.carousel.angleStep;
    this.physics.applyDelta(spacing);
  }

  prevSlide() {
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
    this.carousel.destroy();
    this.gridFloor.destroy();
    this.particles.destroy();
    this.renderer.dispose();
  }
}
