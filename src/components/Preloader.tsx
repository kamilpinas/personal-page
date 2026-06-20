import { useEffect, useRef } from "react"
import gsap from "gsap"
import { REDUCED_MOTION } from "../motion"
import type { SphereParams } from "../webgl/LiquidSphere"

type Props = {
  params: React.MutableRefObject<SphereParams>
  onIgnite: () => void // fired as the stream is swallowed — hero pour overlaps
  onDone: () => void
}

export function Preloader({ params, onIgnite, onDone }: Props) {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    if (REDUCED_MOTION) {
      params.current.intro = 1
      params.current.stream = 0
      onIgnite()
      onDone()
      return
    }

    const counterEl = root.querySelector(".preloader__counter")
    const counter = { v: 0 }

    const tl = gsap.timeline({ onComplete: onDone })

    // out of nothing: the first drip falls from the top edge —
    // unhurried, the same viscous pace as the pour it leads
    tl.to(params.current, {
      head: 1,
      duration: 1.25,
      ease: "power1.in",
    })
      // …then the pour: counter 0→100 fills the sphere from the stream
      .to(counter, {
        v: 100,
        duration: 2.1,
        ease: "power1.inOut",
        onUpdate: () => {
          params.current.intro = counter.v / 100
          if (counterEl)
            counterEl.textContent = String(Math.round(counter.v)).padStart(
              3,
              "0",
            )
        },
      })
      // pour complete — the last of the stream is swallowed by the sphere
      .to(
        params.current,
        { stream: 0, duration: 0.7, ease: "power2.in" },
        ">-0.1",
      )
      .add(() => onIgnite(), "<+0.35")
      .to(root, { opacity: 0, duration: 0.5, ease: "power2.out" }, "<")

    return () => {
      tl.kill()
    }
  }, [params, onIgnite, onDone])

  return (
    <div ref={rootRef} className="preloader">
      <div className="preloader__counter">000</div>
    </div>
  )
}
