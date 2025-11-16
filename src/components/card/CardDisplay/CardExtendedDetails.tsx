/**
 * CardExtendedDetails - Official text, keywords, set info
 */

import React from 'react';
import { Badge } from '@/components/ui';

interface CardExtendedDetailsProps {
  officialText?: string | null;
  keywords?: string[] | null;
  set?: { name: string } | null;
  setNumber?: string | null;
}

export const CardExtendedDetails: React.FC<CardExtendedDetailsProps> = ({
  officialText,
  keywords,
  set,
  setNumber,
}) => {
  return (
    <div className="mt-4 space-y-2">
      {officialText && (
        <div>
          <h4 className="mb-1 text-sm font-medium text-gray-700">
            Official Text:
          </h4>
          <p className="text-sm text-gray-600">{officialText}</p>
        </div>
      )}

      {keywords && keywords.length > 0 && (
        <div>
          <h4 className="mb-1 text-sm font-medium text-gray-700">Keywords:</h4>
          <div className="flex flex-wrap gap-1">
            {keywords.map((keyword, index) => (
              <Badge key={index} variant="default" className="text-xs">
                {keyword}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {set && (
        <div className="text-xs text-gray-500">
          {set.name} #{setNumber}
        </div>
      )}
    </div>
  );
};
