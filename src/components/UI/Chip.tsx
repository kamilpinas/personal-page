import React from "react"

interface ChipProps {
  label: string
  isActive: boolean
  onClick: () => void
}

export const Chip: React.FC<ChipProps> = ({ label, isActive, onClick }) => {
  return (
    <button
      className={`lg:text-lg px-2 py-1 text-xs sm:text-md font-medium rounded-full transition-colors duration-500 ease-in-out  hover:bg-silver-400 hover:text-gray-900 hover:shadow-glow-silver ${
        isActive
          ? "bg-silver-400 text-gray-900 shadow-glow-silver"
          : "bg-transparent text-silver-300 hover:bg-silver-400 hover:text-gray-900"
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  )
}
