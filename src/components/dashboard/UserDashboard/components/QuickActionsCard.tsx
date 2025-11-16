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
    <Card className="border-[#443a5c] bg-[#2d2640]">
      <CardHeader>
        <CardTitle className="text-[#a89ec7]">QUICK ACTIONS</CardTitle>
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
