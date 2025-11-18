/**
 * Utility functions for AdvancedFilters
 */

import type { AdvancedFilterOptions } from './types';

/**
 * Count the number of active filters across all filter types
 */
export function getActiveFilterCount(filters: AdvancedFilterOptions): number {
  let count = 0;

  // Count text filters
  Object.values(filters.textFilters).forEach((value) => {
    if (Array.isArray(value) ? value.length > 0 : value) count++;
  });

  // Count categorical filters
  Object.values(filters.categoricalFilters).forEach((value) => {
    if (Array.isArray(value) && value.length > 0) count++;
  });

  // Count range filters
  Object.values(filters.rangeFilters).forEach((range) => {
    if (range && (range.min !== undefined || range.max !== undefined)) count++;
  });

  // Count boolean filters
  Object.values(filters.booleanFilters).forEach((value) => {
    if (value !== undefined) count++;
  });

  // Count date filters
  Object.values(filters.dateFilters).forEach((dateRange) => {
    if (dateRange && (dateRange.from || dateRange.to)) count++;
  });

  return count;
}

/**
 * Create empty filter object
 */
export function createEmptyFilters(): AdvancedFilterOptions {
  return {
    textFilters: {},
    categoricalFilters: {},
    rangeFilters: {},
    booleanFilters: {},
    dateFilters: {},
  };
}
