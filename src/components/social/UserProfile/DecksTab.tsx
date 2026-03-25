/**
 * DecksTab Component
 * Displays user's public decks (placeholder)
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

export const DecksTab: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Public Decks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-muted-foreground py-8 text-center">
          <div className="mb-2 text-4xl">🃏</div>
          <p>Deck list will be loaded here</p>
        </div>
      </CardContent>
    </Card>
  );
};
