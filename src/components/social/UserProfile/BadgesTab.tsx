/**
 * BadgesTab Component
 * Displays user badges and achievements
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { getBadgeRarityColor } from './utils';
import type { UserProfile } from '@/lib/services/socialService';

interface BadgesTabProps {
  profile: UserProfile;
}

export const BadgesTab: React.FC<BadgesTabProps> = ({ profile }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Badges & Achievements</CardTitle>
      </CardHeader>
      <CardContent>
        {profile.badges.length === 0 ? (
          <div className="text-muted-foreground py-8 text-center">
            <div className="mb-2 text-4xl">🏆</div>
            <p>No badges earned yet</p>
            <p className="text-sm">Complete activities to earn badges!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {profile.badges.map((badge) => (
              <div
                key={badge.id}
                className={`rounded-lg p-4 ${getBadgeRarityColor(badge.rarity)}`}
              >
                <div className="text-center">
                  <div className="mb-2 text-3xl">{badge.icon}</div>
                  <div className="font-semibold">{badge.name}</div>
                  <div className="text-sm opacity-90">{badge.description}</div>
                  <div className="mt-2 text-xs opacity-75">
                    Earned {new Date(badge.earnedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
