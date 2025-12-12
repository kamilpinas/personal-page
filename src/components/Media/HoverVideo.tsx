import { useRef, useEffect, useCallback } from "react"
import { useInView } from "react-intersection-observer"
import { twMerge } from "tailwind-merge"
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion"

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
  const prefersReducedMotion = usePrefersReducedMotion()
  const videoRef = useRef<HTMLVideoElement>(null)
  const posterRef = useRef<HTMLImageElement>(null)
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const handleInteraction = useCallback(
    (play: boolean) => {
      if (prefersReducedMotion || !videoRef.current) {
        return
      }
      if (play) {
        videoRef.current.play().catch((error) => {
          console.error("Error attempting to play video:", error)
        })
      } else {
        videoRef.current.pause()
        videoRef.current.currentTime = 0
      }
    },
    [prefersReducedMotion]
  )

  useEffect(() => {
    handleInteraction(isPlaying)
  }, [isPlaying, handleInteraction])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handlePlay = () => {
      if (posterRef.current) {
        posterRef.current.style.opacity = "0"
      }
    }
    const handlePause = () => {
      if (posterRef.current) {
        posterRef.current.style.opacity = "1"
      }
    }

    video.addEventListener("play", handlePlay)
    video.addEventListener("pause", handlePause)

    return () => {
      video.removeEventListener("play", handlePlay)
      video.removeEventListener("pause", handlePause)
    }
  }, [inView])

  return (
    <div ref={ref} className="absolute inset-0 h-full w-full">
      {inView && (
        <video
          ref={videoRef}
          className={twMerge(
            `absolute inset-0 h-full w-full object-cover ${
              isWide ? "lg:p-4 lg:md:p-6 " : ""
            }`,
            videoClassName
          )}
          poster={posterSrc}
          preload="metadata"
          playsInline
          muted
          loop
        >
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      <img
        ref={posterRef}
        src={posterSrc}
        alt={alt}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
          isWide ? "lg:p-4 lg:md:p-6 " : ""
        }`}
        loading="lazy"
      />
    </div>
  )
}
