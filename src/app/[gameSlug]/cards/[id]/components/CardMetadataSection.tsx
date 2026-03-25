/**
 * CardMetadataSection Component
 * Displays card metadata including ID, language, update date, and tags
 */

'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
} from '@/components/ui';
import type { CardWithRelations } from '@/lib/types/card';

interface CardMetadataSectionProps {
  card: CardWithRelations;
}

export function CardMetadataSection({ card }: CardMetadataSectionProps) {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <svg
            className="text-muted-foreground h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Card Metadata
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="text-foreground font-medium">Card ID</label>
            <div className="text-muted-foreground mt-1 font-mono text-xs break-all">
              {card.id}
            </div>
          </div>

          <div>
            <label className="text-foreground font-medium">Language</label>
            <div className="mt-1 text-white">
              {card.language?.toUpperCase() || 'EN'}
            </div>
          </div>

          <div>
            <label className="text-foreground font-medium">Last Updated</label>
            <div className="text-muted-foreground mt-1">
              {new Date(card.updatedAt).toLocaleDateString()}
            </div>
          </div>

          {card.keywords && card.keywords.length > 0 && (
            <div>
              <label className="text-foreground font-medium">
                Keywords Count
              </label>
              <div className="mt-1 text-white">
                {card.keywords.length} keywords
              </div>
            </div>
          )}

          {card.tags && card.tags.length > 0 && (
            <div>
              <label className="text-foreground font-medium">Tags Count</label>
              <div className="mt-1 text-white">{card.tags.length} tags</div>
            </div>
          )}

          {card.rulings && card.rulings.length > 0 && (
            <div>
              <label className="text-foreground font-medium">
                Rulings Count
              </label>
              <div className="mt-1 text-white">
                {card.rulings.length} rulings
              </div>
            </div>
          )}
        </div>

        {card.tags && card.tags.length > 0 && (
          <div className="border-border mt-4 border-t pt-4">
            <h4 className="text-foreground mb-2 font-medium">Tags</h4>
            <div className="flex flex-wrap gap-1">
              {card.tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-secondary text-foreground text-xs"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
