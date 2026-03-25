/**
 * CommentForm Component
 * Form for submitting comments or replies
 */

import React, { useState } from 'react';
import { Card, CardContent, Button } from '@/components/ui';

interface CommentFormProps {
  onSubmit: (content: string) => void;
  onCancel: () => void;
  placeholder: string;
  isReply?: boolean;
}

export const CommentForm: React.FC<CommentFormProps> = ({
  onSubmit,
  onCancel,
  placeholder,
  isReply = false,
}) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(content.trim());
      setContent('');
    } catch (error) {
      console.error('Failed to submit comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card
      className={`mb-4 ${isReply ? 'border-border bg-accent' : 'border-green-200 bg-green-50'}`}
    >
      <CardContent className="pt-4">
        <div className="space-y-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={placeholder}
            className="border-border w-full resize-none rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            rows={3}
            maxLength={2000}
          />

          <div className="flex items-center justify-between">
            <div className="text-muted-foreground text-xs">
              {content.length}/2000 characters
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={onCancel} variant="outline" size="sm">
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                variant="default"
                size="sm"
                disabled={!content.trim() || isSubmitting}
              >
                {isSubmitting
                  ? 'Posting...'
                  : isReply
                    ? 'Post Reply'
                    : 'Post Comment'}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
