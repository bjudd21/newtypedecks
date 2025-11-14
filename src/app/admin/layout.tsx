import React from 'react';
import Link from 'next/link';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1625] via-[#2a1f3d] to-[#1a1625]">
      {/* Admin Header */}
      <header className="sticky top-0 z-50 border-b border-[#443a5c] bg-[#0f0d15]/95 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link
                href="/admin"
                className="group flex items-center space-x-2 text-xl font-bold transition-colors duration-200"
              >
                <span className="text-white">Newtype Decks</span>
                <span className="rounded-md bg-gradient-to-r from-amber-500 to-orange-500 px-2 py-0.5 text-xs font-semibold tracking-wide text-white uppercase shadow-lg shadow-amber-500/30">
                  Admin
                </span>
              </Link>

              <nav className="hidden space-x-6 md:flex">
                <Link
                  href="/admin/cards"
                  className="font-medium text-gray-300 transition-colors duration-200 hover:text-[#8b7aaa] focus:ring-2 focus:ring-[#8b7aaa] focus:ring-offset-2 focus:ring-offset-[#0f0d15] focus:outline-none"
                >
                  Cards
                </Link>
                <Link
                  href="/admin/users"
                  className="font-medium text-gray-300 transition-colors duration-200 hover:text-[#8b7aaa] focus:ring-2 focus:ring-[#8b7aaa] focus:ring-offset-2 focus:ring-offset-[#0f0d15] focus:outline-none"
                >
                  Users
                </Link>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="group flex items-center space-x-1.5 text-sm font-medium text-[#8b7aaa] transition-colors duration-200 hover:text-[#a89ec7] focus:ring-2 focus:ring-[#8b7aaa] focus:ring-offset-2 focus:ring-offset-[#0f0d15] focus:outline-none"
              >
                <svg
                  className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                <span>Back to Site</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Content */}
      <main className="container mx-auto px-4 py-8">{children}</main>

      {/* Admin Footer */}
      <footer className="mt-auto border-t border-[#443a5c] bg-[#0f0d15]/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-gray-400">
            <p className="font-medium text-gray-300">
              Admin Dashboard - Gundam Card Game Database
            </p>
            <p className="mt-1 text-gray-500">
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
