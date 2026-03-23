import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
} from '@/components/ui';

export function Keywords({ keywords }: { keywords: string[] }) {
  return (
    <Card className="border-gray-700 bg-gray-800">
      <CardHeader>
        <CardTitle>Keywords</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {keywords.map((keyword, index) => (
            <Badge key={index} variant="default" className="text-sm">
              {keyword}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
