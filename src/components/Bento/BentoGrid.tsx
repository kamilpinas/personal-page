import React from "react"
import { twMerge } from "tailwind-merge"

interface BentoGridProps {
  children: React.ReactNode
  className?: string
}

export const BentoGrid: React.FC<BentoGridProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={twMerge(
        "grid h-full w-full gap-6 p-2 grid-layout rounded-lg shadow-md",
        className
      )}
    >
      {children}
    </div>
  )
}
