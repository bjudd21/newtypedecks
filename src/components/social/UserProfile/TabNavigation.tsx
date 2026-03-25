/**
 * TabNavigation Component
 * Tab navigation for profile sections
 */

import React from 'react';

type TabId = 'overview' | 'decks' | 'activity' | 'badges';

interface TabNavigationProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const tabs = [
  { id: 'overview' as TabId, label: '📊 Overview' },
  { id: 'decks' as TabId, label: '🃏 Decks' },
  { id: 'activity' as TabId, label: '📈 Activity' },
  { id: 'badges' as TabId, label: '🏆 Badges' },
];

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
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
              className={`border-b-2 px-1 py-3 text-sm font-medium ${
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
