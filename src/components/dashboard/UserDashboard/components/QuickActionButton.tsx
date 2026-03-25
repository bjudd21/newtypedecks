/**
 * Quick action button component
 */

import React from 'react';
import type { QuickAction } from '../types';

interface QuickActionButtonProps {
  action: QuickAction;
}

export const QuickActionButton: React.FC<QuickActionButtonProps> = ({
  action,
}) => {
  return (
    <button
      onClick={action.action}
      className="group border-border bg-background hover:border-primary hover:bg-accent hover:shadow-primary/20 rounded-lg border p-4 text-left transition-all duration-200 hover:shadow-lg"
    >
      <div className="mb-2 flex items-center">
        <span className="mr-3 text-xl">{action.icon}</span>
        <h3 className="group-hover:text-primary/80 font-medium text-white transition-colors">
          {action.title}
        </h3>
      </div>
      <p className="text-muted-foreground text-sm">{action.description}</p>
    </button>
  );
};
