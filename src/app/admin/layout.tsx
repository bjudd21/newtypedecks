import React from 'react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1625] via-[#2a1f3d] to-[#1a1625]">
      {/* Admin Content - Using main navbar from root layout */}
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
