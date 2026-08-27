import * as THREE from 'three';

/**
 * PixelParticles
 * Interactive 3D Cybernetic Pixel Particle Matrix.
 * Features sharp square pixel shapes, orbital drift, vertical levitation,
 * kinetic speed stretching, and movie-reactive neon color luminescence.
 */
export class Particles {
  constructor(scene, count = 750) {
    this.scene = scene;
    this.count = count;
    this.mesh = null;
    this.init();
  }

  init() {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.count * 3);
    const initialPositions = new Float32Array(this.count * 3);
    const randoms = new Float32Array(this.count * 4); // [speed, size, phase, colorType]

    for (let i = 0; i < this.count; i++) {
      // Cylindrical distribution surrounding the curved cards
      const radius = 5.0 + Math.random() * 22.0;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 18.0;

      const x = Math.sin(theta) * radius;
      const z = Math.cos(theta) * radius - (radius > 12.0 ? 3.0 : 0.0);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      initialPositions[i * 3] = x;
      initialPositions[i * 3 + 1] = y;
      initialPositions[i * 3 + 2] = z;

      // Random attributes per pixel particle
      randoms[i * 4] = 0.4 + Math.random() * 1.2;      // speed
      randoms[i * 4 + 1] = 6.0 + Math.random() * 18.0; // pixel size (6px to 24px)
      randoms[i * 4 + 2] = Math.random() * Math.PI * 2; // phase
      randoms[i * 4 + 3] = Math.random();               // color variation (accent vs white vs cyan)
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aInitialPos', new THREE.BufferAttribute(initialPositions, 3));
    geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 4));

    // Custom GLSL Shader Material for sharp square pixel particles
    const vertexShader = `
      attribute vec3 aInitialPos;
      attribute vec4 aRandom; // speed, size, phase, colorType

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

        // Dynamic 3D orbital & levitation drift
        vec3 pos = aInitialPos;

        // Vertical floating sine wave
        pos.y += sin(uTime * 0.8 * speed + phase) * 1.2;
        
        // Horizontal orbital drift around cylinder
        float angle = uTime * 0.15 * speed + uVelocity * 2.0;
        float cosA = cos(angle);
        float sinA = sin(angle);
        float newX = pos.x * cosA - pos.z * sinA;
        float newZ = pos.x * sinA + pos.z * cosA;
        pos.x = newX;
        pos.z = newZ;

        // Subtle kinetic scatter on velocity
        pos.x += sin(pos.y * 2.0 + uTime * 3.0) * uVelocity * 0.6;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPosition;

        // Size attenuation with perspective depth
        float kineticStretch = 1.0 + abs(uVelocity) * 1.8;
        gl_PointSize = (baseSize * kineticStretch) * (300.0 / -mvPosition.z);
        gl_PointSize = clamp(gl_PointSize, 3.0, 36.0);

        // Distance fog fade
        float dist = -mvPosition.z;
        vDistanceAlpha = smoothstep(1.5, 6.0, dist) * (1.0 - smoothstep(22.0, 48.0, dist));
      }
    `;

    const fragmentShader = `
      varying vec4 vRandom;
      varying float vDistanceAlpha;

      uniform vec3 uAccentColor;
      uniform float uTime;

      void main() {
        // Sharp Square Pixel Shape (discard rounded soft points)
        vec2 p = gl_PointCoord - vec2(0.5);

        // Discard fragments outside the sharp pixel square
        if (abs(p.x) > 0.45 || abs(p.y) > 0.45) {
          discard;
        }

        // Inner pixel glow & micro crosshair detail
        float centerGlow = 1.0 - length(p) * 0.8;

        // Twinkle pulse
        float twinkle = 0.7 + 0.3 * sin(uTime * 4.0 * vRandom.x + vRandom.z);

        // Color modulation based on random attribute
        vec3 pixelColor;
        float colorType = vRandom.w;

        if (colorType < 0.45) {
          // Movie Theme Neon Accent
          pixelColor = uAccentColor * 1.4;
        } else if (colorType < 0.75) {
          // Electric Cyan / Teal Pixel
          pixelColor = vec3(0.2, 0.85, 1.0);
        } else {
          // Crisp White / Platinum Spark
          pixelColor = vec3(0.95, 0.98, 1.0);
        }

        float alpha = vDistanceAlpha * twinkle * centerGlow * 0.85;

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
