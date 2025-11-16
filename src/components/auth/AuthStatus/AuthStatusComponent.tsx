'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useDropdown } from './hooks/useDropdown';
import { useMenuItems } from './hooks/useMenuItems';
import { LoadingState } from './components/LoadingState';
import { UnauthenticatedState } from './components/UnauthenticatedState';
import { UserButton } from './components/UserButton';
import { DropdownMenu } from './components/DropdownMenu';
import type { AuthStatusProps } from './types';

export function AuthStatusComponent({ className = '' }: AuthStatusProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { isDropdownOpen, toggleDropdown, closeDropdown } = useDropdown();
  const menuItems = useMenuItems(closeDropdown);

  if (isLoading) {
    return <LoadingState className={className} />;
  }

  if (!isAuthenticated) {
    return <UnauthenticatedState className={className} />;
  }

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className="relative">
        <UserButton
          userName={user?.name}
          isDropdownOpen={isDropdownOpen}
          onToggle={toggleDropdown}
        />
        <DropdownMenu
          isOpen={isDropdownOpen}
          menuItems={menuItems}
          userRole={user?.role}
          onClose={closeDropdown}
        />
      </div>
    </div>
  );
}

export default AuthStatusComponent;
