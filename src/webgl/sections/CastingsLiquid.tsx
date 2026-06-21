import { useEffect, useRef } from "react"
import {
  ENV_FN,
  FRAG_PRELUDE,
  GET_NORMAL_FN,
  HALO_MISS,
  NOISE_FNS,
  SDF_FNS,
  SHADE_HIT,
} from "../glsl"
import { setupLiquidCanvas } from "../setupLiquidCanvas"

// Molten progress rail for act 06. A single mercury bead fills the rail
// left->right as the horizontal scroll advances — the leading edge carries
// a glowing weld head, and a chrome cube (echoing the cast-ingot theme)
// blooms out of the rail at each project's position once the fill reaches
// it, indicating that casting.
//
// This canvas gets extremely wide and short (a thin bar spanning the full
// section width), so it can't use the shared raymarch()'s perspective
// camera — at that aspect ratio, edge rays need more marching distance
// than the loop's cutoff allows and just go unhit. Since everything here
// sits flat near z=0, an orthographic ray (straight down -Z, with x/y
// baked into the ray origin) converges in a few steps no matter how wide
// the canvas gets, because horizontal position no longer affects travel
// distance.

const makeFrag = (count: number) => /* glsl */ `${FRAG_PRELUDE}
uniform float uProgress;
${NOISE_FNS}
${SDF_FNS}

float map(vec3 p) {
  float flow = uTime * 0.3;
  float aspect = uRes.x / min(uRes.x, uRes.y);
  // the camera projects uv.x to world p.x with a fixed 1.619 magnification
  // at z=0 (ro.z/|rd.z proj|, see raymarch()) — bake it in so the rail
  // actually reaches the screen edges instead of stopping short
  float halfW = aspect * 1.619 - 0.5;
  float progress = clamp(uProgress, 0.0, 1.0);

  float ripple = 0.035 * sin(p.x * 2.6 + flow * 1.4);
  float fillX = mix(-halfW, halfW, progress);

  // the rail itself — fills left to right, with a glowing weld head
  // riding the leading edge of the fill
  vec3 ra = vec3(-halfW, ripple, 0.0);
  vec3 rb = vec3(fillX, ripple, 0.0);
  float rr = 0.12 + 0.018 * fbm(vec3(p.x * 1.4 - flow * 1.3, 0.0, 2.0));
  float d = sdCapsule(p, ra, rb, rr);
  d = smin(d, length(p - vec3(fillX, ripple, 0.0)) - 0.18, 0.07);

  // a chrome cube blooms out of the rail at each project once the fill
  // reaches it. Edges are clamped to [0,1] so the start node still blooms
  // from nothing (instead of popping in pre-grown) and the end node
  // reaches full size exactly at progress=1 (instead of capping out early).
  for (int i = 0; i < ${count}; i++) {
    float t = float(i) / float(${count > 1 ? count - 1 : 1});
    float nx = mix(-halfW, halfW, t);

    float growLo = clamp(t - 0.01, 0.0, 1.0);
    float growHi = clamp(t + 0.01, growLo + 0.001, 1.0);
    float grow = smoothstep(growLo, growHi, progress);
    if (grow < 0.01) continue;

    vec3 np = p - vec3(nx, ripple, 0.0);

    // vertical tick sizes
    float halfHeight = 0.5 * grow;
    float halfWidth  = 0.001;

    // box SDF for a thin vertical line
    vec3 q = abs(np) - vec3(halfWidth, halfHeight, halfWidth);
    float tick = length(max(q, 0.0))
               + min(max(q.x, max(q.y, q.z)), 0.0);

    d = smin(d, tick, 0.5);
}

  return d;
}

${GET_NORMAL_FN}
${ENV_FN}

void main() {
  // orthographic: x/y come from uv directly (same 1.619 world-scale
  // convention as the perspective camera at its z=0 crossing), the ray
  // only travels in z, so reach is constant regardless of aspect ratio
  vec2 uv = (gl_FragCoord.xy * 2.0 - uRes) / min(uRes.x, uRes.y);
  vec3 ro = vec3(uv * 1.619, 3.4);
  vec3 rd = vec3(0.0, 0.0, -1.0);
  float t = 0.0;
  float minDist = 1e3;
  bool hit = false;
  vec3 p;
  for (int i = 0; i < 80; i++) {
    p = ro + rd * t;
    float d = map(p);
    minDist = min(minDist, d);
    if (d < 0.005) { hit = true; break; }
    // damp the step like the shared raymarch() does — smin() blends
    // aren't perfectly metric, so a full step can overshoot near a join
    // and harden the edge; 0.65 keeps the march conservative there
    t += d * 0.65;
    if (t > 6.0) break;
  }
  float edgeAlpha = hit ? 1.0 - smoothstep(0.0, 0.05, minDist) : 0.0;
  edgeAlpha = max(edgeAlpha, smoothstep(0.08, 0.0, minDist));

  ${HALO_MISS}
  ${SHADE_HIT}
  outColor = vec4(col, edgeAlpha * silhouette);
}
`

type Props = {
  /** 0..1 scroll progress through the pinned horizontal-scroll act. */
  progressRef: React.MutableRefObject<number>
  /** Number of projects — baked into the shader as a fixed loop count. */
  count: number
}

export function CastingsLiquid({ progressRef, count }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    if (!canvasRef.current) return
    return setupLiquidCanvas(canvasRef.current, {
      frag: makeFrag(count),
      extraUniforms: ["uProgress"],
      draw: (gl, loc) => {
        gl.uniform1f(loc.uProgress, progressRef.current)
      },
    })
  }, [progressRef, count])
  return (
    <div className="castings-liquid" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  )
}
