import React, { useState } from "react" // Removed useEffect
import { useTranslation } from "react-i18next"
import { getAge, yearsSince } from "../utils/date"
import { profile, getStats, getSuperheroes } from "../lib/profile"
import ProfileStats from "../components/About/ProfileStats"
import Portrait from "../components/Media/Portrait"

import Modal from "../components/Modal"
import DomeGallery from "@/components/Media/DomeGallery"
import PageMeta from "../components/SEO/PageMeta" // Import PageMeta

const About: React.FC = () => {
  const { t } = useTranslation()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const age = getAge(new Date(profile.dobISO))
  const experienceYears = yearsSince(new Date(profile.startDateISO))

  // Removed old useEffect for document.title

  const stats = getStats(t, age, experienceYears)
  const superheroes = getSuperheroes(t)

  return (
    <>
      <PageMeta
        titleKey="aboutPage.meta.title"
        descriptionKey="aboutPage.meta.description"
        pageName="aboutPage"
      />
      <main className="relative w-full overflow-hidden text-text">
        <div className="after:absolute after:inset-0 after:pointer-events-none">
          <div className="mx-auto h-full grid grid-cols-1 md:grid-cols-12 gap-6 px-4 md:px-6 xl:px-8 py-[max(env(safe-area-inset-top),20px)]">
            {/* Mobile: Portrait on top */}
            <div className="md:hidden h-[45svh] flex items-center justify-center">
              <Portrait
                src={profile.photo}
                alt={t("aboutPage.portraitAlt", { name: profile.name })}
                loading="lazy"
              />
            </div>
            {/* Left Column: Content */}
            <div className="md:col-span-8 lg:col-span-6 flex flex-col justify-center gap-6 md:overflow-visible">
              <img
                src={"/images/name.png"}
                alt={"name"}
                className="h-full w-full object-cover select-none drop-shadow-[0_0_1px_#C0C0C0] hover:drop-shadow-[0_0_3px_#C0C0C0] transition-all duration-500"
                loading="lazy"
              />
              <h1 className="text-[clamp(24px,4vw,40px)] font-semibold tracking-tight text-silver-300">
                {t("aboutPage.jobTitle")}
              </h1>
              <h2 className="text-[clamp(12px,1.6vw,16px)] text-text-muted">
                {t("aboutPage.jobSubtitle")}
              </h2>
              <div className="space-y-6 text-[clamp(12px,1.4vw,14px)] leading-relaxed  text-justify">
                <div>
                  <h3 className="font-semibold text-silver-300 mb-1 inline-flex items-center gap-3">
                    <img
                      src={"/images/books.png"}
                      className="w-8 h-6 object-cover"
                      loading="lazy"
                    />
                    {t("aboutPage.philosophy.title")}
                  </h3>
                  <p className="text-[#cfd3da]">
                    {t("aboutPage.philosophy.content", { experienceYears })}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-silver-300 mb-1 inline-flex items-center gap-3">
                    <img
                      src={"/images/briefcase.png"}
                      className="w-8 h-8 object-cover"
                      loading="lazy"
                    />
                    {t("aboutPage.experience.title")}
                  </h3>
                  <p className="text-[#cfd3da]">
                    {t("aboutPage.experience.content")}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-silver-300 mb-1 inline-flex items-center gap-3">
                    <img
                      src={"/images/process.png"}
                      className="w-8 h-8 object-cover"
                      loading="lazy"
                    />
                    {t("aboutPage.process.title")}
                  </h3>
                  <p className="text-[#cfd3da]">
                    {t("aboutPage.process.description")}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-silver-300 mb-1 inline-flex items-center gap-3">
                    <img
                      src={"/images/plane.png"}
                      className="w-8 h-6 object-cover"
                      loading="lazy"
                    />
                    {t("aboutPage.afterHours.title")}
                  </h3>
                  <p className="text-[#cfd3da]">
                    {t("aboutPage.afterHours.content")}{" "}
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="ml-2 text-white font-bold text-sm hover:underline"
                    >
                      {t("aboutPage.afterHours.button")}
                    </button>
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Portrait (Desktop) */}
            <div className="hidden md:col-span-4 lg:col-span-6 md:flex flex-col items-center justify-center">
              <Portrait
                src={profile.photo}
                alt={t("aboutPage.portraitAlt", { name: profile.name })}
                loading="lazy"
              />
              <ProfileStats items={stats} />
            </div>
          </div>
        </div>
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <DomeGallery
            images={superheroes}
            grayscale={false}
            fit={1}
            segments={20}
            minRadius={1000}
          />
        </Modal>
      </main>
    </>
  )
}

export default About
