import React from 'react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen">
      {/* Admin Content - Using main navbar from root layout */}
      <main className="container mx-auto px-4 py-8">{children}</main>

      {/* Admin Footer */}
      <footer className="border-border bg-background/80 mt-auto border-t backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="text-muted-foreground text-center text-sm">
            <p className="text-foreground font-medium">
              Admin Dashboard - Newtype Decks
            </p>
            <p className="text-muted-foreground/70 mt-1">
              Use admin functions responsibly. All actions are logged.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export const metadata = {
  title: 'Admin Panel | Newtype Decks',
  description:
    'Administrative interface for managing the Newtype Decks database.',
};
