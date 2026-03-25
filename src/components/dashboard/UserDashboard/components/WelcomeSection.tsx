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
      <h1 className="text-foreground mb-2 text-2xl font-semibold">
        Welcome back{userName ? `, ${userName.split(' ')[0]}` : ''}!
      </h1>
      <p className="text-muted-foreground">
        Here&apos;s your personal dashboard.
      </p>
    </div>
  );
};
