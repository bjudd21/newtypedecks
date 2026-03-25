import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';

export function CardDescription({ description }: { description: string }) {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle>Description</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-foreground leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
}
