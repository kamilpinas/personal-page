import { useEffect, useRef } from "react"
import gsap from "gsap"
import { REDUCED_MOTION } from "../motion"
import type { SphereParams } from "../webgl/LiquidSphere"
import { CastingsLiquid } from "../webgl/sections/CastingsLiquid"

type Project = {
  key: string
  title: string
  tag: string
  desc: string
  video: string
  poster: string
  tech: string[]
  link?: string
  extensionLink?: string
}

const PROJECTS: Project[] = [
  {
    key: "senior-browse",
    title: "SeniorBrowse",
    tag: "Browser extension + website",
    desc: "A Chrome extension that turns the browser into a calm, safe space for seniors — a simplified homepage with large shortcut tiles, one-tap text sizing, a helper panel on every page, and scam/phishing-site blocking. Caregivers get PIN-protected settings, ad removal, download limits and activity logs through a 5-minute setup wizard. I built both the extension and its marketing website.",
    video: "/movies/senior-browse.mp4",
    poster: "/images/senior-browse.png",
    tech: [
      "React",
      "TypeScript",
      "Manifest V3",
      "Chrome Extension API",
      "Cloudflare Workers",
    ],
    link: "https://senior-browse.kamilpinas.workers.dev/",
    extensionLink:
      "https://chromewebstore.google.com/detail/seniorbrowse/pkmalnikjbfdeomlekjfidpidmamefkn",
  },
  {
    key: "mini-bouncer",
    title: "Mini Bouncer",
    tag: "Event rental platform",
    desc: "A high-performance landing page for a boutique event-rental business — smooth motion, mobile-first, conversion-optimized.",
    video: "/movies/mini-bouncer.mp4",
    poster: "/images/mini-bouncer.png",
    tech: [
      "React",
      "TypeScript",
      "Vite",
      "Framer Motion",
      "EmailJS",
      "Cloudflare",
    ],
    link: "https://mini-bouncer.com",
  },
  {
    key: "duke-flooring",
    title: "Duke Flooring",
    tag: "Studio website",
    desc: "A sleek, modern site for a flooring company — built to showcase products with strong visual appeal and a fast, mobile-first experience.",
    video: "/movies/dukeflooring.mp4",
    poster: "/images/duke.jpg",
    tech: [
      "React",
      "TypeScript",
      "Vite",
      "Tailwind",
      "Framer Motion",
      "Swiper",
    ],
    link: "https://dukeflooring.com/",
  },
  {
    key: "przysnilo",
    title: "Przyśniło.się",
    tag: "Full-stack dream journal",
    desc: "A platform to record, share and explore dreams — JWT auth, voting, comments, Chart.js stats, image uploads and email notifications.",
    video: "/movies/przysnilo.mp4",
    poster: "/images/przysnilo.jpg",
    tech: ["React", "TypeScript", "Node", "Express", "Prisma", "JWT"],
  },
  {
    key: "haruoto",
    title: "Haruoto",
    tag: "Restaurant web app",
    desc: "A vibrant site for a Japanese restaurant with an interactive menu and a seamless online reservation system.",
    video: "/movies/haruoto.mp4",
    poster: "/images/haruoto.jpg",
    tech: [
      "React",
      "TypeScript",
      "Node",
      "Express",
      "Prisma",
      "Chart.js",
      "JWT",
    ],
    link: "https://haruoto.pages.dev/",
  },
  {
    key: "modular",
    title: "Modular",
    tag: "Furniture configurator",
    desc: "A customizable modular furniture store — users design and visualize their own furniture configurations in real time.",
    video: "/movies/modular.mp4",
    poster: "/images/modular.jpg",
    tech: ["React", "TypeScript", "Vite", "Tailwind", "Framer Motion"],
    link: "https://modular-home.pages.dev/",
  },
]

type Props = {
  params: React.MutableRefObject<SphereParams>
}

