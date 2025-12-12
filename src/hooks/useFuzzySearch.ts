
import { useMemo } from 'react';

function fuzzyMatch(pattern: string, text: string): boolean {
  const patternChars = [...pattern.toLowerCase()];
  const textChars = [...text.toLowerCase()];

  let patternIndex = 0;
  let textIndex = 0;

  while (patternIndex < patternChars.length && textIndex < textChars.length) {
    if (patternChars[patternIndex] === textChars[textIndex]) {
      patternIndex++;
    }
    textIndex++;
  }

  return patternIndex === patternChars.length;
}

export function useFuzzySearch<T>(items: T[], keys: (keyof T)[], searchTerm: string) {
  return useMemo(() => {
    if (!searchTerm) {
      return items;
    }

    return items.filter(item => {
      return keys.some(key => {
        const value = item[key];
        if (typeof value === 'string') {
          return fuzzyMatch(searchTerm, value);
        } else if (Array.isArray(value)) {
          return value.some(v => typeof v === 'string' && fuzzyMatch(searchTerm, v));
        }
        return false;
      });
    });
  }, [items, keys, searchTerm]);
}
