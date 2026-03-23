import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { parseAbilities } from '../utils/parseAbilities';

export function SpecialAbilities({ abilities }: { abilities: string }) {
  const parsedAbilities = parseAbilities(abilities);

  return (
    <Card className="border-gray-700 bg-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <svg
            className="h-5 w-5 text-purple-600"
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
              className="rounded-r-md border-l-4 border-purple-400 bg-purple-900/20 p-3"
            >
              <h4 className="mb-1 text-sm font-semibold text-purple-900">
                {ability.name}
              </h4>
              <p className="text-sm leading-relaxed text-purple-800">
                {ability.description}
              </p>
              {ability.cost && (
                <p className="mt-1 text-xs text-purple-600">
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
