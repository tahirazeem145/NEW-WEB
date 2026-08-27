/**
 * GLSL Liquid Distortion Shader with Rounded Corner Mesh Clipping
 * Matches Jesper Landberg curved panorama panel layout with smooth rounded corners,
 * motion-velocity-modulated liquid ripple refraction, and optical chromatic aberration.
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

    // Concave cylindrical curvature along wide panorama radius
    float angle = position.x / uRadius;
    float newX = uRadius * sin(angle);
    float newZ = uRadius * (cos(angle) - 1.0);
    
    // Subtle kinetic wave along card during rapid slide scrolling
    float kineticWave = sin(position.y * 1.2 + uTime * 3.5) * uVelocity * 0.05;
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

  // 2D Simplex Noise Helper
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

  // Rounded rectangle SDF distance function
  float roundedBoxSDF(vec2 p, vec2 size, float radius) {
    vec2 d = abs(p) - size + vec2(radius);
    return min(max(d.x, d.y), 0.0) + length(max(d, 0.0)) - radius;
  }

  void main() {
    vec2 uv = vUv;

    // Rounded rectangle corner clipping (exact Jesper Landberg panel border-radius)
    vec2 p = uv - vec2(0.5);
    vec2 halfSize = vec2(0.495, 0.495);
    float radius = 0.038;
    float distToEdge = roundedBoxSDF(p, halfSize, radius);

    // Discard fragments outside the rounded card frame
    if (distToEdge > 0.0) {
      discard;
    }

    // Antialiased corner border alpha
    float cornerAlpha = 1.0 - smoothstep(-0.003, 0.001, distToEdge);

    // Active motion factor: only trigger water ripples when cursor is actively moving
    float motionFactor = smoothstep(0.005, 0.25, uMouseSpeed) * uHover;

    vec2 dir = uv - uMouse;
    float dist = length(dir);

    // Liquid ripple equations
    float rippleFreq = 28.0;
    float rippleSpeed = 5.5;
    float ripple = sin(dist * rippleFreq - uTime * rippleSpeed);
    float turbulence = perlinNoise(uv * 8.0 + vec2(uTime * 0.4, uTime * 0.3)) * 0.22;
    float falloff = exp(-dist * 5.2);

    // Total displacement vector
    vec2 liquidDisplacement = normalize(dir + 0.0001) * (ripple + turbulence) * falloff * motionFactor * 0.09;
    liquidDisplacement.x += sin(uv.y * 10.0 + uTime * 2.0) * uVelocity * 0.035;

    // Chromatic aberration offsets
    float rOffset = 1.15;
    float gOffset = 1.00;
    float bOffset = 0.85;

    vec2 uvR = uv + liquidDisplacement * rOffset;
    vec2 uvG = uv + liquidDisplacement * gOffset;
    vec2 uvB = uv + liquidDisplacement * bOffset;

    uvR = clamp(uvR, vec2(0.001), vec2(0.999));
    uvG = clamp(uvG, vec2(0.001), vec2(0.999));
    uvB = clamp(uvB, vec2(0.001), vec2(0.999));

    float r = texture2D(uTexture, uvR).r;
    float g = texture2D(uTexture, uvG).g;
    float b = texture2D(uTexture, uvB).b;
    float a = texture2D(uTexture, uv).a;

    vec3 finalColor = vec3(r, g, b);

    // Specular liquid caustic glint active strictly on cursor motion
    if (motionFactor > 0.001) {
      float caustic = pow(max(0.0, sin(dist * 32.0 - uTime * 6.0) * falloff), 4.0) * motionFactor * 0.45;
      finalColor += uAccentColor * caustic;
      finalColor += vec3(0.15, 0.2, 0.25) * (caustic * 0.6);
    }

    // Subtle edge border highlight around the curved card
    float edgeHighlight = smoothstep(-0.008, -0.001, distToEdge) * (1.0 - smoothstep(-0.001, 0.001, distToEdge));
    finalColor += vec3(0.35, 0.35, 0.4) * edgeHighlight * 0.5;

    gl_FragColor = vec4(finalColor, a * uOpacity * cornerAlpha);
  }
`;
