import { useEffect, useRef } from "react"
import {
  ENV_FN,
  FRAG_CURSOR_UNIFORMS,
  FRAG_PRELUDE,
  GET_NORMAL_FN,
  HALO_MISS,
  NOISE_FNS,
  raymarch,
  SDF_FNS,
  SHADE_HIT,
} from "../glsl"
import { setupLiquidCanvas } from "../setupLiquidCanvas"
import type { SphereParams } from "../LiquidSphere"

// Self-contained molten ingot for act 05. Lives inside .alloy__ingot so
// its on-screen position tracks layout exactly. Reacts to the cursor
// with a localised mercury-like bulge — the metal swells where the
// pointer hovers and a softer "lean" follows the cursor's direction.

const FRAG = /* glsl */ `${FRAG_PRELUDE}
${FRAG_CURSOR_UNIFORMS}
uniform float uPool;
${NOISE_FNS}
${SDF_FNS}

float map(vec3 p) {
  if (uPool < 0.001) return 1e3;

  float flow = uTime * 0.5;
  float aspect = uRes.x / min(uRes.x, uRes.y);
  float halfW = aspect - 0.05;

  // slow mercurial roll
  float ripple = 0.035 * sin(p.x * 2.0 + flow * 1.1)
               + 0.02  * sin(p.x * 5.5 - flow * 2.1);

  vec3 a = vec3(-halfW, ripple, 0.0);
  vec3 b = vec3( halfW, ripple, 0.0);

  // base radius
  float r = 1.1 * uPool;
  r = min(r, 1.35 * uPool);
  // surface noise
  r += 0.08 * fbm(vec3(p.x * 1.3 - flow * 1.4, 0.0, 5.0)) * uPool;

  // cursor interaction: a strong local bulge under the pointer
  float mx = uMouse.x * aspect;
  float my = uMouse.y;
  float distToMouse = length(p.xy - vec2(mx, my * 0.3));
  float bulge = smoothstep(4.0, 0.0, distToMouse);
  r += bulge * 0.3 * uMouseAmp * uPool;

  // softer lean toward the cursor across the whole ingot
  vec3 mdir = normalize(vec3(uMouse * 1.2, 0.8));
  float facing = pow(max(dot(normalize(p + vec3(0, 0.6, 0)), mdir), 0.0), 4.0);
  r += facing * 0.12 * uMouseAmp * uPool;

  float d = sdCapsule(p, a, b, r);
  // mercurial detail noise
  d -= (fbm(p * 2.2 + vec3(-flow * 1.5, uTime * 0.2, 9.0)) - 0.5) * 0.08 * uPool;
  return d;
}

${GET_NORMAL_FN}
${ENV_FN}

void main() {
  if (uPool < 0.001) discard;
  ${raymarch(70)}
  ${HALO_MISS}
  ${SHADE_HIT}
  outColor = vec4(col, edgeAlpha * silhouette);
}
`

type Props = {
  params: React.MutableRefObject<SphereParams>
}

export default function AlloyLiquid({ params }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    if (!canvasRef.current) return
    return setupLiquidCanvas(canvasRef.current, {
      frag: FRAG,
      cursor: true,
      extraUniforms: ["uPool"],
      draw: (gl, loc) => {
        gl.uniform1f(loc.uPool!, params.current.pool)
      },
      skipFrame: () => params.current.pool < 0.001,
    })
  }, [params])
  return (
    <div className="alloy-liquid" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  )
}
