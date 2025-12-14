import { Document, Page, pdfjs } from "react-pdf"
import "react-pdf/dist/Page/AnnotationLayer.css"
import "react-pdf/dist/Page/TextLayer.css"
import cvPL from "../assets/CV_PL.pdf"
import cvENG from "../assets/CV_ENG.pdf"
import { useState, useEffect, useRef } from "react"
import { motion, useSpring } from "framer-motion"
import { useGesture } from "@use-gesture/react"
import ResumeControls from "../components/ResumeControls"
import { Tooltip } from "react-tooltip"
import { useTranslation } from "react-i18next"
import PageMeta from "../components/SEO/PageMeta"

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString()

export default function ResumePage() {
  const { t } = useTranslation()
  const [language, setLanguage] = useState<"PL" | "ENG">("PL")
  const [containerWidth, setContainerWidth] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const ref = useRef<HTMLDivElement>(null)

  const x = useSpring(0, { stiffness: 300, damping: 30 })
  const y = useSpring(0, { stiffness: 300, damping: 30 })
  const scale = useSpring(1, { stiffness: 300, damping: 30 })

  useEffect(() => {
    const updateContainerWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth)
      }
    }
    updateContainerWidth()
    window.addEventListener("resize", updateContainerWidth)
    return () => {
      window.removeEventListener("resize", updateContainerWidth)
    }
  }, [])

  useGesture(
    {
      onDrag: ({ offset: [dx, dy] }) => {
        x.set(dx)
        y.set(dy)
      },
      onPinch: ({ offset: [s] }) => {
        scale.set(s)
      },
      onWheel: ({ event, delta: [, dy] }) => {
        event.preventDefault()
        scale.set(scale.get() - dy * 0.001)
      },
    },
    {
      target: ref,
      eventOptions: { passive: false },
      drag: { from: () => [x.get(), y.get()] },
      pinch: { from: () => [scale.get(), 0] },
      wheel: { eventOptions: { passive: false } },
    }
  )

  const handleLanguageChange = (lang: "PL" | "ENG") => {
    setLanguage(lang)
    handleReset()
  }

  const handleDownload = () => {
    const link = document.createElement("a")
    link.href = language === "PL" ? cvPL : cvENG
    link.download = `${t("header.resume")}_${language}_Kamil_Pinas.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleZoomIn = () => {
    scale.set(scale.get() + 0.1)
  }

  const handleZoomOut = () => {
    scale.set(Math.max(0.5, scale.get() - 0.1))
  }

  const handleReset = () => {
    scale.set(1)
    x.set(0)
    y.set(0)
  }

  return (
    <>
      <PageMeta
        titleKey="resumePage.meta.title"
        descriptionKey="resumePage.meta.description"
        pageName="resumePage"
      />
      <div
        ref={containerRef}
        className="touch-none"
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          gap: "1rem",
        }}
      >
        <motion.div
          ref={ref}
          style={{
            x,
            y,
            scale,
            touchAction: "none",
            cursor: "grab",
          }}
          whileTap={{ cursor: "grabbing" }}
        >
          <Document
            file={language === "PL" ? cvPL : cvENG}
            className="flex justify-center"
          >
            <Page pageNumber={1} width={Math.min(containerWidth, 700)} />
          </Document>
        </motion.div>
        <ResumeControls
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onReset={handleReset}
          onDownload={handleDownload}
          selectedLanguage={language}
          onLanguageChange={handleLanguageChange}
        />
        <Tooltip id="resume-tooltip" />
      </div>
    </>
  )
}
