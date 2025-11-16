/**
 * Sortable column header button
 */

import React from 'react';
import type { User, SortOrder } from '../types';

interface SortButtonProps {
  field: keyof User;
  label: string;
  currentField: keyof User;
  sortOrder: SortOrder;
  onSort: (field: keyof User) => void;
}

export const SortButton: React.FC<SortButtonProps> = ({
  field,
  label,
  currentField,
  sortOrder,
  onSort,
}) => {
  return (
    <button
      onClick={() => onSort(field)}
      className="flex items-center text-sm font-medium text-gray-300 hover:text-white"
    >
      {label}
      {currentField === field && (
        <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
      )}
    </button>
  );
};
