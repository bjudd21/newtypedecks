/**
 * UserDashboard Module Exports
 *
 * This module provides a user dashboard with:
 * - Welcome section with personalized greeting
 * - Statistics cards (decks, cards, collection value, favorite format)
 * - Quick action buttons for common tasks
 * - Recent activity display
 * - Account information card
 * - Settings and preferences card
 */

// Main component
export { UserDashboardComponent } from './UserDashboardComponent';

// Types
export type { User, UserDashboardProps, QuickAction, Stat } from './types';

// Constants
export { STATS } from './constants';

// Hooks
export { useQuickActions } from './hooks/useQuickActions';

// Components
export { WelcomeSection } from './components/WelcomeSection';
export { StatsGrid } from './components/StatsGrid';
export { StatCard } from './components/StatCard';
export { QuickActionsCard } from './components/QuickActionsCard';
export { QuickActionButton } from './components/QuickActionButton';
export { RecentActivityCard } from './components/RecentActivityCard';
export { AccountInfoCard } from './components/AccountInfoCard';
export { SettingsCard } from './components/SettingsCard';
