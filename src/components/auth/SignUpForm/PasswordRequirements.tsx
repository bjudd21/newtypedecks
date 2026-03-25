/**
 * Password requirements display component
 */

import React from 'react';

export const PasswordRequirements: React.FC = () => {
  return (
    <div className="border-border bg-background text-muted-foreground rounded border p-3 text-sm">
      <p className="mb-1 font-medium text-white">Password Requirements:</p>
      <ul className="space-y-1 text-xs">
        <li>• At least 8 characters long</li>
        <li>• Contains uppercase and lowercase letters</li>
        <li>• Contains at least one number</li>
        <li>• Contains at least one special character</li>
      </ul>
    </div>
  );
};
