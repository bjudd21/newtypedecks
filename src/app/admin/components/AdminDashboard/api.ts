/**
 * API utilities for Admin Dashboard
 */

import type { DashboardStats } from './types';

interface FetchStatsResponse {
  success: boolean;
  stats?: DashboardStats;
}

export async function fetchDashboardStats(): Promise<DashboardStats | null> {
  try {
    const response = await fetch('/api/admin/stats');
    const data: FetchStatsResponse = await response.json();

    if (data.success) {
      return data.stats || null;
    }

    return null;
  } catch (error) {
    console.error('Failed to load dashboard stats:', error);
    return null;
  }
}
