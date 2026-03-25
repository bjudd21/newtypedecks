/**
 * Sortable column header button
 */

import React from 'react';
import type { Card, SortOrder } from '../types';

interface SortButtonProps {
  field: keyof Card;
  label: string;
  currentField: keyof Card;
  sortOrder: SortOrder;
  onSort: (field: keyof Card) => void;
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
      className="text-foreground hover:text-foreground flex items-center text-sm font-medium"
    >
      {label}
      {currentField === field && (
        <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
      )}
    </button>
  );
};
