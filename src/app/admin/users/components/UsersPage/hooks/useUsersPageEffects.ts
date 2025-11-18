'use client';
/**
 * Custom hook for users page effects
 */

import { useEffect } from 'react';
import type { PaginationData } from '../types';

interface UseUsersPageEffectsOptions {
  search: string;
  debouncedSearch: string;
  roleFilter: string;
  pagination: PaginationData;
  setDebouncedSearch: (value: string) => void;
  setPagination: (pagination: PaginationData) => void;
  loadStats: () => void;
  loadUsers: (page: number, searchQuery: string, role: string) => void;
}

export function useUsersPageEffects({
  search,
  debouncedSearch,
  roleFilter,
  pagination,
  setDebouncedSearch,
  setPagination,
  loadStats,
  loadUsers,
}: UseUsersPageEffectsOptions) {
  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search, setDebouncedSearch]);

  // Load stats on mount
  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // Load users when search, role filter, or page changes
  useEffect(() => {
    loadUsers(pagination.currentPage, debouncedSearch, roleFilter);
  }, [pagination.currentPage, debouncedSearch, roleFilter, loadUsers]);

  // Reset to page 1 when search or role filter changes
  useEffect(() => {
    if (pagination.currentPage !== 1) {
      setPagination({ ...pagination, currentPage: 1 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, roleFilter]);
}
