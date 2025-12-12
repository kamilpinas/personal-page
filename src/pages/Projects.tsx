import CardSwap, { Card } from "@/components/Media/CardSwap"
import { useState, useRef, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { getProjects } from "../lib/projects"
import {
  SiReact,
  SiTypescript,
  SiVite,
  SiTailwindcss,
  SiFramer,
  SiSwiper,
  SiExpress,
  SiPrisma,
  SiNodedotjs,
  SiJsonwebtokens,
  SiAxios,
  SiChartdotjs,
  SiReactrouter,
} from "react-icons/si"
import PageMeta from "../components/SEO/PageMeta" // Import PageMeta

const TechIcon = ({ tech }: { tech: string }) => {
  const iconMap: { [key: string]: JSX.Element } = {
    React: <SiReact />,
    TypeScript: <SiTypescript />,
    Vite: <SiVite />,
    "Tailwind CSS": <SiTailwindcss />,
    "Framer Motion": <SiFramer />,
    Swiper: <SiSwiper />,
    Express: <SiExpress />,
    Prisma: <SiPrisma />,
    "Node.js": <SiNodedotjs />,
    JWT: <SiJsonwebtokens />,
    Axios: <SiAxios />,
    "Chart.js": <SiChartdotjs />,
    "React Router": <SiReactrouter />,
  }

  return iconMap[tech] || <span>{tech}</span>
}

export default function ProjectsPage() {
  const { t } = useTranslation()
  const [activeIndex, setActiveIndex] = useState(0)
  const projects = getProjects(t)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      if (entries[0]) {
        const { width } = entries[0].contentRect
        setDimensions({
          width: width,
          height: width * (9 / 16),
        })
      }
    })

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  return (
    <>
      <PageMeta
        titleKey="projectsPage.meta.title"
        descriptionKey="projectsPage.meta.description"
        pageName="projectsPage"
      />
      <main className="relative w-full h-full text-text">
        <div className="mx-auto h-full grid lg:grid-rows-1 grid-rows-2 grid-cols-2 lg:grid-cols-12 gap-6 px-4 lg:px-6 xl:px-8 py-[max(env(safe-area-inset-top),20px)]">
          <div className="col-span-6 lg:col-span-8 h-full flex items-center justify-center relative">
            <div
              ref={containerRef}
              className="absolute left-28 md:left-1/2 -translate-x-1/2 bottom-1/3 w-[100%] md:w-[60%] lg:w-[70%] h-auto max-w-full"
            >
              <CardSwap
                cardDistance={-30}
                verticalDistance={30}
                skewAmount={0}
                delay={7000}
                pauseOnHover={true}
                onCardChange={setActiveIndex}
                activeCardIndex={activeIndex}
                width={dimensions.width}
                height={dimensions.height}
              >
                {projects.map((project, index) => (
                  <Card key={index} isActive={index === activeIndex}>
                    {index === activeIndex ? (
                      <a
                        href={project.link}
                        key={index}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <video
                          src={project.clipSrc}
                          title={project.title}
                          className="object-cover w-full h-full bg-black"
                          autoPlay
                          loop
                          muted
                          playsInline
                        />
                      </a>
                    ) : (
                      <a
                        href={project.link}
                        key={index}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                                              <img
                                                className="object-cover w-full h-full brightness-75 bg-black"
                                                src={project.previewSrc}
                                                alt={project.title}
                                                loading="lazy"
                                              />                      </a>
                    )}
                  </Card>
                ))}
              </CardSwap>
            </div>
          </div>
          <div className="lg:col-span-4 col-span-6 flex flex-col justify-center gap-6">
            <h1 className="text-[clamp(28px,4vw,44px)] font-semibold tracking-tight text-silver-300">
              {projects[activeIndex].title}
            </h1>
            <p className="text-[clamp(14px,1.6vw,18px)] text-text-muted">
              {projects[activeIndex].description}
            </p>
            <a
              href={projects[activeIndex].link}
              key={activeIndex}
              target="_blank"
              rel="noopener noreferrer"
            >
              {projects[activeIndex].link && (
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-lg border border-silver-400/25 bg-white/[0.06] px-4 py-2.5 text-silver-300 hover:shadow-glow-silver focus-visible:ring-2 focus-visible:ring-silver-400/40 transition"
                >
                  {t("projectsPage.redirect")}
                </button>
              )}
            </a>
            <div>
              <h3 className="font-semibold text-silver-300 mb-2">
                {t("projectsPage.technologies")}
              </h3>
              <ul className="flex flex-wrap gap-4">
                {projects[activeIndex].technologies.map((tech, index) => (
                  <li key={index} className="text-4xl text-silver-300">
                    <TechIcon tech={tech} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
