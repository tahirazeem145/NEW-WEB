import * as THREE from 'three';

/**
 * DarkAtmosphere
 * Implements a luxurious 3D dark space backdrop with procedural dark nebula,
 * volumetric cinema spotlight falloff, and movie-reactive ambient color glows.
 */
export class DarkAtmosphere {
  constructor(scene) {
    this.scene = scene;
    this.mesh = null;
    this.init();
  }

  init() {
    const vertexShader = `
      varying vec2 vUv;
      varying vec3 vPosition;

      void main() {
        vUv = uv;
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      varying vec2 vUv;
      varying vec3 vPosition;

      uniform float uTime;
      uniform vec3 uAccentColor;
      uniform float uVelocity;

      // 2D Simplex Pseudo Noise
      vec2 hash2(vec2 p) {
        p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
        return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
      }

      float perlinNoise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(dot(hash2(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
              dot(hash2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
          mix(dot(hash2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
              dot(hash2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
          u.y
        );
      }

      void main() {
        vec2 uv = vUv;
        vec2 centeredUv = uv - vec2(0.5, 0.5);
        float dist = length(centeredUv);

        // Deep obsidian pitch-black base
        vec3 darkPitch = vec3(0.015, 0.015, 0.02);

        // Volumetric Cinema Spotlight Aura behind the cards
        float spotAura = exp(-dist * 2.8) * 0.18;

        // Slow rolling dark nebula smoke
        float smoke = perlinNoise(centeredUv * 3.5 + vec2(uTime * 0.04, uTime * 0.03)) * 0.08;
        float smoke2 = perlinNoise(centeredUv * 7.0 - vec2(uTime * 0.02, uTime * 0.05)) * 0.04;

        // Cinematic horizon glow
        float horizon = smoothstep(0.7, 0.35, abs(uv.y - 0.48)) * 0.06;

        // Tint dark space with active movie's accent color
        vec3 ambientGlow = uAccentColor * (spotAura + smoke + smoke2 + horizon);

        // Pure pitch-black radial edge vignette
        float edgeVignette = smoothstep(0.75, 0.15, dist);

        vec3 finalBg = (darkPitch + ambientGlow) * edgeVignette;

        // Kinetic flash on fast drag
        finalBg += uAccentColor * (abs(uVelocity) * 0.08);

        gl_FragColor = vec4(finalBg, 1.0);
      }
    `;

    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      depthWrite: false,
      side: THREE.BackSide,
      uniforms: {
        uTime: { value: 0.0 },
        uAccentColor: { value: new THREE.Color('#ea2e15') },
        uVelocity: { value: 0.0 }
      }
    });

    const geometry = new THREE.SphereGeometry(65, 32, 24);
    this.mesh = new THREE.Mesh(geometry, this.material);
    this.mesh.position.set(0, 0, 0);
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
