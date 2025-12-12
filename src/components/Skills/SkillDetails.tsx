import React from "react"
import { Skill } from "../../lib/skills"
import { iconMap } from "../../lib/icons"

interface SkillDetailsProps {
  skill: Skill | null
}

export const SkillDetails: React.FC<SkillDetailsProps> = ({ skill }) => {
  if (!skill) {
    return (
      <div className="p-6 bg-surface-2 rounded-lg flex items-center justify-center h-full">
        <p className="text-silver-400">Select a skill to see details</p>
      </div>
    )
  }

  const Icon = iconMap[skill.icon]

  return (
    <div className="p-6 bg-surface-2 rounded-lg h-full overflow-y-auto">
      <div className="flex items-center gap-4 mb-4">
        {Icon && <Icon className="w-8 h-8 text-silver-300" />}
        <h2 className="text-2xl font-bold text-silver-300">{skill.name}</h2>
      </div>
      <p className="text-silver-400 mb-4">{skill.description}</p>

      {skill.highlights && (
        <div className="mb-4">
          <h3 className="font-bold text-silver-300 mb-2">Highlights</h3>
          <ul className="list-disc list-inside text-silver-400">
            {skill.highlights.map((highlight, index) => (
              <li key={index}>{highlight}</li>
            ))}
          </ul>
        </div>
      )}
      {skill.links && (
        <div>
          <h3 className="font-bold text-silver-300 mb-2">Links</h3>
          <ul className="text-silver-400">
            {skill.links.map((link, index) => (
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
