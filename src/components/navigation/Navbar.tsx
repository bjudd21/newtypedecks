// Navigation bar component with enhanced accessibility
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
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
      {navigation.map((item, index) => {
        const isActive = pathname === item.href;
        const navProps = getNavItemProps(item.href, isActive, item.description);

        return (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              delay: index * 0.1,
              type: 'spring',
              stiffness: 260,
              damping: 20,
            }}
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.2, type: 'spring', stiffness: 300 },
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href={item.href}
              className={cn(
                'group relative block overflow-hidden rounded-full px-4 py-2 transition-all duration-300 ease-in-out',
                'flex items-center justify-center',
                'focus:ring-2 focus:ring-[#6b5a8a] focus:ring-offset-2 focus:ring-offset-[#1a1625] focus:outline-none',
                isActive
                  ? 'border border-[#8b7aaa] bg-[#6b5a8a] font-medium text-white shadow-lg shadow-[#6b5a8a]/30'
                  : 'border border-[#443a5c] bg-[#2d2640] text-gray-300 hover:border-[#6b5a8a] hover:bg-[#3a3050] hover:text-white hover:shadow-lg hover:shadow-[#6b5a8a]/20'
              )}
              {...navProps}
            >
              {/* Animated background on hover */}
              {!isActive && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-[#8b7aaa]/10 via-[#a89ec7]/20 to-[#8b7aaa]/10"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
              )}

              {/* Active indicator */}
              {isActive && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-[#6b5a8a] via-[#8b7aaa] to-[#6b5a8a]"
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  style={{ backgroundSize: '200% 100%' }}
                />
              )}

              <span className="relative z-10">{item.name}</span>
              {isActive && <span className="sr-only"> (current page)</span>}
            </Link>
          </motion.div>
        );
      })}
    </nav>
  );
}
