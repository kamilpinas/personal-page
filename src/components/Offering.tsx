import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { REDUCED_MOTION } from "../motion"
import type { SphereParams } from "../webgl/LiquidSphere"
import OfferingLiquid from "../webgl/sections/OfferingLiquid"

const SOCIALS = [
  { label: "GitHub", href: "https://github.com/kamilpinas" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/kamil-pinas" },
  { label: "WhatsApp", href: "https://wa.me/48730697499" },
]

type Props = {
  params: React.MutableRefObject<SphereParams>
}

export function Offering({ params }: Props) {
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root || REDUCED_MOTION) return

    const ctx = gsap.context(() => {
      // the metal coalesces back into the source sphere as the finale lands
      ScrollTrigger.create({
        trigger: root,
        start: "top 60%",
        onEnter: () => {
          // metal re-forms as a sphere, then squares into the block
          gsap.to(params.current, {
            finale: 1,
            duration: 0.9,
            ease: "power2.out",
          })
          gsap.to(params.current, {
            morph: 1,
            duration: 1.1,
            delay: 0.7,
            ease: "power2.inOut",
          })
        },
        onLeaveBack: () => {
          gsap.to(params.current, { finale: 0, morph: 0, duration: 0.6 })
        },
      })

      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: "top 60%" },
      })
      tl.fromTo(
        ".offer__title .line-inner",
        { yPercent: 115 },
        { yPercent: 0, duration: 1, ease: "power3.out", stagger: 0.12 },
      )
        .add(() => {
          root
            .querySelectorAll(".offer__title .sheen-host")
            .forEach((el, i) =>
              setTimeout(() => el.classList.add("sheen-run"), i * 140),
            )
        }, "-=0.3")
        .fromTo(
          ".offer__reveal",
          { opacity: 0, y: 22 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", stagger: 0.1 },
          "-=0.4",
        )
    }, root)

    return () => ctx.revert()
  }, [params])

  return (
    <section ref={rootRef} className="offer" aria-label="Contact">
      <OfferingLiquid params={params} />
      <h2 className="offer__title">
        <span className="line-mask">
          <span className="line-inner">Pour it</span>
        </span>
        <span className="line-mask">
          <span
            className="line-inner sheen-host chrome-text"
            data-text="together"
          >
            together
          </span>
        </span>
      </h2>

      <p className="offer__sub offer__reveal">
        Available for B2B · 2-week notice · Open to remote
      </p>

      <a
        className="offer__email offer__reveal sheen-host"
        data-text="kamilpinas@gmail.com"
        href="mailto:kamilpinas@gmail.com"
      >
        kamilpinas@gmail.com
      </a>

      <div className="offer__cv offer__reveal">
        <a
          className="cv-btn"
          href="/CV_ENG.pdf"
          download
          aria-label="Download Kamil Pinas CV in English (PDF)"
        >
          <span className="cv-btn__k">CV</span> — English
        </a>
        <a
          className="cv-btn"
          href="/CV_PL.pdf"
          download
          aria-label="Download Kamil Pinas CV in Polish (PDF)"
        >
          <span className="cv-btn__k">CV</span> — Polski
        </a>
      </div>

      <div className="offer__socials offer__reveal">
        {SOCIALS.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target={s.href.startsWith("http") ? "_blank" : undefined}
            rel="noreferrer"
            className="stud"
          >
            {s.label}
          </a>
        ))}
      </div>
    </section>
  )
}
