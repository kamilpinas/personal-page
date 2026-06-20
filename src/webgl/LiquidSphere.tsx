import { useEffect, useRef } from "react"
import { vertexShader, fragmentShader } from "./shaders"
import { REDUCED_MOTION } from "../motion"

export type SphereParams = {
  // hero sphere + preloader (main shader)
  intro: number
  stream: number
  head: number
  rise: number
  orbX: number
  orbY: number
  orbScale: number
  // forge: scroll-synced waypoints (ForgeLiquid)
  maze: number
  mazeNodes: Float32Array // 8 vec2 pairs (16 floats), world coords
  nodeCount: number
  headX: number
  headY: number
  viewTopY: number
  // alloy ingot presence (AlloyLiquid)
  pool: number
  // offering finale (OfferingLiquid)
  finale: number
  morph: number
}

type Props = {
  params: React.MutableRefObject<SphereParams>
  className?: string
}

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!
  gl.shaderSource(sh, src)
  gl.compileShader(sh)
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(sh)
    gl.deleteShader(sh)
    throw new Error(`Shader compile failed: ${log}`)
  }
  return sh
}

export function LiquidSphere({ params, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext("webgl2", {
      alpha: true,
      antialias: true,
      premultipliedAlpha: false,
    })
    if (!gl) return // static CSS fallback stays visible

    const prefersReduced = REDUCED_MOTION

    const program = gl.createProgram()!
    const vs = compile(gl, gl.VERTEX_SHADER, vertexShader)
    const fs = compile(gl, gl.FRAGMENT_SHADER, fragmentShader)
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program))
      return
    }
    gl.useProgram(program)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    gl.clearColor(0, 0, 0, 0)

    const loc = {
      res: gl.getUniformLocation(program, "uRes"),
      time: gl.getUniformLocation(program, "uTime"),
      mouse: gl.getUniformLocation(program, "uMouse"),
      mouseAmp: gl.getUniformLocation(program, "uMouseAmp"),
      intro: gl.getUniformLocation(program, "uIntro"),
      stream: gl.getUniformLocation(program, "uStream"),
      head: gl.getUniformLocation(program, "uHead"),
      rise: gl.getUniformLocation(program, "uRise"),
      orbX: gl.getUniformLocation(program, "uOrbX"),
      orbY: gl.getUniformLocation(program, "uOrbY"),
      orbScale: gl.getUniformLocation(program, "uOrbScale"),
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    const resize = () => {
      const { clientWidth, clientHeight } = canvas
      canvas.width = Math.max(1, Math.round(clientWidth * dpr))
      canvas.height = Math.max(1, Math.round(clientHeight * dpr))
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    // cursor: smoothed in the loop; amplitude decays when idle
    const mouse = { tx: 0, ty: 0, x: 0, y: 0, amp: 0, targetAmp: 0 }
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.tx = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse.ty = -(((e.clientY - rect.top) / rect.height) * 2 - 1)
      mouse.targetAmp = 1
    }
    const isTouch = window.matchMedia("(pointer: coarse)").matches
    if (!isTouch && !prefersReduced) {
      window.addEventListener("pointermove", onMove, { passive: true })
    }

    let raf = 0
    let visible = true
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
    })
    io.observe(canvas)

    const start = performance.now()
    const draw = (now: number) => {
      mouse.x += (mouse.tx - mouse.x) * 0.055
      mouse.y += (mouse.ty - mouse.y) * 0.055
      mouse.targetAmp *= 0.985
      mouse.amp += (mouse.targetAmp - mouse.amp) * 0.06

      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.uniform2f(loc.res, canvas.width, canvas.height)
      gl.uniform1f(loc.time, (now - start) / 1000)
      gl.uniform2f(loc.mouse, mouse.x, mouse.y)
      gl.uniform1f(loc.mouseAmp, mouse.amp)
      gl.uniform1f(loc.intro, params.current.intro)
      gl.uniform1f(loc.stream, params.current.stream)
      gl.uniform1f(loc.head, params.current.head)
      gl.uniform1f(loc.rise, params.current.rise)
      gl.uniform1f(loc.orbX, params.current.orbX)
      gl.uniform1f(loc.orbY, params.current.orbY)
      gl.uniform1f(loc.orbScale, params.current.orbScale)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }

    if (prefersReduced) {
      // one solid frame, no loop
      params.current.intro = 1
      params.current.stream = 0
      draw(start + 1)
    } else {
      const loop = (now: number) => {
        raf = requestAnimationFrame(loop)
        if (!visible || document.hidden) return
        const pc = params.current
        // skip the (expensive) raymarch when neither the sphere nor the
        // preloader stream needs to render
        if (pc.intro < 0.01 && pc.head < 0.001) {
          gl.clear(gl.COLOR_BUFFER_BIT)
          return
        }
        draw(now)
      }
      raf = requestAnimationFrame(loop)
    }

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("pointermove", onMove)
      ro.disconnect()
      io.disconnect()
      gl.deleteProgram(program)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
    }
  }, [params])

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />
}
