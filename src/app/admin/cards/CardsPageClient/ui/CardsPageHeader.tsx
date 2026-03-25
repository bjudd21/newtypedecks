/**
 * Header component for admin cards page
 */

import React from 'react';
import { Button } from '@/components/ui/Button';

interface SimpleGame {
  id: string;
  slug: string;
  name: string;
}

interface CardsPageHeaderProps {
  totalCount: number;
  games: SimpleGame[];
  selectedGameSlug: string;
  onGameChange: (slug: string) => void;
  onCreateClick: () => void;
}

export const CardsPageHeader: React.FC<CardsPageHeaderProps> = ({
  totalCount,
  games,
  selectedGameSlug,
  onGameChange,
  onCreateClick,
}) => {
  const selectedGame = games.find((g) => g.slug === selectedGameSlug);

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-white">Card Management</h1>
        <p className="text-muted-foreground mt-1">
          {selectedGame ? selectedGame.name : 'All Games'} —{' '}
          {totalCount.toLocaleString()} cards
        </p>
      </div>
      <div className="flex items-center gap-3">
        {games.length > 1 && (
          <select
            value={selectedGameSlug}
            onChange={(e) => onGameChange(e.target.value)}
            className="border-border bg-card focus:border-primary rounded-md border px-3 py-2 text-sm text-white focus:outline-none"
          >
            {games.map((game) => (
              <option key={game.slug} value={game.slug}>
                {game.name}
              </option>
            ))}
          </select>
        )}
        <Button variant="primary" onClick={onCreateClick}>
          Create Card
        </Button>
      </div>
    </div>
  );
};
