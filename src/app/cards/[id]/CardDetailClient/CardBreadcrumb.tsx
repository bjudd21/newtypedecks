import React from 'react';
import Link from 'next/link';

export function CardBreadcrumb({ cardName }: { cardName: string }) {
  return (
    <nav className="mb-6 text-sm">
      <div className="flex items-center space-x-2 text-gray-400">
        <Link href="/cards" className="transition-colors hover:text-cyan-400">
          Card Database
        </Link>
        <span>›</span>
        <span className="text-white">{cardName}</span>
      </div>
    </nav>
  );
}
