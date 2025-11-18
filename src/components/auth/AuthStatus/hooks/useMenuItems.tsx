'use client';
/**
 * Hook for generating menu items
 */

import React from 'react';
import { useRouter } from 'next/navigation';
import { DashboardIcon } from '../components/icons/DashboardIcon';
import { ProfileIcon } from '../components/icons/ProfileIcon';
import type { MenuItem } from '../types';

export function useMenuItems(closeDropdown: () => void): MenuItem[] {
  const router = useRouter();

  const handleProfile = () => {
    router.push('/profile');
    closeDropdown();
  };

  const handleDashboard = () => {
    router.push('/dashboard');
    closeDropdown();
  };

  return [
    {
      label: 'Dashboard',
      onClick: handleDashboard,
      icon: <DashboardIcon />,
    },
    {
      label: 'Profile Settings',
      onClick: handleProfile,
      icon: <ProfileIcon />,
    },
  ];
}
