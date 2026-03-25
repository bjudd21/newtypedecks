/**
 * Tab navigation component
 */

import React from 'react';
import type { TabType } from '../types';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs = [
    { id: 'overview' as TabType, label: '📊 Overview' },
    { id: 'distributions' as TabType, label: '📈 Distributions' },
    { id: 'suggestions' as TabType, label: '💡 Suggestions' },
    { id: 'improvements' as TabType, label: '⚡ Improvements' },
  ];

  return (
    <div className="mb-6">
      <div className="border-border border-b">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`border-b-2 px-1 py-2 text-sm font-medium ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'text-muted-foreground/70 hover:border-border hover:text-muted-foreground border-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};
