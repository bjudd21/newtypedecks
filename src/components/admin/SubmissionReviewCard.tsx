'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@/components/ui';
import type { CardSubmissionWithDetails } from '@/lib/types/submission';

export interface SubmissionReviewCardProps {
  submission: CardSubmissionWithDetails;
  onReview?: (id: string, status: 'APPROVED' | 'REJECTED', reviewNotes?: string, rejectionReason?: string) => void;
  onPublish?: (id: string) => void;
  isLoading?: boolean;
  className?: string;
}

export const SubmissionReviewCard: React.FC<SubmissionReviewCardProps> = ({
  submission,
  onReview,
  onPublish,
  isLoading = false,
  className,
}) => {
  const [reviewNotes, setReviewNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  const handleApprove = () => {
    if (onReview) {
      onReview(submission.id, 'APPROVED', reviewNotes || undefined);
      setShowReviewForm(false);
      setReviewNotes('');
    }
  };

  const handleReject = () => {
    if (onReview && rejectionReason.trim()) {
      onReview(submission.id, 'REJECTED', reviewNotes || undefined, rejectionReason);
      setShowReviewForm(false);
      setReviewNotes('');
      setRejectionReason('');
    }
  };

  const handlePublish = () => {
    if (onPublish) {
      onPublish(submission.id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'PUBLISHED': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'bg-red-100 text-red-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'NORMAL': return 'bg-gray-100 text-gray-800';
      case 'LOW': return 'bg-gray-50 text-gray-600';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{submission.name}</CardTitle>
            <p className="text-sm text-gray-600">Set: {submission.setNumber}</p>
            <p className="text-xs text-gray-500">
              Submitted {new Date(submission.createdAt).toLocaleDateString()}
              {submission.submitterName && ` by ${submission.submitterName}`}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Badge className={getStatusColor(submission.status)}>
              {submission.status}
            </Badge>
            <Badge className={getPriorityColor(submission.priority)}>
              {submission.priority}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Card Image */}
          {submission.imageUrl && (
            <div className="flex justify-center">
              <Image
                src={submission.imageUrl}
                alt={`Card preview for ${submission.name}`}
                width={192}
                height={256}
                className="max-w-48 max-h-64 object-contain rounded-lg border"
              />
            </div>
          )}

          {/* Card Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            {submission.level !== undefined && (
              <div>
                <span className="font-medium">Level:</span> {submission.level}
              </div>
            )}
            {submission.cost !== undefined && (
              <div>
                <span className="font-medium">Cost:</span> {submission.cost}
              </div>
            )}
            {submission.clashPoints !== undefined && (
              <div>
                <span className="font-medium">CP:</span> {submission.clashPoints}
              </div>
            )}
            {submission.hitPoints !== undefined && (
              <div>
                <span className="font-medium">HP:</span> {submission.hitPoints}
              </div>
            )}
            {submission.attackPoints !== undefined && (
              <div>
                <span className="font-medium">AP:</span> {submission.attackPoints}
              </div>
            )}
            {submission.faction && (
              <div>
                <span className="font-medium">Faction:</span> {submission.faction}
              </div>
            )}
            {submission.series && (
              <div>
                <span className="font-medium">Series:</span> {submission.series}
              </div>
            )}
            {submission.pilot && (
              <div>
                <span className="font-medium">Pilot:</span> {submission.pilot}
              </div>
            )}
          </div>

          {/* Card Text */}
          {submission.description && (
            <div>
              <h4 className="font-medium text-sm mb-1">Description:</h4>
              <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                {submission.description}
              </p>
            </div>
          )}

          {submission.officialText && (
            <div>
              <h4 className="font-medium text-sm mb-1">Official Text:</h4>
              <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                {submission.officialText}
              </p>
            </div>
          )}

          {/* Keywords and Tags */}
          {submission.keywords && submission.keywords.length > 0 && (
            <div>
              <h4 className="font-medium text-sm mb-1">Keywords:</h4>
              <div className="flex flex-wrap gap-1">
                {submission.keywords.map((keyword, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {submission.tags && submission.tags.length > 0 && (
            <div>
              <h4 className="font-medium text-sm mb-1">Tags:</h4>
              <div className="flex flex-wrap gap-1">
                {submission.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Special Flags */}
          <div className="flex flex-wrap gap-2">
            {submission.isFoil && <Badge variant="secondary">Foil</Badge>}
            {submission.isPromo && <Badge variant="secondary">Promo</Badge>}
            {submission.isAlternate && <Badge variant="secondary">Alt Art</Badge>}
            {submission.isLeak && <Badge variant="secondary">Leak</Badge>}
            {submission.isPreview && <Badge variant="secondary">Preview</Badge>}
          </div>

          {/* Review History */}
          {(submission.reviewNotes || submission.rejectionReason) && (
            <div className="border-t pt-4">
              <h4 className="font-medium text-sm mb-2">Review History:</h4>
              {submission.reviewNotes && (
                <div className="mb-2">
                  <span className="text-xs text-gray-500">Review Notes:</span>
                  <p className="text-sm text-gray-700">{submission.reviewNotes}</p>
                </div>
              )}
              {submission.rejectionReason && (
                <div>
                  <span className="text-xs text-gray-500">Rejection Reason:</span>
                  <p className="text-sm text-red-600">{submission.rejectionReason}</p>
                </div>
              )}
              {submission.reviewedBy && (
                <p className="text-xs text-gray-500 mt-1">
                  Reviewed by {submission.reviewedBy} on {new Date(submission.reviewedAt!).toLocaleDateString()}
                </p>
              )}
            </div>
          )}

          {/* Review Form */}
          {showReviewForm && submission.status === 'PENDING' && (
            <div className="border-t pt-4 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Review Notes (Optional)
                </label>
                <textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Add any review notes..."
                  rows={2}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rejection Reason (Required for rejection)
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Explain why this submission is being rejected..."
                  rows={2}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleApprove}
                  variant="default"
                  size="sm"
                  disabled={isLoading}
                >
                  Approve
                </Button>
                <Button
                  onClick={handleReject}
                  variant="secondary"
                  size="sm"
                  disabled={isLoading || !rejectionReason.trim()}
                >
                  Reject
                </Button>
                <Button
                  onClick={() => setShowReviewForm(false)}
                  variant="outline"
                  size="sm"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-xs text-gray-500">
              ID: {submission.id.slice(0, 8)}...
            </div>

            <div className="flex gap-2">
              {submission.status === 'PENDING' && (
                <Button
                  onClick={() => setShowReviewForm(true)}
                  variant="default"
                  size="sm"
                  disabled={isLoading || showReviewForm}
                >
                  Review
                </Button>
              )}

              {submission.status === 'APPROVED' && onPublish && (
                <Button
                  onClick={handlePublish}
                  variant="default"
                  size="sm"
                  disabled={isLoading}
                >
                  Publish as Card
                </Button>
              )}

              {submission.status === 'PUBLISHED' && (
                <span className="text-sm text-green-600 font-medium">
                  Published ✓
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubmissionReviewCard;