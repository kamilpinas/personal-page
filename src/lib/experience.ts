import { Briefcase, Code, GraduationCap, Rocket, Shield } from "lucide-react"
import { TFunction } from "i18next"

export type ExperienceItem = {
  title: string
  cardTitle: string
  cardSubtitle: string
  cardDetailedText: string | string[]
  icon: any
}

export const items = (t: TFunction): ExperienceItem[] => [
  {
    title: t("experiencePage.timeline.zebra.date"),
    cardTitle: t("experiencePage.timeline.zebra.title"),
    cardSubtitle: t("experiencePage.timeline.zebra.subtitle"),
    icon: Briefcase,
    cardDetailedText: Array.from({ length: 9 })
      .map((_, index) => t(`experiencePage.timeline.zebra.details.${index}`))
      .filter(Boolean),
  },

  {
    title: t("experiencePage.timeline.duke.date"),
    cardTitle: t("experiencePage.timeline.duke.title"),
    cardSubtitle: t("experiencePage.timeline.duke.subtitle"),
    icon: Code,
    cardDetailedText: Array.from({ length: 10 })
      .map((_, index) => t(`experiencePage.timeline.duke.details.${index}`))
      .filter(Boolean),
  },
  {
    title: t("experiencePage.timeline.icsec.date"),
    cardTitle: t("experiencePage.timeline.icsec.title"),
    cardSubtitle: t("experiencePage.timeline.icsec.subtitle"),
    icon: Shield,
    cardDetailedText: Array.from({ length: 8 })
      .map((_, index) => t(`experiencePage.timeline.icsec.details.${index}`))
      .filter(Boolean),
  },

  {
    title: t("experiencePage.timeline.b2b.date"),
    cardTitle: t("experiencePage.timeline.b2b.title"),
    cardSubtitle: t("experiencePage.timeline.b2b.subtitle"),
    icon: Rocket,
    cardDetailedText: t("experiencePage.timeline.b2b.details.0"),
  },
  {
    title: t("experiencePage.timeline.tsr.date"),
    cardTitle: t("experiencePage.timeline.tsr.title"),
    cardSubtitle: t("experiencePage.timeline.tsr.subtitle"),
    icon: Briefcase,
    cardDetailedText: Array.from({ length: 11 })
      .map((_, index) => t(`experiencePage.timeline.tsr.details.${index}`))
      .filter(Boolean),
  },
  {
    title: t("experiencePage.timeline.bachelor.date"),
    cardTitle: t("experiencePage.timeline.bachelor.title"),
    cardSubtitle: t("experiencePage.timeline.bachelor.subtitle"),
    icon: GraduationCap,
    cardDetailedText: Array.from({ length: 5 })
      .map((_, index) => t(`experiencePage.timeline.bachelor.details.${index}`))
      .filter(Boolean),
  },
]
