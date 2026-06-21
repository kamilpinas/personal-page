import { useEffect, useRef } from "react"
import gsap from "gsap"
import { REDUCED_MOTION } from "../motion"
import { IconGithub, IconLinkedin, IconWhatsapp } from "./icons"

const SOCIAL_LINKS = [
  { label: "GitHub", href: "https://github.com/kamilpinas", Icon: IconGithub },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/kamil-pinas",
    Icon: IconLinkedin,
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/48730697499",
    Icon: IconWhatsapp,
  },
]

type Props = {
  ignited: boolean
}

export function TopBar({ ignited }: Props) {
  const topbarRef = useRef<HTMLDivElement>(null)
  const mobileBarRef = useRef<HTMLDivElement>(null)

  // fade in alongside the hero name reveal, same timing as the rest of its
  // intro-hide elements — kept separate from Hero's own GSAP context because
  // this bar now lives outside Hero to escape its local stacking context
  // (otherwise .forge/.castings, later in the DOM at the same z-index as
  // .hero, would swallow clicks once scrolled over the fixed bar)
  useEffect(() => {
    if (!ignited) return
    const targets = [topbarRef.current, mobileBarRef.current].filter(Boolean)
    if (REDUCED_MOTION) {
      gsap.set(targets, { opacity: 1 })
      return
    }
    gsap.to(targets, { opacity: 1, duration: 0.9, delay: 1.2 })
  }, [ignited])

  useEffect(() => {
    const bar = mobileBarRef.current
    const offer = document.querySelector(".offer")
    if (!bar || !offer) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        bar.classList.toggle("hero__mobile-bar--hidden", entry.isIntersecting)
      },
      { threshold: 0.15 },
    )
    observer.observe(offer)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <div ref={topbarRef} className="hero__topbar intro-hide">
        <a className="hero__contact" href="mailto:kamilpinas@gmail.com">
          kamilpinas@gmail.com
        </a>
        <a
          className="hero__cv-link"
          href="/CV_ENG.pdf"
          download
          aria-label="Download CV (English, PDF)"
        >
          CV
        </a>
        <div className="hero__socials">
          {SOCIAL_LINKS.map(({ label, href, Icon }) => (
            <a
              key={label}
              className="hero__social-icon"
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
            >
              <Icon className="hero__social-icon-svg" />
            </a>
          ))}
        </div>
      </div>

      <div ref={mobileBarRef} className="hero__mobile-bar intro-hide">
        <a
          className="hero__cv-link"
          href="/CV_ENG.pdf"
          download
          aria-label="Download CV (English, PDF)"
        >
          CV
        </a>
        <div className="hero__socials">
          {SOCIAL_LINKS.map(({ label, href, Icon }) => (
            <a
              key={label}
              className="hero__social-icon"
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
            >
              <Icon className="hero__social-icon-svg" />
            </a>
          ))}
        </div>
      </div>
    </>
  )
}
