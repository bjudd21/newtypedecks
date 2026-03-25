/**
 * QuickActionCard - Clickable card for quick navigation
 */

import React from 'react';
import Link from 'next/link';

interface QuickActionCardProps {
  href: string;
  icon: string;
  title: string;
  description: string;
  actionLabel: string;
}

export const QuickActionCard: React.FC<QuickActionCardProps> = ({
  href,
  icon,
  title,
  description,
  actionLabel,
}) => {
  return (
    <Link href={href}>
      <div className="group border-border bg-card/60 hover:border-primary hover:shadow-primary/20 cursor-pointer overflow-hidden rounded-lg border p-6 backdrop-blur-md transition-all duration-300 hover:shadow-lg">
        <div className="mb-4 flex items-center">
          <span className="bg-primary mr-3 flex h-12 w-12 items-center justify-center rounded-lg text-2xl shadow-lg">
            {icon}
          </span>
          <h3 className="text-foreground text-lg font-semibold">{title}</h3>
        </div>
        <p className="text-foreground">{description}</p>
        <div className="text-primary group-hover:text-primary/80 mt-4 flex items-center text-sm font-medium transition-colors">
          <span>{actionLabel}</span>
          <svg
            className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </Link>
  );
};
