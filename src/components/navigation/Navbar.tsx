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
  {
    name: 'Collection',
    href: '/collection',
    description: 'Manage your card collection',
  },
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
              'rounded-full px-4 py-2 transition-all duration-300 ease-in-out',
              'flex items-center justify-center',
              'focus:outline-none focus:ring-2 focus:ring-[#6b5a8a] focus:ring-offset-2 focus:ring-offset-[#1a1625]',
              isActive
                ? 'border border-[#8b7aaa] bg-[#6b5a8a] font-medium text-white shadow-lg shadow-[#6b5a8a]/30'
                : 'border border-[#443a5c] bg-[#2d2640] text-gray-300 hover:scale-105 hover:border-[#6b5a8a] hover:bg-[#3a3050] hover:text-white hover:shadow-lg hover:shadow-[#6b5a8a]/20'
            )}
            {...navProps}
          >
            {item.name}
            {isActive && <span className="sr-only"> (current page)</span>}
          </Link>
        );
      })}
    </nav>
  );
}
