/**
 * Individual template card component
 */

import React from 'react';
import { Button, Badge } from '@/components/ui';
import { TemplateStats } from './TemplateStats';
import { ColorBadges } from './ColorBadges';
import { getSourceBadgeColor } from '../utils';
import type { DeckTemplate } from '../types';

interface TemplateCardProps {
  template: DeckTemplate;
  isSelected: boolean;
  isCreating: boolean;
  onTemplateClick: (template: DeckTemplate) => void;
  onCreateFromTemplate: (templateId: string) => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  isSelected,
  isCreating,
  onTemplateClick,
  onCreateFromTemplate,
}) => {
  return (
    <div
      onClick={() => onTemplateClick(template)}
      className={`hover:bg-accent cursor-pointer rounded-lg border p-4 transition-colors ${
        isSelected ? 'bg-blue-50 ring-2 ring-blue-500' : ''
      }`}
    >
      <div className="mb-2 flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="text-foreground truncate font-medium">
            {template.name}
          </h3>
          <div className="text-muted-foreground truncate text-sm">
            by {template.creator.name || 'Unknown'}
          </div>
        </div>
        {template.templateSource && (
          <Badge className={getSourceBadgeColor(template.templateSource)}>
            {template.templateSource}
          </Badge>
        )}
      </div>

      {template.description && (
        <div className="text-muted-foreground mb-3 line-clamp-2 text-sm">
          {template.description}
        </div>
      )}

      <TemplateStats
        cardCount={template.cardCount}
        uniqueCards={template.uniqueCards}
        totalCost={template.totalCost}
        usageCount={template.usageCount}
      />

      <ColorBadges colors={template.colors} />

      <div className="flex items-center gap-2">
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onCreateFromTemplate(template.id);
          }}
          size="sm"
          variant="default"
          disabled={isCreating}
          className="flex-1"
        >
          {isCreating ? 'Creating...' : 'Use Template'}
        </Button>

        <div className="text-muted-foreground text-xs">
          ♥ {template.favoriteCount}
        </div>
      </div>
    </div>
  );
};
