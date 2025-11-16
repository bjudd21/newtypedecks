/**
 * UserTable Module Exports
 *
 * This module provides an admin user management table with:
 * - Sortable columns (email, name, role, created date)
 * - User activity statistics (decks, collections, submissions)
 * - Role badges and email verification status
 * - Edit and delete actions per user
 * - Responsive table layout
 * - Loading and empty states
 */

// Main component
export { UserTableComponent } from './UserTableComponent';

// Types
export type { User, UserTableProps, SortOrder } from './types';

// Utilities
export { getRoleBadgeVariant, formatDate } from './utils';

// Hooks
export { useSorting } from './hooks/useSorting';

// Components
export { LoadingState } from './components/LoadingState';
export { EmptyState } from './components/EmptyState';
export { TableHeader } from './components/TableHeader';
export { TableRow } from './components/TableRow';
export { SortButton } from './components/SortButton';
export { VerifiedBadge } from './components/VerifiedBadge';
export { ActivityStats } from './components/ActivityStats';
