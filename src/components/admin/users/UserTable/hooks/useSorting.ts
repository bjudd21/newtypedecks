'use client';
/**
 * Hook for managing table sorting
 */

import { useState, useMemo } from 'react';
import type { User, SortOrder } from '../types';

export function useSorting(users: User[]) {
  const [sortField, setSortField] = useState<keyof User>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const handleSort = (field: keyof User) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];

      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortOrder === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      if (aVal instanceof Date && bVal instanceof Date) {
        return sortOrder === 'asc'
          ? aVal.getTime() - bVal.getTime()
          : bVal.getTime() - aVal.getTime();
      }

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        const aDate = new Date(aVal);
        const bDate = new Date(bVal);
        return sortOrder === 'asc'
          ? aDate.getTime() - bDate.getTime()
          : bDate.getTime() - aDate.getTime();
      }

      return 0;
    });
  }, [users, sortField, sortOrder]);

  return {
    sortField,
    sortOrder,
    sortedUsers,
    handleSort,
  };
}
