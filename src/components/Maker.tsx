import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { REDUCED_MOTION } from "../motion"
import { MakerLiquid } from "../webgl/sections/MakerLiquid"

const STATS = [
  { label: "Years experience", value: "5+" },
  { label: "Framework", value: "React" },
  { label: "Language", value: "TypeScript" },
  { label: "Languages", value: "EN · PL" },
]

export function Maker() {
  const rootRef = useRef<HTMLElement>(null)
  // 0 = mercury head fully formed; 1 = pool only, portrait revealed.
  // Defaults to 1 so reduced-motion / mobile (which skip the reveal
  // animation) render the calm pool state straight away.
  const revealRef = useRef(1)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    if (REDUCED_MOTION || window.innerWidth < 1100) return

    // Desktop only: start with the mercury sculpture visible, fade the
    // portrait in as scroll drains it.
    revealRef.current = 0

    const ctx = gsap.context(() => {
      gsap.set(".maker__portrait img", { opacity: 0 })

      ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: "+=100%",
        pin: true,
        scrub: 0.7,
        onEnter: () => {
          // Hero faded the main metal layer to 0 for the corner-orb handoff.
          // The Maker pool runs in its own canvas, but the LiquidSphere main
          // canvas is restored here in case the user reloads mid-page and
          // later scrolls back into Hero.
          const ml = document.querySelector<HTMLElement>(".metal-layer")
          if (ml) ml.style.opacity = "1"
        },
        onUpdate: (self) => {
          revealRef.current = self.progress
        },
      })

      // Portrait fades in as the mercury head sinks back into the pool —
      // resolve to opacity 1 by ~70% of the pin scroll so the final 30%
      // is the photo holding still against the settled basin.
      gsap.to(".maker__portrait img", {
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "+=70%",
          scrub: 0.7,
        },
      })

      gsap.fromTo(
        ".maker__left > *, .maker__right > *",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
          stagger: 0.08,
          scrollTrigger: { trigger: root, start: "top 55%" },
        },
      )
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={rootRef} className="maker" aria-label="About">
      <div className="maker__left">
        <h2 className="maker__head">
          <span className="line-mask">
            <span className="line-inner">Forged in</span>
          </span>
          <span className="line-mask">
            <span className="line-inner chrome-text">code</span>
          </span>
        </h2>
        <p>
          I build complex, data-intensive interfaces: dashboards, desktop
          applications, and customer-facing products for clients spanning
          various industries and the enterprise space.
        </p>
        <p>
          AI assistance is genuinely part of my process, not something I lean on
          as a crutch. It's woven in there to sharpen my decisions and maintain
          momentum without sacrificing quality or cutting corners.
        </p>
      </div>

      <div className="maker__portrait">
        <img
          src="/images/no-bg.png"
          alt="Portrait of Kamil Pinas, Frontend Software Engineer"
          width={800}
          height={747}
          loading="lazy"
          decoding="async"
        />
        <MakerLiquid revealRef={revealRef} />
      </div>

      <div className="maker__right">
        <div className="maker__studs">
          {STATS.map((s) => (
            <span className="maker__stud" key={s.label}>
              <b>{s.value}</b>
              <i>{s.label}</i>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
