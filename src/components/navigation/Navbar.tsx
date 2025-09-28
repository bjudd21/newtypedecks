// Navigation bar component with enhanced accessibility
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { getNavItemProps } from '@/lib/utils/accessibility';

const navigation = [
  { name: 'Home', href: '/', description: 'Go to home page' },
  { name: 'Cards', href: '/cards', description: 'Browse card database' },
  { name: 'Decks', href: '/decks', description: 'Build and manage decks' },
  { name: 'Collection', href: '/collection', description: 'Manage your card collection' },
  { name: 'Submit', href: '/submit', description: 'Submit new cards' },
  { name: 'About', href: '/about', description: 'About this website' },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav
      className="hidden space-x-6 md:flex"
      role="navigation"
      aria-label="Main navigation"
    >
      {navigation.map((item) => {
        const isActive = pathname === item.href;
        const navProps = getNavItemProps(item.href, isActive, item.description);

        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              'text-gray-600 hover:text-gray-900 transition-colors duration-200',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md px-2 py-1',
              isActive && 'text-blue-600 font-medium'
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
  );
}
