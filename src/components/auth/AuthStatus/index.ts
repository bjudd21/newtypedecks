/**
 * AuthStatus Module Exports
 *
 * This module provides an authentication status component with:
 * - User dropdown menu with profile links
 * - Loading and unauthenticated states
 * - Admin panel link for privileged users
 * - Sign-out functionality
 * - Framer Motion animations
 */

// Main component
export { AuthStatusComponent } from './AuthStatusComponent';

// Types
export type { AuthStatusProps, MenuItem } from './types';

// Constants
export { dropdownVariants, itemVariants } from './constants';

// Hooks
export { useDropdown } from './hooks/useDropdown';
export { useMenuItems } from './hooks/useMenuItems';

// Components
export { LoadingState } from './components/LoadingState';
export { UnauthenticatedState } from './components/UnauthenticatedState';
export { UserButton } from './components/UserButton';
export { DropdownMenu } from './components/DropdownMenu';

// Icons
export { DashboardIcon } from './components/icons/DashboardIcon';
export { ProfileIcon } from './components/icons/ProfileIcon';
export { AdminIcon } from './components/icons/AdminIcon';
export { LogoutIcon } from './components/icons/LogoutIcon';
