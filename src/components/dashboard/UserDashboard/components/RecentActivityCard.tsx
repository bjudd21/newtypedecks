/**
 * Recent activity card component
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

export const RecentActivityCard: React.FC = () => {
  return (
    <Card className="border-[#443a5c] bg-[#2d2640]">
      <CardHeader>
        <CardTitle className="text-[#a89ec7]">RECENT ACTIVITY</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="py-8 text-center text-gray-400">
            <p>No recent activity yet.</p>
            <p className="mt-1 text-sm text-gray-500">
              Start building decks or managing your collection to see activity
              here.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
