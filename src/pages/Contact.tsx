import ContactForm from "@/components/Contact/ContactForm"
import ContactGrid from "@/components/Contact/ContactGrid"
import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import PageMeta from "../components/SEO/PageMeta" // Import PageMeta

const Contact: React.FC = () => {
  const { t } = useTranslation()
  const [localTime, setLocalTime] = useState("")

  useEffect(() => {
    const date = new Date()
    setLocalTime(
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    )
  }, [t]) // Added 't' back as a dependency

  return (
    <>
      <PageMeta
        titleKey="contactPage.meta.title"
        descriptionKey="contactPage.meta.description"
        pageName="contactPage"
      />
      <main className="relative w-full overflow-hidden">
        <div className="after:absolute after:inset-0 after:pointer-events-none">
          <div className="mx-auto h-full grid grid-cols-1 md:grid-cols-2 gap-6 px-4 md:px-6 xl:px-8 py-[max(env(safe-area-inset-top),20px)]">
            <div className="flex flex-col justify-center gap-6 p-2">
              <h1 className="text-[clamp(28px,4vw,44px)] font-semibold tracking-tight text-silver-300">
                {t("contactPage.header")}
              </h1>
              <p className="text-[clamp(14px,1.6vw,18px)] text-text-muted">
                {t("contactPage.description")}
              </p>
              <div className="flex flex-wrap gap-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-silver-400/25 px-3 py-1.5 text-[13px] text-silver-300 bg-white/5 backdrop-blur-[2px]">
                  {t("contactPage.status")}
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-silver-400/25 px-3 py-1.5 text-[13px] text-silver-300 bg-white/5 backdrop-blur-[2px]">
                  {t("contactPage.localTime", { time: localTime })}
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-silver-400/25 px-3 py-1.5 text-[13px] text-silver-300 bg-white/5 backdrop-blur-[2px]">
                  {t("contactPage.reply")}
                </div>
              </div>
            </div>
            <div className="col-span-1 hidden md:flex items-center justify-center">
              <img
                src="/images/call.png"
                alt="call"
                className="object-cover w-3/5"
              />
            </div>
            {/* Contact Form always visible */}
            <div className="col-span-1 md:col-span-1 flex justify-center p-2">
              <ContactForm />
            </div>
            {/* Contact Grid */}
            <div className="col-span-1 md:col-span-1">
              <ContactGrid />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default Contact
