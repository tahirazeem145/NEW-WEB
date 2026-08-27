import * as THREE from 'three';

/**
 * GridFloor
 * High-end Dark Cybernetic Horizon Floor with Dual-Frequency Grid,
 * Intersection Crosshairs (+), Kinetic Pulse Waves, and Depth Fog.
 */
export class GridFloor {
  constructor(scene) {
    this.scene = scene;
    this.mesh = null;
    this.init();
  }

  init() {
    const size = 160;

    const vertexShader = `
      varying vec3 vWorldPosition;
      varying vec2 vUv;
      uniform float uTime;
      uniform float uVelocity;
      
      void main() {
        vUv = uv;
        vec3 pos = position;
        
        // Subtle kinetic floor wave on velocity
        float wave = sin(length(pos.xz) * 0.2 - uTime * 2.0) * uVelocity * 0.08;
        pos.y += wave;
        
        vWorldPosition = pos;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `;

    const fragmentShader = `
      varying vec3 vWorldPosition;
      varying vec2 vUv;
      uniform vec3 uGridColor;
      uniform vec3 uAccentColor;
      uniform float uTime;
      uniform float uVelocity;

      // 2D Simplex Hash
      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
      }

      void main() {
        vec2 pos = vWorldPosition.xz;
        float dist = length(pos);

        // 1. Primary Grid (Major Grid Lines)
        float majorScale = 0.25; // 4m cells
        vec2 majorGrid = abs(fract(pos * majorScale - 0.5) - 0.5) / fwidth(pos * majorScale);
        float majorLine = 1.0 - min(min(majorGrid.x, majorGrid.y), 1.0);

        // 2. Secondary Sub-Grid (Fine Grid Lines)
        float minorScale = 1.0; // 1m cells
        vec2 minorGrid = abs(fract(pos * minorScale - 0.5) - 0.5) / fwidth(pos * minorScale);
        float minorLine = 1.0 - min(min(minorGrid.x, minorGrid.y), 1.0);

        // 3. Intersection Crosshairs (+) at major nodes
        vec2 nodeDist = abs(fract(pos * majorScale - 0.5) - 0.5);
        float crossArm = 0.08;
        float crossThickness = 0.015;
        float isCrossX = step(nodeDist.y, crossThickness) * step(nodeDist.x, crossArm);
        float isCrossY = step(nodeDist.x, crossThickness) * step(nodeDist.y, crossArm);
        float crosshair = max(isCrossX, isCrossY);

        // 4. Concentric Kinetic Pulse Waves
        float pulseSpeed = 3.5;
        float pulseWave = sin(dist * 0.35 - uTime * pulseSpeed);
        float pulseHighlight = smoothstep(0.85, 1.0, pulseWave) * 0.65;

        // 5. Atmospheric Horizon Fog Falloff
        float fogNear = 6.0;
        float fogFar = 55.0;
        float depthFog = 1.0 - smoothstep(fogNear, fogFar, dist);

        // Combine Line Weights
        float totalAlpha = (minorLine * 0.15 + majorLine * 0.45 + crosshair * 0.75 + pulseHighlight * 0.3) * depthFog;

        // Color blending with subtle movie accent hue
        vec3 baseColor = uGridColor;
        vec3 finalColor = mix(baseColor, uAccentColor, min(pulseHighlight + abs(uVelocity) * 1.5, 0.6));
        finalColor += vec3(0.12, 0.14, 0.18) * crosshair;

        gl_FragColor = vec4(finalColor, totalAlpha * 0.55);
      }
    `;

    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      uniforms: {
        uGridColor: { value: new THREE.Color('#222228') },
        uAccentColor: { value: new THREE.Color('#ea2e15') },
        uTime: { value: 0.0 },
        uVelocity: { value: 0.0 }
      }
    });

    const geometry = new THREE.PlaneGeometry(size, size, 64, 64);
    geometry.rotateX(-Math.PI / 2);

    this.mesh = new THREE.Mesh(geometry, this.material);
    this.mesh.position.y = -3.8;
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
