import { ExperienceItem } from "@/lib/experience"
import { createElement, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslation } from "react-i18next"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Tooltip } from "react-tooltip"

type TimelineItemProps = {
  item: ExperienceItem
}

const itemVariants = {
  hidden: { opacity: 0, y: 200 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const TimelineItem = ({ item }: TimelineItemProps) => {
  const { t } = useTranslation()
  const [isHovered, setIsHovered] = useState(false)
  const isArray = Array.isArray(item.cardDetailedText)
  const hasMoreThan5details = isArray && item.cardDetailedText.length > 5
  const [isExpanded, setIsExpanded] = useState(false)

  const detailsToShow =
    isArray && hasMoreThan5details && !isExpanded
      ? item.cardDetailedText.slice(0, 5)
      : item.cardDetailedText

  return (
    <div
      className="timeline-item"
      onMouseLeave={() => setIsHovered(false)}
      onMouseOver={() => setIsHovered(true)}
    >
      <motion.div
        className="timeline-content rounded-lg border border-silver-400/20 shadow-lg ease-in-out hover:shadow-glow-silver focus:shadow-glow-silver focus:outline-none duration-500"
        variants={itemVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <div
          className={`timeline-icon scale-125 ${isHovered ? "border " : ""}`}
        >
          {createElement(item.icon)}
        </div>
        <div>
          <h3 className="text-lg font-bold text-text">{item.cardTitle}</h3>
          <h4 className="text-md font-semibold text-text-muted">
            {item.cardSubtitle}
          </h4>
        </div>
        <motion.div layout className="pt-2">
          <AnimatePresence initial={false}>
            {Array.isArray(detailsToShow) ? (
              <motion.ul layout className="mt-4 list-disc space-y-2 pl-5">
                {detailsToShow.map((line, i) => (
                  <motion.li
                    key={i}
                    className="text-sm text-text-muted"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{
                      opacity: { duration: 0.7 },
                      height: { duration: 0.5 },
                    }}
                  >
                    {line}
                  </motion.li>
                ))}
              </motion.ul>
            ) : (
              <p className="mt-2 text-sm text-text-muted">{detailsToShow}</p>
            )}
          </AnimatePresence>
          {hasMoreThan5details && (
            <div className="flex justify-start ms-[-3px]">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-4 flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                data-tooltip-id={`expand-tooltip-${item.title.replace(
                  /\s+/g,
                  "-"
                )}`}
                data-tooltip-content={
                  isExpanded
                    ? t("experiencePage.showLessTooltip")
                    : t("experiencePage.showMoreTooltip")
                }
                aria-label={
                  isExpanded
                    ? t("experiencePage.showLessTooltip")
                    : t("experiencePage.showMoreTooltip")
                }
              >
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
                <span>
                  {isExpanded
                    ? t("experiencePage.showLess")
                    : t("experiencePage.showMore")}
                </span>
              </button>
              <Tooltip
                id={`expand-tooltip-${item.title.replace(/\s+/g, "-")}`}
              />
            </div>
          )}
        </motion.div>
        <div className="timeline-date">{item.title}</div>
      </motion.div>
    </div>
  )
}

type CustomTimelineProps = {
  items: ExperienceItem[]
}

export const CustomTimeline = ({ items }: CustomTimelineProps) => {
  return (
    <div className="timeline-container">
      {items.map((item, index) => (
        <TimelineItem key={index} item={item} />
      ))}
    </div>
  )
}
