/**
 * UserTable - Backward compatibility re-export layer
 *
 * This file maintains backward compatibility for existing imports while
 * the actual implementation has been modularized into UserTable/
 */

// Main component exports
export { UserTableComponent as UserTable } from './UserTable/UserTableComponent';
export { UserTableComponent as default } from './UserTable/UserTableComponent';

// Type exports
export type { User, UserTableProps, SortOrder } from './UserTable/types';

// Utility exports
export { getRoleBadgeVariant, formatDate } from './UserTable/utils';

// Hook exports
export { useSorting } from './UserTable/hooks/useSorting';

// Component exports
export { LoadingState } from './UserTable/components/LoadingState';
export { EmptyState } from './UserTable/components/EmptyState';
export { TableHeader } from './UserTable/components/TableHeader';
export { TableRow } from './UserTable/components/TableRow';
export { SortButton } from './UserTable/components/SortButton';
export { VerifiedBadge } from './UserTable/components/VerifiedBadge';
export { ActivityStats } from './UserTable/components/ActivityStats';
