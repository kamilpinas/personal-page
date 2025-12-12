import { useCallback } from 'react';

// This is a placeholder for a prefetching mechanism.
// In a real app, you might use a library like React Query or a custom solution
// to prefetch data associated with a route.
const prefetchData = (href: string) => {
  console.log(`Prefetching data for ${href}`);
  // Example: fetch(`/api/data-for${href}`).then(res => res.json())...;
};

// This hook returns event handlers that can be attached to elements.
// When the user hovers over or focuses on the element, we prefetch the data.
export function usePrefetchOnIntent() {
  const handlePointerEnter = useCallback((href: string) => {
    const timeoutId = setTimeout(() => {
      prefetchData(href);
    }, 100); // Small delay to avoid prefetching on accidental mouse-overs

    return () => clearTimeout(timeoutId);
  }, []);

  const handleFocus = useCallback((href: string) => {
    prefetchData(href);
  }, []);

  const onIntent = useCallback(
    (href: string) => {
      let cleanup: (() => void) | undefined;
      return {
        onPointerEnter: () => {
          cleanup = handlePointerEnter(href);
        },
        onPointerLeave: () => {
          cleanup?.();
        },
        onFocus: () => handleFocus(href),
      };
    },
    [handlePointerEnter, handleFocus]
  );

  return { onIntent };
}
