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
      <div className="border-b border-[#443a5c]">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`border-b-2 px-1 py-2 text-sm font-medium ${
                currentTab === tab.id
                  ? 'border-[#8b7aaa] text-[#8b7aaa]'
                  : 'border-transparent text-gray-400 hover:border-[#6b5a8a] hover:text-gray-300'
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
