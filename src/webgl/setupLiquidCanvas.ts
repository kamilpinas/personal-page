// Shared WebGL2 boilerplate for the per-section liquid canvases.
//
// Each section component used to repeat ~150 lines of identical setup:
// context creation, shader compilation, DPR-aware resize, cursor
// tracking, IntersectionObserver visibility, RAF loop, cleanup. This
// module consolidates all of it into a single helper.

import { REDUCED_MOTION } from "../motion"
import { VERT } from "./glsl"

export type DrawCtx = {
  time: number // seconds since the canvas mounted
  width: number // canvas.width (post-DPR)
  height: number // canvas.height (post-DPR)
  mouseX: number // smoothed -1..1 (canvas-local)
  mouseY: number // smoothed -1..1 (canvas-local; positive = up)
  mouseAmp: number // 0..1, decays when the pointer is still
}

export type LiquidConfig = {
  /** Full fragment shader source. Must declare `out vec4 outColor;`. */
  frag: string
  /**
   * Whether the shader uses uMouse/uMouseAmp. When true a pointermove
   * listener is wired up and the smoothed values are passed via DrawCtx
   * — but you still need to upload them inside `draw`. Defaults false.
   */
  cursor?: boolean
  /**
   * Names of section-specific uniforms whose locations should be
   * resolved up-front and made available to `draw` as `loc.uX`.
   */
  extraUniforms?: string[]
  /**
   * Per-frame uniform upload. uRes and uTime are uploaded automatically
   * before `draw` runs; uMouse/uMouseAmp are uploaded automatically when
   * `cursor: true`. Use `draw` only for section-specific uniforms.
   */
  draw?: (
    gl: WebGL2RenderingContext,
    loc: Record<string, WebGLUniformLocation | null>,
    ctx: DrawCtx,
  ) => void
  /**
   * Optional cheap predicate evaluated each frame. Returning `true`
   * skips the raymarch and emits a clear — useful for sections that
   * fade in/out via a presence uniform.
   */
  skipFrame?: () => boolean
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

/**
 * Initialise a WebGL2 canvas with the given fragment shader and start a
 * RAF loop. Returns a teardown function — call it from useEffect cleanup.
 */
export function setupLiquidCanvas(
  canvas: HTMLCanvasElement,
  config: LiquidConfig,
): () => void {
  const gl = canvas.getContext("webgl2", {
    alpha: true,
    antialias: true,
    premultipliedAlpha: false,
  })
  if (!gl) return () => {}

  const program = gl.createProgram()!
  const vs = compile(gl, gl.VERTEX_SHADER, VERT)
  const fs = compile(gl, gl.FRAGMENT_SHADER, config.frag)
  gl.attachShader(program, vs)
  gl.attachShader(program, fs)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program))
    gl.deleteProgram(program)
    gl.deleteShader(vs)
    gl.deleteShader(fs)
    return () => {}
  }
  gl.useProgram(program)
  gl.enable(gl.BLEND)
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
  gl.clearColor(0, 0, 0, 0)

  // Resolve uniform locations up-front. Per-frame draw() reads from `loc`.
  const loc: Record<string, WebGLUniformLocation | null> = {
    uRes: gl.getUniformLocation(program, "uRes"),
    uTime: gl.getUniformLocation(program, "uTime"),
  }
  if (config.cursor) {
    loc.uMouse = gl.getUniformLocation(program, "uMouse")
    loc.uMouseAmp = gl.getUniformLocation(program, "uMouseAmp")
  }
  for (const name of config.extraUniforms ?? []) {
    loc[name] = gl.getUniformLocation(program, name)
  }

  // DPR-aware resize: keep internal resolution sharp without overshooting
  // on high-DPI screens (>1.5x DPR has diminishing returns for raymarching).
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

  // Cursor smoothing — running average with exponential decay on the
  // amplitude so the metal slowly settles when the pointer is idle.
  const mouse = { tx: 0, ty: 0, x: 0, y: 0, amp: 0, targetAmp: 0 }
  let detachPointer: (() => void) | null = null
  const isTouch = window.matchMedia("(pointer: coarse)").matches
  if (config.cursor && !isTouch && !REDUCED_MOTION) {
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.tx = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse.ty = -(((e.clientY - rect.top) / rect.height) * 2 - 1)
      mouse.targetAmp = 1
    }
    window.addEventListener("pointermove", onMove, { passive: true })
    detachPointer = () => window.removeEventListener("pointermove", onMove)
  }

  // Visibility gate — pause the loop when the canvas leaves the viewport
  // or the tab is hidden. Cheap and meaningful: raymarching is the most
  // expensive thing happening in any given frame.
  let visible = true
  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting
  })
  io.observe(canvas)

  const start = performance.now()
  const ctx: DrawCtx = {
    time: 0,
    width: canvas.width,
    height: canvas.height,
    mouseX: 0,
    mouseY: 0,
    mouseAmp: 0,
  }

  const frame = (now: number) => {
    // smooth the cursor each frame so motion feels weighted, not snappy
    mouse.x += (mouse.tx - mouse.x) * 0.055
    mouse.y += (mouse.ty - mouse.y) * 0.055
    mouse.targetAmp *= 0.985
    mouse.amp += (mouse.targetAmp - mouse.amp) * 0.06

    ctx.time = (now - start) / 1000
    ctx.width = canvas.width
    ctx.height = canvas.height
    ctx.mouseX = mouse.x
    ctx.mouseY = mouse.y
    ctx.mouseAmp = mouse.amp

    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.uniform2f(loc.uRes, canvas.width, canvas.height)
    gl.uniform1f(loc.uTime, ctx.time)
    if (config.cursor) {
      gl.uniform2f(loc.uMouse, mouse.x, mouse.y)
      gl.uniform1f(loc.uMouseAmp, mouse.amp)
    }
    config.draw?.(gl, loc, ctx)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
  }

  let raf = 0
  if (REDUCED_MOTION) {
    frame(start + 1)
  } else {
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop)
      if (!visible || document.hidden) return
      if (config.skipFrame?.()) {
        gl.clear(gl.COLOR_BUFFER_BIT)
        return
      }
      frame(now)
    }
    raf = requestAnimationFrame(loop)
  }

  return () => {
    cancelAnimationFrame(raf)
    detachPointer?.()
    ro.disconnect()
    io.disconnect()
    gl.deleteProgram(program)
    gl.deleteShader(vs)
    gl.deleteShader(fs)
  }
}
