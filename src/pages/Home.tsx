import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { BentoGrid } from "../components/Bento/BentoGrid"
import { BentoTile } from "../components/Bento/BentoTile"
import { getTilesData } from "../lib/tiles"
import PageMeta from "../components/SEO/PageMeta" // Import PageMeta

export default function HomePage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const { t } = useTranslation()
  const { lng } = useParams()
  const TILES_DATA = getTilesData(t, lng || "en")

  return (
    <>
      <PageMeta
        titleKey="homePage.meta.title"
        descriptionKey="homePage.meta.description"
        pageName="homePage"
      />
      <main
        className="flex h-[80vh] flex-col items-center justify-center w-full"
        onMouseLeave={() => setHoveredCard(null)}
      >
        <BentoGrid>
          {TILES_DATA.map((tile, i) => (
            <BentoTile
              key={tile.id}
              tile={tile}
              i={i}
              hoveredCard={hoveredCard}
              setHoveredCard={setHoveredCard}
            />
          ))}
        </BentoGrid>
      </main>
    </>
  )
}
