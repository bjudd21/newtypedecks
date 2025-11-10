import React from 'react';
import Link from 'next/link';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-xl font-bold text-blue-600">
                GCG Admin
              </Link>

              <nav className="hidden space-x-6 md:flex">
                <Link
                  href="/admin/submissions"
                  className="font-medium text-gray-700 hover:text-blue-600"
                >
                  Submissions
                </Link>
                <Link
                  href="/admin/cards"
                  className="font-medium text-gray-700 hover:text-blue-600"
                >
                  Cards
                </Link>
                <Link
                  href="/admin/users"
                  className="font-medium text-gray-700 hover:text-blue-600"
                >
                  Users
                </Link>
                <Link
                  href="/admin/import"
                  className="font-medium text-gray-700 hover:text-blue-600"
                >
                  Data Import
                </Link>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Admin Panel</span>
              <Link
                href="/"
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                ← Back to Site
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Content */}
      <main className="container mx-auto px-4 py-6">{children}</main>

      {/* Admin Footer */}
      <footer className="mt-auto border-t bg-white">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-gray-600">
            <p>Admin Dashboard - Gundam Card Game Database</p>
            <p className="mt-1">
              Use admin functions responsibly. All actions are logged.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export const metadata = {
  title: 'Admin Panel | Gundam Card Game',
  description:
    'Administrative interface for managing the Gundam Card Game database.',
};
