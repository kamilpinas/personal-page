import React from "react"
import { Skill, SkillCategory } from "../../lib/skills"
import { iconMap } from "../../lib/icons"

interface SkillProgressBarListProps {
  skills: Skill[]

  selectedCategory: SkillCategory | "all"
  onSkillClick: (skillId: string) => void
}

export const SkillProgressBarList: React.FC<SkillProgressBarListProps> = ({
  skills,
  selectedCategory,
  onSkillClick,
}) => {
  return (
    <div className="p-4 bg-surface-2 rounded-lg">
      <h3 className="text-xl font-bold text-silver-300 mb-4">
        {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skills.map((skill) => {
          const Icon = iconMap[skill.icon]
          return (
            <div
              key={skill.id}
              className="flex items-center gap-4 p-3 bg-surface rounded-md cursor-pointer hover:bg-surface-2 transition-colors"
              onClick={() => onSkillClick(skill.id)}
            >
              {Icon && <Icon className="w-6 h-6 text-silver-300" />}
              <div className="flex-grow">
                <p className="text-silver-300 font-medium">{skill.name}</p>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div
                    className="bg-silver-400 h-2.5 rounded-full"
                    style={{ width: `${skill.proficiency}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
