/**
 * API utilities for users page
 */

import type { User, UserStatistics, PaginationData } from './types';

interface FetchUsersOptions {
  page: number;
  limit?: number;
  search?: string;
  role?: string;
}

interface FetchUsersResponse {
  success: boolean;
  users?: User[];
  pagination?: {
    page: number;
    totalPages: number;
    totalCount: number;
    hasMore: boolean;
  };
}

export async function fetchUsers(
  options: FetchUsersOptions
): Promise<{ users: User[]; pagination: PaginationData }> {
  const { page, limit = 20, search, role } = options;

  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (search) {
    params.append('search', search);
  }

  if (role) {
    params.append('role', role);
  }

  try {
    const response = await fetch(`/api/admin/users?${params.toString()}`);
    const data: FetchUsersResponse = await response.json();

    if (data.success) {
      return {
        users: data.users || [],
        pagination: {
          currentPage: data.pagination?.page || 1,
          totalPages: data.pagination?.totalPages || 1,
          totalCount: data.pagination?.totalCount || 0,
          hasMore: data.pagination?.hasMore || false,
        },
      };
    }

    throw new Error('Failed to load users');
  } catch (error) {
    console.error('Failed to fetch users:', error);
    throw error;
  }
}

interface FetchStatsResponse {
  success: boolean;
  stats?: UserStatistics;
}

export async function fetchUserStats(): Promise<UserStatistics | null> {
  try {
    const response = await fetch('/api/admin/users/stats');
    const data: FetchStatsResponse = await response.json();

    if (data.success) {
      return data.stats || null;
    }

    return null;
  } catch (error) {
    console.error('Failed to fetch user statistics:', error);
    return null;
  }
}
