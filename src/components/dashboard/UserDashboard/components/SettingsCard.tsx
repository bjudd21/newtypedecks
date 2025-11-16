/**
 * Settings and preferences card component
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui';

export const SettingsCard: React.FC = () => {
  return (
    <Card className="border-[#443a5c] bg-[#2d2640]">
      <CardHeader>
        <CardTitle className="text-[#a89ec7]">
          SETTINGS & PREFERENCES
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="rounded-lg border border-[#443a5c] bg-[#1a1625] p-4">
            <h4 className="mb-2 font-medium text-white">Privacy Settings</h4>
            <p className="mb-3 text-sm text-gray-400">
              Control who can see your decks and collection.
            </p>
            <Button variant="brandOutline" size="sm" disabled>
              COMING SOON
            </Button>
          </div>

          <div className="rounded-lg border border-[#443a5c] bg-[#1a1625] p-4">
            <h4 className="mb-2 font-medium text-white">Export Data</h4>
            <p className="mb-3 text-sm text-gray-400">
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
