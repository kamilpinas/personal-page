import { useEffect, useRef } from "react"
import {
  ENV_FN,
  FRAG_PRELUDE,
  GET_NORMAL_FN,
  HALO_MISS,
  NOISE_FNS,
  raymarch,
  SDF_FNS,
  SHADE_HIT,
} from "../glsl"
import { setupLiquidCanvas } from "../setupLiquidCanvas"

// Molten progress rail for act 06. A single mercury bead fills the rail
// left->right as the horizontal scroll advances — the leading edge carries
// a glowing weld head, and a sphere blooms out of the rail at each
// project's position once the fill reaches it, indicating that casting.

const makeFrag = (count: number) => /* glsl */ `${FRAG_PRELUDE}
uniform float uProgress;
${NOISE_FNS}
${SDF_FNS}

float map(vec3 p) {
  float flow = uTime * 0.5;
  float aspect = uRes.x / min(uRes.x, uRes.y);
  float halfW = aspect - 0.05;
  float progress = clamp(uProgress, 0.0, 1.0);

  float ripple = 0.025 * sin(p.x * 2.6 + flow * 1.4);
  float fillX = mix(-halfW, halfW, progress);

  // the rail itself — fills left to right, with a glowing weld head
  // riding the leading edge of the fill
  vec3 ra = vec3(-halfW, ripple, 0.0);
  vec3 rb = vec3(fillX, ripple, 0.0);
  float rr = 0.075 + 0.012 * fbm(vec3(p.x * 1.4 - flow * 1.3, 0.0, 2.0));
  float d = sdCapsule(p, ra, rb, rr);
  d = smin(d, length(p - vec3(fillX, ripple, 0.0)) - 0.12, 0.05);

  // a sphere blooms out of the rail at each project once the fill reaches it
  for (int i = 0; i < ${count}; i++) {
    float t = float(i) / float(${count > 1 ? count - 1 : 1});
    float nx = mix(-halfW, halfW, t);
    float grow = smoothstep(t - 0.05, t + 0.02, progress);
    if (grow < 0.01) continue;

    vec3 np = p - vec3(nx, ripple, 0.0);
    float seed = fract(sin(float(i) * 91.73) * 43758.5453);
    float nr = (0.17 + 0.05 * seed) * grow;
    float sph = length(np) - nr;
    sph -= (fbm(np * 2.8 + vec3(seed * 11.0, flow * 1.1, 5.0)) - 0.5) * 0.05 * grow;
    d = smin(d, sph, 0.11);
  }

  return d;
}

${GET_NORMAL_FN}
${ENV_FN}

void main() {
  ${raymarch(80)}
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
