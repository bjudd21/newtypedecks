'use client';
/**
 * Custom hook for users page state management
 */

import { useState } from 'react';
import type { User, UserStatistics, PaginationData } from '../types';

export function useUsersPageState() {
  // Data states
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStatistics | null>(null);

  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isStatsLoading, setIsStatsLoading] = useState(true);

  // Filter states
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('');

  // Pagination state
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasMore: false,
  });

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>();

  return {
    // Data
    users,
    setUsers,
    stats,
    setStats,

    // Loading
    isLoading,
    setIsLoading,
    isStatsLoading,
    setIsStatsLoading,

    // Filters
    search,
    setSearch,
    debouncedSearch,
    setDebouncedSearch,
    roleFilter,
    setRoleFilter,

    // Pagination
    pagination,
    setPagination,

    // Modals
    isEditModalOpen,
    setIsEditModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    selectedUser,
    setSelectedUser,
  };
}
