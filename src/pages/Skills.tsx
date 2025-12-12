import React, { useState, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { getSkills } from "../lib/skills"
import { SkillBubbleChart } from "../components/Skills/SkillBubbleChart"
import { SkillLegend } from "../components/Skills/SkillLegend"
import { SkillDisplayPanel } from "../components/Skills/SkillDisplayPanel"
import PageMeta from "../components/SEO/PageMeta" // Import PageMeta

// Map internal SkillCategory values to translation keys
const categoryMap: Record<string, string> = {
  all: "skillsPage.categories.all",
  "core-programming": "skillsPage.categories.core-programming",
  "react-ecosystem": "skillsPage.categories.react-ecosystem",
  "ui-ux": "skillsPage.categories.ui-ux",
  "dev-workflow": "skillsPage.categories.dev-workflow",
  utilities: "skillsPage.categories.utilities",
}

const SkillsPage: React.FC = () => {
  const { t } = useTranslation()
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const allSkills = useMemo(() => getSkills(t), [t])

  const handleSkillClick = (skillId: string) => {
    setSelectedSkillId(skillId)
  }

  const selectedSkill = useMemo(() => {
    return allSkills.find((skill) => skill.id === selectedSkillId) || null
  }, [selectedSkillId, allSkills])

  // Generate categories with translated names for display
  const categoriesForDisplay = useMemo(() => {
    const uniqueCategories = [
      "all",
      ...new Set(allSkills.map((skill) => skill.category)),
    ]

    const translatedCategories = uniqueCategories.map((cat) =>
      t(categoryMap[cat])
    )
    return [...new Set(translatedCategories)]
  }, [allSkills, t])

  const filteredSkills = useMemo(() => {
    if (selectedCategory === "all") {
      return allSkills
    }
    return allSkills.filter((skill) => skill.category === selectedCategory)
  }, [selectedCategory, allSkills])

  return (
    <>
      <PageMeta
        titleKey="skillsPage.meta.title"
        descriptionKey="skillsPage.meta.description"
        pageName="skillsPage"
      />
      <div className="relative min-h-[85svh] md:min-h-[85dvh] w-full p-0 flex flex-col">
        <div className="w-full h-full grid grid-cols-1 md:grid-cols-3 gap-8 p-8 flex-grow">
          <div className="flex flex-col md:col-span-2 h-full">
            <SkillLegend
              categories={categoriesForDisplay} // Pass translated names for display
              selectedCategory={t(categoryMap[selectedCategory])} // Pass translated name for selected category
              onSelectCategory={(translatedCategoryName) => {
                // Find the original SkillCategory from the translated name
                const originalCategory = Object.keys(categoryMap).find(
                  (key) => t(categoryMap[key]) === translatedCategoryName
                )
                if (originalCategory) {
                  setSelectedCategory(originalCategory)
                  setSelectedSkillId(null)
                }
              }}
            />
            <div className="flex-grow min-h-[30rem]">
              <SkillBubbleChart
                skills={filteredSkills}
                onSkillClick={handleSkillClick}
                activeSkillId={selectedSkillId}
              />
            </div>
          </div>
          <div className="flex flex-col gap-8 md:col-span-1 h-full">
            <SkillDisplayPanel
              selectedSkill={selectedSkill}
              filteredSkills={filteredSkills}
              selectedCategory={selectedCategory}
              onSkillClick={handleSkillClick}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default SkillsPage
