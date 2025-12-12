import { useEffect, useState } from 'react';

interface UseKeyboardListNavOptions {
  itemCount: number;
  onSelectItem: (index: number) => void;
  loop?: boolean;
}

export function useKeyboardListNav({
  itemCount,
  onSelectItem,
  loop = true,
}: UseKeyboardListNavOptions) {
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (itemCount === 0) return;

      let nextIndex = activeIndex;

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        nextIndex = activeIndex + 1;
        if (nextIndex >= itemCount) {
          nextIndex = loop ? 0 : itemCount - 1;
        }
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        nextIndex = activeIndex - 1;
        if (nextIndex < 0) {
          nextIndex = loop ? itemCount - 1 : 0;
        }
      } else if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        if (activeIndex !== -1) {
          onSelectItem(activeIndex);
        }
      }

      setActiveIndex(nextIndex);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeIndex, itemCount, onSelectItem, loop]);

  return { activeIndex, setActiveIndex };
}