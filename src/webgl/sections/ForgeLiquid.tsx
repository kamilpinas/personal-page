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
import type { SphereParams } from "../LiquidSphere"

// Self-contained molten pour for act 04. A thick chrome stream spills
// down the centre to a leading drip head, and an irregular blob blooms
// at each milestone as the pour reaches it. uNodes/uMazeHead are scroll
// synced by Forge.tsx; the bottom of the screen fades the stream out so
// the act doesn't bleed into the next section.

const FRAG = /* glsl */ `${FRAG_PRELUDE}
uniform float uMaze;
uniform vec2  uNodes[8];
uniform int   uNodeCount;
uniform vec2  uMazeHead;
uniform float uViewTopY;
${NOISE_FNS}
${SDF_FNS}

float map(vec3 p) {
  if (uMaze < 0.001) return 1e3;

  float flow = uTime * 0.5;
  float headY = uMazeHead.y;
  float topY = uViewTopY + 0.25;

  // single thick stream spilling down the centre
  float r = (0.05 + 0.02 * fbm(vec3(0.0, p.y * 1.4 - flow * 2.2, 1.0))) * uMaze;
  float md = sdCapsule(p, vec3(0.0, topY, 0.0), vec3(0.0, headY, 0.0), r);
  md -= (fbm(p * 2.3 + vec3(0.0, -flow * 2.6, 6.0)) - 0.5) * 0.03 * uMaze;

  // molten drip at the leading edge
  md = smin(md, length(p - vec3(0.0, headY, 0.0)) - 0.07 * uMaze, 0.06);

  // irregular blobs at each milestone — each given a different seed so
  // no two read the same
  for (int i = 0; i < 8; i++) {
    if (i >= uNodeCount) break;
    float ny = uNodes[i].y;
    float grow = smoothstep(headY - 0.05, headY + 0.45, ny);
    if (grow < 0.01) continue;

    vec3 bp = p - vec3(0.0, ny, 0.0);
    float seed = fract(sin(float(i) * 91.73) * 43758.5453);
    float br = (0.12 + 0.06 * seed) * grow * uMaze;
    bp.y *= 0.82 + 0.3 * seed;

    float blob = length(bp) - br;
    blob -= (fbm(bp * 2.6 + vec3(seed * 12.0, -flow, 3.0)) - 0.5) * 0.07 * grow * uMaze;
    md = smin(md, blob, 0.13);
  }

  return md;
}

${GET_NORMAL_FN}
${ENV_FN}

void main() {
  if (uMaze < 0.01) discard;

  ${raymarch(90)}
  ${HALO_MISS}
  ${SHADE_HIT}

  // top fade so the stream dissolves before it touches the viewport edge
  float topFade = smoothstep(uViewTopY + 0.15, uViewTopY - 0.4, p.y);
  outColor = vec4(col, edgeAlpha * silhouette * topFade);
}
`

type Props = {
  params: React.MutableRefObject<SphereParams>
}

export function ForgeLiquid({ params }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    if (!canvasRef.current) return
    return setupLiquidCanvas(canvasRef.current, {
      frag: FRAG,
      extraUniforms: [
        "uMaze",
        "uNodes",
        "uNodeCount",
        "uMazeHead",
        "uViewTopY",
      ],
      draw: (gl, loc) => {
        gl.uniform1f(loc.uMaze!, params.current.maze)
        gl.uniform2fv(loc.uNodes!, params.current.mazeNodes)
        gl.uniform1i(loc.uNodeCount!, params.current.nodeCount)
        gl.uniform2f(loc.uMazeHead!, params.current.headX, params.current.headY)
        gl.uniform1f(loc.uViewTopY!, params.current.viewTopY)
      },
      skipFrame: () => params.current.maze < 0.001,
    })
  }, [params])
  return (
    <div className="forge-liquid" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  )
}
