/**
 * Type definitions for Admin Dashboard
 */

import type { UserRole } from '@prisma/client';

export interface DashboardStats {
  cards: {
    total: number;
  };
  users: {
    total: number;
    byRole: {
      [key in UserRole]: number;
    };
    recent: number;
  };
  recentActivity: Array<{
    type: string;
    name: string;
    timestamp: Date | string;
  }>;
}
