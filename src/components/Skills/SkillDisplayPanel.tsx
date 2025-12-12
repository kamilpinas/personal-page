import React from "react"
import { Skill } from "../../lib/skills"
import { iconMap } from "../../lib/icons"
import { useTranslation } from "react-i18next"

interface SkillDisplayPanelProps {
  selectedSkill: Skill | null
  filteredSkills: Skill[]
  selectedCategory: string
  onSkillClick: (skillId: string) => void
}

export const SkillDisplayPanel: React.FC<SkillDisplayPanelProps> = ({
  selectedSkill,
}) => {
  const { t } = useTranslation()

  if (!selectedSkill) {
    return (
      <div className="p-6 rounded-lg flex items-center justify-center h-full">
        <p className="text-sm sm:text-base text-silver-400">
          {t("skillsPage.details.selectSkill")}
        </p>
      </div>
    )
  }

  const Icon = iconMap[selectedSkill.icon]

  return (
    <div className="rounded-lg h-full overflow-y-auto flex flex-col justify-center">
      <div className="flex items-center gap-4 mb-4">
        {Icon && <Icon className="w-6 h-6 text-silver-300" />}
        <h2 className="text-lg font-bold text-silver-300">
          {selectedSkill.name}
        </h2>
      </div>
      <p className="text-sm  text-silver-400 mb-4">
        {selectedSkill.description}
      </p>

      {selectedSkill.highlights && (
        <div className="mb-4">
          <h3 className="font-bold text-base text-silver-300">
            {t("skillsPage.details.highlights")}
          </h3>
          <ul className="list-disc list-inside text-sm text-silver-400">
            {selectedSkill.highlights.map((highlight, index) => (
              <li key={index}>{highlight}</li>
            ))}
          </ul>
        </div>
      )}
      {selectedSkill.links && (
        <div>
          <h3 className="font-bold text-base text-silver-300">
            {t("skillsPage.details.links")}
          </h3>
          <ul className="text-sm  text-silver-400">
            {selectedSkill.links.map((link, index) => (
              <li key={index}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-silver-200 underline"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
