/**
 * Hook for debounced search
 */

import { useRef, useCallback } from 'react';

interface UseDebouncedSearchOptions {
  onSearch?: (value: string) => void;
  debounceMs: number;
}

export function useDebouncedSearch({
  onSearch,
  debounceMs,
}: UseDebouncedSearchOptions) {
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const triggerSearch = useCallback(
    (value: string) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        if (onSearch) {
          onSearch(value);
        }
      }, debounceMs);
    },
    [onSearch, debounceMs]
  );

  return { triggerSearch };
}
