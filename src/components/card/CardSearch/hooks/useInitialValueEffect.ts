'use client';
/**
 * Custom hook for initial value effect
 */

import { useEffect } from 'react';
import type { CardSearchFilters } from '@/lib/types/card';

interface UseInitialValueEffectOptions {
  initialValue: string;
  filters: CardSearchFilters;
  performSearch: (query: string, filters: CardSearchFilters) => void;
}

export function useInitialValueEffect({
  initialValue,
  filters,
  performSearch,
}: UseInitialValueEffectOptions) {
  useEffect(() => {
    if (initialValue) {
      performSearch(initialValue, filters);
    }
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
