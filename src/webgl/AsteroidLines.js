import * as THREE from 'three';

/**
 * AsteroidLines
 * Elegant, slow-moving diagonal shooting stars / asteroid streak lines
 * cascading gracefully from the TOP-RIGHT corner down to the BOTTOM-LEFT.
 */
export class AsteroidLines {
  constructor(scene, count = 14) {
    this.scene = scene;
    this.count = count;
    this.mesh = null;
    this.init();
  }

  init() {
    // 2-vertex diagonal line segments (Head at bottom-left, Tail trailing to top-right)
    const positions = new Float32Array(this.count * 6);
    const lineParams = new Float32Array(this.count * 4); // [speed, length, brightness, phase]
    const initialOffsets = new Float32Array(this.count * 3);

    for (let i = 0; i < this.count; i++) {
      // Distributed across top-right to bottom-left diagonal corridor
      const x = -10.0 + Math.random() * 38.0;
      const y = -10.0 + Math.random() * 28.0;
      const z = -4.0 + (Math.random() - 0.5) * 20.0;

      const length = 2.4 + Math.random() * 3.2;  // streak length
      const speed = 2.0 + Math.random() * 2.2;   // slow, graceful glide speed
      const brightness = 0.65 + Math.random() * 0.35;

      initialOffsets[i * 3] = x;
      initialOffsets[i * 3 + 1] = y;
      initialOffsets[i * 3 + 2] = z;

      lineParams[i * 4] = speed;
      lineParams[i * 4 + 1] = length;
      lineParams[i * 4 + 2] = brightness;
      lineParams[i * 4 + 3] = Math.random() * 100.0;

      // Vertex 0: Head (leading tip)
      positions[i * 6] = 0;
      positions[i * 6 + 1] = 0;
      positions[i * 6 + 2] = 0;

      // Vertex 1: Tail (trailing end)
      positions[i * 6 + 3] = 0;
      positions[i * 6 + 4] = 1;
      positions[i * 6 + 5] = 0;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const vertexTypes = new Float32Array(this.count * 2);
    for (let i = 0; i < this.count; i++) {
      vertexTypes[i * 2] = 0.0;     // Head
      vertexTypes[i * 2 + 1] = 1.0; // Tail
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

        // Normalized diagonal direction: from Top-Right (+X, +Y) to Bottom-Left (-X, -Y)
        // Direction vector: dir = (-1.25, -1.0, -0.2)
        vec3 dir = normalize(vec3(-1.25, -1.0, -0.2));

        // Periodic travel cycle across a 40-unit diagonal space
        float cycleLength = 42.0;
        float progress = mod(uTime * speed + phase, cycleLength);

        // Current head position along diagonal path
        vec3 headPos = aOrigin + dir * progress;

        // Wrap around boundaries
        if (headPos.y < -12.0 || headPos.x < -20.0) {
          headPos -= dir * cycleLength;
        }

        vec3 worldPos = headPos;

        // Tail extends backwards towards Top-Right (-dir * len)
        if (aVertexType > 0.5) {
          worldPos -= dir * len;
          vAlpha = 0.0; // Smooth tail falloff to 0
        } else {
          vAlpha = 0.95; // Bright glowing head
        }

        // Subtle parallax displacement
        worldPos.x += uVelocity * 0.5;

        vBrightness = brightness;

        vec4 mvPosition = modelViewMatrix * vec4(worldPos, 1.0);
        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    const fragmentShader = `
      varying float vAlpha;
      varying float vBrightness;

      void main() {
        // Pure diamond white core with soft celestial blue-white halo
        vec3 coreColor = vec3(1.0, 1.0, 1.0);
        vec3 haloColor = vec3(0.9, 0.95, 1.0);
        
        vec3 finalColor = mix(haloColor, coreColor, vAlpha) * (vBrightness * 1.3);
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
