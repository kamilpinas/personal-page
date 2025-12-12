import React from "react"
import { twMerge } from "tailwind-merge"

interface ContainerProps {
  children: React.ReactNode
  className?: string
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={twMerge(
        "mx-auto w-full px-8 sm:px-12 lg:px-28 justify-center",
        className
      )}
    >
      {children}
    </div>
  )
}
