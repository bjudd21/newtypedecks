/**
 * User Service Module
 * Exports all user service functionality
 */

// Export types
export type {
  UserListOptions,
  UserListResult,
  UserActivity,
  UserWithActivity,
  UserStatistics,
  UpdateUserData,
} from './types';

// Export utility functions
export * from './userQuery';
export * from './userCrud';
export * from './userStatistics';
export * from './userValidation';

// Export main service
export { UserService } from './UserService';
