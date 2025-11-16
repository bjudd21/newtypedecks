/**
 * UserDashboard - Backward compatibility re-export layer
 *
 * This file maintains backward compatibility for existing imports while
 * the actual implementation has been modularized into UserDashboard/
 */

// Main component exports
export { UserDashboardComponent as UserDashboard } from './UserDashboard/UserDashboardComponent';
export { UserDashboardComponent as default } from './UserDashboard/UserDashboardComponent';

// Type exports
export type {
  User,
  UserDashboardProps,
  QuickAction,
  Stat,
} from './UserDashboard/types';

// Constants exports
export { STATS } from './UserDashboard/constants';

// Hook exports
export { useQuickActions } from './UserDashboard/hooks/useQuickActions';

// Component exports
export { WelcomeSection } from './UserDashboard/components/WelcomeSection';
export { StatsGrid } from './UserDashboard/components/StatsGrid';
export { StatCard } from './UserDashboard/components/StatCard';
export { QuickActionsCard } from './UserDashboard/components/QuickActionsCard';
export { QuickActionButton } from './UserDashboard/components/QuickActionButton';
export { RecentActivityCard } from './UserDashboard/components/RecentActivityCard';
export { AccountInfoCard } from './UserDashboard/components/AccountInfoCard';
export { SettingsCard } from './UserDashboard/components/SettingsCard';
