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

// Self-contained molten block for act 07. Coalesces from a sphere into
// a rounded building-block cube as the user scrolls — uFinale is the
// presence, uMorph drives the sphere↔cube interpolation. Spins slowly
// and leans toward the cursor.

const FRAG = /* glsl */ `${FRAG_PRELUDE}
${FRAG_CURSOR_UNIFORMS}
uniform float uFinale;
uniform float uMorph;
${NOISE_FNS}
${SDF_FNS}

float map(vec3 p) {
  if (uFinale < 0.001) return 1e3;

  vec3 sp = p;
  // slow spin + a lean toward the cursor
  float ay = uTime * 0.22 + uMouse.x * 0.55;
  float ax = -0.18 * sin(uTime * 0.35) - uMouse.y * 0.45;
  float cyA = cos(ay), syA = sin(ay);
  sp.xz = mat2(cyA, -syA, syA, cyA) * sp.xz;
  float cxA = cos(ax), sxA = sin(ax);
  sp.yz = mat2(cxA, -sxA, sxA, cxA) * sp.yz;

  float breathe = 1.0 + 0.03 * sin(uTime * 0.6);
  float sph = length(sp) - 0.85 * breathe * uFinale;

  // rounded box (the block)
  vec3 b = vec3(0.6 * uFinale);
  vec3 qb = abs(sp) - b;
  float box = length(max(qb, 0.0)) + min(max(qb.x, max(qb.y, qb.z)), 0.0)
            - 0.14 * uFinale;

  float shape = mix(sph, box, uMorph);
  // living molten surface — strong on the sphere, a whisper on the block
  float n = fbm(sp * 1.7 + vec3(0.0, uTime * 0.22, 0.0)) - 0.5;
  shape -= n * mix(0.13, 0.04, uMorph) * uFinale;

  return shape;
}

${GET_NORMAL_FN}
${ENV_FN}

void main() {
  if (uFinale < 0.001) discard;
  ${raymarch(70)}
  ${HALO_MISS}
  ${SHADE_HIT}
  outColor = vec4(col, edgeAlpha * silhouette);
}
`

type Props = {
  params: React.MutableRefObject<SphereParams>
}

export default function OfferingLiquid({ params }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    if (!canvasRef.current) return
    return setupLiquidCanvas(canvasRef.current, {
      frag: FRAG,
      cursor: true,
      extraUniforms: ["uFinale", "uMorph"],
      draw: (gl, loc) => {
        gl.uniform1f(loc.uFinale!, params.current.finale)
        gl.uniform1f(loc.uMorph!, params.current.morph)
      },
      skipFrame: () => params.current.finale < 0.001,
    })
  }, [params])
  return (
    <div className="offering-liquid" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  )
}
