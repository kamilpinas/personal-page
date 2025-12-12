import { Plus, Minus, RefreshCw } from "lucide-react";

interface ZoomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

export default function ZoomControls({ onZoomIn, onZoomOut, onReset }: ZoomControlsProps) {
  return (
    <div className="absolute bottom-4 right-4 z-10 flex gap-2">
      <button
        onClick={onZoomIn}
        className="p-2 rounded-full bg-gray-800 text-white shadow-glow-silver hover:bg-gray-700 transition-colors"
        aria-label="Zoom in"
      >
        <Plus size={20} />
      </button>
      <button
        onClick={onZoomOut}
        className="p-2 rounded-full bg-gray-800 text-white shadow-glow-silver hover:bg-gray-700 transition-colors"
        aria-label="Zoom out"
      >
        <Minus size={20} />
      </button>
      <button
        onClick={onReset}
        className="p-2 rounded-full bg-gray-800 text-white shadow-glow-silver hover:bg-gray-700 transition-colors"
        aria-label="Reset zoom"
      >
        <RefreshCw size={20} />
      </button>
    </div>
  );
}
