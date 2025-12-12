import { Download } from "lucide-react";

interface DownloadButtonProps {
  onDownload: () => void;
}

export default function DownloadButton({ onDownload }: DownloadButtonProps) {
  return (
    <div className="absolute top-4 right-4 z-10">
      <button
        onClick={onDownload}
        className="p-2 rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 transition-colors"
        aria-label="Download CV"
      >
        <Download size={20} />
      </button>
    </div>
  );
}
