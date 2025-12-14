import {
  createBrowserRouter,
  useOutlet,
  useParams,
  Navigate,
  useLocation,
} from "react-router-dom"
import { Suspense, lazy, useEffect, cloneElement } from "react"
import { useTranslation } from "react-i18next"
import { Header } from "../components/Layout/Header"
import { Container } from "../components/Layout/Container"
import { AnimatePresence, motion } from "framer-motion"

const HomePage = lazy(() => import("../pages/Home"))
const AboutPage = lazy(() => import("../pages/About"))
const ProjectsPage = lazy(() => import("../pages/Projects"))
const SkillsPage = lazy(() => import("../pages/Skills"))
const ContactPage = lazy(() => import("../pages/Contact"))
const ResumePage = lazy(() => import("../pages/Resume"))
const ErrorPage = lazy(() => import("../pages/Error"))

const AppLayout = () => {
  const { lng } = useParams()
  const { i18n } = useTranslation()
  const location = useLocation()
  const outlet = useOutlet()

  useEffect(() => {
    if (lng && i18n.language !== lng) {
      i18n.changeLanguage(lng)
    }
  }, [lng, i18n])

  const isBackToHomeLocation =
    location.pathname.endsWith("/en") || location.pathname.endsWith("/pl")

  return (
    <div className="flex min-h-screen flex-col relative">
      <Header />
      <Container className="flex-grow flex flex-col">
        <Suspense
          fallback={
            <div className="flex flex-col justify-center items-center h-full ">
              <img src="/images/loading.gif" alt="Loading..." />
              <h1 className="text-silver-300 text-2xl">Loading....</h1>
            </div>
          }
        >
          <AnimatePresence mode="wait">
            {outlet && (
              <motion.div
                key={location.pathname}
                initial={{
                  opacity: 0,
                  x: isBackToHomeLocation ? "-100%" : "100%",
                }}
                animate={{ opacity: 1, x: 0 }}
                exit={{
                  opacity: 0,
                  x: isBackToHomeLocation ? "100%" : "-100%",
                }}
                transition={{ duration: 0.6 }}
                className="h-full"
              >
                {cloneElement(outlet, { key: location.pathname })}
              </motion.div>
            )}
          </AnimatePresence>
        </Suspense>
      </Container>
    </div>
  )
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/en" replace />,
  },
  {
    path: "/sitemap.xml",
  },
  {
    element: <AppLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/:lng", element: <HomePage /> },
      { path: "/:lng/about", element: <AboutPage /> },
      { path: "/:lng/projects", element: <ProjectsPage /> },
      { path: "/:lng/skills", element: <SkillsPage /> },
      { path: "/:lng/contact", element: <ContactPage /> },
      { path: "/:lng/resume", element: <ResumePage /> },
    ],
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
])
