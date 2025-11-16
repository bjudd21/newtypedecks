/**
 * UserTable types
 */

import { UserRole } from '@prisma/client';

export interface User {
  id: string;
  email: string;
  name?: string | null;
  role: UserRole;
  emailVerified?: Date | string | null;
  createdAt?: Date | string;
  activity?: {
    decks: number;
    collections: number;
    submissions: number;
  };
}

export interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  isLoading?: boolean;
}

export type SortOrder = 'asc' | 'desc';
