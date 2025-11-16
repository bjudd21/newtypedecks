/**
 * Type definitions for AdvancedSort component
 */

export interface SortOption {
  key: string;
  label: string;
  description?: string;
  defaultOrder?: 'asc' | 'desc';
  dataType?: 'text' | 'number' | 'date';
}

export interface ActiveSort {
  field: string;
  order: 'asc' | 'desc';
  priority: number; // For multiple sorts, lower number = higher priority
}

export interface AdvancedSortProps {
  sortOptions: SortOption[];
  activeSorts: ActiveSort[];
  onSortsChange: (sorts: ActiveSort[]) => void;
  maxSorts?: number;
  showMultiSort?: boolean;
  className?: string;
}
