/**
 * Table header component
 */

import React from 'react';
import { SortButton } from './SortButton';
import type { User, SortOrder } from '../types';

interface TableHeaderProps {
  sortField: keyof User;
  sortOrder: SortOrder;
  onSort: (field: keyof User) => void;
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
          <SortButton
            field="email"
            label="Email"
            currentField={sortField}
            sortOrder={sortOrder}
            onSort={onSort}
          />
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
            onClick={() => onSort('role')}
            className="text-foreground hover:text-foreground text-sm font-medium"
          >
            Role
          </button>
        </th>
        <th className="px-4 py-3 text-center">
          <span className="text-foreground text-sm font-medium">Verified</span>
        </th>
        <th className="px-4 py-3 text-center">
          <span className="text-foreground text-sm font-medium">Activity</span>
        </th>
        <th className="px-4 py-3 text-left">
          <SortButton
            field="createdAt"
            label="Joined"
            currentField={sortField}
            sortOrder={sortOrder}
            onSort={onSort}
          />
        </th>
        <th className="px-4 py-3 text-right">
          <span className="text-foreground text-sm font-medium">Actions</span>
        </th>
      </tr>
    </thead>
  );
};
