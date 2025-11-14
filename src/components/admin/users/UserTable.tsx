'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
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

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  isLoading?: boolean;
}

export function UserTable({
  users,
  onEdit,
  onDelete,
  isLoading,
}: UserTableProps) {
  const [sortField, setSortField] = useState<keyof User>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: keyof User) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedUsers = [...users].sort((a, b) => {
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

  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return 'destructive';
      case UserRole.MODERATOR:
        return 'warning';
      default:
        return 'secondary';
    }
  };

  const formatDate = (date?: Date | string | null) => {
    if (!date) return '—';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#8b7aaa] border-t-transparent" />
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="rounded-lg border border-[#443a5c] bg-[#2d2640]/60 p-12 text-center backdrop-blur-md">
        <p className="text-gray-400">No users found</p>
        <p className="mt-2 text-sm text-gray-500">
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-[#443a5c] bg-[#2d2640]/60 backdrop-blur-md">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-[#443a5c] bg-[#1a1625]">
            <tr>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('email')}
                  className="flex items-center text-sm font-medium text-gray-300 hover:text-white"
                >
                  Email
                  {sortField === 'email' && (
                    <span className="ml-1">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center text-sm font-medium text-gray-300 hover:text-white"
                >
                  Name
                  {sortField === 'name' && (
                    <span className="ml-1">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('role')}
                  className="text-sm font-medium text-gray-300 hover:text-white"
                >
                  Role
                </button>
              </th>
              <th className="px-4 py-3 text-center">
                <span className="text-sm font-medium text-gray-300">
                  Verified
                </span>
              </th>
              <th className="px-4 py-3 text-center">
                <span className="text-sm font-medium text-gray-300">
                  Activity
                </span>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('createdAt')}
                  className="flex items-center text-sm font-medium text-gray-300 hover:text-white"
                >
                  Joined
                  {sortField === 'createdAt' && (
                    <span className="ml-1">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </button>
              </th>
              <th className="px-4 py-3 text-right">
                <span className="text-sm font-medium text-gray-300">
                  Actions
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#443a5c]">
            {sortedUsers.map((user) => (
              <tr
                key={user.id}
                className="transition-colors hover:bg-[#3d3450]/30"
              >
                <td className="px-4 py-3">
                  <div className="max-w-xs">
                    <div className="truncate text-sm text-gray-300">
                      {user.email}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm text-white">
                    {user.name || <span className="text-gray-500">—</span>}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge
                    variant={getRoleBadgeVariant(user.role)}
                    className="text-xs"
                  >
                    {user.role}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-center">
                  {user.emailVerified ? (
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-500/20">
                      <svg
                        className="h-3 w-3 text-green-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  ) : (
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gray-500/20">
                      <svg
                        className="h-3 w-3 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {user.activity ? (
                    <div className="flex justify-center gap-3 text-xs text-gray-400">
                      <span title="Decks">{user.activity.decks}D</span>
                      <span title="Collections">
                        {user.activity.collections}C
                      </span>
                      <span title="Submissions">
                        {user.activity.submissions}S
                      </span>
                    </div>
                  ) : (
                    <div className="text-center text-sm text-gray-500">—</div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm text-gray-400">
                    {formatDate(user.createdAt)}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onEdit(user)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(user)}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
