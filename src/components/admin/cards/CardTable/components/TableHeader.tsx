/**
 * Table header component
 */

import React from 'react';
import { SortButton } from './SortButton';
import type { Card, SortOrder } from '../types';

interface TableHeaderProps {
  sortField: keyof Card;
  sortOrder: SortOrder;
  onSort: (field: keyof Card) => void;
}

export const TableHeader: React.FC<TableHeaderProps> = ({
  sortField,
  sortOrder,
  onSort,
}) => {
  return (
    <thead className="border-border bg-background border-b">
      <tr>
        <th className="px-4 py-3 text-left">
          <button
            onClick={() => onSort('imageUrl')}
            className="text-foreground hover:text-foreground text-sm font-medium"
          >
            Image
          </button>
        </th>
        <th className="px-4 py-3 text-left">
          <SortButton
            field="name"
            label="Name"
            currentField={sortField}
            sortOrder={sortOrder}
            onSort={onSort}
          />
        </th>
        <th className="px-4 py-3 text-left">
          <button
            onClick={() => onSort('type')}
            className="text-foreground hover:text-foreground text-sm font-medium"
          >
            Type
          </button>
        </th>
        <th className="px-4 py-3 text-left">
          <button
            onClick={() => onSort('rarity')}
            className="text-foreground hover:text-foreground text-sm font-medium"
          >
            Rarity
          </button>
        </th>
        <th className="px-4 py-3 text-left">
          <button
            onClick={() => onSort('set')}
            className="text-foreground hover:text-foreground text-sm font-medium"
          >
            Set
          </button>
        </th>
        <th className="px-4 py-3 text-center">
          <button
            onClick={() => onSort('level')}
            className="text-foreground hover:text-foreground text-sm font-medium"
          >
            Level
          </button>
        </th>
        <th className="px-4 py-3 text-center">
          <button
            onClick={() => onSort('cost')}
            className="text-foreground hover:text-foreground text-sm font-medium"
          >
            Cost
          </button>
        </th>
        <th className="px-4 py-3 text-right">
          <span className="text-foreground text-sm font-medium">Actions</span>
        </th>
      </tr>
    </thead>
  );
};
