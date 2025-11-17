/**
 * User Service - Re-export for backward compatibility
 * All implementation moved to userService/ directory
 */

export type {
  UserListOptions,
  UserListResult,
  UserActivity,
  UserWithActivity,
  UserStatistics,
  UpdateUserData,
} from './userService/types';

export { UserService } from './userService/UserService';
