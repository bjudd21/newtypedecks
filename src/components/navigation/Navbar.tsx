// Navigation bar component
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Cards', href: '/cards' },
  { name: 'Decks', href: '/decks' },
  { name: 'Collection', href: '/collection' },
  { name: 'About', href: '/about' },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="hidden space-x-6 md:flex">
      {navigation.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className={cn(
            'text-gray-600 hover:text-gray-900 transition-colors duration-200',
            pathname === item.href && 'text-blue-600 font-medium'
          )}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
}
