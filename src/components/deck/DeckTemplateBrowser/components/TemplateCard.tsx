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
      className={`cursor-pointer rounded-lg border p-4 transition-colors hover:bg-gray-50 ${
        isSelected ? 'bg-blue-50 ring-2 ring-blue-500' : ''
      }`}
    >
      <div className="mb-2 flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-medium text-gray-900">
            {template.name}
          </h3>
          <div className="truncate text-sm text-gray-600">
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
        <div className="mb-3 line-clamp-2 text-sm text-gray-600">
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

        <div className="text-xs text-gray-400">♥ {template.favoriteCount}</div>
      </div>
    </div>
  );
};
