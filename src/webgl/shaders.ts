export const vertexShader = /* glsl */ `#version 300 es
precision highp float;
const vec2 verts[3] = vec2[3](vec2(-1.0,-1.0), vec2(3.0,-1.0), vec2(-1.0,3.0));
void main() {
  gl_Position = vec4(verts[gl_VertexID], 0.0, 1.0);
}
`

export const fragmentShader = /* glsl */ `#version 300 es
precision highp float;

uniform vec2  uRes;
uniform float uTime;
uniform vec2  uMouse;     // smoothed, -1..1, canvas space
uniform float uMouseAmp;  // 0..1, decays when idle
uniform float uIntro;     // 0..1 birth of the sphere (driven by the loading pour)
uniform float uStream;    // 1 while loading — a stream pours in from above; →0 swallowed
uniform float uHead;      // 0..1 the leading drip falls from the top edge to the pool
uniform float uRise;      // world-units the sphere has scrolled up (synced 1:1 with page scroll)
uniform float uOrbX;      // world x offset — the sphere parks toward a corner
uniform float uOrbY;      // world y offset
uniform float uOrbScale;  // sphere radius scale (1 = hero size, →0 = parked tiny)

out vec4 outColor;

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
    mix(mix(hash(i), hash(i + vec3(1, 0, 0)), f.x),
        mix(hash(i + vec3(0, 1, 0)), hash(i + vec3(1, 1, 0)), f.x), f.y),
    mix(mix(hash(i + vec3(0, 0, 1)), hash(i + vec3(1, 0, 1)), f.x),
        mix(hash(i + vec3(0, 1, 1)), hash(i + vec3(1, 1, 1)), f.x), f.y),
    f.z);
}

float fbm(vec3 p) {
  float a = 0.5;
  float r = 0.0;
  for (int i = 0; i < 3; i++) {
    r += a * noise(p);
    p *= 2.02;
    a *= 0.5;
  }
  return r;
}

float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

float sdCapsule(vec3 p, vec3 a, vec3 b, float r) {
  vec3 pa = p - a, ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h) - r;
}

float map(vec3 p) {
  // blob space: anchored to the hero, then parks toward a corner via uOrb*
  float rise = uRise;
  float orbS = max(uOrbScale, 0.001);
  vec3 bp = p;
  bp.x -= uOrbX;
  bp.y -= rise + uOrbY;

  vec3 q = bp;
  float a = uTime * 0.12;
  float c = cos(a), s = sin(a);
  q.xz = mat2(c, -s, s, c) * q.xz;

  float breathe = 1.0 + 0.035 * sin(uTime * 0.65);
  // sphere shrinks proportionally — surface noise and cursor lean follow it
  float d = length(bp) - 0.92 * breathe * uIntro * orbS;

  // molten surface — slow rolling noise (noise scale tracks the orb size)
  float n = fbm(q * (1.7 / orbS) + vec3(0.0, uTime * 0.22, 0.0)) - 0.5;

  // the metal leans toward the cursor like disturbed mercury
  vec3 mdir = normalize(vec3(uMouse * 1.4, 0.8));
  float facing = pow(max(dot(normalize(bp + 1e-4), mdir), 0.0), 5.0);

  d -= (n * 0.14 + facing * 0.24 * uMouseAmp) * uIntro * orbS;

  // loading pour: molten stream falls from above into the forming sphere
  if (uStream > 0.001 && uHead > 0.001) {
    // when the pour ends, the stream's top sinks down and is swallowed
    float top = mix(-0.1, 4.6, uStream);
    // the leading drip descends from the top edge before the stream exists
    float head = mix(4.6, -0.05, uHead);
    float sr = 0.075 * (0.55 + 0.45 * uStream);
    // slight wobble so it reads as liquid, not a rod
    sr *= 1.0 + 0.3 * (noise(vec3(p.y * 2.4 - uTime * 2.6, uTime * 0.7, 1.7)) - 0.5);
    // a fatter droplet at the falling tip
    float tip = length(p - vec3(0.0, head, 0.0)) - sr * 1.9 * (1.0 - uHead * 0.6);
    float stream = sdCapsule(p, vec3(0.0, top, 0.0), vec3(0.0, head, 0.0), sr);
    d = smin(d, smin(stream, tip, 0.15), 0.32);

    // impact shimmer once the stream has reached the pooling metal
    float topness = smoothstep(0.35, 0.95, p.y / max(length(p), 1e-3));
    d -= uStream * uIntro * smoothstep(0.85, 1.0, uHead)
       * 0.05 * topness * sin(uTime * 9.0 + p.x * 9.0);
  }

  return d;
}

vec3 getNormal(vec3 p) {
  const vec2 e = vec2(0.003, 0.0);
  return normalize(vec3(
    map(p + e.xyy) - map(p - e.xyy),
    map(p + e.yxy) - map(p - e.yxy),
    map(p + e.yyx) - map(p - e.yyx)));
}

// procedural dark studio: vertical falloff + two soft light bands + key light
vec3 envColor(vec3 d) {
  float v = clamp(d.y * 0.5 + 0.5, 0.0, 1.0);
  vec3 col = mix(vec3(0.012, 0.013, 0.017), vec3(0.40, 0.43, 0.50), pow(v, 1.6));
  col += smoothstep(0.20, 0.0, abs(d.y - 0.42)) * vec3(0.95, 0.97, 1.0) * 0.85;
  col += smoothstep(0.28, 0.0, abs(d.y + 0.18)) * vec3(0.45, 0.50, 0.60) * 0.30;
  float hot = pow(max(dot(d, normalize(vec3(-0.4, 0.75, 0.5))), 0.0), 42.0);
  col += hot * vec3(1.25);
  return col;
}

void main() {
  if (uIntro < 0.01 && (uStream < 0.001 || uHead < 0.001)) {
    outColor = vec4(0.0);
    return;
  }

  vec2 uv = (gl_FragCoord.xy * 2.0 - uRes) / min(uRes.x, uRes.y);
  vec3 ro = vec3(0.0, 0.0, 3.4);
  vec3 rd = normalize(vec3(uv, -2.1));

  float t = 0.0;
  float minDist = 1e3;
  bool hit = false;
  vec3 p;
  for (int i = 0; i < 90; i++) {
    p = ro + rd * t;
    float d = map(p);
    minDist = min(minDist, d);
    if (d < 0.005) { hit = true; break; }
    t += d * 0.65;
    if (t > 9.0) break;
  }

  float edgeAlpha = hit ? 1.0 - smoothstep(0.0, 0.05, minDist) : 0.0;
  edgeAlpha = max(edgeAlpha, smoothstep(0.08, 0.0, minDist)); // keep the halo

  if (!hit) {
    float halo = smoothstep(0.08, 0.0, minDist) * 0.12;
    outColor = vec4(vec3(0.75, 0.8, 0.9) * halo, halo * edgeAlpha);
    return;
  }

  vec3 n = getNormal(p);
  vec3 r = reflect(rd, n);
  vec3 col = envColor(r);

  float fre = pow(1.0 - max(dot(n, -rd), 0.0), 3.0);
  col += fre * vec3(0.50, 0.55, 0.65) * 0.85;
  // whisper of iridescence on grazing angles
  col *= mix(vec3(1.0), vec3(0.95, 0.99, 1.07), fre);

  col = pow(col, vec3(0.92)); // mild lift

  // Fresnel-driven silhouette softness
  float ndotv = max(dot(n, -rd), 0.0);

  // The silhouette is where ndotv → 0 (surface perpendicular to view)
  // Fade alpha sharply there for a soft edge
  float silhouette = smoothstep(0.0, 0.30, ndotv);

  outColor = vec4(col, edgeAlpha * silhouette);
}
`
