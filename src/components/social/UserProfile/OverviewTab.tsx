/**
 * OverviewTab Component
 * Displays user statistics and recent activity
 */

import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
} from '@/components/ui';
import type { UserProfile } from '@/lib/services/socialService';

interface OverviewTabProps {
  profile: UserProfile;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ profile }) => {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Total Decks</span>
              <span className="font-medium">
                {profile.statistics.totalDecks}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Public Decks</span>
              <span className="font-medium">
                {profile.statistics.publicDecks}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Average Rating</span>
              <div className="flex items-center gap-1">
                <span className="font-medium">
                  {profile.statistics.averageRating.toFixed(1)}
                </span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`text-sm ${
                        star <= Math.round(profile.statistics.averageRating)
                          ? 'text-yellow-400'
                          : 'text-foreground'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Comments Given</span>
              <span className="font-medium">
                {profile.statistics.commentsGiven}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Comments Received</span>
              <span className="font-medium">
                {profile.statistics.commentsReceived}
              </span>
            </div>
            {profile.statistics.favoriteArchetype && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  Favorite Archetype
                </span>
                <Badge variant="secondary">
                  {profile.statistics.favoriteArchetype}
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <div className="bg-primary/20 flex h-8 w-8 items-center justify-center rounded-full">
                🃏
              </div>
              <div className="flex-1">
                <div className="font-medium">Created new deck</div>
                <div className="text-muted-foreground">
                  Tournament Aggro Build • 2 hours ago
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                💬
              </div>
              <div className="flex-1">
                <div className="font-medium">Commented on deck</div>
                <div className="text-muted-foreground">
                  Control Lock Meta Analysis • 1 day ago
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-full">
                ⭐
              </div>
              <div className="flex-1">
                <div className="font-medium">Rated deck</div>
                <div className="text-muted-foreground">
                  Midrange Value Engine • 3 days ago
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
