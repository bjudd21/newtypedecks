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
      <div className="group cursor-pointer overflow-hidden rounded-lg border border-[#443a5c] bg-[#2d2640]/60 p-6 backdrop-blur-md transition-all duration-300 hover:border-[#8b7aaa] hover:shadow-lg hover:shadow-[#8b7aaa]/20">
        <div className="mb-4 flex items-center">
          <span className="mr-3 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-[#8b7aaa] to-[#6b5a8a] text-2xl shadow-lg">
            {icon}
          </span>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
        <p className="text-gray-300">{description}</p>
        <div className="mt-4 flex items-center text-sm font-medium text-[#8b7aaa] transition-colors group-hover:text-[#a89ec7]">
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
