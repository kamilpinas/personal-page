import React from "react"
import { Chip } from "../UI/Chip"
// import { SkillCategory } from "../../lib/skills" // SkillCategory is no longer directly used here for type

interface SkillLegendProps {
  categories: string[] // Now contains translated category names
  selectedCategory: string // Now receives a translated category name
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
            label={category} // Use the already translated category name
            isActive={selectedCategory === category} // Compare with translated selectedCategory
            onClick={() => onSelectCategory(category)}
          />
        ))}
      </div>
    </div>
  )
}
