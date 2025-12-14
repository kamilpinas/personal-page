import React, { useState, useMemo, useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"
import { getSkills } from "../lib/skills"
import { SkillBubbleChart } from "../components/Skills/SkillBubbleChart"
import { SkillLegend } from "../components/Skills/SkillLegend"
import { SkillDisplayPanel } from "../components/Skills/SkillDisplayPanel"
import PageMeta from "../components/SEO/PageMeta"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronUp } from "lucide-react"

const categoryMap: Record<string, string> = {
  all: "skillsPage.categories.all",
  "core-programming": "skillsPage.categories.core-programming",
  "frontend-development": "skillsPage.categories.frontend-development",
  "devops-and-tools": "skillsPage.categories.devops-and-tools",
  "ui-ux": "skillsPage.categories.ui-ux",
}

const SkillsPage: React.FC = () => {
  const { t } = useTranslation()
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [showBackToTop, setShowBackToTop] = useState(false)
  const detailsRef = useRef<HTMLDivElement>(null)

  const allSkills = useMemo(() => getSkills(t), [t])

  const handleSkillClick = (skillId: string) => {
    setSelectedSkillId(skillId)
    if (detailsRef.current) {
      detailsRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  const selectedSkill = useMemo(() => {
    return allSkills.find((skill) => skill.id === selectedSkillId) || null
  }, [selectedSkillId, allSkills])

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

  const handleScroll = () => {
    const isScrollable =
      document.documentElement.scrollHeight >
      document.documentElement.clientHeight
    if (window.scrollY > 200 && isScrollable) {
      setShowBackToTop(true)
    } else {
      setShowBackToTop(false)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll)
    window.addEventListener("resize", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleScroll)
    }
  }, [])

  return (
    <>
      <PageMeta
        titleKey="skillsPage.meta.title"
        descriptionKey="skillsPage.meta.description"
        pageName="skillsPage"
      />
      <div className="relative min-h-[85svh] md:min-h-[85dvh] w-full p-0 flex flex-col">
        <div className="w-full h-full grid grid-cols-1 md:grid-cols-3 py-4 flex-grow">
          <div className="flex flex-col md:col-span-2 h-full">
            <SkillLegend
              categories={categoriesForDisplay}
              selectedCategory={t(categoryMap[selectedCategory])}
              onSelectCategory={(translatedCategoryName) => {
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
          <div className="flex flex-col md:col-span-1 h-full" ref={detailsRef}>
            <SkillDisplayPanel
              selectedSkill={selectedSkill}
              filteredSkills={filteredSkills}
              selectedCategory={selectedCategory}
              onSkillClick={handleSkillClick}
            />
          </div>
        </div>
        <AnimatePresence>
          {showBackToTop && (
            <motion.button
              onClick={scrollToTop}
              className="fixed bottom-10 right-10 bg-silver-400 text-bg p-2 rounded-full shadow-lg hover:bg-gray-100 animate-bounce"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
            >
              <ChevronUp />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

export default SkillsPage
