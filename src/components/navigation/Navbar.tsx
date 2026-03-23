// Navigation bar component with enhanced accessibility
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { getNavItemProps } from '@/lib/utils/accessibility';
import {
  getGameSlugFromPath,
  buildGameNavItems,
  PLATFORM_NAV_ITEMS,
} from './gameRouting';

export function Navbar() {
  const pathname = usePathname();
  const gameSlug = getGameSlugFromPath(pathname);
  const navigation = gameSlug
    ? buildGameNavItems(gameSlug)
    : PLATFORM_NAV_ITEMS;

  return (
    <nav
      className="hidden items-center gap-8 md:flex"
      role="navigation"
      aria-label="Main navigation"
    >
      {navigation.map((item, index) => {
        const isActive =
          item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
        const navProps = getNavItemProps(item.href, isActive, item.description);

        return (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              delay: index * 0.05,
            }}
          >
            <Link
              href={item.href}
              className={cn(
                'group relative pb-1 text-base font-medium transition-colors duration-200',
                'focus:ring-2 focus:ring-[#8b7aaa] focus:ring-offset-2 focus:ring-offset-[#0f0d15] focus:outline-none',
                isActive ? 'text-white' : 'text-gray-300 hover:text-[#8b7aaa]'
              )}
              {...navProps}
            >
              <span className="relative">
                {item.name}
                {isActive && <span className="sr-only"> (current page)</span>}
              </span>

              {/* Active underline indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute right-0 bottom-0 left-0 h-0.5 bg-gradient-to-r from-[#6b5a8a] via-[#8b7aaa] to-[#6b5a8a]"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}

              {/* Hover underline */}
              {!isActive && (
                <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#8b7aaa] transition-all duration-300 group-hover:w-full" />
              )}
            </Link>
          </motion.div>
        );
      })}

      {/* Switch Game link — only shown when inside a game context */}
      {gameSlug && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          <Link
            href="/"
            className="group flex items-center gap-1 pb-1 text-sm font-medium text-gray-500 transition-colors duration-200 hover:text-[#8b7aaa] focus:ring-2 focus:ring-[#8b7aaa] focus:ring-offset-2 focus:ring-offset-[#0f0d15] focus:outline-none"
            aria-label="Switch game"
          >
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
            Switch
          </Link>
        </motion.div>
      )}
    </nav>
  );
}
