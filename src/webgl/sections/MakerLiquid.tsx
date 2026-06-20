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

// Mercury sculpture that sits behind the portrait in act 02.
// At uReveal=0 the metal forms a head-and-shoulders silhouette rising out
// of the basin pool; as scroll drives uReveal→1, the head sinks and the
// connecting column thins, leaving just the pool — the portrait <img> fades
// in over the top in sync, so the photo reads as "born from the metal".

const FRAG = /* glsl */ `${FRAG_PRELUDE}
uniform float uReveal;
${NOISE_FNS}
${SDF_FNS}

float map(vec3 p) {
  float flow = uTime * 0.5;
  float aspect = uRes.x / min(uRes.x, uRes.y);
  float reveal = clamp(uReveal, 0.0, 1.0);

  // Pool basin — wide capsule along the bottom of the canvas
  float halfW = aspect - 0.05;
  float poolY = -1.0;
  float ripple = 0.05 * sin(p.x * 2.4 + flow * 1.6)
               + 0.03 * sin(p.x * 6.1 - flow * 2.3);
  vec3 pa = vec3(-halfW, poolY + ripple, 0.0);
  vec3 pb = vec3( halfW, poolY + ripple, 0.0);
  float pr = 0.35 + 0.05 * fbm(vec3(p.x * 1.3 - flow * 1.5, 0.0, 3.0));
  float pool = sdCapsule(p, pa, pb, pr);

  // Head silhouette — sinks deep below the pool as reveal completes
  float headY = mix(0.85, -0.9, reveal);
  vec3 hp = p - vec3(0.0, headY, 0.0);
  vec3 hs = vec3(1, 0.70, 0.40);
  float skull = (length(hp / hs) - 1.0) * min(hs.x, min(hs.y, hs.z));
  float headFade = smoothstep(0.2, 2.0, reveal);
  skull += headFade * 0.5;
  // Mercury column connecting head to pool — thickness drops to ~0 with reveal
  vec3 ba = vec3(0.0, headY - 0.30, 0.0);
  vec3 bb = vec3(0.0, poolY + 0.50, 0.0);
  float br = mix(0.85, 0.001, smoothstep(0.0, 0.65, reveal));
  float body = sdCapsule(p, ba, bb, br);

  // Smooth-union the three pieces — k tightens as reveal completes so the
  // silhouette resolves crisply instead of melting away
  float k = mix(0.30, 0.05, reveal);
  float d = smin(smin(skull, body, k), pool, k);
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
  /** 0 = mercury head fully formed, 1 = head sunk, pool only. */
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
