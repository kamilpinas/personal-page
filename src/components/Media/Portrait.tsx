import React from "react"

interface PortraitProps {
  src: string
  alt: string
  loading?: "lazy" | "eager"
}

const Portrait: React.FC<PortraitProps> = ({ src, alt, loading = "lazy" }) => {
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const rotateX = (y / rect.height - 0.5) * -12
    const rotateY = (x / rect.width - 0.5) * 12
    e.currentTarget.style.setProperty("--rotate-x", `${rotateX}deg`)
    e.currentTarget.style.setProperty("--rotate-y", `${rotateY}deg`)
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.setProperty("--rotate-x", "0deg")
    e.currentTarget.style.setProperty("--rotate-y", "0deg")
  }

  return (
    <div
      style={{ perspective: "1000px" }}
      className="group relative aspect-[3/4] w-[min(90%,640px)] max-w-full rounded-2xl overflow-hidden from-white/5 to-white/2  transition-shadow duration-300 focus-visible:ring-2 focus-visible:ring-silver-400/40 focus-visible:outline-none"
    >
      <div
        className="h-full w-full transition-transform duration-500 ease-out motion-safe:group-hover:[transform:rotateX(var(--rotate-x,0))_rotateY(var(--rotate-y,0))_translateZ(20px)]"
        style={{ transformStyle: "preserve-3d" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <img
          src={src}
          alt={alt}
          loading={loading}
          className="h-full w-full object-cover select-none drop-shadow-[0_0_5px_#C0C0C0] hover:drop-shadow-[0_0_10px_#C0C0C0] transition-all duration-500"
        />
      </div>
    </div>
  )
}

export default Portrait
