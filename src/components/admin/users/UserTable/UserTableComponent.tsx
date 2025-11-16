'use client';

import React from 'react';
import { useSorting } from './hooks/useSorting';
import { LoadingState } from './components/LoadingState';
import { EmptyState } from './components/EmptyState';
import { TableHeader } from './components/TableHeader';
import { TableRow } from './components/TableRow';
import type { UserTableProps } from './types';

export function UserTableComponent({
  users,
  onEdit,
  onDelete,
  isLoading,
}: UserTableProps) {
  const { sortField, sortOrder, sortedUsers, handleSort } = useSorting(users);

  if (isLoading) {
    return <LoadingState />;
  }

  if (users.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-[#443a5c] bg-[#2d2640]/60 backdrop-blur-md">
      <div className="overflow-x-auto">
        <table className="w-full">
          <TableHeader
            sortField={sortField}
            sortOrder={sortOrder}
            onSort={handleSort}
          />
          <tbody className="divide-y divide-[#443a5c]">
            {sortedUsers.map((user) => (
              <TableRow
                key={user.id}
                user={user}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserTableComponent;
