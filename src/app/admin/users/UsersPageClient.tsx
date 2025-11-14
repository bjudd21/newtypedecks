'use client';

import { useState, useEffect, useCallback } from 'react';
import { UserTable } from '@/components/admin/users/UserTable';
import { UserEditModal } from '@/components/admin/users/UserEditModal';
import { UserStatsCard } from '@/components/admin/users/UserStatsCard';
import { DeleteConfirmModal } from '@/components/admin/DeleteConfirmModal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Pagination } from '@/components/ui/Pagination';
import { UserRole } from '@prisma/client';

interface User {
  id: string;
  email: string;
  name?: string | null;
  role: UserRole;
  emailVerified?: Date | string | null;
  createdAt?: Date | string;
  activity?: {
    decks: number;
    collections: number;
    submissions: number;
  };
}

interface UserStatistics {
  total: number;
  byRole: {
    [key in UserRole]: number;
  };
  verified: number;
  unverified: number;
  recentSignups: number;
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasMore: boolean;
}

export function UsersPageClient() {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('');
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

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // Load user statistics
  const loadStats = useCallback(async () => {
    setIsStatsLoading(true);

    try {
      const response = await fetch('/api/admin/users/stats');
      const data = await response.json();

      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to load user statistics:', error);
    } finally {
      setIsStatsLoading(false);
    }
  }, []);

  // Load users
  const loadUsers = useCallback(
    async (page: number, searchQuery: string, role: string) => {
      setIsLoading(true);

      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: '20',
        });

        if (searchQuery) {
          params.append('search', searchQuery);
        }

        if (role) {
          params.append('role', role);
        }

        const response = await fetch(`/api/admin/users?${params.toString()}`);
        const data = await response.json();

        if (data.success) {
          setUsers(data.users || []);
          setPagination({
            currentPage: data.pagination?.page || 1,
            totalPages: data.pagination?.totalPages || 1,
            totalCount: data.pagination?.totalCount || 0,
            hasMore: data.pagination?.hasMore || false,
          });
        }
      } catch (error) {
        console.error('Failed to load users:', error);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

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
      setPagination((prev) => ({ ...prev, currentPage: 1 }));
    }
  }, [debouncedSearch, roleFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleModalSuccess = () => {
    // Reload users and stats after successful edit/delete
    loadUsers(pagination.currentPage, debouncedSearch, roleFilter);
    loadStats();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">User Management</h1>
        <p className="mt-1 text-gray-400">
          Manage user accounts and permissions (
          {pagination.totalCount.toLocaleString()} users)
        </p>
      </div>

      {/* User Statistics */}
      {stats && <UserStatsCard stats={stats} isLoading={isStatsLoading} />}

      {/* Filters */}
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full"
        />

        <Select
          value={roleFilter}
          onChange={(value: string) => setRoleFilter(value)}
          options={[
            { value: '', label: 'All Roles' },
            { value: UserRole.ADMIN, label: 'Admin' },
            { value: UserRole.MODERATOR, label: 'Moderator' },
            { value: UserRole.USER, label: 'User' },
          ]}
          className="w-full"
        />
      </div>

      {/* Users Table */}
      <UserTable
        users={users}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        isLoading={isLoading}
      />

      {/* Pagination */}
      {!isLoading && pagination.totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Modals */}
      {selectedUser && (
        <>
          <UserEditModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onSuccess={handleModalSuccess}
            user={selectedUser}
          />

          <DeleteConfirmModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onSuccess={handleModalSuccess}
            itemType="user"
            itemName={selectedUser.email}
            itemId={selectedUser.id}
            apiEndpoint={`/api/admin/users/${selectedUser.id}`}
          />
        </>
      )}
    </div>
  );
}
