import { Link, useRouteError } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Button } from "../components/UI/Button"

const ErrorPage = () => {
  const { t } = useTranslation()
  const error = useRouteError()

  let title = t("notFoundPage.title")
  let message = t("notFoundPage.description")

  if (error instanceof Error && error.message) {
    // This will catch errors thrown by loaders or actions
    title = error.message
    message = t("notFoundPage.errorMessage")
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4 bg-[#1E1E1E]">
      <div className="max-w-md flex items-center flex-col">
        <video
          src={"/movies/warning.mp4"}
          title={"Error"}
          className="object-cover w-64 h-64 bg-black"
          autoPlay
          loop
          muted
          playsInline
        />
        <h2 className="text-3xl font-bold mt-4">{title}</h2>
        <p className="text-lg mt-2 text-gray-600">{message}</p>
        <div className="mt-8">
          <Link to="/">
            <Button>{t("notFoundPage.goHome")}</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ErrorPage
