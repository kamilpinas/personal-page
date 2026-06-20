import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import type { SphereParams } from "../webgl/LiquidSphere"
import { REDUCED_MOTION } from "../motion"

const STACK = [
  "AG Grid",
  "React Context",
  "Redux",
  "Electron",
  "Tailwind",
  "Material UI",
  "WebSocket API",
  "SonarCube",
  "GitHub CoPilot",
  "Claude Code",
  "Accessibility",
  "Web Vitals",
  "CI/CD",
  "REST APIs",
  "PixiJS",
  "WebGL",
  "D3.js",
]

type Props = {
  ignited: boolean // pour finished — bring the hero in
  params: React.MutableRefObject<SphereParams>
}

export function Hero({ ignited, params }: Props) {
  const rootRef = useRef<HTMLElement>(null)
  const played = useRef(false)

  useEffect(() => {
    if (!ignited || played.current) return
    played.current = true
    const root = rootRef.current
    if (!root) return

    const reduced = REDUCED_MOTION

    const lines = root.querySelectorAll<HTMLElement>(".hero__name .line")

    if (reduced) {
      params.current.intro = 1
      params.current.stream = 0
      gsap.set(lines, { clipPath: "none", filter: "none", y: 0 })
      gsap.set(root.querySelectorAll(".intro-hide"), { opacity: 1 })
      return
    }

    const metalPos = document.querySelector<HTMLElement>(".metal-pos")
    const setMx = (v: string) => metalPos?.style.setProperty("--mx", v)

    const ctx = gsap.context(() => {
      // a settle wobble as the freshly cast sphere takes its final size
      gsap.fromTo(
        params.current,
        { intro: 0.96 },
        { intro: 1, duration: 1.1, ease: "elastic.out(1, 0.45)" },
      )

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } })

      // the name pours up out of the pool, molten → solid
      tl.to(
        lines,
        {
          clipPath: "inset(-15% 0 -10% 0)",
          filter: "blur(0px)",
          y: 0,
          duration: 1.15,
          stagger: 0.14,
        },
        0.25,
      )
        // sheen locks each line into chrome
        .add(() => {
          lines.forEach((l, i) =>
            setTimeout(() => l.classList.add("sheen-run"), i * 160),
          )
        }, 1.05)
        .to(
          root.querySelectorAll(".intro-hide"),
          {
            opacity: 1,
            duration: 0.9,
            stagger: 0.08,
          },
          1.2,
        )

      // scroll hand-off: the big sphere shrinks AND moves toward the corner
      // orb's exact on-screen position, matching its pixel size. Then a
      // crossfade swaps the rendering from the main canvas to the corner
      // canvas — visually one continuous orb travelling to its rest spot.
      const restMx = window.innerWidth <= 640 ? "-50%" : "-28%"
      const cornerEl = document.querySelector<HTMLElement>(".corner-orb")
      const metalLayer = document.querySelector<HTMLElement>(".metal-layer")

      // map the corner orb's CSS-rendered center + size into the main
      // canvas's world coords. recomputed per-frame to survive resizes.
      const orbTarget = () => {
        if (!cornerEl) return { x: 1.2, y: -0.95, scale: 0.1 }
        const cb = cornerEl.getBoundingClientRect()
        const canvas =
          document.querySelector<HTMLCanvasElement>(".metal-pos canvas")
        if (!canvas || cb.width < 4) return { x: 1.2, y: -0.95, scale: 0.1 }
        const c = canvas.getBoundingClientRect()
        const cmin = Math.min(c.width, c.height)
        const cx = cb.left + cb.width / 2
        const cy = cb.top + cb.height / 2
        const lx = cx - c.left
        const ly = cy - c.top
        const u = (lx * 2 - c.width) / cmin
        const v = (c.height - ly * 2) / cmin
        // sphere has world radius 0.92 at scale 1. For the big sphere to
        // match the corner orb's pixel radius, solve for scale.
        const targetWorldR = (((cb.width / 2) * 2) / cmin) * 1.619
        return { x: u * 1.619, y: v * 1.619, scale: targetWorldR / 0.92 }
      }

      ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: "bottom top",
        scrub: 0.6,
        onUpdate: (self) => {
          const p = self.progress
          params.current.rise = 0
          params.current.intro = 1
          // canvas stays anchored — no shift to centre that would tug the
          // shrinking sphere sideways
          setMx(restMx)

          // shrink+travel finishes by p≈0.78 — by then the big sphere is
          // already at the corner orb's exact size and position
          const travel = Math.min(p / 0.78, 1)
          const t = orbTarget()
          params.current.orbX = t.x * travel
          params.current.orbY = t.y * travel
          params.current.orbScale = 1 - travel * (1 - t.scale)

          // crossfade window opens AFTER the travel completes (p ≥ 0.78).
          // .metal-layer (the big-sphere canvas) and .corner-orb crossfade
          // via CSS opacity — both at identical pixel size / position so
          // their alphas sum to 1 → no visible flash or transparency.
          const fade = Math.max(0, Math.min(1, (p - 0.78) / 0.12))
          if (metalLayer) metalLayer.style.opacity = String(1 - fade)
          if (cornerEl) cornerEl.style.opacity = String(fade)
        },
      })

      // the name + role travel to the corner orb the same way the big
      // sphere does — explicit pixel translation toward the orb's centre,
      // shrinking to a point as they get there
      const isMobile = window.innerWidth < 860

      const inner = root.querySelector<HTMLElement>(".hero__inner")
      if (inner) {
        gsap.to(inner, {
          opacity: 0,
          y: isMobile ? "80%" : 100,
          x: isMobile ? undefined : "50%",
          scale: 2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "100% top",
            scrub: true,
          },
        })
      }

      // idle re-sheen: a light bar sweeps the chrome every few seconds
      let sheenTimer = gsap.delayedCall(7, function loop() {
        lines.forEach((l, i) => {
          l.classList.remove("sheen-run")
          void l.offsetWidth // restart the CSS animation
          setTimeout(() => l.classList.add("sheen-run"), i * 160)
        })
        sheenTimer = gsap.delayedCall(7, loop)
      })

      // (cursor parallax removed — the scroll handoff now drives x/y on the
      // same element and a parallax tween would fight with it)

      return () => {
        sheenTimer.kill()
      }
    }, root)

    return () => ctx.revert()
  }, [ignited])

  return (
    <section ref={rootRef} className="hero" aria-label="Intro">
      <a
        className="hero__contact intro-hide"
        href="mailto:kamilpinas@gmail.com"
      >
        kamilpinas@gmail.com
      </a>

      <div className="hero__inner">
        <h1 className="hero__name">
          <span className="line pour chrome-text sheen-host" data-text="Kamil">
            Kamil
          </span>
          <span className="line pour chrome-text sheen-host" data-text="Pinas">
            Pinas
          </span>
        </h1>
        <p className="hero__role intro-hide">
          <span className="rule" />
          <span>
            Frontend Software Engineer —{" "}
            <span className="accent">React · TypeScript</span>
          </span>
        </p>
      </div>

      <div className="hero__cue intro-hide" aria-hidden="true">
        <span className="cue-label">Scroll</span>
        <span className="cue-rail" />
      </div>

      <div className="marquee intro-hide" aria-hidden="true">
        <div className="marquee__track">
          {[0, 1, 2, 3].map((g) => (
            <div className="marquee__group" key={g}>
              {STACK.map((s) => (
                <span key={s}>
                  {s} <i>·</i>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
