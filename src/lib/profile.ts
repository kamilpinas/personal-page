import { TFunction } from "i18next"
import { profileData } from "./data"

export const profile = profileData

export const getStats = (
  t: TFunction,
  age: number,
  experienceYears: number
) => [
  {
    label: t("aboutPage.stats.age"),
    value: `${age} ${t("aboutPage.stats.years")}`,
  },
  {
    label: t("aboutPage.stats.experience"),
    value: `${experienceYears}+ ${t("aboutPage.stats.years")}`,
  },
  {
    label: t("aboutPage.stats.focus"),
    value: ["react", "typescript", "redux", "nodejs", "webpack"],
  },
]

export const getSuperheroes = (t: TFunction) => [
  { src: "/images/superhero1.jpeg", alt: t("aboutPage.superheroes.lotr") },
  {
    src: "/images/superhero2.png",
    alt: t("aboutPage.superheroes.peakyBlinders"),
  },
  { src: "/images/superhero3.jpeg", alt: t("aboutPage.superheroes.mario") },
  { src: "/images/superhero4.png", alt: t("aboutPage.superheroes.avengers") },
  { src: "/images/superhero5.png", alt: t("aboutPage.superheroes.got") },
  { src: "/images/superhero6.jpeg", alt: t("aboutPage.superheroes.witcher") },
  { src: "/images/superhero7.jpeg", alt: t("aboutPage.superheroes.shrek") },
]
