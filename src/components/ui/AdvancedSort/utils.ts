/**
 * Utility functions for AdvancedSort
 */

import type { ActiveSort } from './types';

export const getSortIcon = (field: string, activeSorts: ActiveSort[]) => {
  const sort = activeSorts.find((s) => s.field === field);
  if (!sort) return null;

  return sort.order === 'asc' ? '↑' : '↓';
};

export const getSortPriority = (field: string, activeSorts: ActiveSort[]) => {
  const sort = activeSorts.find((s) => s.field === field);
  return sort?.priority;
};

export const isFieldSorted = (field: string, activeSorts: ActiveSort[]) => {
  return activeSorts.some((sort) => sort.field === field);
};
