/**
 * User activity statistics component
 */

import React from 'react';

interface ActivityStatsProps {
  activity?: {
    decks: number;
    collections: number;
    submissions: number;
  };
}

export const ActivityStats: React.FC<ActivityStatsProps> = ({ activity }) => {
  if (!activity) {
    return <div className="text-center text-sm text-gray-500">—</div>;
  }

  return (
    <div className="flex justify-center gap-3 text-xs text-gray-400">
      <span title="Decks">{activity.decks}D</span>
      <span title="Collections">{activity.collections}C</span>
      <span title="Submissions">{activity.submissions}S</span>
    </div>
  );
};
