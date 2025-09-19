import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Gundam Card Game Database",
  description: "A comprehensive database and deck building platform for the Gundam Card Game",
  keywords: ["gundam", "card game", "database", "deck building", "collection"],
  authors: [{ name: "Gundam Card Game Community" }],
  openGraph: {
    title: "Gundam Card Game Database",
    description: "A comprehensive database and deck building platform for the Gundam Card Game",
    type: "website",
    locale: "en_US",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-gray-50 font-sans antialiased">
        <div className="flex min-h-screen flex-col">
          <header className="border-b bg-white">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">
                  Gundam Card Game
                </h1>
                <nav className="hidden md:flex space-x-6">
                  <a href="/cards" className="text-gray-600 hover:text-gray-900">
                    Cards
                  </a>
                  <a href="/decks" className="text-gray-600 hover:text-gray-900">
                    Decks
                  </a>
                  <a href="/collection" className="text-gray-600 hover:text-gray-900">
                    Collection
                  </a>
                </nav>
              </div>
            </div>
          </header>
          
          <main className="flex-1">
            {children}
          </main>
          
          <footer className="border-t bg-white">
            <div className="container mx-auto px-4 py-6">
              <div className="text-center text-sm text-gray-500">
                <p>
                  Gundam Card Game Database is not affiliated with Bandai Namco Entertainment Inc.
                </p>
                <p className="mt-1">
                  All card images and game content are used under fair use for educational and community purposes.
                </p>
                <p className="mt-2">
                  © 2024 Gundam Card Game Community. All rights reserved.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
