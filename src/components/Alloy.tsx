import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { REDUCED_MOTION } from "../motion"
import type { SphereParams } from "../webgl/LiquidSphere"
import AlloyLiquid from "../webgl/sections/AlloyLiquid"

type Group = {
  label: string
  skills: { name: string; value: number }[]
}

// curated from the full skills dataset (real proficiency values)
const GROUPS: Group[] = [
  {
    label: "Core",
    skills: [
      { name: "TypeScript", value: 95 },
      { name: "JavaScript", value: 85 },
      { name: "CSS", value: 80 },
      { name: "HTML", value: 80 },
      { name: "Performance", value: 75 },
    ],
  },
  {
    label: "Frameworks",
    skills: [
      { name: "React", value: 95 },
      { name: "Redux Toolkit", value: 85 },
      { name: "Context API", value: 85 },
      { name: "AG Grid", value: 75 },
      { name: "D3.js", value: 65 },
    ],
  },
  {
    label: "Tooling & AI",
    skills: [
      { name: "Claude", value: 80 },
      { name: "GitHub Copilot", value: 80 },
      { name: "Vite", value: 75 },
      { name: "Webpack", value: 75 },
      { name: "Electron", value: 70 },
    ],
  },
]

type Props = {
  params: React.MutableRefObject<SphereParams>
}

export function Alloy({ params }: Props) {
  const rootRef = useRef<HTMLElement>(null)
  const ingotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root || REDUCED_MOTION) return

    const ctx = gsap.context(() => {
      // the ingot forms once the title is on screen
      ScrollTrigger.create({
        trigger: ".alloy__head",
        start: "top 72%",
        end: "bottom top",
        onEnter: () => gsap.to(params.current, { pool: 1, duration: 0.7 }),
        onLeaveBack: () => gsap.to(params.current, { pool: 0, duration: 0.5 }),
      })
      ScrollTrigger.create({
        trigger: root,
        start: "bottom 55%",
        onEnter: () => gsap.to(params.current, { pool: 0, duration: 0.5 }),
        onLeaveBack: () => gsap.to(params.current, { pool: 1, duration: 0.6 }),
      })

      // headings + columns pour up; bars fill like mercury rising
      gsap.fromTo(
        ".alloy__head .line-inner",
        { yPercent: 115 },
        {
          yPercent: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: root, start: "top 75%" },
        },
      )

      gsap.utils.toArray<HTMLElement>(".alloy-col", root).forEach((col) => {
        const bars = col.querySelectorAll<HTMLElement>(".bar__fill")
        gsap.fromTo(
          col.querySelectorAll(".bar, .alloy-col__label"),
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            stagger: 0.06,
            scrollTrigger: { trigger: col, start: "top 80%" },
          },
        )
        bars.forEach((bar) => {
          const target = Number(bar.dataset.value)
          gsap.fromTo(
            bar,
            { scaleX: 0 },
            {
              scaleX: target / 100,
              duration: 1.3,
              ease: "power2.out",
              scrollTrigger: { trigger: bar, start: "top 86%" },
            },
          )
        })
      })
    }, root)

    return () => ctx.revert()
  }, [params])

  return (
    <section ref={rootRef} className="alloy" aria-label="Skills">
      <div className="alloy__head">
        <h2>
          <span className="line-mask">
            <span className="line-inner">The</span>
          </span>
          <span className="line-mask">
            <span className="line-inner chrome-text">composition</span>
          </span>
        </h2>
      </div>

      {/* the molten ingot the skills are drawn from (WebGL renders on it) */}
      <div className="alloy__ingot" ref={ingotRef} aria-hidden="true">
        <AlloyLiquid params={params} />
      </div>

      <div className="alloy__grid">
        {GROUPS.map((g) => (
          <div className="alloy-col" key={g.label}>
            <span className="alloy-col__label">{g.label}</span>
            {g.skills.map((s) => (
              <div className="bar" key={s.name}>
                <div className="bar__head">
                  <span className="bar__name">{s.name}</span>
                </div>
                <div className="bar__track">
                  <div className="bar__fill" data-value={s.value} />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
