/**
 * TabNavigation Component
 * Navigation tabs for switching between collection views
 */

'use client';

import React from 'react';

export type TabType = 'view' | 'import' | 'advanced' | 'export';

interface TabNavigationProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
}

interface Tab {
  id: TabType;
  label: string;
  icon: string;
}

const tabs: Tab[] = [
  { id: 'view', label: 'View Collection', icon: '📖' },
  { id: 'import', label: 'Import Cards', icon: '📥' },
  { id: 'advanced', label: 'Advanced Import', icon: '🔧' },
  { id: 'export', label: 'Export Collection', icon: '📤' },
];

export const TabNavigation: React.FC<TabNavigationProps> = ({
  currentTab,
  onTabChange,
}) => {
  return (
    <div className="mb-6">
      <div className="border-border border-b">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`border-b-2 px-1 py-2 text-sm font-medium ${
                currentTab === tab.id
                  ? 'border-primary text-primary'
                  : 'text-muted-foreground hover:border-primary hover:text-foreground border-transparent'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};
