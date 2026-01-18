import { useTranslation } from "react-i18next"
import { items } from "@/lib/experience"
import { CustomTimeline } from "@/components/Experience/CustomTimeline"
import PageMeta from "@/components/SEO/PageMeta"

const Experience = () => {
  const { t } = useTranslation()

  return (
    <>
      <PageMeta
        titleKey="experiencePage.meta.title"
        descriptionKey="experiencePage.meta.description"
        pageName="experiencePage"
      />

      <CustomTimeline items={items(t)} />
    </>
  )
}

export default Experience
