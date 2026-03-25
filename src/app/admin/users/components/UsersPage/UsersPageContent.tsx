/**
 * UsersPageContent - Main component orchestrator
 */

'use client';

import { UserTable } from '@/components/admin/users/UserTable';
import { UserEditModal } from '@/components/admin/users/UserEditModal';
import { UserStatsCard } from '@/components/admin/users/UserStatsCard';
import { DeleteConfirmModal } from '@/components/admin/DeleteConfirmModal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Pagination } from '@/components/ui/Pagination';
import { UserRole } from '@prisma/client';
import { useUsersPageState } from './hooks/useUsersPageState';
import { useUsersPageHandlers } from './hooks/useUsersPageHandlers';
import { useUsersPageEffects } from './hooks/useUsersPageEffects';

export function UsersPageContent() {
  // State management
  const {
    users,
    setUsers,
    stats,
    setStats,
    isLoading,
    setIsLoading,
    isStatsLoading,
    setIsStatsLoading,
    search,
    setSearch,
    debouncedSearch,
    setDebouncedSearch,
    roleFilter,
    setRoleFilter,
    pagination,
    setPagination,
    isEditModalOpen,
    setIsEditModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    selectedUser,
    setSelectedUser,
  } = useUsersPageState();

  // Event handlers
  const {
    loadStats,
    loadUsers,
    handlePageChange,
    handleEditClick,
    handleDeleteClick,
    handleModalSuccess,
  } = useUsersPageHandlers({
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
  });

  // Effects
  useUsersPageEffects({
    search,
    debouncedSearch,
    roleFilter,
    pagination,
    setDebouncedSearch,
    setPagination,
    loadStats,
    loadUsers,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">User Management</h1>
        <p className="text-muted-foreground mt-1">
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
            _itemId={selectedUser.id}
            apiEndpoint={`/api/admin/users/${selectedUser.id}`}
          />
        </>
      )}
    </div>
  );
}
