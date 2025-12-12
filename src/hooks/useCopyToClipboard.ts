
import { useState, useCallback } from 'react';

export function useCopyToClipboard() {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async (text: string) => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard not supported');
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
      return true;
    } catch (error) {
      console.warn('Copy failed', error);
      setCopied(false);
      return false;
    }
  }, []);

  const reset = useCallback(() => {
    setCopied(false);
  }, []);

  return { copy, copied, reset };
}
