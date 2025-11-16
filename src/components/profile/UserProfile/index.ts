/**
 * UserProfile Module Exports
 *
 * This module provides a user profile settings component with:
 * - Profile information editing (name, email)
 * - Form validation
 * - Account settings
 * - Account deletion
 */

// Main component
export { UserProfileComponent } from './UserProfileComponent';

// Types
export type { User, UserProfileProps, FormData, FormErrors } from './types';

// Hooks
export { useFormState } from './hooks/useFormState';
export { useFormValidation } from './hooks/useFormValidation';
export { useProfileHandlers } from './hooks/useProfileHandlers';

// Components
export { ErrorMessage } from './components/ErrorMessage';
export { ProfileField } from './components/ProfileField';
export { AccountStatistics } from './components/AccountStatistics';
export { DangerZone } from './components/DangerZone';
export { ProfileInformationCard } from './components/ProfileInformationCard';
export { AccountSettingsCard } from './components/AccountSettingsCard';
