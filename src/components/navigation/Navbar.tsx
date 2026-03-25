// Navigation bar component
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
import { ArrowLeftRight } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const gameSlug = getGameSlugFromPath(pathname);
  const navigation = gameSlug
    ? buildGameNavItems(gameSlug)
    : PLATFORM_NAV_ITEMS;

  return (
    <nav
      className="hidden items-center gap-6 md:flex"
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
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.04 }}
          >
            <Link
              href={item.href}
              className={cn(
                'group relative pb-1 text-sm font-medium transition-colors duration-150',
                'focus:ring-ring focus:ring-offset-background focus:ring-2 focus:ring-offset-2 focus:outline-none',
                isActive
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
              {...navProps}
            >
              {item.name}
              {isActive && <span className="sr-only"> (current page)</span>}

              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="bg-primary absolute right-0 bottom-0 left-0 h-px"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}

              {/* Hover indicator */}
              {!isActive && (
                <span className="bg-border absolute bottom-0 left-0 h-px w-0 transition-all duration-200 group-hover:w-full" />
              )}
            </Link>
          </motion.div>
        );
      })}

      {/* Switch Game link — only shown when inside a game context */}
      {gameSlug && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.12 }}
        >
          <Link
            href="/"
            className="text-muted-foreground/60 hover:text-muted-foreground focus:ring-ring focus:ring-offset-background flex items-center gap-1.5 pb-1 text-sm transition-colors duration-150 focus:ring-2 focus:ring-offset-2 focus:outline-none"
            aria-label="Switch game"
          >
            <ArrowLeftRight className="h-3.5 w-3.5" aria-hidden="true" />
            Switch
          </Link>
        </motion.div>
      )}
    </nav>
  );
}
