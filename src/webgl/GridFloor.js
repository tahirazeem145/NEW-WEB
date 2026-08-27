import * as THREE from 'three';

/**
 * GridFloor
 * Implements the futuristic 3D perspective wireframe grid floor
 * with depth attenuation, subtle horizon glow, and motion reactivity.
 */
export class GridFloor {
  constructor(scene) {
    this.scene = scene;
    this.mesh = null;
    this.init();
  }

  init() {
    const size = 120;
    const divisions = 60;

    // Custom Shader Material for realistic perspective grid with depth fading
    const vertexShader = `
      varying vec3 vPosition;
      varying vec2 vUv;
      
      void main() {
        vUv = uv;
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      varying vec3 vPosition;
      varying vec2 vUv;
      uniform vec3 uGridColor;
      uniform vec3 uBgColor;
      uniform float uLineThickness;
      uniform float uGridScale;
      uniform float uTime;
      uniform float uVelocity;

      void main() {
        // Compute grid coordinates
        vec2 grid = abs(fract(vPosition.xz * uGridScale - 0.5) - 0.5) / fwidth(vPosition.xz * uGridScale);
        float line = min(grid.x, grid.y);
        float gridAlpha = 1.0 - min(line, 1.0);

        // Depth fog falloff from center / camera
        float dist = length(vPosition.xz);
        float fogFactor = smoothstep(12.0, 48.0, dist);
        
        // Perspective fade
        float alpha = gridAlpha * (1.0 - fogFactor) * 0.45;

        // Dynamic accent glow near center
        vec3 finalColor = mix(uGridColor, vec3(0.92, 0.18, 0.08), min(abs(uVelocity) * 2.0, 0.4));
        
        gl_FragColor = vec4(finalColor, alpha);
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
        uGridColor: { value: new THREE.Color('#333338') },
        uBgColor: { value: new THREE.Color('#080808') },
        uLineThickness: { value: 0.04 },
        uGridScale: { value: 0.25 },
        uTime: { value: 0.0 },
        uVelocity: { value: 0.0 }
      }
    });

    const geometry = new THREE.PlaneGeometry(size, size, 1, 1);
    geometry.rotateX(-Math.PI / 2);

    this.mesh = new THREE.Mesh(geometry, this.material);
    this.mesh.position.y = -4.2;
    this.scene.add(this.mesh);
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
