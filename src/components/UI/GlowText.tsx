import React from 'react';
import { twMerge } from 'tailwind-merge';

interface GlowTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

export const GlowText: React.FC<GlowTextProps> = ({ children, className, ...props }) => {
  return (
    <span
      className={twMerge(
        'bg-gradient-to-r from-silver-300 to-silver-500 bg-clip-text text-transparent',
        'drop-shadow-[0_0_8px_rgba(192,198,207,0.35)]',
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
