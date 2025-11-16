import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';

export function CardDescription({ description }: { description: string }) {
  return (
    <Card className="border-gray-700 bg-gray-800">
      <CardHeader>
        <CardTitle>Description</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="leading-relaxed text-gray-300">{description}</p>
      </CardContent>
    </Card>
  );
}
