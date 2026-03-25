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
    return (
      <div className="text-muted-foreground/70 text-center text-sm">—</div>
    );
  }

  return (
    <div className="text-muted-foreground flex justify-center gap-3 text-xs">
      <span title="Decks">{activity.decks}D</span>
      <span title="Collections">{activity.collections}C</span>
      <span title="Submissions">{activity.submissions}S</span>
    </div>
  );
};
