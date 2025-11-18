'use client';
/**
 * Hook for managing filter operations
 */

import { useCallback } from 'react';
import type { AdvancedFilterOptions, FilterRange } from '../types';

interface UseFilterManagementOptions {
  filters: AdvancedFilterOptions;
  onFiltersChange: (filters: AdvancedFilterOptions) => void;
}

export function useFilterManagement({
  filters,
  onFiltersChange,
}: UseFilterManagementOptions) {
  /**
   * Update a filter in a specific section
   */
  const updateFilters = useCallback(
    (section: keyof AdvancedFilterOptions, key: string, value: unknown) => {
      const newFilters = {
        ...filters,
        [section]: {
          ...filters[section],
          [key]: value,
        },
      };
      onFiltersChange(newFilters);
    },
    [filters, onFiltersChange]
  );

  /**
   * Update a range filter (min/max)
   */
  const updateRangeFilter = useCallback(
    (field: string, type: 'min' | 'max', value: number | undefined) => {
      const currentRange =
        filters.rangeFilters[field as keyof typeof filters.rangeFilters] || {};
      const newRange = { ...currentRange, [type]: value } as FilterRange;
      updateFilters('rangeFilters', field, newRange);
    },
    [filters, updateFilters]
  );

  /**
   * Add a value to an array filter
   */
  const addArrayFilter = useCallback(
    (section: keyof AdvancedFilterOptions, key: string, value: string) => {
      const current = (filters[section] as Record<string, string[]>)[key] || [];
      if (!current.includes(value)) {
        updateFilters(section, key, [...current, value]);
      }
    },
    [filters, updateFilters]
  );

  /**
   * Remove a value from an array filter
   */
  const removeArrayFilter = useCallback(
    (section: keyof AdvancedFilterOptions, key: string, value: string) => {
      const current = (filters[section] as Record<string, string[]>)[key] || [];
      updateFilters(
        section,
        key,
        current.filter((item: string) => item !== value)
      );
    },
    [filters, updateFilters]
  );

  /**
   * Clear all filters
   */
  const clearAllFilters = useCallback(() => {
    onFiltersChange({
      textFilters: {},
      categoricalFilters: {},
      rangeFilters: {},
      booleanFilters: {},
      dateFilters: {},
    });
  }, [onFiltersChange]);

  return {
    updateFilters,
    updateRangeFilter,
    addArrayFilter,
    removeArrayFilter,
    clearAllFilters,
  };
}
