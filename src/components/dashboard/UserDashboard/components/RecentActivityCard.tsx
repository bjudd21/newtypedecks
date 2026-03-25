/**
 * Recent activity card component
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

export const RecentActivityCard: React.FC = () => {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-primary/80">RECENT ACTIVITY</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="text-muted-foreground py-8 text-center">
            <p>No recent activity yet.</p>
            <p className="text-muted-foreground/70 mt-1 text-sm">
              Start building decks or managing your collection to see activity
              here.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
