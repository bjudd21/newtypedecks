// Navigation bar component with enhanced accessibility
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { getNavItemProps } from '@/lib/utils/accessibility';

// Force fresh render - purple theme

const navigation = [
  { name: 'Cards', href: '/cards', description: 'Browse card database' },
  { name: 'Decks', href: '/decks', description: 'Build and manage decks' },
  { name: 'Collection', href: '/collection', description: 'Manage your card collection' },
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
              'text-gray-300 hover:text-white transition-colors duration-200',
              'focus:outline-none focus:ring-2 focus:ring-[#6b5a8a] focus:ring-offset-2 rounded-md px-2 py-1',
              isActive && 'text-[#6b5a8a] font-medium'
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
