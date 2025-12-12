import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import cvPL from "../assets/CVPL_Kamil_Pinas.pdf";
import cvENG from "../assets/CVENG_Kamil_Pinas.pdf";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { DocumentCallback } from "react-pdf/dist/shared/types.js";
import ResumeControls from "../components/ResumeControls";
import { Tooltip } from "react-tooltip";
import { useTranslation } from "react-i18next";
import PageMeta from "../components/SEO/PageMeta"; // Import PageMeta

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export default function ResumePage() {
  const { t } = useTranslation();
  const [scale, setScale] = useState(1.0);
  const [transformOrigin, setTransformOrigin] = useState("50% 50%");
  const [pageDimensions, setPageDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [initialPageDimensions, setInitialPageDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [language, setLanguage] = useState<"PL" | "ENG">("PL");
  const [resetKey, setResetKey] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerDimensions, setContainerDimensions] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    // Removed old document.title useEffect

    const updateContainerDimensions = () => {
      if (containerRef.current) {
        setContainerDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateContainerDimensions();

    window.addEventListener("resize", updateContainerDimensions);

    return () => {
      window.removeEventListener("resize", updateContainerDimensions);
    };
  }, []); // Empty dependency array as 't' is no longer used for document.title

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setTransformOrigin(`${x * 100}% ${y * 100}%`);
    }

    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale((prevScale) => Math.max(0.5, prevScale + delta));
  };

  const onDocumentLoadSuccess = (pdf: DocumentCallback) => {
    pdf.getPage(1).then((page) => {
      const dimensions = {
        width: page.view[2],
        height: page.view[3],
      };
      setPageDimensions(dimensions);
      setInitialPageDimensions(dimensions); // Store initial dimensions
    });
  };

  const handleZoomIn = () => {
    setScale((prevScale) => prevScale + 0.1);
  };

  const handleZoomOut = () => {
    setScale((prevScale) => Math.max(0.5, prevScale - 0.1));
  };

  const handleReset = () => {
    setScale(1.0);
    setTransformOrigin("50% 50%");
    setPageDimensions(initialPageDimensions); // Reset to initial dimensions
    setResetKey((prevKey) => prevKey + 1); // Change key to reset component state
  };

  const handleLanguageChange = (lang: "PL" | "ENG") => {
    setLanguage(lang);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = language === "PL" ? cvPL : cvENG;
    link.download = `${t("header.resume")}_${language}_Kamil_Pinas.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const scaledWidth = scale * pageDimensions.width;
  const scaledHeight = scale * pageDimensions.height;

  const dragConstraints = {
    left: -(scaledWidth - containerDimensions.width) / 2,
    right: (scaledWidth - containerDimensions.width) / 2,
    top: -(scaledHeight - containerDimensions.height) / 2,
    bottom: (scaledHeight - containerDimensions.height) / 2,
  };

  const finalDragConstraints = {
    left: Math.min(0, dragConstraints.left),
    right: Math.max(0, dragConstraints.right),
    top: Math.min(0, dragConstraints.top),
    bottom: Math.max(0, dragConstraints.bottom),
  };

  return (
    <>
      <PageMeta
        titleKey="resumePage.meta.title"
        descriptionKey="resumePage.meta.description"
        pageName="resumePage"
      />
      <div
        ref={containerRef}
        onWheel={handleWheel}
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          gap: "1rem", // Add some gap between the document and controls
        }}
      >
        <motion.div
          key={resetKey} // Add key to reset component state
          ref={ref}
          drag={scale > 1} // Conditionally enable dragging
          dragConstraints={finalDragConstraints}
          dragMomentum={false} // Disable momentum
          style={{
            scale,
            transformOrigin,
            width: `${pageDimensions.width}px`,
            height: `${pageDimensions.height}px`,
            cursor: scale > 1 ? "grab" : "auto",
          }}
          whileTap={{ cursor: "grabbing" }}
        >
          <Document
            file={language === "PL" ? cvPL : cvENG}
            onLoadSuccess={onDocumentLoadSuccess}
          >
            <Page pageNumber={1} />
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
  );
}
