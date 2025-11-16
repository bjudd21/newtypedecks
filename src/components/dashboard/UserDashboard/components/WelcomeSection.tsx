/**
 * Welcome section component
 */

import React from 'react';

interface WelcomeSectionProps {
  userName?: string | null;
}

export const WelcomeSection: React.FC<WelcomeSectionProps> = ({ userName }) => {
  return (
    <div className="mb-8">
      <h1 className="mb-2 bg-gradient-to-r from-[#8b7aaa] via-[#a89ec7] to-[#8b7aaa] bg-clip-text text-3xl font-bold text-transparent">
        Welcome back{userName ? `, ${userName.split(' ')[0]}` : ''}!
      </h1>
      <p className="text-gray-400">
        Ready to dive into the Gundam Card Game? Here&apos;s your personal
        dashboard.
      </p>
    </div>
  );
};
