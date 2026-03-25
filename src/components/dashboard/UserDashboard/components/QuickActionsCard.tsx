/**
 * Quick actions card component
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { QuickActionButton } from './QuickActionButton';
import type { QuickAction } from '../types';

interface QuickActionsCardProps {
  actions: QuickAction[];
}

export const QuickActionsCard: React.FC<QuickActionsCardProps> = ({
  actions,
}) => {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-primary/80">QUICK ACTIONS</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {actions.map((action, index) => (
            <QuickActionButton key={index} action={action} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
