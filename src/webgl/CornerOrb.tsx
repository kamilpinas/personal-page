import { useEffect, useRef, useState } from "react"
import { ChatPanel } from "../components/ChatPanel"
import { useAiChat } from "../components/useAiChat"
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
} from "./glsl"
import { setupLiquidCanvas } from "./setupLiquidCanvas"

// A tiny, self-contained liquid-chrome orb fixed to the bottom-right
// once the hero hands off. Acts as both a persistent visual anchor and
// the entry point to the embedded AI assistant — hover or click to
// expand the chat panel.

const FRAG = /* glsl */ `${FRAG_PRELUDE}
${FRAG_CURSOR_UNIFORMS}
${NOISE_FNS}
${SDF_FNS}

float map(vec3 p) {
  vec3 bp = p;
  vec3 q = bp;
  float a = uTime * 0.12;
  float c = cos(a), s = sin(a);
  q.xz = mat2(c, -s, s, c) * q.xz;
  float breathe = 1.0 + 0.035 * sin(uTime * 0.65);
  float d = length(bp) - 0.92 * breathe;
  float n = fbm(q * 1.7 + vec3(0.0, uTime * 0.22, 0.0)) - 0.5;
  vec3 mdir = normalize(vec3(uMouse * 1.4, 0.8));
  float facing = pow(max(dot(normalize(bp + 1e-4), mdir), 0.0), 5.0);
  d -= n * 0.14 + facing * 0.24 * uMouseAmp;
  return d;
}

${GET_NORMAL_FN}
${ENV_FN}

void main() {
  ${raymarch(60)}
  ${HALO_MISS}
  ${SHADE_HIT}
  outColor = vec4(col, edgeAlpha * silhouette);
}
`

export function CornerOrb() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [isLocked, setIsLocked] = useState(false)
  const [showCue, setShowCue] = useState(false)

  const chat = useAiChat()
  const isOpen = isHovered || isLocked

  // surface the conversational cue after the hero handoff has settled
  useEffect(() => {
    const timer = setTimeout(() => setShowCue(true), 4000)
    return () => clearTimeout(timer)
  }, [])

  // mount the WebGL orb once
  useEffect(() => {
    if (!canvasRef.current) return
    return setupLiquidCanvas(canvasRef.current, {
      frag: FRAG,
      cursor: true,
    })
  }, [])

  const handleSend = (text: string) => {
    setShowCue(false)
    chat.sendMessage(text)
  }

  return (
    <div
      className={`corner-orb ${isOpen ? "corner-orb--expanded" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        setIsLocked(true)
        setShowCue(false)
      }}
      aria-label="Personal AI Assistant"
    >
      {!isOpen && (
        <div
          className={`corner-orb__cue-badge ${
            showCue ? "corner-orb__cue-badge--visible" : ""
          }`}
          onMouseEnter={(e) => {
            e.stopPropagation()
            setIsHovered(true)
          }}
          onClick={(e) => {
            e.stopPropagation()
            setIsLocked(true)
            setShowCue(false)
          }}
        >
          <span className="corner-orb__cue-ping" />
          <span>Chat with me</span>
        </div>
      )}

      <div className="corner-orb__canvas-wrapper">
        <canvas ref={canvasRef} />
      </div>

      {isOpen && (
        <ChatPanel
          messages={chat.messages}
          isLoading={chat.isLoading}
          onSend={handleSend}
          onClose={() => {
            setIsLocked(false)
            setIsHovered(false)
          }}
          onFocus={() => setIsLocked(true)}
        />
      )}
    </div>
  )
}
