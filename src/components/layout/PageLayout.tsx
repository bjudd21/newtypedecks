// Page layout component with breadcrumbs
'use client';

import { Breadcrumb } from '@/components/navigation';

interface PageLayoutProps {
  children: React.ReactNode;
  showBreadcrumb?: boolean;
}

export function PageLayout({ children, showBreadcrumb = true }: PageLayoutProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      {showBreadcrumb && <Breadcrumb />}
      {children}
    </div>
  );
}
