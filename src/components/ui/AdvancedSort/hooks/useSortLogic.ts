/**
 * Custom hook for sort management logic
 */

import { useCallback } from 'react';
import type { ActiveSort } from '../types';

interface UseSortLogicOptions {
  activeSorts: ActiveSort[];
  onSortsChange: (sorts: ActiveSort[]) => void;
  maxSorts: number;
}

export function useSortLogic({
  activeSorts,
  onSortsChange,
  maxSorts,
}: UseSortLogicOptions) {
  const addSort = useCallback(
    (field: string, order: 'asc' | 'desc') => {
      // Check if this field is already being sorted
      const existingIndex = activeSorts.findIndex((sort) => sort.field === field);

      if (existingIndex >= 0) {
        // Update existing sort
        const newSorts = [...activeSorts];
        newSorts[existingIndex] = { ...newSorts[existingIndex], order };
        onSortsChange(newSorts);
      } else {
        // Add new sort
        if (activeSorts.length >= maxSorts) {
          // Replace the lowest priority sort
          const newSorts = activeSorts
            .slice(0, maxSorts - 1)
            .map((sort) => ({ ...sort, priority: sort.priority + 1 }));

          newSorts.unshift({ field, order, priority: 1 });
          onSortsChange(newSorts);
        } else {
          // Add new sort with highest priority
          const newSorts = [
            { field, order, priority: 1 },
            ...activeSorts.map((sort) => ({
              ...sort,
              priority: sort.priority + 1,
            })),
          ];
          onSortsChange(newSorts);
        }
      }
    },
    [activeSorts, onSortsChange, maxSorts]
  );

  const removeSort = useCallback(
    (field: string) => {
      const newSorts = activeSorts
        .filter((sort) => sort.field !== field)
        .map((sort, index) => ({ ...sort, priority: index + 1 }));
      onSortsChange(newSorts);
    },
    [activeSorts, onSortsChange]
  );

  const clearAllSorts = useCallback(() => {
    onSortsChange([]);
  }, [onSortsChange]);

  // Get the primary sort for simple display
  const primarySort = activeSorts.find((sort) => sort.priority === 1);

  return {
    addSort,
    removeSort,
    clearAllSorts,
    primarySort,
  };
}
