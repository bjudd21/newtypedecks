/**
 * UserProfile - Backward compatibility re-export layer
 *
 * This file maintains backward compatibility for existing imports while
 * the actual implementation has been modularized into UserProfile/
 */

// Main component exports
export { UserProfileComponent as UserProfile } from './UserProfile/UserProfileComponent';
export { UserProfileComponent as default } from './UserProfile/UserProfileComponent';

// Type exports
export type {
  User,
  UserProfileProps,
  FormData,
  FormErrors,
} from './UserProfile/types';

// Hook exports
export { useFormState } from './UserProfile/hooks/useFormState';
export { useFormValidation } from './UserProfile/hooks/useFormValidation';
export { useProfileHandlers } from './UserProfile/hooks/useProfileHandlers';

// Component exports
export { ErrorMessage } from './UserProfile/components/ErrorMessage';
export { ProfileField } from './UserProfile/components/ProfileField';
export { AccountStatistics } from './UserProfile/components/AccountStatistics';
export { DangerZone } from './UserProfile/components/DangerZone';
export { ProfileInformationCard } from './UserProfile/components/ProfileInformationCard';
export { AccountSettingsCard } from './UserProfile/components/AccountSettingsCard';
