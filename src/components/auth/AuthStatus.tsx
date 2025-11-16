/**
 * AuthStatus - Backward compatibility re-export layer
 *
 * This file maintains backward compatibility for existing imports while
 * the actual implementation has been modularized into AuthStatus/
 */

// Main component exports
export { AuthStatusComponent as AuthStatus } from './AuthStatus/AuthStatusComponent';
export { AuthStatusComponent as default } from './AuthStatus/AuthStatusComponent';

// Type exports
export type { AuthStatusProps, MenuItem } from './AuthStatus/types';

// Constants exports
export { dropdownVariants, itemVariants } from './AuthStatus/constants';

// Hook exports
export { useDropdown } from './AuthStatus/hooks/useDropdown';
export { useMenuItems } from './AuthStatus/hooks/useMenuItems';

// Component exports
export { LoadingState } from './AuthStatus/components/LoadingState';
export { UnauthenticatedState } from './AuthStatus/components/UnauthenticatedState';
export { UserButton } from './AuthStatus/components/UserButton';
export { DropdownMenu } from './AuthStatus/components/DropdownMenu';

// Icon exports
export { DashboardIcon } from './AuthStatus/components/icons/DashboardIcon';
export { ProfileIcon } from './AuthStatus/components/icons/ProfileIcon';
export { AdminIcon } from './AuthStatus/components/icons/AdminIcon';
export { LogoutIcon } from './AuthStatus/components/icons/LogoutIcon';
