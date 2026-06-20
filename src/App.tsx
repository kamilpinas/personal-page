import { useCallback, useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Lenis from "lenis"
import { Preloader } from "./components/Preloader"
import { Hero } from "./components/Hero"
import { REDUCED_MOTION } from "./motion"
import { LiquidSphere } from "./webgl/LiquidSphere"
import type { SphereParams } from "./webgl/LiquidSphere"

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const [ignited, setIgnited] = useState(false)
  const [loading, setLoading] = useState(true)
  // shared scroll-synced state for all sections — each section reads only
  // the fields it needs; everything renders in its own canvas
  const sphere = useRef<SphereParams>({
    intro: 0,
    stream: 1,
    head: 0,
    rise: 0,
    orbX: 0,
    orbY: 0,
    orbScale: 1,
    maze: 0,
    mazeNodes: new Float32Array(16),
    nodeCount: 0,
    headX: 0,
    headY: 0,
    viewTopY: 1.6,
    pool: 0,
    finale: 0,
    morph: 0,
  })

  const handleIgnite = useCallback(() => setIgnited(true), [])
  const handleDone = useCallback(() => setLoading(false), [])

  // smooth scroll starts only once the metal has ignited
  useEffect(() => {
    if (loading) return
    if (REDUCED_MOTION) return

    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
    lenis.on("scroll", ScrollTrigger.update)
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    ScrollTrigger.refresh()
    ;(window as unknown as { __lenis?: Lenis }).__lenis = lenis

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      delete (window as unknown as { __lenis?: Lenis }).__lenis
    }
  }, [loading])

  // hold the scroll while the metal ignites
  useEffect(() => {
    const lock = loading ? "hidden" : ""
    document.documentElement.style.overflow = lock
    document.body.style.overflow = lock
    return () => {
      document.documentElement.style.overflow = ""
      document.body.style.overflow = ""
    }
  }, [loading])

  return (
    <>
      <div className="studio" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />

      <div className="metal-layer" aria-hidden="true">
        <div className="metal-pos">
          <LiquidSphere params={sphere} />
        </div>
      </div>

      {loading && (
        <Preloader
          params={sphere}
          onIgnite={handleIgnite}
          onDone={handleDone}
        />
      )}

      <Hero ignited={ignited} params={sphere} />
    </>
  )
}
