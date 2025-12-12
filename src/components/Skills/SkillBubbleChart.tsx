import React, { useMemo } from "react"
import { hierarchy, pack } from "d3-hierarchy"
import { motion } from "framer-motion"
import { Skill } from "../../lib/skills"
import useResizeObserver from "use-resize-observer"

interface SkillBubbleChartProps {
  skills: Skill[]
  onSkillClick: (skillId: string) => void
  activeSkillId: string | null
}

interface SkillNode {
  id: string
  name?: string
  description?: string
  proficiency?: number
  children?: SkillNode[]
}

export const SkillBubbleChart: React.FC<SkillBubbleChartProps> = ({
  skills,
  onSkillClick,
  activeSkillId,
}) => {
  const { ref, width = 0, height = 0 } = useResizeObserver<HTMLDivElement>()

  const root = useMemo(() => {
    if (width === 0 || height === 0) {
      return null
    }
    const rootData: SkillNode = {
      id: "root",
      children: skills.map((skill) => ({
        id: skill.id,
        name: skill.name,
        description: skill.description,
        proficiency: skill.proficiency,
      })),
    }
    const packLayout = pack<SkillNode>().size([
      Math.max(1, width),
      Math.max(1, height),
    ])

    return packLayout(hierarchy(rootData).sum((d) => d.proficiency || 0))
  }, [skills, width, height])

  if (!root) {
    return <div ref={ref} style={{ width: "100%", height: "100%" }} />
  }

  return (
    <div
      ref={ref}
      style={{ width: "100%", height: "100%", position: "relative" }}
    >
      {root.leaves().map((leaf, i) => (
        <motion.div
          key={leaf.data.id}
          data-tooltip-id="skill-tooltip"
          data-tooltip-content={leaf.data.name} // Only name in tooltip
          onClick={() => onSkillClick(leaf.data.id)}
          initial={{
            x: leaf.x - leaf.r,
            y: leaf.y - leaf.r,
            width: leaf.r * 2,
            height: leaf.r * 2,
          }}
          animate={{
            x: leaf.x - leaf.r,
            y: leaf.y - leaf.r,
            width: leaf.r * 2,
            height: leaf.r * 2,
            scale: leaf.data.id === activeSkillId ? 1.1 : 1, // Highlight active skill
          }}
          style={{
            fontSize: `clamp(0.4rem, ${leaf.r / 65}rem, 1.2rem)`,
            lineHeight: 1,
            backgroundImage: `url('/images/bubble${
              ((Math.ceil(i + 1 / 5) - 1) % 5) + 1
            }.png')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          whileHover={{
            scale: 1.15,
            zIndex: 10,
          }}
          transition={{ type: "spring", stiffness: 150, damping: 20 }}
          className={`absolute rounded-full flex items-center justify-center text-center text-white p-4 cursor-pointer hover:drop-shadow-[0_0_6px_rgba(192,198,207,0.75)] ${
            leaf.data.id === activeSkillId
              ? "drop-shadow-[0_0_6px_rgba(192,198,207,0.75)]"
              : ""
          }`}
        >
          {leaf.data.name}
        </motion.div>
      ))}
    </div>
  )
}
