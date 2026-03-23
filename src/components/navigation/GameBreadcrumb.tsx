'use client';

/**
 * GameBreadcrumb — shows the current game slug in the header when the user is
 * inside a game context (e.g. /gundam-card-game/cards).
 *
 * Uses URL-based detection so it works inside the root layout, outside
 * the GameProvider tree.
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getGameSlugFromPath } from './gameRouting';

export function GameBreadcrumb() {
  const pathname = usePathname();
  const gameSlug = getGameSlugFromPath(pathname);

  if (!gameSlug) return null;

  return (
    <Link
      href={`/${gameSlug}`}
      className="hidden items-center gap-1 text-sm text-gray-400 transition-colors hover:text-[#a89ec7] md:flex"
      aria-label={`Back to ${gameSlug} home`}
    >
      <svg
        className="h-3.5 w-3.5 text-gray-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
      <span className="max-w-[140px] truncate font-medium">{gameSlug}</span>
    </Link>
  );
}
