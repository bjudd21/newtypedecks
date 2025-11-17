/**
 * User Service - Main orchestrator
 * Handles user management operations for admin panel
 */

import type { UserRole } from '@prisma/client';
import type {
  UserListOptions,
  UserListResult,
  UserWithActivity,
  UserStatistics,
  UserActivity,
  UpdateUserData,
} from './types';
import * as userQuery from './userQuery';
import * as userCrud from './userCrud';
import * as userStatistics from './userStatistics';
import * as userValidation from './userValidation';

export class UserService {
  /**
   * Get all users with pagination, search, and filtering
   */
  static async getAllUsers(
    options: UserListOptions = {}
  ): Promise<UserListResult> {
    return userQuery.getAllUsers(options);
  }

  /**
   * Get single user by ID with activity statistics
   */
  static async getUserById(id: string): Promise<UserWithActivity | null> {
    return userCrud.getUserById(id);
  }

  /**
   * Update user information
   */
  static async updateUser(
    id: string,
    data: UpdateUserData
  ): Promise<UserWithActivity> {
    return userCrud.updateUser(id, data);
  }

  /**
   * Update user role
   */
  static async updateUserRole(
    id: string,
    role: UserRole
  ): Promise<UserWithActivity> {
    return userCrud.updateUserRole(id, role);
  }

  /**
   * Delete user account
   * This will cascade delete related records based on Prisma schema
   */
  static async deleteUser(id: string): Promise<boolean> {
    return userCrud.deleteUser(id);
  }

  /**
   * Get overall user statistics for admin dashboard
   */
  static async getUserStatistics(): Promise<UserStatistics> {
    return userStatistics.getUserStatistics();
  }

  /**
   * Get user activity details
   */
  static async getUserActivity(id: string): Promise<UserActivity | null> {
    return userStatistics.getUserActivity(id);
  }

  /**
   * Check if user exists by ID
   */
  static async userExists(id: string): Promise<boolean> {
    return userValidation.userExists(id);
  }

  /**
   * Check if email is already in use
   */
  static async emailExists(
    email: string,
    excludeUserId?: string
  ): Promise<boolean> {
    return userValidation.emailExists(email, excludeUserId);
  }
}
