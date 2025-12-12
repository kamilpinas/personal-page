import React from 'react';
import { LucideProps } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface IconProps extends LucideProps {
  icon: React.ComponentType<LucideProps>;
}

export const Icon: React.FC<IconProps> = ({ icon: IconComponent, className, ...props }) => {
  return <IconComponent className={twMerge('h-5 w-5 text-text-muted', className)} {...props} />;
};
