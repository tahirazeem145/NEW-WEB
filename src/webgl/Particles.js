import * as THREE from 'three';

/**
 * Particles — Minimalist Sparse Micro-Pixel Swarm
 * 40 subtle, delicate micro-pixels wandering and floating freely
 * in true random 3D directions across the cinema environment.
 */
export class Particles {
  constructor(scene, count = 40) {
    this.scene = scene;
    this.count = count;
    this.mesh = null;
    this.init();
  }

  init() {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.count * 3);
    const initialPositions = new Float32Array(this.count * 3);
    const flightVectors = new Float32Array(this.count * 4); // [freqX, freqY, freqZ, baseSize]
    const phaseOffsets = new Float32Array(this.count * 4);  // [phaseX, phaseY, phaseZ, colorType]

    for (let i = 0; i < this.count; i++) {
      // Widely distributed across 3D cinema space
      const x = (Math.random() - 0.5) * 24.0;
      const y = (Math.random() - 0.5) * 14.0;
      const z = -1.0 + (Math.random() - 0.5) * 16.0;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      initialPositions[i * 3] = x;
      initialPositions[i * 3 + 1] = y;
      initialPositions[i * 3 + 2] = z;

      // Independent 3D wander frequencies
      flightVectors[i * 4] = 0.20 + Math.random() * 0.45;     // X wander frequency
      flightVectors[i * 4 + 1] = 0.25 + Math.random() * 0.50; // Y wander frequency
      flightVectors[i * 4 + 2] = 0.18 + Math.random() * 0.40; // Z wander frequency
      flightVectors[i * 4 + 3] = 2.0 + Math.random() * 3.0;   // subtle micro-pixel size (2px - 5px)

      // Random phase offsets
      phaseOffsets[i * 4] = Math.random() * Math.PI * 2;
      phaseOffsets[i * 4 + 1] = Math.random() * Math.PI * 2;
      phaseOffsets[i * 4 + 2] = Math.random() * Math.PI * 2;
      phaseOffsets[i * 4 + 3] = Math.random();
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aInitialPos', new THREE.BufferAttribute(initialPositions, 3));
    geometry.setAttribute('aFlightVec', new THREE.BufferAttribute(flightVectors, 4));
    geometry.setAttribute('aPhaseOffset', new THREE.BufferAttribute(phaseOffsets, 4));

    // Custom GLSL Shader Material for random 3D micro-pixel wander
    const vertexShader = `
      attribute vec3 aInitialPos;
      attribute vec4 aFlightVec;   // freqX, freqY, freqZ, baseSize
      attribute vec4 aPhaseOffset; // phaseX, phaseY, phaseZ, colorType

      varying vec4 vPhaseOffset;
      varying float vDistanceAlpha;

      uniform float uTime;
      uniform float uVelocity;
      uniform vec2 uResolution;

      void main() {
        vPhaseOffset = aPhaseOffset;

        float fx = aFlightVec.x;
        float fy = aFlightVec.y;
        float fz = aFlightVec.z;
        float baseSize = aFlightVec.w;

        float px = aPhaseOffset.x;
        float py = aPhaseOffset.y;
        float pz = aPhaseOffset.z;

        // True random 3D Brownian wandering flight
        vec3 pos = aInitialPos;
        
        pos.x += sin(uTime * fx + px) * 1.6 + cos(uTime * (fy * 0.6) + pz) * 0.8;
        pos.y += cos(uTime * fy + py) * 1.4 + sin(uTime * (fz * 0.7) + px) * 0.7;
        pos.z += sin(uTime * fz + pz) * 1.3 + cos(uTime * (fx * 0.5) + py) * 0.6;

        // Subtle displacement when dragging
        pos.x += sin(pos.y * 1.5 + uTime * 2.0) * uVelocity * 0.35;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPosition;

        // Perspective depth size attenuation
        gl_PointSize = baseSize * (150.0 / -mvPosition.z);
        gl_PointSize = clamp(gl_PointSize, 1.5, 7.5);

        // Distance fog fade
        float dist = -mvPosition.z;
        vDistanceAlpha = smoothstep(1.0, 3.5, dist) * (1.0 - smoothstep(16.0, 34.0, dist));
      }
    `;

    const fragmentShader = `
      varying vec4 vPhaseOffset;
      varying float vDistanceAlpha;

      uniform vec3 uAccentColor;
      uniform float uTime;

      void main() {
        // Sharp Square Micro-Pixel Shape
        vec2 p = gl_PointCoord - vec2(0.5);

        if (abs(p.x) > 0.44 || abs(p.y) > 0.44) {
          discard;
        }

        // Soft micro-pixel glow
        float pixelGlow = 1.0 - max(abs(p.x), abs(p.y)) * 0.5;

        // Gentle random twinkle
        float twinkle = 0.65 + 0.35 * sin(uTime * 3.0 * (vPhaseOffset.x + 0.5) + vPhaseOffset.y);

        // Color variation
        vec3 pixelColor;
        float colorType = vPhaseOffset.w;

        if (colorType < 0.45) {
          pixelColor = uAccentColor * 1.4;
        } else if (colorType < 0.75) {
          pixelColor = vec3(0.35, 0.9, 1.0);
        } else {
          pixelColor = vec3(1.0, 1.0, 1.0);
        }

        float alpha = vDistanceAlpha * twinkle * pixelGlow * 0.85;

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
