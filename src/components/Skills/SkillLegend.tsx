import React from "react"
import { Chip } from "../UI/Chip"

interface SkillLegendProps {
  categories: string[]
  selectedCategory: string
  onSelectCategory: (category: string) => void
}

export const SkillLegend: React.FC<SkillLegendProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((category) => (
          <Chip
            key={category}
            label={category}
            isActive={selectedCategory === category}
            onClick={() => onSelectCategory(category)}
          />
        ))}
      </div>
    </div>
  )
}