export function Castings({ params }: Props) {
  const rootRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef(0)

  useEffect(() => {
    const root = rootRef.current
    const track = trackRef.current
    if (!root || !track) return

    const panels = gsap.utils.toArray<HTMLElement>(".casting", root)
    const videos = panels.map((p) => p.querySelector("video"))
    const isMobile = window.innerWidth < 860

    if (REDUCED_MOTION || isMobile) {
      // vertical stacked fallback — no pin, no horizontal scroll
      panels.forEach((p) => {
        gsap.fromTo(
          p,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            scrollTrigger: { trigger: p, start: "top 80%" },
          },
        )
      })
      videos.forEach((v) => v && v.play().catch(() => {}))
      // in stacked layout each project sits at its own DOM Y
      ;(
        window as unknown as { __gotoProject?: (key: string) => void }
      ).__gotoProject = (key) => {
        const idx = PROJECTS.findIndex((p) => p.key === key)
        if (idx < 0) return
        panels[idx]?.scrollIntoView({ behavior: "smooth", block: "start" })
      }
      return () => {
        delete (window as unknown as { __gotoProject?: (key: string) => void })
          .__gotoProject
      }
    }

    let activeIdx = -1
    const setActive = (idx: number) => {
      if (idx === activeIdx) return
      activeIdx = idx
      panels.forEach((p, i) => {
        const on = i === idx
        p.classList.toggle("cast", on)
        const v = videos[i]
        if (v) {
          if (on) v.play().catch(() => {})
          else v.pause()
        }
      })
    }

    const ctx = gsap.context(() => {
      const distance = () => track.scrollWidth - window.innerWidth
      let pinST: ScrollTrigger | null = null

      // expose a scroller other sections can call to jump to a project.
      // pinned section: ScrollTrigger rewrites .offsetTop, so use its start/end
      ;(
        window as unknown as { __gotoProject?: (key: string) => void }
      ).__gotoProject = (key) => {
        const idx = PROJECTS.findIndex((p) => p.key === key)
        if (idx < 0 || !pinST) return
        const targetY =
          pinST.start +
          (idx / (PROJECTS.length - 1)) * (pinST.end - pinST.start)
        const lenis = (
          window as unknown as {
            __lenis?: {
              scrollTo: (
                y: number,
                o?: { duration?: number; immediate?: boolean },
              ) => void
            }
          }
        ).__lenis
        // prefer Lenis so smooth scroll integrates with ScrollTrigger; native fallback otherwise
        if (lenis?.scrollTo) {
          try {
            lenis.scrollTo(targetY, { duration: 1.4 })
          } catch {
            window.scrollTo({ top: targetY, behavior: "smooth" })
          }
        } else {
          window.scrollTo({ top: targetY, behavior: "smooth" })
        }
      }

      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: root,
          pin: true,
          scrub: 0.8,
          start: "top top",
          end: () => "+=" + distance(),
          invalidateOnRefresh: true,
          onEnter: () => {
            // no WebGL pool behind the projects — CastingsLiquid handles it
            params.current.pool = 0
            setActive(0)
          },
          onEnterBack: () => setActive(activeIdx < 0 ? 0 : activeIdx),
          onUpdate: (self) => {
            const p = self.progress
            setActive(Math.round(p * (PROJECTS.length - 1)))
            progressRef.current = p
          },
        },
      })
      pinST = tween.scrollTrigger ?? null
    }, root)

    return () => {
      delete (window as unknown as { __gotoProject?: (key: string) => void })
        .__gotoProject
      ctx.revert()
    }
  }, [params])

  return (
    <section ref={rootRef} className="castings" aria-label="Projects">
      <div className="castings__head">
        <h2>
          <span className="line-mask">
            <span className="line-inner">
              Cast <span className="chrome-text">Works</span>
            </span>
          </span>
        </h2>
      </div>

      <div className="castings__track" ref={trackRef}>
        {PROJECTS.map((p, i) => (
          <article className="casting" key={p.title}>
            <div className="casting__media">
              <div className="casting__bezel">
                <video
                  src={p.video}
                  poster={p.poster}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  aria-label={`${p.title} — ${p.tag} demo`}
                />
              </div>
            </div>

            <div className="casting__info">
              <span className="casting__index">
                {String(i + 1).padStart(2, "0")} /{" "}
                {String(PROJECTS.length).padStart(2, "0")}
              </span>
              <span className="casting__tag">{p.tag}</span>
              <h3 className="casting__title">{p.title}</h3>
              <p className="casting__desc">{p.desc}</p>
              <div className="casting__tech">
                {p.tech.map((t) => (
                  <span className="chip" key={t}>
                    {t}
                  </span>
                ))}
              </div>
              <div className="casting__links">
                {p.link && (
                  <a
                    className="casting__link"
                    href={p.link}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {p.extensionLink ? "Visit website" : "Visit live"}{" "}
                    <span aria-hidden="true">↗</span>
                  </a>
                )}
                {p.extensionLink && (
                  <a
                    className="casting__link"
                    href={p.extensionLink}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Chrome extension <span aria-hidden="true">↗</span>
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      <CastingsLiquid progressRef={progressRef} count={PROJECTS.length} />
    </section>
  )
}
