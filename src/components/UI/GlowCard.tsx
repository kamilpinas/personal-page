import React from "react"
import { twMerge } from "tailwind-merge"

interface GlowCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export const GlowCard = React.forwardRef<HTMLDivElement, GlowCardProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={twMerge(
          "relative rounded-lg border border-silver-400/20 bg-transparent  shadow-lg transition-all duration-500 ease-in-out",
          "hover:shadow-glow-silver focus:shadow-glow-silver focus:outline-none",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

GlowCard.displayName = "GlowCard"
