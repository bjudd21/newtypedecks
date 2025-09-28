// Mobile navigation menu component with enhanced accessibility
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { getNavItemProps, handleKeyboardActivation, KEYBOARD_CODES, trapFocus } from '@/lib/utils/accessibility';

const navigation = [
  { name: 'Home', href: '/', description: 'Go to home page' },
  { name: 'Cards', href: '/cards', description: 'Browse card database' },
  { name: 'Decks', href: '/decks', description: 'Build and manage decks' },
  { name: 'Collection', href: '/collection', description: 'Manage your card collection' },
  { name: 'Submit', href: '/submit', description: 'Submit new cards' },
  { name: 'About', href: '/about', description: 'About this website' },
];

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Handle escape key to close menu
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === KEYBOARD_CODES.ESCAPE && isOpen) {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Focus trap for mobile menu
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

  // Close menu when clicking outside
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

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

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
        className="text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md p-2"
        aria-label={isOpen ? 'Close mobile menu' : 'Open mobile menu'}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          id="mobile-menu"
          className="absolute top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-50"
          role="region"
          aria-label="Mobile navigation menu"
        >
          <nav
            className="px-4 py-2 space-y-1"
            role="navigation"
            aria-label="Mobile navigation"
          >
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const navProps = getNavItemProps(item.href, isActive, item.description);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={closeMenu}
                  onKeyDown={(e) => {
                    if (e.key === KEYBOARD_CODES.ENTER || e.key === KEYBOARD_CODES.SPACE) {
                      e.preventDefault();
                      closeMenu();
                      // Navigate programmatically if needed
                    }
                  }}
                  className={cn(
                    'block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors duration-200',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                    isActive && 'text-blue-600 bg-blue-50 font-medium'
                  )}
                  {...navProps}
                >
                  {item.name}
                  {isActive && (
                    <span className="sr-only"> (current page)</span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </div>
  );
}
