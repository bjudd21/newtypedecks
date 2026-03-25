import React from 'react';
import { Badge } from '@/components/ui';

export function RulingItem({
  ruling,
}: {
  ruling: {
    id: string;
    question: string;
    answer: string;
    source: string | null;
    isOfficial: boolean;
    updatedAt: Date;
  };
}) {
  return (
    <div
      className={`border-l-4 pl-4 ${ruling.isOfficial ? 'border-green-400 bg-green-900/20' : 'border-blue-400 bg-blue-900/20'} rounded-r-md p-3`}
    >
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <Badge
          variant={ruling.isOfficial ? 'default' : 'secondary'}
          className={`text-xs ${ruling.isOfficial ? 'bg-green-800/30 text-green-800' : 'bg-blue-800/30 text-blue-800'}`}
        >
          {ruling.isOfficial ? 'Official' : 'Community'}
        </Badge>

        {ruling.source && (
          <Badge
            variant="secondary"
            className="bg-secondary text-foreground text-xs"
          >
            {ruling.source}
          </Badge>
        )}

        <span className="text-muted-foreground ml-auto text-xs">
          Updated: {new Date(ruling.updatedAt).toLocaleDateString()}
        </span>
      </div>

      <div className="mb-3">
        <h4
          className={`mb-1 text-sm font-semibold ${ruling.isOfficial ? 'text-green-900' : 'text-blue-900'}`}
        >
          Q: {ruling.question}
        </h4>
      </div>

      <div
        className={`text-sm leading-relaxed ${ruling.isOfficial ? 'text-green-800' : 'text-blue-800'}`}
      >
        <strong>A:</strong> {ruling.answer}
      </div>
    </div>
  );
}
