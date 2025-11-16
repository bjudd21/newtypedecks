/**
 * UserTable utilities
 */

import { UserRole } from '@prisma/client';

/**
 * Get badge variant based on user role
 */
export function getRoleBadgeVariant(role: UserRole) {
  switch (role) {
    case UserRole.ADMIN:
      return 'destructive' as const;
    case UserRole.MODERATOR:
      return 'warning' as const;
    default:
      return 'secondary' as const;
  }
}

/**
 * Format date for display
 */
export function formatDate(date?: Date | string | null): string {
  if (!date) return '—';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
