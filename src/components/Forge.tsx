import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { REDUCED_MOTION } from "../motion"
import type { SphereParams } from "../webgl/LiquidSphere"
import { ForgeLiquid } from "../webgl/sections/ForgeLiquid"

type Milestone = {
  date: string
  title: string
  role: string
  blurb?: string
  links?: { label: string; tag: string; projectKey: string }[]
}

const MILESTONES: Milestone[] = [
  {
    date: "2021",
    title: "B.Sc. Computer Science",
    role: "Akademia Tarnowska",
    blurb:
      "Graduated with a focus on algorithms, software architecture and databases — the groundwork for every engineering decision since.",
  },
  {
    date: "2021 — 2024",
    title: "TSR",
    role: "Frontend / UI Engineer",
    blurb:
      "Sole frontend engineer on a B2B workforce-management platform. Architected the component system, owned AG Grid integration for large datasets, and built D3 charts and client-side PDF export from scratch.",
  },
  {
    date: "Oct 2024",
    title: "IcSec · SCADVANCE XP",
    role: "Frontend / UI Engineer",
    blurb:
      "Designed and built the entire analyst-facing UI for an OT/SCADA security platform — alert management workflows, real-time telemetry views, and high-density data tables under strict security constraints.",
  },
  {
    date: "Nov 2024 — Present",
    title: "Zebra · Aurora Focus",
    role: "Frontend / UI Engineer",
    blurb:
      "Core frontend engineer on an industrial AI desktop app. Built the PixiJS/WebGL real-time overlay system, integrated live OCR streams, and interfaced directly with physical industrial cameras and vision hardware via Electron IPC — bridging software and physical devices.",
  },
  {
    date: "2024 — 2026 · After hours",
    title: "Freelance",
    role: "Frontend Developer & Designer",
    links: [
      { label: "Duke Flooring", tag: "Website", projectKey: "duke-flooring" },
      {
        label: "Mini Bouncer",
        tag: "Landing page",
        projectKey: "mini-bouncer",
      },
    ],
  },
]

type Props = {
  params: React.MutableRefObject<SphereParams>
}

