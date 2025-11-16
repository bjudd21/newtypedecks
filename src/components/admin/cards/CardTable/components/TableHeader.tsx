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
    <thead className="border-b border-[#443a5c] bg-[#1a1625]">
      <tr>
        <th className="px-4 py-3 text-left">
          <button
            onClick={() => onSort('imageUrl')}
            className="text-sm font-medium text-gray-300 hover:text-white"
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
            className="text-sm font-medium text-gray-300 hover:text-white"
          >
            Type
          </button>
        </th>
        <th className="px-4 py-3 text-left">
          <button
            onClick={() => onSort('rarity')}
            className="text-sm font-medium text-gray-300 hover:text-white"
          >
            Rarity
          </button>
        </th>
        <th className="px-4 py-3 text-left">
          <button
            onClick={() => onSort('set')}
            className="text-sm font-medium text-gray-300 hover:text-white"
          >
            Set
          </button>
        </th>
        <th className="px-4 py-3 text-center">
          <button
            onClick={() => onSort('level')}
            className="text-sm font-medium text-gray-300 hover:text-white"
          >
            Level
          </button>
        </th>
        <th className="px-4 py-3 text-center">
          <button
            onClick={() => onSort('cost')}
            className="text-sm font-medium text-gray-300 hover:text-white"
          >
            Cost
          </button>
        </th>
        <th className="px-4 py-3 text-right">
          <span className="text-sm font-medium text-gray-300">Actions</span>
        </th>
      </tr>
    </thead>
  );
};
