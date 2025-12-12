import React from "react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import AnimatedNumber from "./AnimatedNumber"
import { iconMap } from "../../lib/icons" // Import iconMap

interface ProfileStatItem {
  label: string
  value: string | React.ReactNode | string[]
}

interface ProfileStatsProps {
  items: ProfileStatItem[]
}

const iconContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2,
    },
  },
}

const iconVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
}

const ProfileStats: React.FC<ProfileStatsProps> = ({ items }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <div
      ref={ref}
      className="mt-8 flex flex-wrap gap-8 justify-center text-center"
    >
      {items.map((item) => {
        if (Array.isArray(item.value)) {
          return (
            <div
              key={item.label}
              className="flex flex-col items-center justify-between"
            >
              <motion.div
                className="flex gap-4"
                variants={iconContainerVariants}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
              >
                {(item.value as string[]).map((iconKey, index) => {
                  const IconComponent = iconMap[iconKey as keyof typeof iconMap];
                  if (!IconComponent) return null;
                  return (
                    <motion.div key={index} variants={iconVariants}>
                      <IconComponent size={40} />
                    </motion.div>
                  );
                })}
              </motion.div>
              <span className="text-sm text-silver-400 tracking-[0.3em] uppercase mt-2">
                {item.label}
              </span>
            </div>
          )
        }

        const number = parseInt(item.value as string, 10)

        return (
          <div key={item.label} className="flex flex-col items-center">
            {isNaN(number) ? (
              <span className="text-2xl font-semibold text-silver-300">
                {item.value}
              </span>
            ) : (
              <span className="text-5xl font-bold text-silver-200">
                {inView && <AnimatedNumber value={number} />}
                {item.label === "Experience" ? "+" : ""}
              </span>
            )}
            <span className="text-sm text-silver-400 tracking-[0.3em] uppercase mt-2">
              {item.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export default ProfileStats
