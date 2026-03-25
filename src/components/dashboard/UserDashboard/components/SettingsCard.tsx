/**
 * Settings and preferences card component
 */

import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
} from '@/components/ui';

export const SettingsCard: React.FC = () => {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-primary/80">
          SETTINGS & PREFERENCES
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="border-border bg-background rounded-lg border p-4">
            <h4 className="mb-2 font-medium text-white">Privacy Settings</h4>
            <p className="text-muted-foreground mb-3 text-sm">
              Control who can see your decks and collection.
            </p>
            <Button variant="brandOutline" size="sm" disabled>
              COMING SOON
            </Button>
          </div>

          <div className="border-border bg-background rounded-lg border p-4">
            <h4 className="mb-2 font-medium text-white">Export Data</h4>
            <p className="text-muted-foreground mb-3 text-sm">
              Download your decks and collection data.
            </p>
            <Button variant="brandOutline" size="sm" disabled>
              COMING SOON
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
