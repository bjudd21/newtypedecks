// Mobile navigation menu component with enhanced accessibility
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowLeftRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  getNavItemProps,
  handleKeyboardActivation,
  KEYBOARD_CODES,
  trapFocus,
} from '@/lib/utils/accessibility';
import {
  getGameSlugFromPath,
  buildGameNavItems,
  PLATFORM_NAV_ITEMS,
} from './gameRouting';

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const gameSlug = getGameSlugFromPath(pathname);
  const navigation = gameSlug
    ? buildGameNavItems(gameSlug)
    : PLATFORM_NAV_ITEMS;
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === KEYBOARD_CODES.ESCAPE && isOpen) {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      if (menuRef.current) {
        const cleanup = trapFocus(menuRef.current);
        return () => {
          cleanup();
          document.removeEventListener('keydown', handleEscape);
        };
      }
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => {
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  return (
    <div className="md:hidden">
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        onKeyDown={(e) => handleKeyboardActivation(e, toggleMenu)}
        className="text-muted-foreground hover:text-foreground focus:ring-ring focus:ring-offset-background rounded-md p-2 transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none"
        aria-label={isOpen ? 'Close mobile menu' : 'Open mobile menu'}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
      >
        {isOpen ? (
          <X className="h-5 w-5" aria-hidden="true" />
        ) : (
          <Menu className="h-5 w-5" aria-hidden="true" />
        )}
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          id="mobile-menu"
          className="border-border bg-background absolute top-full right-0 left-0 z-50 border-b shadow-lg shadow-black/20"
          role="region"
          aria-label="Mobile navigation menu"
        >
          <nav
            className="space-y-1 px-4 py-3"
            role="navigation"
            aria-label="Mobile navigation"
          >
            {navigation.map((item) => {
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.href);
              const navProps = getNavItemProps(
                item.href,
                isActive,
                item.description
              );

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={closeMenu}
                  onKeyDown={(e) => {
                    if (
                      e.key === KEYBOARD_CODES.ENTER ||
                      e.key === KEYBOARD_CODES.SPACE
                    ) {
                      e.preventDefault();
                      closeMenu();
                    }
                  }}
                  className={cn(
                    'block rounded-md px-3 py-2.5 text-sm font-medium transition-colors duration-150',
                    'focus:ring-ring focus:ring-offset-background focus:ring-2 focus:ring-offset-2 focus:outline-none',
                    isActive
                      ? 'bg-accent text-foreground'
                      : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                  )}
                  {...navProps}
                >
                  {item.name}
                  {isActive && <span className="sr-only"> (current page)</span>}
                </Link>
              );
            })}

            {gameSlug && (
              <Link
                href="/"
                onClick={closeMenu}
                className="text-muted-foreground/60 hover:bg-accent/50 hover:text-muted-foreground focus:ring-ring focus:ring-offset-background flex items-center gap-2 rounded-md px-3 py-2.5 text-sm transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none"
              >
                <ArrowLeftRight className="h-3.5 w-3.5" aria-hidden="true" />
                Switch Game
              </Link>
            )}
          </nav>
        </div>
      )}
    </div>
  );
}
