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

// Mercury fountain that sits behind the portrait in act 02.
// At uReveal=0 a single liquid column fully covers the frame from above
// the top edge; as scroll drives uReveal→1, its top surface drains
// straight down to the basin pool. It's one unbroken capsule the whole
// way — the bottom end stays anchored inside the pool so the column never
// separates from it — while the portrait <img> fades in underneath, so the
// photo reads as draining clear top to bottom, no seam or gap.

const FRAG = /* glsl */ `${FRAG_PRELUDE}
uniform float uReveal;
${NOISE_FNS}
${SDF_FNS}

float map(vec3 p) {
  float flow = uTime * 0.5;
  float aspect = uRes.x / min(uRes.x, uRes.y);
  float reveal = clamp(uReveal, 0.0, 1.0);

  // Pool basin — wide capsule along the bottom of the canvas. The resting
  // state once the column above has fully drained away.
  float halfW = aspect + 0.05;
  float poolY = -1.3;
  float poolRipple = 0.05 * sin(p.x * 2.4 + flow * 1.6)
                    + 0.03 * sin(p.x * 6.1 - flow * 2.3);
  vec3 pa = vec3(-halfW, poolY + poolRipple, 0.0);
  vec3 pb = vec3( halfW, poolY + poolRipple, 0.0);
  float pr = 0.2 + 0.05 * fbm(vec3(p.x * 1.3 - flow * 1.5, 0.0, 3.0));
  float pool = sdCapsule(p, pa, pb, pr);

  // Liquid column — one capsule whose top surface (the "level") drains
  // straight down as reveal goes 0->1, uncovering the portrait top to
  // bottom. The bottom end stays anchored well inside the pool the whole
  // time, so column and pool are always fused — never two separate blobs.
  float levelY = mix(0.001, poolY + 0.01, reveal);
  float levelRipple = 0.04 * sin(p.x * 1.8 + flow * 1.4)
                     + 0.025 * sin(levelY * 2.0 + flow * 1.1);
  vec3 ta = vec3(0.0, levelY + levelRipple, 0.0);
  vec3 tb = vec3(0.0, poolY, 0.0);
  float colR = mix(aspect + 0.2, 0.001, smoothstep(0.2, 1.0, reveal));
  float column = sdCapsule(p, ta, tb, colR);

  // Smooth-union the two pieces — k tightens as reveal completes so the
  // pool resolves crisply once the column has fully drained
  float k = mix(0.32, 0.06, reveal);
  float d = smin(column, pool, k);
  d -= (fbm(p * 1.8 + vec3(-flow * 1.4, uTime * 0.25, 7.0)) - 0.5) * 0.08;
  return d;
}

${GET_NORMAL_FN}
${ENV_FN}

void main() {
  ${raymarch(90)}
  ${HALO_MISS}
  ${SHADE_HIT}
  outColor = vec4(col, edgeAlpha * silhouette);
}
`

type MakerLiquidProps = {
  /** 0 = column fully covers the frame, 1 = fully drained, pool only. */
  revealRef: React.MutableRefObject<number>
}

export function MakerLiquid({ revealRef }: MakerLiquidProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    if (!canvasRef.current) return
    return setupLiquidCanvas(canvasRef.current, {
      frag: FRAG,
      extraUniforms: ["uReveal"],
      draw: (gl, loc) => {
        gl.uniform1f(loc.uReveal, revealRef.current)
      },
    })
  }, [revealRef])
  return (
    <div className="maker-liquid" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  )
}
