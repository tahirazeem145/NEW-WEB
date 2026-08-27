import * as THREE from 'three';

/**
 * AsteroidLines
 * Implements glowing white asteroid / meteor speed lines falling from the top
 * through 3D space with gradient alpha tails, varying speeds, and depth parallax.
 */
export class AsteroidLines {
  constructor(scene, count = 55) {
    this.scene = scene;
    this.count = count;
    this.mesh = null;
    this.init();
  }

  init() {
    // Each asteroid line is represented as a 2-vertex vertical segment (Head at bottom, Tail at top)
    const positions = new Float32Array(this.count * 6);
    const lineParams = new Float32Array(this.count * 4); // [speed, length, brightness, phase]
    const initialOffsets = new Float32Array(this.count * 3);

    for (let i = 0; i < this.count; i++) {
      const x = (Math.random() - 0.5) * 36.0;
      const y = -12.0 + Math.random() * 32.0; // Initial spread across vertical height
      const z = -6.0 + (Math.random() - 0.5) * 26.0;

      const length = 1.8 + Math.random() * 3.8;
      const speed = 6.0 + Math.random() * 9.0;
      const brightness = 0.5 + Math.random() * 0.5;

      initialOffsets[i * 3] = x;
      initialOffsets[i * 3 + 1] = y;
      initialOffsets[i * 3 + 2] = z;

      lineParams[i * 4] = speed;
      lineParams[i * 4 + 1] = length;
      lineParams[i * 4 + 2] = brightness;
      lineParams[i * 4 + 3] = Math.random() * 100.0;

      // Vertex 0: Head (bottom)
      positions[i * 6] = 0;
      positions[i * 6 + 1] = 0;
      positions[i * 6 + 2] = 0;

      // Vertex 1: Tail (top)
      positions[i * 6 + 3] = 0;
      positions[i * 6 + 4] = 1; // unit length, scaled in shader
      positions[i * 6 + 5] = 0;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    // Per-instance/vertex attributes
    const vertexTypes = new Float32Array(this.count * 2);
    for (let i = 0; i < this.count; i++) {
      vertexTypes[i * 2] = 0.0;     // Head (leading point)
      vertexTypes[i * 2 + 1] = 1.0; // Tail (fading end)
    }
    geometry.setAttribute('aVertexType', new THREE.BufferAttribute(vertexTypes, 1));

    const lineData = new Float32Array(this.count * 8);
    for (let i = 0; i < this.count; i++) {
      for (let v = 0; v < 2; v++) {
        const idx = (i * 2 + v) * 4;
        lineData[idx] = lineParams[i * 4];
        lineData[idx + 1] = lineParams[i * 4 + 1];
        lineData[idx + 2] = lineParams[i * 4 + 2];
        lineData[idx + 3] = lineParams[i * 4 + 3];
      }
    }
    geometry.setAttribute('aLineData', new THREE.BufferAttribute(lineData, 4));

    const linePositions = new Float32Array(this.count * 6);
    for (let i = 0; i < this.count; i++) {
      for (let v = 0; v < 2; v++) {
        const idx = (i * 2 + v) * 3;
        linePositions[idx] = initialOffsets[i * 3];
        linePositions[idx + 1] = initialOffsets[i * 3 + 1];
        linePositions[idx + 2] = initialOffsets[i * 3 + 2];
      }
    }
    geometry.setAttribute('aOrigin', new THREE.BufferAttribute(linePositions, 3));

    const vertexShader = `
      attribute float aVertexType; // 0.0 = Head, 1.0 = Tail
      attribute vec4 aLineData;    // speed, length, brightness, phase
      attribute vec3 aOrigin;      // initial XYZ position

      varying float vAlpha;
      varying float vBrightness;

      uniform float uTime;
      uniform float uVelocity;

      void main() {
        float speed = aLineData.x;
        float len = aLineData.y;
        float brightness = aLineData.z;
        float phase = aLineData.w;

        // Dynamic falling motion from top (+18) to bottom (-14)
        float totalHeight = 32.0;
        float currentY = mod(aOrigin.y - (uTime * speed + phase), totalHeight) - 14.0;

        vec3 worldPos = aOrigin;
        
        // Head is at currentY, Tail extends upwards by len
        if (aVertexType > 0.5) {
          worldPos.y = currentY + len;
          vAlpha = 0.0; // Tail fades out completely to 0
        } else {
          worldPos.y = currentY;
          vAlpha = 0.95; // Head is maximum brightness
        }

        // Slight diagonal angle / kinetic shear
        worldPos.x += (worldPos.y - currentY) * (uVelocity * 0.15 - 0.03);
        worldPos.z += (worldPos.y - currentY) * 0.02;

        vBrightness = brightness;

        vec4 mvPosition = modelViewMatrix * vec4(worldPos, 1.0);
        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    const fragmentShader = `
      varying float vAlpha;
      varying float vBrightness;

      void main() {
        // Glowing white asteroid streak line with soft blue-white core
        vec3 coreColor = vec3(1.0, 1.0, 1.0);
        vec3 haloColor = vec3(0.85, 0.92, 1.0);
        
        vec3 finalColor = mix(haloColor, coreColor, vAlpha) * (vBrightness * 1.25);
        float alpha = vAlpha * 0.85;

        gl_FragColor = vec4(finalColor, alpha);
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
        uVelocity: { value: 0.0 }
      }
    });

    this.mesh = new THREE.LineSegments(geometry, this.material);
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
