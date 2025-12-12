import React, { useState, useRef } from "react"
import { useTranslation } from "react-i18next"
import emailjs from "@emailjs/browser"
import env from "@/lib/env"

const ContactForm: React.FC = () => {
  const { t } = useTranslation()
  const form = useRef<HTMLFormElement>(null)
  const [status, setStatus] = useState("")
  const [isSending, setIsSending] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.current) return

    setIsSending(true)
    setStatus("")

    emailjs
      .sendForm(
        env.emailJs.serviceId,
        env.emailJs.templateId,
        form.current,
        env.emailJs.publicKey
      )
      .then(
        () => {
          setStatus(t("contactPage.form.messageSent"))
          setIsSending(false)
          form.current?.reset()
        },
        (error) => {
          setStatus(t("contactPage.form.errorMessage"))
          setIsSending(false)
          console.error("FAILED...", error)
        }
      )
  }

  return (
    <div className="flex w-full rounded-2xl border border-silver-400/20 bg-gradient-to-br from-white/5 to-white/2 p-5 md:p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <form ref={form} onSubmit={handleSubmit} className="w-full">
        <div className="mb-4">
          <label htmlFor="name" className="sr-only">
            {t("contactPage.form.name")}
          </label>
          <input
            type="text"
            id="name"
            name="user_name"
            placeholder={t("contactPage.form.name")}
            required
            className="w-full rounded-lg border border-silver-400/20 bg-transparent  text-silver-300 placeholder:text-text-muted px-3.5 py-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-silver-400/40 transition"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="sr-only">
            {t("contactPage.form.email")}
          </label>
          <input
            type="email"
            id="email"
            name="user_email"
            placeholder={t("contactPage.form.email")}
            required
            className="w-full rounded-lg border border-silver-400/20 bg-transparent text-silver-300 placeholder:text-text-muted px-3.5 py-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-silver-400/40 transition"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="message" className="sr-only">
            {t("contactPage.form.message")}
          </label>
          <textarea
            id="message"
            name="user_message"
            placeholder={t("contactPage.form.message")}
            rows={5}
            required
            className="w-full rounded-lg border border-silver-400/20 bg-transparent text-silver-300 placeholder:text-text-muted px-3.5 py-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-silver-400/40 transition"
          ></textarea>
        </div>
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-lg border border-silver-400/25 bg-white/[0.06] px-4 py-2.5 text-silver-300 hover:shadow-glow-silver focus-visible:ring-2 focus-visible:ring-silver-400/40 transition"
          disabled={isSending}
        >
          {isSending
            ? t("contactPage.form.sending")
            : t("contactPage.form.send")}
        </button>
        {status && <p className="mt-4 text-sm text-gray-400">{status}</p>}
      </form>
    </div>
  )
}

export default ContactForm
