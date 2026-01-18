import { Plus, Minus, RefreshCw, Download } from "lucide-react"
import { motion } from "framer-motion"
import { useTranslation } from "react-i18next"

interface ResumeControlsProps {
  onZoomIn: () => void
  onZoomOut: () => void
  onReset: () => void
  onDownload: () => void
}

export default function ResumeControls({
  onZoomIn,
  onZoomOut,
  onReset,
  onDownload,
}: ResumeControlsProps) {
  const { t } = useTranslation()
  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="flex items-center gap-4 p-2 bg-gray-900/50 backdrop-blur-sm rounded-full shadow-lg"
    >
      <div className="flex items-center gap-2">
        <button
          onClick={onZoomOut}
          className="p-2 rounded-full text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
          aria-label={t("resumePage.zoomOut")}
          data-tooltip-id="resume-tooltip"
          data-tooltip-content={t("resumePage.zoomOut")}
        >
          <Minus size={20} />
        </button>
        <button
          onClick={onReset}
          className="p-2 rounded-full text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
          aria-label={t("resumePage.reset")}
          data-tooltip-id="resume-tooltip"
          data-tooltip-content={t("resumePage.reset")}
        >
          <RefreshCw size={16} />
        </button>
        <button
          onClick={onZoomIn}
          className="p-2 rounded-full text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
          aria-label={t("resumePage.zoomIn")}
          data-tooltip-id="resume-tooltip"
          data-tooltip-content={t("resumePage.zoomIn")}
        >
          <Plus size={20} />
        </button>
      </div>
      <button
        onClick={onDownload}
        className="p-3 rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 transition-colors"
        aria-label={t("resumePage.download")}
        data-tooltip-id="resume-tooltip"
        data-tooltip-content={t("resumePage.download")}
      >
        <Download size={24} />
      </button>
    </motion.div>
  )
}
