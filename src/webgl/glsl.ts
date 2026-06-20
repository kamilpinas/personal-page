// Shared GLSL chunks for the per-section liquid shaders.
//
// Each section shader composes these template strings into a complete
// fragment shader. This file is the single source of truth for the chrome
// look, noise functions, raymarch loop and shading — fixing a chrome
// artefact in one place updates every section at once.

export const VERT = /* glsl */ `#version 300 es
precision highp float;
const vec2 v[3] = vec2[3](vec2(-1.,-1.), vec2(3.,-1.), vec2(-1.,3.));
void main() { gl_Position = vec4(v[gl_VertexID], 0., 1.); }
`

// Standard prelude: version, precision, the universal uniforms (uRes,
// uTime), and the output. Compose section-specific uniforms after this.
export const FRAG_PRELUDE = /* glsl */ `#version 300 es
precision highp float;
uniform vec2  uRes;
uniform float uTime;
out vec4 outColor;
`

// Optional cursor uniforms — append after FRAG_PRELUDE when the shader
// reacts to the pointer.
export const FRAG_CURSOR_UNIFORMS = /* glsl */ `
uniform vec2  uMouse;     // smoothed, -1..1, canvas-local
uniform float uMouseAmp;  // 0..1 decay
`

// Cheap value-noise based fbm — the foundation of every molten surface
// in the project. Three octaves, ~2× frequency per octave.
export const NOISE_FNS = /* glsl */ `
float hash(vec3 p) {
  p = fract(p * 0.3183099 + vec3(0.1, 0.2, 0.3));
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}
float noise(vec3 x) {
  vec3 i = floor(x);
  vec3 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x),
        mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
    mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
        mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y),
    f.z);
}
float fbm(vec3 p) {
  float a = 0.5, r = 0.0;
  for (int i = 0; i < 3; i++) { r += a * noise(p); p *= 2.02; a *= 0.5; }
  return r;
}
`

// SDF building blocks used by the section maps.
export const SDF_FNS = /* glsl */ `
float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}
float sdCapsule(vec3 p, vec3 a, vec3 b, float r) {
  vec3 pa = p - a, ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h) - r;
}
`

// Centred-difference normal — relies on a map() function already being
// declared in scope.
export const GET_NORMAL_FN = /* glsl */ `
vec3 getNormal(vec3 p) {
  const vec2 e = vec2(0.003, 0.0);
  return normalize(vec3(
    map(p + e.xyy) - map(p - e.xyy),
    map(p + e.yxy) - map(p - e.yxy),
    map(p + e.yyx) - map(p - e.yyx)));
}
`

// The "studio" environment lookup — vertical falloff plus two soft light
// bands and a sharp key light. Gives the metal its chrome character.
export const ENV_FN = /* glsl */ `
vec3 envColor(vec3 d) {
  float v = clamp(d.y * 0.5 + 0.5, 0.0, 1.0);
  vec3 col = mix(vec3(0.012, 0.013, 0.017), vec3(0.40, 0.43, 0.50), pow(v, 1.6));
  col += smoothstep(0.20, 0.0, abs(d.y - 0.42)) * vec3(0.95, 0.97, 1.0) * 0.85;
  col += smoothstep(0.28, 0.0, abs(d.y + 0.18)) * vec3(0.45, 0.50, 0.60) * 0.30;
  float hot = pow(max(dot(d, normalize(vec3(-0.4, 0.75, 0.5))), 0.0), 42.0);
  col += hot * vec3(1.25);
  return col;
}
`

// The raymarch loop — emits the variables `p`, `hit`, `minDist`,
// `edgeAlpha`, `rd` for the shading step that follows it. Inline into
// main(); `iters` lets each section trade quality for cost.
export const raymarch = (iters: number = 70) => /* glsl */ `
  vec2 uv = (gl_FragCoord.xy * 2.0 - uRes) / min(uRes.x, uRes.y);
  vec3 ro = vec3(0.0, 0.0, 3.4);
  vec3 rd = normalize(vec3(uv, -2.1));
  float t = 0.0;
  float minDist = 1e3;
  bool hit = false;
  vec3 p;
  for (int i = 0; i < ${iters}; i++) {
    p = ro + rd * t;
    float d = map(p);
    minDist = min(minDist, d);
    if (d < 0.005) { hit = true; break; }
    t += d * 0.65;
    if (t > 9.0) break;
  }
  float edgeAlpha = hit ? 1.0 - smoothstep(0.0, 0.05, minDist) : 0.0;
  edgeAlpha = max(edgeAlpha, smoothstep(0.08, 0.0, minDist));
`

// Halo for rays that miss the SDF — produces a soft glow at the
// silhouette without blowing the alpha into the background.
export const HALO_MISS = /* glsl */ `
  if (!hit) {
    float halo = smoothstep(0.08, 0.0, minDist) * 0.12;
    outColor = vec4(vec3(0.75, 0.8, 0.9) * halo, halo * edgeAlpha);
    return;
  }
`

// Shading for rays that hit — Fresnel-tinted chrome with iridescent
// grazing and a soft silhouette. Emits `col` and `silhouette` for the
// final outColor write.
export const SHADE_HIT = /* glsl */ `
  vec3 n = getNormal(p);
  vec3 r = reflect(rd, n);
  vec3 col = envColor(r);
  float fre = pow(1.0 - max(dot(n, -rd), 0.0), 3.0);
  col += fre * vec3(0.50, 0.55, 0.65) * 0.85;
  col *= mix(vec3(1.0), vec3(0.95, 0.99, 1.07), fre);
  col = pow(col, vec3(0.92));
  float ndotv = max(dot(n, -rd), 0.0);
  float silhouette = smoothstep(0.0, 0.30, ndotv);
`
