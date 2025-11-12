'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui';

interface AuthStatusProps {
  className?: string;
}

export function AuthStatus({ className = '' }: AuthStatusProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (isLoading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-8 w-20 rounded bg-[#3a3050]"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/auth/signin')}
            className="border-[#443a5c] bg-[#2d2640] text-white transition-all hover:border-[#8b7aaa] hover:bg-[#3a3050] hover:shadow-lg hover:shadow-[#8b7aaa]/20"
          >
            Sign In
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="default"
            size="sm"
            onClick={() => router.push('/auth/signup')}
            className="bg-gradient-to-r from-[#8b7aaa] to-[#6b5a8a] text-white shadow-lg hover:from-[#a89ec7] hover:to-[#8b7aaa] hover:shadow-[#8b7aaa]/30"
          >
            Sign Up
          </Button>
        </motion.div>
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const handleProfile = () => {
    router.push('/profile');
    setIsDropdownOpen(false);
  };

  const handleDashboard = () => {
    router.push('/dashboard');
  };

  const menuItems = [
    {
      label: 'Profile Settings',
      onClick: handleProfile,
      icon: (
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
    {
      label: 'My Collection',
      onClick: () => {
        router.push('/collection');
        setIsDropdownOpen(false);
      },
      icon: (
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      ),
    },
    {
      label: 'My Decks',
      onClick: () => {
        router.push('/decks');
        setIsDropdownOpen(false);
      },
      icon: (
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      ),
    },
  ];

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: -10,
      transition: {
        duration: 0.2,
      },
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.2,
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Welcome text with icon */}
      <motion.div
        className="hidden items-center gap-2 text-sm text-gray-300 sm:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex h-2 w-2 animate-pulse items-center justify-center rounded-full bg-green-500">
          <div className="h-1.5 w-1.5 rounded-full bg-green-400"></div>
        </div>
        <span className="text-gray-400">Welcome,</span>
        <span className="font-medium text-white">
          {user?.name || user?.email}
        </span>
      </motion.div>

      <div className="flex items-center space-x-2">
        {/* Dashboard Button with animation */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDashboard}
            className="group border-[#8b7aaa] bg-[#2d2640] text-[#8b7aaa] shadow-lg transition-all hover:bg-[#8b7aaa] hover:text-white hover:shadow-[#8b7aaa]/30"
          >
            <span className="transition-transform group-hover:scale-110">
              DASHBOARD
            </span>
          </Button>
        </motion.div>

        {/* User Dropdown */}
        <div className="relative">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-1 border-[#8b7aaa] bg-[#2d2640] text-[#8b7aaa] shadow-lg transition-all hover:bg-[#8b7aaa] hover:text-white hover:shadow-[#8b7aaa]/30"
            >
              <span className="font-semibold uppercase">
                {user?.name?.split(' ')[0] || 'Menu'}
              </span>
              <motion.svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </motion.svg>
            </Button>
          </motion.div>

          {/* Animated Dropdown Menu */}
          <AnimatePresence>
            {isDropdownOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-40"
                  onClick={() => setIsDropdownOpen(false)}
                />

                {/* Dropdown */}
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-lg border border-[#443a5c] bg-[#2d2640] shadow-2xl shadow-[#1a1625]/50 backdrop-blur-xl"
                >
                  <div className="py-1">
                    {menuItems.map((item, _index) => (
                      <motion.button
                        key={item.label}
                        variants={itemVariants}
                        onClick={item.onClick}
                        className="group flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-300 transition-all hover:bg-[#3a3050] hover:text-white"
                        whileHover={{ x: 4 }}
                      >
                        <span className="text-[#8b7aaa] transition-colors group-hover:text-[#a89ec7]">
                          {item.icon}
                        </span>
                        {item.label}
                      </motion.button>
                    ))}

                    {/* Admin Panel (if applicable) */}
                    {(user?.role === 'ADMIN' || user?.role === 'MODERATOR') && (
                      <>
                        <motion.div
                          variants={itemVariants}
                          className="my-1 border-t border-[#443a5c]"
                        />
                        <motion.button
                          variants={itemVariants}
                          onClick={() => {
                            router.push('/admin');
                            setIsDropdownOpen(false);
                          }}
                          className="group flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-300 transition-all hover:bg-[#3a3050] hover:text-white"
                          whileHover={{ x: 4 }}
                        >
                          <span className="text-[#8b7aaa] transition-colors group-hover:text-[#a89ec7]">
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                          </span>
                          Admin Panel
                        </motion.button>
                      </>
                    )}

                    {/* Sign Out */}
                    <motion.div
                      variants={itemVariants}
                      className="my-1 border-t border-[#443a5c]"
                    />
                    <motion.button
                      variants={itemVariants}
                      onClick={handleSignOut}
                      className="group flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-red-400 transition-all hover:bg-red-950/30 hover:text-red-300"
                      whileHover={{ x: 4 }}
                    >
                      <span className="transition-colors">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                      </span>
                      Sign Out
                    </motion.button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default AuthStatus;
