'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, Badge } from '@/components/ui';
import { DeckSuggestion } from '@/lib/services/deckAnalyticsService';

interface SuggestionsListProps {
  suggestions: DeckSuggestion[];
  className?: string;
}

export const SuggestionsList: React.FC<SuggestionsListProps> = ({
  suggestions,
  className
}) => {
  if (suggestions.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Deck Suggestions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-600">
            <div className="text-4xl mb-2">✨</div>
            <p>Your deck looks great!</p>
            <p className="text-sm">No specific suggestions at this time.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sort suggestions by priority and impact
  const sortedSuggestions = [...suggestions].sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
    if (priorityDiff !== 0) return priorityDiff;
    return b.impact - a.impact;
  });

  const getPriorityColor = (priority: DeckSuggestion['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: DeckSuggestion['type']) => {
    switch (type) {
      case 'add': return '➕';
      case 'remove': return '➖';
      case 'replace': return '🔄';
      default: return '💡';
    }
  };

  const getImpactColor = (impact: number) => {
    if (impact >= 0.7) return 'text-red-600';
    if (impact >= 0.4) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Deck Suggestions</CardTitle>
        <div className="text-sm text-gray-600">
          AI-powered recommendations to improve your deck
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedSuggestions.map((suggestion, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl">{getTypeIcon(suggestion.type)}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      variant="outline"
                      className={`text-xs capitalize ${getPriorityColor(suggestion.priority)}`}
                    >
                      {suggestion.priority} priority
                    </Badge>
                    <Badge variant="secondary" className="text-xs capitalize">
                      {suggestion.type}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-500">Impact:</span>
                      <span className={`text-xs font-medium ${getImpactColor(suggestion.impact)}`}>
                        {Math.round(suggestion.impact * 100)}%
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-900 mb-2">
                    {suggestion.reason}
                  </p>

                  {suggestion.card && (
                    <div className="mt-2 p-2 bg-blue-50 rounded border">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-blue-600 font-medium">Suggested Card:</span>
                        <span className="text-sm font-medium">{suggestion.card.name}</span>
                        {suggestion.card.cost !== null && (
                          <Badge variant="outline" className="text-xs">
                            Cost {suggestion.card.cost}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {suggestion.targetCard && (
                    <div className="mt-2 p-2 bg-orange-50 rounded border">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-orange-600 font-medium">Replace:</span>
                        <span className="text-sm font-medium">{suggestion.targetCard.name}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-6 pt-4 border-t">
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <div className="font-semibold text-red-600">
                {suggestions.filter(s => s.priority === 'high').length}
              </div>
              <div className="text-gray-600">High Priority</div>
            </div>
            <div>
              <div className="font-semibold text-yellow-600">
                {suggestions.filter(s => s.priority === 'medium').length}
              </div>
              <div className="text-gray-600">Medium Priority</div>
            </div>
            <div>
              <div className="font-semibold text-blue-600">
                {suggestions.filter(s => s.priority === 'low').length}
              </div>
              <div className="text-gray-600">Low Priority</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SuggestionsList;