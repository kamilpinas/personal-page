import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { GlowCard } from "../UI/GlowCard"
import { HoverVideo } from "../Media/HoverVideo"
import { Tile } from "../../types"
import { Icon } from "../UI/Icon"

interface BentoTileProps {
  tile: Tile
  i: number
  hoveredCard: string | null
  setHoveredCard: (id: string | null) => void
}

export function BentoTile({
  tile,
  i,
  hoveredCard,
  setHoveredCard,
}: BentoTileProps) {
  const { to, title, staticSrc, videoSrc, wide, icon, id } = tile

  const isHovered = hoveredCard === id
  const isAnyHovered = hoveredCard !== null
  const opacity = isAnyHovered ? (isHovered ? 1 : 0.4) : 1
  const isPlaying = hoveredCard === null || isHovered // This is the core logic change

  const textContent = (
    <div
      className={`relative z-10 flex flex-col justify-start h-full w-full to-transparent pointer-events-none ${
        wide ? "lg:w-2/5" : ""
      }`}
    >
      <div className="p-4">
        <div className="flex items-center gap-3">
          {icon && <Icon icon={icon} className="h-6 w-6 text-silver-300" />}
          <h3 className="text-lg md:text-xl font-bold text-white">{title}</h3>
        </div>
      </div>
    </div>
  )

  return (
    <motion.div
      className={`div-${i + 1}`}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      onMouseEnter={() => setHoveredCard(id)}
    >
      <Link to={to} className="group block h-full">
        <GlowCard
          className="relative flex h-full flex-row lg:flex-col justify-between overflow-hidden transition-opacity duration-500"
          style={{ opacity }}
        >
          <HoverVideo
            posterSrc={staticSrc}
            videoSrc={videoSrc}
            alt={title}
            isPlaying={isPlaying} // Pass the new isPlaying prop
          />
          {textContent}
        </GlowCard>
      </Link>
    </motion.div>
  )
}
