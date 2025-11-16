/**
 * Hook for managing dropdown state
 */

import { useState } from 'react';

export function useDropdown() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  return {
    isDropdownOpen,
    toggleDropdown,
    closeDropdown,
  };
}
