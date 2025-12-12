import React from 'react';
import { Link, LinkProps } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  as?: 'button' | 'a' | 'Link';
  href?: string;
  to?: string;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, as = 'button', to, ...props }, ref) => {
    const commonClasses = twMerge(
      'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium',
      'border border-silver-400/40 bg-transparent text-silver-300',
      'transition-all duration-200 ease-in-out',
      'hover:bg-silver-400/10 hover:text-white hover:shadow-glow-silver',
      'focus:outline-none focus:ring-2 focus:ring-silver-400 focus:ring-offset-2 focus:ring-offset-bg',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      className
    );

    if (as === 'a') {
      return (
        <a className={commonClasses} {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
          {children}
        </a>
      );
    }

    if (as === 'Link') {
      return (
        <Link to={to || '#'} className={commonClasses} {...(props as Omit<LinkProps, 'to'>)}>
          {children}
        </Link>
      );
    }

    return (
      <button className={commonClasses} ref={ref} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
