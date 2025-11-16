import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';

export function OfficialText({ text }: { text: string }) {
  return (
    <Card className="border-gray-700 bg-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <svg
            className="h-5 w-5 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Official Text
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-r-md border-l-4 border-blue-400 bg-blue-900/20 p-4">
          <div className="font-mono text-sm leading-relaxed whitespace-pre-line text-gray-200">
            {text}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
