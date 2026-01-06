import { useRef, useEffect } from "react"
import { useInView } from "react-intersection-observer"
import { twMerge } from "tailwind-merge"

interface HoverVideoProps {
  isWide?: boolean
  posterSrc: string
  videoSrc: string
  alt: string
  isPlaying: boolean
  videoClassName?: string
}

export function HoverVideo({
  isWide,
  posterSrc,
  videoSrc,
  alt,
  isPlaying,
  videoClassName,
}: HoverVideoProps) {
  const posterRef = useRef<HTMLImageElement>(null)

  const { ref: inViewRef } = useInView({
    triggerOnce: true,
    threshold: 0,
    rootMargin: "200px",
  })

  const internalVideoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    const video = internalVideoRef.current
    if (!video) return

    if (isPlaying) {
      video.play().catch(() => {})
    } else {
      video.pause()
      video.currentTime = 0
    }
  }, [isPlaying])

  const handleOnPlay = () => {
    if (posterRef.current) posterRef.current.style.opacity = "0"
  }

  const handleOnPause = () => {
    if (posterRef.current) posterRef.current.style.opacity = "1"
  }

  return (
    <div ref={inViewRef} className="absolute inset-0 h-full w-full bg-gray-900">
      {
        <video
          ref={internalVideoRef}
          className={twMerge(
            `absolute inset-0 h-full w-full object-cover ${
              isWide ? "lg:p-4 lg:md:p-6" : ""
            }`,
            videoClassName
          )}
          poster={posterSrc}
          preload="metadata"
          playsInline
          muted
          loop
          onPlay={handleOnPlay}
          onPause={handleOnPause}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      }

      <img
        ref={posterRef}
        src={posterSrc}
        alt={alt}
        className={`pointer-events-none absolute inset-0 z-10 h-full w-full object-cover transition-opacity duration-500 ${
          isWide ? "lg:p-4 lg:md:p-6" : ""
        }`}
        loading="lazy"
      />
    </div>
  )
}
