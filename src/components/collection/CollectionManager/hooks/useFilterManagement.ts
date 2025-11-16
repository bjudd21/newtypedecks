/**
 * Hook for managing collection filters
 */

import { useCallback } from 'react';
import type { CollectionFilters } from '../types';

interface UseFilterManagementOptions {
  setFilters: (
    filters: CollectionFilters | ((prev: CollectionFilters) => CollectionFilters)
  ) => void;
}

export function useFilterManagement({
  setFilters,
}: UseFilterManagementOptions) {
  const handleFilterChange = useCallback(
    (field: string, value: string | number) => {
      setFilters((prev) => ({
        ...prev,
        [field]: value,
        page:
          field !== 'page'
            ? 1
            : typeof value === 'number'
              ? value
              : parseInt(value) || 1,
      }));
    },
    [setFilters]
  );

  return { handleFilterChange };
}
