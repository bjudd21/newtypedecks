/**
 * ActivityTab Component
 * Displays user activity feed (placeholder)
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

export const ActivityTab: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Feed</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-muted-foreground py-8 text-center">
          <div className="mb-2 text-4xl">📈</div>
          <p>Activity feed will be loaded here</p>
        </div>
      </CardContent>
    </Card>
  );
};
