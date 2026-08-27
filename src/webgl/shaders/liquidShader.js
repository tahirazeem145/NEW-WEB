/**
 * GLSL Liquid Distortion Shader
 * Simulates fluid dynamic ripples, liquid surface tension displacement,
 * RGB chromatic dispersion, and caustic sheen when hovering over 3D movie cards.
 */

export const liquidVertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;
  uniform float uTime;
  uniform float uRadius;
  uniform float uVelocity;

  void main() {
    vUv = uv;
    vPosition = position;
    vNormal = normal;

    // Apply cylindrical concave curvature to vertex positions
    float angle = position.x / uRadius;
    float newX = uRadius * sin(angle);
    float newZ = uRadius * (cos(angle) - 1.0);
    
    // Add subtle kinetic wave ripple along mesh when spinning rapidly
    float kineticWave = sin(position.y * 1.5 + uTime * 4.0) * uVelocity * 0.08;
    vec3 curvedPosition = vec3(newX, position.y + kineticWave, newZ);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(curvedPosition, 1.0);
  }
`;

export const liquidFragmentShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;

  uniform sampler2D uTexture;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uHover;
  uniform float uVelocity;
  uniform vec3 uAccentColor;
  uniform float uOpacity;

  // 2D Simplex / Pseudo-noise helper for liquid turbulence
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

    // Vector and distance from fragment to cursor position on the card
    vec2 dir = uv - uMouse;
    float dist = length(dir);

    // Dynamic multi-octave liquid ripple equations
    float rippleFreq = 26.0;
    float rippleSpeed = 4.5;
    float ripple = sin(dist * rippleFreq - uTime * rippleSpeed);
    
    // Liquid noise turbulence
    float turbulence = perlinNoise(uv * 8.0 + vec2(uTime * 0.4, uTime * 0.3)) * 0.2;
    
    // Gaussian dropoff from mouse center
    float falloff = exp(-dist * 5.8);

    // Total displacement vector
    vec2 liquidDisplacement = normalize(dir + 0.0001) * (ripple + turbulence) * falloff * uHover * 0.075;

    // Kinetic drag shear
    liquidDisplacement.x += sin(uv.y * 10.0 + uTime * 2.0) * uVelocity * 0.04;

    // Liquid Chromatic Aberration (separating R, G, B channels across the wave gradient)
    float rOffset = 1.14;
    float gOffset = 1.00;
    float bOffset = 0.86;

    vec2 uvR = uv + liquidDisplacement * rOffset;
    vec2 uvG = uv + liquidDisplacement * gOffset;
    vec2 uvB = uv + liquidDisplacement * bOffset;

    // Clamp UVs to avoid texture border bleeding
    uvR = clamp(uvR, vec2(0.001), vec2(0.999));
    uvG = clamp(uvG, vec2(0.001), vec2(0.999));
    uvB = clamp(uvB, vec2(0.001), vec2(0.999));

    vec4 colorR = texture2D(uTexture, uvR);
    vec4 colorG = texture2D(uTexture, uvG);
    vec4 colorB = texture2D(uTexture, uvB);

    vec4 finalColor = vec4(colorR.r, colorG.g, colorB.b, colorG.a);

    // Liquid surface caustic shimmer on wave peaks
    float caustic = pow(max(0.0, (ripple + turbulence) * falloff), 2.5) * uHover * 0.4;
    finalColor.rgb += uAccentColor * caustic;

    // Subtle edge rim light
    float edgeVignette = smoothstep(0.0, 0.04, uv.x) * smoothstep(1.0, 0.96, uv.x) *
                         smoothstep(0.0, 0.04, uv.y) * smoothstep(1.0, 0.96, uv.y);
    finalColor.rgb *= (0.65 + 0.35 * edgeVignette);

    gl_FragColor = vec4(finalColor.rgb, finalColor.a * uOpacity);
  }
`;
