/**
 * Table row component for single user
 */

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { VerifiedBadge } from './VerifiedBadge';
import { ActivityStats } from './ActivityStats';
import { formatDate, getRoleBadgeVariant } from '../utils';
import type { User } from '../types';

interface TableRowProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export const TableRow: React.FC<TableRowProps> = ({
  user,
  onEdit,
  onDelete,
}) => {
  return (
    <tr className="hover:bg-accent transition-colors">
      <td className="px-4 py-3">
        <div className="max-w-xs">
          <div className="text-foreground truncate text-sm">{user.email}</div>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="text-sm text-white">
          {user.name || <span className="text-muted-foreground/70">—</span>}
        </div>
      </td>
      <td className="px-4 py-3">
        <Badge variant={getRoleBadgeVariant(user.role)} className="text-xs">
          {user.role}
        </Badge>
      </td>
      <td className="px-4 py-3 text-center">
        <VerifiedBadge isVerified={!!user.emailVerified} />
      </td>
      <td className="px-4 py-3">
        <ActivityStats activity={user.activity} />
      </td>
      <td className="px-4 py-3">
        <div className="text-muted-foreground text-sm">
          {formatDate(user.createdAt)}
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={() => onEdit(user)}>
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(user)}
          >
            Delete
          </Button>
        </div>
      </td>
    </tr>
  );
};
