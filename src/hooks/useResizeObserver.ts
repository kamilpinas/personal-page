import { useEffect, useRef } from 'react';

type ResizeObserverCallback = (entry: ResizeObserverEntry) => void;

export function useResizeObserver<T extends HTMLElement>(
  callback: ResizeObserverCallback
): React.RefObject<T> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        callback(entries[0]);
      }
    });

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [callback]);

  return ref;
}