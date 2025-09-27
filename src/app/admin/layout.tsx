import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-xl font-bold text-blue-600">
                GCG Admin
              </Link>

              <nav className="hidden md:flex space-x-6">
                <Link
                  href="/admin/submissions"
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Submissions
                </Link>
                <Link
                  href="/admin/cards"
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Cards
                </Link>
                <Link
                  href="/admin/users"
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Users
                </Link>
                <Link
                  href="/admin/import"
                  className="text-gray-700 hover:text-blue-600 font-medium"
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
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>

      {/* Admin Footer */}
      <footer className="mt-auto bg-white border-t">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-gray-600">
            <p>
              Admin Dashboard - Gundam Card Game Database
            </p>
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
  description: 'Administrative interface for managing the Gundam Card Game database.',
};