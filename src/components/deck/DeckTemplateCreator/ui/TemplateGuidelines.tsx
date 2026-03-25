/**
 * Template guidelines component
 */

import React from 'react';

export const TemplateGuidelines: React.FC = () => {
  return (
    <div className="border-border bg-accent text-muted-foreground rounded border p-3 text-sm">
      <div className="mb-2 font-medium">Template Guidelines:</div>
      <ul className="space-y-1 text-xs">
        <li>• Templates become public and can be used by anyone</li>
        <li>• Choose descriptive names and provide helpful descriptions</li>
        <li>• Ensure your deck is complete and well-balanced</li>
        <li>• Templates help new players learn different strategies</li>
      </ul>
    </div>
  );
};
