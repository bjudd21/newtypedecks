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
      className="group rounded-lg border border-[#443a5c] bg-[#1a1625] p-4 text-left transition-all duration-200 hover:border-[#8b7aaa] hover:bg-[#3a3050] hover:shadow-lg hover:shadow-[#8b7aaa]/20"
    >
      <div className="mb-2 flex items-center">
        <span className="mr-3 text-xl">{action.icon}</span>
        <h3 className="font-medium text-white transition-colors group-hover:text-[#a89ec7]">
          {action.title}
        </h3>
      </div>
      <p className="text-sm text-gray-400">{action.description}</p>
    </button>
  );
};
