/**
 * Activity Service
 * Handles user activity feeds and following feeds
 */

import type { ActivityFeed } from './types';

export async function getUserActivityFeed(
  _userId: string,
  _page = 1,
  _limit = 20
): Promise<ActivityFeed[]> {
  return [];
}

export async function getFollowingFeed(
  _userId: string,
  _page = 1,
  _limit = 20
): Promise<ActivityFeed[]> {
  return [];
}
