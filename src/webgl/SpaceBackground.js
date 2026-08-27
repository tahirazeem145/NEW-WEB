import * as THREE from 'three';

/**
 * SpaceBackground
 * Deep Space 3D Cosmic Environment featuring:
 * - Dynamic Procedural GLSL Galactic Nebula Skydome
 * - 2500+ Twinkling Multi-Spectral Star Clusters with Scintillation Shaders
 * - Deep Space Orbital Dust & Cosmic Rays
 */

const nebulaVertexShader = `
  varying vec3 vWorldPosition;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const nebulaFragmentShader = `
  varying vec3 vWorldPosition;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uVelocity;

  // 3D Simplex noise for cosmic gas clouds
  vec4 permute(vec4 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;

    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    vec3 dir = normalize(vWorldPosition);

    float t = uTime * 0.04;
    
    // Multi-octave cosmic fractal clouds
    float n1 = snoise(dir * 2.2 + vec3(t * 0.2, t * 0.15, 0.0));
    float n2 = snoise(dir * 4.5 - vec3(0.0, t * 0.1, t * 0.25)) * 0.5;
    float n3 = snoise(dir * 8.0 + vec3(t * 0.3, 0.0, t * 0.1)) * 0.25;
    float nebulaDensity = max(0.0, (n1 + n2 + n3) * 0.8 + 0.1);

    // Cosmic Color Gradients (Deep Violet, Stellar Cyan, Cosmic Magenta, Midnight Obsidian)
    vec3 spaceDark = vec3(0.015, 0.015, 0.03);
    vec3 nebulaViolet = vec3(0.18, 0.06, 0.32);
    vec3 nebulaCyan = vec3(0.04, 0.18, 0.35);
    vec3 nebulaGold = vec3(0.35, 0.18, 0.06);

    vec3 col = spaceDark;
    col = mix(col, nebulaViolet, smoothstep(0.15, 0.7, nebulaDensity) * 0.45);
    col = mix(col, nebulaCyan, smoothstep(0.35, 0.9, n2 + 0.5) * 0.35);
    col += nebulaGold * pow(max(0.0, n1), 3.0) * 0.25;

    // Horizon depth falloff
    float horizon = smoothstep(-0.4, 0.6, dir.y);
    col = mix(col * 0.6, col, horizon);

    gl_FragColor = vec4(col, 1.0);
  }
`;

const starVertexShader = `
  attribute float aSize;
  attribute vec3 aColor;
  attribute float aScintillation;
  
  varying vec3 vColor;
  varying float vScintillation;
  
  uniform float uTime;
  uniform float uVelocity;

  void main() {
    vColor = aColor;
    vScintillation = aScintillation;

    vec3 pos = position;
    // Parallax trail velocity
    pos.x -= uVelocity * 0.8 * (position.z / 40.0);

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Distance attenuation + twinkling pulse
    float twinkle = sin(uTime * 3.5 + aScintillation * 6.28) * 0.4 + 0.6;
    gl_PointSize = aSize * twinkle * (140.0 / -mvPosition.z);
  }
`;

const starFragmentShader = `
  varying vec3 vColor;
  varying float vScintillation;
  uniform float uTime;

  void main() {
    // Smooth circular particle with soft glowing aura
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    if (dist > 0.5) discard;

    float core = 1.0 - smoothstep(0.0, 0.18, dist);
    float aura = 1.0 - smoothstep(0.0, 0.5, dist);
    float alpha = core * 0.9 + aura * 0.4;

    vec3 finalStarColor = mix(vColor, vec3(1.0, 1.0, 1.0), core * 0.75);
    gl_FragColor = vec4(finalStarColor, alpha);
  }
`;

export class SpaceBackground {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();

    this.nebulaMesh = null;
    this.nebulaMaterial = null;
    this.starPoints = null;
    this.starMaterial = null;

    this.init();
  }

  init() {
    this.scene.add(this.group);
    this.createNebulaDome();
    this.createStarClusters();
  }

  createNebulaDome() {
    const geo = new THREE.SphereGeometry(60, 48, 32);
    this.nebulaMaterial = new THREE.ShaderMaterial({
      vertexShader: nebulaVertexShader,
      fragmentShader: nebulaFragmentShader,
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0.0 },
        uVelocity: { value: 0.0 }
      }
    });

    this.nebulaMesh = new THREE.Mesh(geo, this.nebulaMaterial);
    this.group.add(this.nebulaMesh);
  }

  createStarClusters() {
    const starCount = 2800;
    const geometry = new THREE.BufferGeometry();
    
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);
    const scintillations = new Float32Array(starCount);

    // Color palette for stellar classification
    const starColors = [
      new THREE.Color(0.85, 0.92, 1.0),  // Class O/B (Blue-White)
      new THREE.Color(1.0, 1.0, 1.0),   // Class A (Pure White)
      new THREE.Color(1.0, 0.95, 0.8),  // Class F/G (Warm Yellow-White)
      new THREE.Color(1.0, 0.75, 0.5),  // Class K (Golden Orange)
      new THREE.Color(0.7, 0.85, 1.0),  // Galactic Cyan
      new THREE.Color(0.9, 0.65, 1.0)   // Violet/Magenta Starlight
    ];

    for (let i = 0; i < starCount; i++) {
      // Distribute stars in spherical celestial field
      const radius = 22.0 + Math.random() * 32.0;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Select stellar color
      const color = starColors[Math.floor(Math.random() * starColors.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      // Varied star brightness & sizing
      const isGiant = Math.random() > 0.96;
      sizes[i] = isGiant ? (2.8 + Math.random() * 2.2) : (1.0 + Math.random() * 1.4);
      scintillations[i] = Math.random();
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('aScintillation', new THREE.BufferAttribute(scintillations, 1));

    this.starMaterial = new THREE.ShaderMaterial({
      vertexShader: starVertexShader,
      fragmentShader: starFragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0.0 },
        uVelocity: { value: 0.0 }
      }
    });

    this.starPoints = new THREE.Points(geometry, this.starMaterial);
    this.group.add(this.starPoints);
  }

  update(time, velocity = 0) {
    if (this.nebulaMaterial) {
      this.nebulaMaterial.uniforms.uTime.value = time;
      this.nebulaMaterial.uniforms.uVelocity.value = velocity;
    }

    if (this.starMaterial) {
      this.starMaterial.uniforms.uTime.value = time;
      this.starMaterial.uniforms.uVelocity.value = velocity;
    }

    // Slow celestial rotation of deep space sphere
    this.group.rotation.y = time * 0.012;
    this.group.rotation.x = Math.sin(time * 0.008) * 0.03;
  }

  destroy() {
    if (this.nebulaMesh) {
      this.group.remove(this.nebulaMesh);
      this.nebulaMesh.geometry.dispose();
      this.nebulaMesh.material.dispose();
    }
    if (this.starPoints) {
      this.group.remove(this.starPoints);
      this.starPoints.geometry.dispose();
      this.starPoints.material.dispose();
    }
    this.scene.remove(this.group);
  }
}
