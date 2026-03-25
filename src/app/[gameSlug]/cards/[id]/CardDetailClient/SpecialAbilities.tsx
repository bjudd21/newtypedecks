import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { parseAbilities } from '../utils/parseAbilities';

export function SpecialAbilities({ abilities }: { abilities: string }) {
  const parsedAbilities = parseAbilities(abilities);

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <svg
            className="text-primary h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          Special Abilities
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {parsedAbilities.map((ability, index) => (
            <div
              key={index}
              className="border-primary bg-primary/10 rounded-r-md border-l-4 p-3"
            >
              <h4 className="text-foreground mb-1 text-sm font-semibold">
                {ability.name}
              </h4>
              <p className="text-foreground text-sm leading-relaxed">
                {ability.description}
              </p>
              {ability.cost && (
                <p className="text-primary mt-1 text-xs">
                  Cost: {ability.cost}
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
