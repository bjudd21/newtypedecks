/**
 * UserDashboard types
 */

export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: string;
}

export interface UserDashboardProps {
  user: User;
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
