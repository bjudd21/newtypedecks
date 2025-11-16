/**
 * Custom hook for users page event handlers
 */

import { useCallback } from 'react';
import { fetchUsers, fetchUserStats } from '../api';
import type { User, UserStatistics, PaginationData } from '../types';

interface UseUsersPageHandlersOptions {
  debouncedSearch: string;
  roleFilter: string;
  pagination: PaginationData;
  setUsers: (users: User[]) => void;
  setPagination: (pagination: PaginationData) => void;
  setIsLoading: (loading: boolean) => void;
  setStats: (stats: UserStatistics | null) => void;
  setIsStatsLoading: (loading: boolean) => void;
  setIsEditModalOpen: (open: boolean) => void;
  setIsDeleteModalOpen: (open: boolean) => void;
  setSelectedUser: (user: User | undefined) => void;
}

export function useUsersPageHandlers({
  debouncedSearch,
  roleFilter,
  pagination,
  setUsers,
  setPagination,
  setIsLoading,
  setStats,
  setIsStatsLoading,
  setIsEditModalOpen,
  setIsDeleteModalOpen,
  setSelectedUser,
}: UseUsersPageHandlersOptions) {
  // Load user statistics
  const loadStats = useCallback(async () => {
    setIsStatsLoading(true);

    try {
      const stats = await fetchUserStats();
      setStats(stats);
    } finally {
      setIsStatsLoading(false);
    }
  }, [setStats, setIsStatsLoading]);

  // Load users
  const loadUsers = useCallback(
    async (page: number, searchQuery: string, role: string) => {
      setIsLoading(true);

      try {
        const result = await fetchUsers({
          page,
          limit: 20,
          search: searchQuery,
          role,
        });

        setUsers(result.users);
        setPagination(result.pagination);
      } finally {
        setIsLoading(false);
      }
    },
    [setUsers, setPagination, setIsLoading]
  );

  // Handle page change
  const handlePageChange = useCallback(
    (page: number) => {
      setPagination({ ...pagination, currentPage: page });
    },
    [pagination, setPagination]
  );

  // Handle edit click
  const handleEditClick = useCallback(
    (user: User) => {
      setSelectedUser(user);
      setIsEditModalOpen(true);
    },
    [setSelectedUser, setIsEditModalOpen]
  );

  // Handle delete click
  const handleDeleteClick = useCallback(
    (user: User) => {
      setSelectedUser(user);
      setIsDeleteModalOpen(true);
    },
    [setSelectedUser, setIsDeleteModalOpen]
  );

  // Handle modal success (reload data)
  const handleModalSuccess = useCallback(() => {
    loadUsers(pagination.currentPage, debouncedSearch, roleFilter);
    loadStats();
  }, [loadUsers, loadStats, pagination.currentPage, debouncedSearch, roleFilter]);

  return {
    loadStats,
    loadUsers,
    handlePageChange,
    handleEditClick,
    handleDeleteClick,
    handleModalSuccess,
  };
}
