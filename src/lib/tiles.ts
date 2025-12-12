import { Tile } from "../types"
import { User, Briefcase, Code, Mail, FileText } from "lucide-react"
import { TFunction } from "i18next"

export const getTilesData = (t: TFunction, lng: string): Tile[] => [
  {
    id: "about",
    title: t("tiles.about.title"),
    to: `/${lng}/about`,
    icon: User,
    staticSrc: "/images/about.jpg",
    videoSrc: "/movies/about.mp4",
  },
  {
    id: "skills",
    title: t("tiles.skills.title"),
    to: `/${lng}/skills`,
    icon: Code,
    staticSrc: "/images/skills.jpg",
    videoSrc: "/movies/skills.mp4",
    wide: true,
  },
  {
    id: "resume",
    title: t("tiles.resume.title"),
    to: `/${lng}/resume`,
    icon: FileText,
    staticSrc: "/images/resume.jpg",
    videoSrc: "/movies/resume.mp4",
  },
  {
    id: "contact",
    title: t("tiles.contact.title"),
    to: `/${lng}/contact`,
    icon: Mail,
    staticSrc: "/images/contact.jpg",
    videoSrc: "/movies/contact.mp4",
  },
  {
    id: "projects",
    title: t("tiles.projects.title"),
    to: `/${lng}/projects`,
    icon: Briefcase,
    staticSrc: "/images/projects.jpg",
    videoSrc: "/movies/projects.mp4",
    wide: true,
  },
]
