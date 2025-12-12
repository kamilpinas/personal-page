import { Link, useLocation, useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Container } from "./Container"
import { ArrowLeft } from "lucide-react"
import LanguageSwitcher from "../LanguageSwitcher"

export function Header() {
  const location = useLocation()
  const { lng } = useParams()
  const { t } = useTranslation()

  const isHomePage = location.pathname === `/${lng}`

  return (
    <header className="sticky top-0 z-50 bg-transparent backdrop-blur-lg">
      <Container
        className={`flex h-16 items-center ${
          isHomePage ? "justify-end" : "justify-between"
        }`}
      >
        {!isHomePage && (
          <Link
            to={`/${lng}`}
            className="flex items-center gap-2 text-silver-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">{t("header.home")}</span>
          </Link>
        )}
        <LanguageSwitcher />
      </Container>
    </header>
  )
}
