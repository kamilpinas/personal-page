import React, { useState } from "react"
import { useTranslation } from "react-i18next"

const ContactForm: React.FC = () => {
  const { t } = useTranslation()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState("")
  const [isSending, setIsSending] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !message) {
      setStatus(t("contactPage.form.fillFields"))
      return
    }
    setIsSending(true)
    console.log({ name, email, message })
    setTimeout(() => {
      setStatus(t("contactPage.form.messageSent"))
      setName("")
      setEmail("")
      setMessage("")
      setIsSending(false)
    }, 1000)
  }

  return (
    <div className="flex w-full rounded-2xl border border-silver-400/20 bg-gradient-to-br from-white/5 to-white/2 p-5 md:p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <form onSubmit={handleSubmit} className="w-full">
        <div className="mb-4">
          <label htmlFor="name" className="sr-only">
            {t("contactPage.form.name")}
          </label>
          <input
            type="text"
            id="name"
            placeholder={t("contactPage.form.name")}
            value={name}
            onChange={(e) => setName(e.target.value)}
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
            placeholder={t("contactPage.form.email")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-silver-400/20 bg-transparent text-silver-300 placeholder:text-text-muted px-3.5 py-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-silver-400/40 transition"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="message" className="sr-only">
            {t("contactPage.form.message")}
          </label>
          <textarea
            id="message"
            placeholder={t("contactPage.form.message")}
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
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
