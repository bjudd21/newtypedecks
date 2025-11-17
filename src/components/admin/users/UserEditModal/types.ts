/**
 * Type definitions for UserEditModal
 */

import type { UserRole } from '@prisma/client';

export interface User {
  id: string;
  email: string;
  name?: string | null;
  role: UserRole;
}

export interface UserEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user: User;
}

export interface FormData {
  name: string;
  email: string;
  role: UserRole;
  password?: string;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}
