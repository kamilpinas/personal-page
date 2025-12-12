import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function debounce<T extends (...args: any[]) => any>(func: T, delay: number): T {
  let timeout: NodeJS.Timeout | null = null;

  return function(this: any, ...args: Parameters<T>) {
    const context = this;
    const later = () => {
      timeout = null;
      func.apply(context, args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, delay);
  } as T;
}