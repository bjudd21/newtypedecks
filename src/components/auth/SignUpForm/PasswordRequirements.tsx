/**
 * Password requirements display component
 */

import React from 'react';

export const PasswordRequirements: React.FC = () => {
  return (
    <div className="rounded border border-[#443a5c] bg-[#1a1625] p-3 text-sm text-gray-400">
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