export function Forge({ params }: Props) {
  const rootRef = useRef<HTMLElement>(null)
  const anchorRefs = useRef<HTMLSpanElement[]>([])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    // mobile: no WebGL maze (it would render over the stacked cards) —
    // the milestone cards just show as a clean CSS list
    if (REDUCED_MOTION || window.innerWidth < 860) {
      params.current.maze = 0
      return
    }

    // measure each milestone's vertical screen position → shader world Y.
    // x is fixed at 0 (screen centre); ForgeLiquid uses these to position
    // its molten waypoints. world Y is computed against ForgeLiquid's own
    // (fullscreen-fixed) canvas, so it stays consistent regardless of the
    // main metal layer's position.
    const toWorldY = (sy: number, cy: number, halfH: number) =>
      ((cy - sy) / halfH) * 1.619

    const measure = () => {
      const canvas = root.querySelector("canvas")
      if (!canvas) return
      const c = canvas.getBoundingClientRect()
      const cy = c.top + c.height / 2
      const halfH = c.height / 2
      anchorRefs.current.forEach((a, i) => {
        if (!a) return
        const r = a.getBoundingClientRect()
        const sy = r.top + r.height / 2
        params.current.mazeNodes[i * 2] = 0
        params.current.mazeNodes[i * 2 + 1] = toWorldY(sy, cy, halfH)
      })
      params.current.nodeCount = MILESTONES.length
      // the drip head sits at a fixed "pour line" ~72% down the screen;
      // the stream spills to here and milestones bloom as they cross it
      params.current.headX = 0
      params.current.headY = toWorldY(window.innerHeight * 0.72, cy, halfH)
      params.current.viewTopY = toWorldY(0, cy, halfH)
    }

    const ctx = gsap.context(() => {
      // keep waypoint positions synced while forge is in view
      ScrollTrigger.create({
        trigger: root,
        start: "top bottom",
        end: "bottom top",
        onUpdate: measure,
        onRefresh: measure,
        onEnter: measure,
        onEnterBack: measure,
      })

      // the pour only begins once the act title is on screen — no orphan
      // dripping in the gap between Act 03 and Act 04
      ScrollTrigger.create({
        trigger: ".forge__head",
        start: "top",
        end: "bottom",
        onEnter: () => {
          measure()
          gsap.to(params.current, { maze: 1, duration: 0.7 })
        },
        onLeaveBack: () => gsap.to(params.current, { maze: 0, duration: 0.5 }),
      })

      // and fades out as the act ends
      ScrollTrigger.create({
        trigger: root,
        start: "bottom 60%",
        onEnter: () => gsap.to(params.current, { maze: 0, duration: 0.5 }),
        onLeaveBack: () => gsap.to(params.current, { maze: 1, duration: 0.6 }),
      })

      // each card slides in from its side as its blob reaches centre screen
      gsap.utils.toArray<HTMLElement>(".milestone", root).forEach((m) => {
        gsap.fromTo(
          m.querySelector(".milestone__card"),
          {
            opacity: 0,
            x: m.classList.contains("milestone--left") ? -60 : 60,
            filter: "blur(8px)",
          },
          {
            opacity: 1,
            x: 0,
            filter: "blur(0px)",
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: m,
              start: "top 70%",
              end: "bottom 60%",
              toggleActions: "play none none reverse",
            },
          },
        )
      })

      gsap.fromTo(
        ".forge__head .line-inner",
        { yPercent: 165 },
        {
          yPercent: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: root, start: "top 75%" },
        },
      )
    }, root)

    window.addEventListener("resize", measure)
    return () => {
      window.removeEventListener("resize", measure)
      ctx.revert()
    }
  }, [params])

  return (
    <section ref={rootRef} className="forge" aria-label="Experience">
      <ForgeLiquid params={params} />
      <div className="forge__head">
        <h2>
          <span className="line-mask">
            <span className="line-inner">
              My <span className="chrome-text">Path</span>
            </span>
          </span>
        </h2>
      </div>

      <ol className="forge__track">
        {MILESTONES.map((m, i) => {
          const yearMatch = m.date.match(/\b(19|20)\d{2}\b/)
          return (
          <li
            key={m.title}
            className={`milestone ${i % 2 === 0 ? "milestone--left" : "milestone--right"}`}
          >
            <span
              className="milestone__anchor"
              ref={(el) => {
                if (el) anchorRefs.current[i] = el
              }}
            />
            <div className="milestone__card">
              <span className="milestone__index">
                {String(i + 1).padStart(2, "0")} /{" "}
                {String(MILESTONES.length).padStart(2, "0")}
              </span>
              <time
                className="milestone__date"
                dateTime={yearMatch ? yearMatch[0] : undefined}
              >
                {m.date}
              </time>
              <h3 className="milestone__title">{m.title}</h3>
              <p className="milestone__role">{m.role}</p>
              {m.blurb && <p className="milestone__blurb">{m.blurb}</p>}
              {m.links && (
                <ul className="milestone__links">
                  {m.links.map((l) => (
                    <li key={l.projectKey}>
                      <button
                        type="button"
                        className="milestone__link"
                        onClick={() => {
                          const goto = (
                            window as unknown as {
                              __gotoProject?: (key: string) => void
                            }
                          ).__gotoProject
                          if (goto) goto(l.projectKey)
                          else
                            document
                              .querySelector(".castings")
                              ?.scrollIntoView({ behavior: "smooth" })
                        }}
                      >
                        <span>{l.label}</span>
                        <i>— {l.tag}</i>
                        <span
                          aria-hidden="true"
                          className="milestone__link-arrow"
                        >
                          ↗
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </li>
          )
        })}
      </ol>
    </section>
  )
}
