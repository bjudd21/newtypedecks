/**
 * UserDashboard types
 */

import type { DashboardData } from '@/lib/database/dashboard';

export type { DashboardData };

export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: string;
}

export interface UserDashboardProps {
  user: User;
  dashboardData: DashboardData;
}

export interface QuickAction {
  title: string;
  description: string;
  icon: string;
  action: () => void;
}

export interface Stat {
  title: string;
  value: string;
  icon: string;
  color: string;
}
