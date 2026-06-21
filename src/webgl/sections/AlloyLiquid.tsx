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

// ─── Molecule graph ───────────────────────────────────────────────────────────
// Hard-coded H2O-like cluster; scale/positions tweak easily.

float sdAtom(vec3 p, vec3 centre, float r) {
  return length(p - centre) - r;
}

float sdBond(vec3 p, vec3 a, vec3 b, float r) {
  return sdCapsule(p, a, b, r);
}

float map(vec3 p) {
  if (uPool < 0.001) return 1e3;

  float t = uTime * 0.3;

  // Gently tumble the molecule
  float ay = t * 0.7, az = t * 0.4;
  mat2  Ry = mat2(cos(ay), -sin(ay), sin(ay), cos(ay));
  mat2  Rz = mat2(cos(az), -sin(az), sin(az), cos(az));
  vec3  q  = p;
  q.xz = Ry * q.xz;
  q.xy = Rz * q.xy;

  float scale = uPool * 1.3;

  // Atom positions (model space)
  vec3 O  = vec3( 0.00,  0.00,  0.00) * scale;
  vec3 H1 = vec3( 0.70,  0.5,  0.00) * scale;
  vec3 H2 = vec3(-0.70,  0.5,  0.00) * scale;
  vec3 C  = vec3( 0.00, -0.7,  0.00) * scale; // carbon neighbour

  float atomR = 0.28 * scale;
  float bondR = 0.05 * scale;

  float d = sdAtom(q, O,  atomR * 1.2);          // oxygen (bigger)
  d = smin(d, sdAtom(q, H1, atomR * 0.75), 0.12); // hydrogen
  d = smin(d, sdAtom(q, H2, atomR * 0.75), 0.12);
  d = smin(d, sdAtom(q, C,  atomR * 0.85 ), 0.12); // carbon
  d = smin(d, sdBond(q, O, H1, bondR), 0.08);
  d = smin(d, sdBond(q, O, H2, bondR), 0.08);
  d = smin(d, sdBond(q, O, C,  bondR), 0.08);

  // Cursor bulge
  float bulge = smoothstep(1.1, 0.0, length(q.xy - uMouse * 0.5));
  d -= bulge * 0.15 * uMouseAmp * uPool;

  // Liquid surface noise
  float flow = uTime * 0.5;
  d -= (fbm(q * 3.0 + vec3(-flow, 0.0, 4.0)) - 0.5) * 0.04 * uPool;

  return d;
}

${GET_NORMAL_FN}
${ENV_FN}

void main() {
  if (uPool < 0.001) discard;
  ${raymarch(80)}
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
