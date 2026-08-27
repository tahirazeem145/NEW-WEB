import * as THREE from 'three';

/**
 * Particles — Micro-Pixel Particle Swarm
 * 1,600 sharp, tiny square micro-pixels flying and swirling continuously
 * in 3D perspective space with vortex flight physics and movie-reactive neon luminescence.
 */
export class Particles {
  constructor(scene, count = 1600) {
    this.scene = scene;
    this.count = count;
    this.mesh = null;
    this.init();
  }

  init() {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.count * 3);
    const initialPositions = new Float32Array(this.count * 3);
    const randoms = new Float32Array(this.count * 4); // [speed, baseSize, phase, colorType]

    for (let i = 0; i < this.count; i++) {
      // Wide 3D volume surrounding camera and curved panorama cards
      const radius = 3.5 + Math.random() * 24.0;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 20.0;

      const x = Math.sin(theta) * radius;
      const z = Math.cos(theta) * radius - 2.0;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      initialPositions[i * 3] = x;
      initialPositions[i * 3 + 1] = y;
      initialPositions[i * 3 + 2] = z;

      // Small micro-pixel sizing (2px to 7px) with lively flight velocities
      randoms[i * 4] = 0.5 + Math.random() * 1.8;      // flight speed multiplier
      randoms[i * 4 + 1] = 2.5 + Math.random() * 5.5;  // small micro-pixel size
      randoms[i * 4 + 2] = Math.random() * Math.PI * 2;// 3D flight phase
      randoms[i * 4 + 3] = Math.random();              // color palette selector
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aInitialPos', new THREE.BufferAttribute(initialPositions, 3));
    geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 4));

    // Custom GLSL Shader Material for crisp square micro-pixels
    const vertexShader = `
      attribute vec3 aInitialPos;
      attribute vec4 aRandom; // speed, baseSize, phase, colorType

      varying vec4 vRandom;
      varying float vDistanceAlpha;

      uniform float uTime;
      uniform float uVelocity;
      uniform vec2 uResolution;

      void main() {
        vRandom = aRandom;

        float speed = aRandom.x;
        float baseSize = aRandom.y;
        float phase = aRandom.z;

        // Dynamic 3D continuous flight vortex
        vec3 pos = aInitialPos;

        // Continuous vertical & horizontal flying turbulence
        float flightTime = uTime * 0.9 * speed + phase;
        pos.y += sin(flightTime * 1.2) * 1.8 + cos(flightTime * 0.7) * 0.8;
        
        // Swirling 3D orbital flight around the cinema viewport
        float orbitAngle = uTime * 0.18 * speed + uVelocity * 2.5;
        float cosA = cos(orbitAngle);
        float sinA = sin(orbitAngle);
        float rotX = pos.x * cosA - pos.z * sinA;
        float rotZ = pos.x * sinA + pos.z * cosA;
        pos.x = rotX;
        pos.z = rotZ;

        // Kinetic flight burst when scrolling
        pos.x += sin(pos.y * 1.5 + uTime * 4.0) * uVelocity * 0.8;
        pos.z += cos(pos.x * 1.5 + uTime * 3.0) * uVelocity * 0.5;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPosition;

        // Perspective depth size attenuation for small micro-pixels
        float kineticStretch = 1.0 + abs(uVelocity) * 1.4;
        gl_PointSize = (baseSize * kineticStretch) * (180.0 / -mvPosition.z);
        gl_PointSize = clamp(gl_PointSize, 1.5, 12.0);

        // Distance fog fade
        float dist = -mvPosition.z;
        vDistanceAlpha = smoothstep(1.0, 4.0, dist) * (1.0 - smoothstep(20.0, 45.0, dist));
      }
    `;

    const fragmentShader = `
      varying vec4 vRandom;
      varying float vDistanceAlpha;

      uniform vec3 uAccentColor;
      uniform float uTime;

      void main() {
        // Sharp Square Pixel Shape (100% sharp micro-pixel geometry)
        vec2 p = gl_PointCoord - vec2(0.5);

        // Discard fragments outside the square pixel box
        if (abs(p.x) > 0.46 || abs(p.y) > 0.46) {
          discard;
        }

        // Sharp micro-pixel glow
        float pixelGlow = 1.0 - max(abs(p.x), abs(p.y)) * 0.6;

        // Rapid glittering twinkle
        float twinkle = 0.65 + 0.35 * sin(uTime * 6.0 * vRandom.x + vRandom.z * 3.0);

        // Color variation (Movie Accent / Cyber Cyan / Pure White Spark)
        vec3 pixelColor;
        float colorType = vRandom.w;

        if (colorType < 0.40) {
          // Movie Theme Neon Pixel
          pixelColor = uAccentColor * 1.6;
        } else if (colorType < 0.70) {
          // Electric Cyan Pixel Spark
          pixelColor = vec3(0.3, 0.9, 1.0);
        } else {
          // Crisp Pure Diamond White Pixel
          pixelColor = vec3(1.0, 1.0, 1.0);
        }

        float alpha = vDistanceAlpha * twinkle * pixelGlow * 0.9;

        gl_FragColor = vec4(pixelColor, alpha);
      }
    `;

    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0.0 },
        uVelocity: { value: 0.0 },
        uAccentColor: { value: new THREE.Color('#ea2e15') },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
      }
    });

    this.mesh = new THREE.Points(geometry, this.material);
    this.scene.add(this.mesh);
  }

  setAccentColor(colorHex) {
    if (this.material && this.material.uniforms) {
      this.material.uniforms.uAccentColor.value.set(colorHex);
    }
  }

  update(time, velocity = 0) {
    if (this.material && this.material.uniforms) {
      this.material.uniforms.uTime.value = time;
      this.material.uniforms.uVelocity.value = velocity;
    }
  }

  destroy() {
    if (this.mesh) {
      this.scene.remove(this.mesh);
      this.mesh.geometry.dispose();
      this.material.dispose();
    }
  }
}
