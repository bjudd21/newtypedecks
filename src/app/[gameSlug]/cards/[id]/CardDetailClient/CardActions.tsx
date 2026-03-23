import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui';

export function CardActions() {
  return (
    <div className="mt-8 flex flex-wrap gap-4">
      <Button onClick={() => window.history.back()} variant="secondary">
        ← Back
      </Button>

      <Link href="/cards">
        <Button variant="cyber">Browse More Cards</Button>
      </Link>
    </div>
  );
}
