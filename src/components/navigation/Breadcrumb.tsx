// Breadcrumb navigation component
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
// import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  name: string;
  href: string;
}

export function Breadcrumb() {
  const pathname = usePathname();

  // Generate breadcrumb items based on current path
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [{ name: 'Home', href: '/' }];

    let currentPath = '';
    segments.forEach((segment) => {
      currentPath += `/${segment}`;

      // Convert segment to readable name
      const name = segment
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      breadcrumbs.push({
        name,
        href: currentPath,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't show breadcrumb on home page
  if (pathname === '/') {
    return null;
  }

  return (
    <nav className="mb-4 flex items-center space-x-2 text-sm text-gray-500">
      {breadcrumbs.map((item, index) => (
        <div key={item.href} className="flex items-center">
          {index > 0 && (
            <svg
              className="mx-2 h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          )}
          {index === breadcrumbs.length - 1 ? (
            <span className="font-medium text-gray-900">{item.name}</span>
          ) : (
            <Link
              href={item.href}
              className="transition-colors duration-200 hover:text-gray-700"
            >
              {item.name}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
