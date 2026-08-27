/**
 * GLSL Liquid Distortion Shader
 * Simulates fluid dynamic ripples, liquid surface tension displacement,
 * RGB chromatic dispersion, and caustic sheen ONLY when the cursor is actively moving over 3D movie cards.
 * When the cursor is stationary or placed, the poster remains crystal clear with 0 distortion.
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
    
    // Subtle kinetic wave ripple along mesh when carousel spins
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
  uniform float uMouseSpeed;
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

    // Active motion factor: only trigger water ripples when cursor is actively moving
    // When cursor is placed still (uMouseSpeed == 0), motionFactor = 0 -> zero distortion
    float motionFactor = smoothstep(0.005, 0.25, uMouseSpeed) * uHover;

    // Dynamic multi-octave liquid ripple equations
    float rippleFreq = 28.0;
    float rippleSpeed = 5.5;
    float ripple = sin(dist * rippleFreq - uTime * rippleSpeed);
    
    // Liquid noise turbulence
    float turbulence = perlinNoise(uv * 8.0 + vec2(uTime * 0.4, uTime * 0.3)) * 0.25;
    
    // Gaussian spatial dropoff from cursor position
    float falloff = exp(-dist * 5.2);

    // Total displacement vector (strictly 0 when mouse is stationary)
    vec2 liquidDisplacement = normalize(dir + 0.0001) * (ripple + turbulence) * falloff * motionFactor * 0.09;

    // Kinetic carousel drag shear
    liquidDisplacement.x += sin(uv.y * 10.0 + uTime * 2.0) * uVelocity * 0.04;

    // Liquid Chromatic Aberration (R, G, B channel separation on motion)
    float rOffset = 1.15;
    float gOffset = 1.00;
    float bOffset = 0.85;

    vec2 uvR = uv + liquidDisplacement * rOffset;
    vec2 uvG = uv + liquidDisplacement * gOffset;
    vec2 uvB = uv + liquidDisplacement * bOffset;

    // Clamp UVs to avoid texture border artifacts
    uvR = clamp(uvR, vec2(0.001), vec2(0.999));
    uvG = clamp(uvG, vec2(0.001), vec2(0.999));
    uvB = clamp(uvB, vec2(0.001), vec2(0.999));

    // Sample color channels with fluid displacement
    float r = texture2D(uTexture, uvR).r;
    float g = texture2D(uTexture, uvG).g;
    float b = texture2D(uTexture, uvB).b;
    float a = texture2D(uTexture, uv).a;

    vec3 finalColor = vec3(r, g, b);

    // Specular liquid caustic glint active ONLY during active cursor motion
    if (motionFactor > 0.001) {
      float caustic = pow(max(0.0, sin(dist * 32.0 - uTime * 6.0) * falloff), 4.0) * motionFactor * 0.45;
      finalColor += uAccentColor * caustic;
      finalColor += vec3(0.15, 0.2, 0.25) * (caustic * 0.6);
    }

    gl_FragColor = vec4(finalColor, a * uOpacity);
  }
`;
