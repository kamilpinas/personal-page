import { useTranslation } from "react-i18next"
import { useParams, useLocation, useNavigate } from "react-router-dom"

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const { lng } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const changeLanguage = (newLng: string) => {
    const newPath = location.pathname.replace(`/${lng}`, `/${newLng}`)
    i18n.changeLanguage(newLng)
    navigate(newPath)
  }

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={() => changeLanguage("en")}
        className={`text-sm font-medium ${
          i18n.language === "en" ? "text-white" : "text-silver-400"
        } hover:text-white transition-colors`}
      >
        EN
      </button>
      <button
        onClick={() => changeLanguage("pl")}
        className={`text-sm font-medium ${
          i18n.language === "pl" ? "text-white" : "text-silver-400"
        } hover:text-white transition-colors`}
      >
        PL
      </button>
    </div>
  )
}
