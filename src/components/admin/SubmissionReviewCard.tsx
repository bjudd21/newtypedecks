'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
} from '@/components/ui';
import type { CardSubmissionWithDetails } from '@/lib/types/submission';

export interface SubmissionReviewCardProps {
  submission: CardSubmissionWithDetails;
  onReview?: (
    id: string,
    status: 'APPROVED' | 'REJECTED',
    reviewNotes?: string,
    rejectionReason?: string
  ) => void;
  onPublish?: (id: string) => void;
  isLoading?: boolean;
  className?: string;
}

// Helper Components
interface CardDetailsGridProps {
  submission: CardSubmissionWithDetails;
}

const CardDetailsGrid: React.FC<CardDetailsGridProps> = ({ submission }) => (
  <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
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
);

interface CardTextSectionProps {
  description?: string | null;
  officialText?: string | null;
}

const CardTextSection: React.FC<CardTextSectionProps> = ({
  description,
  officialText,
}) => (
  <>
    {description && (
      <div>
        <h4 className="mb-1 text-sm font-medium">Description:</h4>
        <p className="rounded bg-gray-50 p-2 text-sm text-gray-700">
          {description}
        </p>
      </div>
    )}
    {officialText && (
      <div>
        <h4 className="mb-1 text-sm font-medium">Official Text:</h4>
        <p className="rounded bg-gray-50 p-2 text-sm text-gray-700">
          {officialText}
        </p>
      </div>
    )}
  </>
);

interface KeywordsAndTagsProps {
  keywords?: string[] | null;
  tags?: string[] | null;
}

const KeywordsAndTags: React.FC<KeywordsAndTagsProps> = ({
  keywords,
  tags,
}) => (
  <>
    {keywords && keywords.length > 0 && (
      <div>
        <h4 className="mb-1 text-sm font-medium">Keywords:</h4>
        <div className="flex flex-wrap gap-1">
          {keywords.map((keyword, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {keyword}
            </Badge>
          ))}
        </div>
      </div>
    )}
    {tags && tags.length > 0 && (
      <div>
        <h4 className="mb-1 text-sm font-medium">Tags:</h4>
        <div className="flex flex-wrap gap-1">
          {tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    )}
  </>
);

interface SpecialFlagsProps {
  isFoil?: boolean | null;
  isPromo?: boolean | null;
  isAlternate?: boolean | null;
  isLeak?: boolean | null;
  isPreview?: boolean | null;
}

const SpecialFlags: React.FC<SpecialFlagsProps> = ({
  isFoil,
  isPromo,
  isAlternate,
  isLeak,
  isPreview,
}) => {
  const hasFlags = isFoil || isPromo || isAlternate || isLeak || isPreview;
  if (!hasFlags) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {isFoil && <Badge variant="secondary">Foil</Badge>}
      {isPromo && <Badge variant="secondary">Promo</Badge>}
      {isAlternate && <Badge variant="secondary">Alt Art</Badge>}
      {isLeak && <Badge variant="secondary">Leak</Badge>}
      {isPreview && <Badge variant="secondary">Preview</Badge>}
    </div>
  );
};

interface ReviewHistoryProps {
  reviewNotes?: string | null;
  rejectionReason?: string | null;
  reviewedBy?: string | null;
  reviewedAt?: Date | null;
}

const ReviewHistory: React.FC<ReviewHistoryProps> = ({
  reviewNotes,
  rejectionReason,
  reviewedBy,
  reviewedAt,
}) => {
  const hasHistory = reviewNotes || rejectionReason;
  if (!hasHistory) return null;

  return (
    <div className="border-t pt-4">
      <h4 className="mb-2 text-sm font-medium">Review History:</h4>
      {reviewNotes && (
        <div className="mb-2">
          <span className="text-xs text-gray-500">Review Notes:</span>
          <p className="text-sm text-gray-700">{reviewNotes}</p>
        </div>
      )}
      {rejectionReason && (
        <div>
          <span className="text-xs text-gray-500">Rejection Reason:</span>
          <p className="text-sm text-red-600">{rejectionReason}</p>
        </div>
      )}
      {reviewedBy && reviewedAt && (
        <p className="mt-1 text-xs text-gray-500">
          Reviewed by {reviewedBy} on{' '}
          {new Date(reviewedAt).toLocaleDateString()}
        </p>
      )}
    </div>
  );
};

interface ReviewFormProps {
  show: boolean;
  reviewNotes: string;
  rejectionReason: string;
  isLoading: boolean;
  onReviewNotesChange: (value: string) => void;
  onRejectionReasonChange: (value: string) => void;
  onApprove: () => void;
  onReject: () => void;
  onCancel: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  show,
  reviewNotes,
  rejectionReason,
  isLoading,
  onReviewNotesChange,
  onRejectionReasonChange,
  onApprove,
  onReject,
  onCancel,
}) => {
  if (!show) return null;

  return (
    <div className="space-y-3 border-t pt-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Review Notes (Optional)
        </label>
        <textarea
          value={reviewNotes}
          onChange={(e) => onReviewNotesChange(e.target.value)}
          placeholder="Add any review notes..."
          rows={2}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Rejection Reason (Required for rejection)
        </label>
        <textarea
          value={rejectionReason}
          onChange={(e) => onRejectionReasonChange(e.target.value)}
          placeholder="Explain why this submission is being rejected..."
          rows={2}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="flex gap-2">
        <Button
          onClick={onApprove}
          variant="default"
          size="sm"
          disabled={isLoading}
        >
          Approve
        </Button>
        <Button
          onClick={onReject}
          variant="secondary"
          size="sm"
          disabled={isLoading || !rejectionReason.trim()}
        >
          Reject
        </Button>
        <Button
          onClick={onCancel}
          variant="outline"
          size="sm"
          disabled={isLoading}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

interface ActionButtonsProps {
  submissionId: string;
  status: string;
  isLoading: boolean;
  showReviewForm: boolean;
  onReviewClick: () => void;
  onPublish?: (id: string) => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  submissionId,
  status,
  isLoading,
  showReviewForm,
  onReviewClick,
  onPublish,
}) => (
  <div className="flex items-center justify-between border-t pt-4">
    <div className="text-xs text-gray-500">
      ID: {submissionId.slice(0, 8)}...
    </div>

    <div className="flex gap-2">
      {status === 'PENDING' && (
        <Button
          onClick={onReviewClick}
          variant="default"
          size="sm"
          disabled={isLoading || showReviewForm}
        >
          Review
        </Button>
      )}

      {status === 'APPROVED' && onPublish && (
        <Button
          onClick={() => onPublish(submissionId)}
          variant="default"
          size="sm"
          disabled={isLoading}
        >
          Publish as Card
        </Button>
      )}

      {status === 'PUBLISHED' && (
        <span className="text-sm font-medium text-green-600">Published ✓</span>
      )}
    </div>
  </div>
);

// Helper functions for status and priority colors
const getStatusColor = (status: string): string => {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800';
    case 'APPROVED':
      return 'bg-green-100 text-green-800';
    case 'REJECTED':
      return 'bg-red-100 text-red-800';
    case 'PUBLISHED':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case 'URGENT':
      return 'bg-red-100 text-red-800';
    case 'HIGH':
      return 'bg-orange-100 text-orange-800';
    case 'NORMAL':
      return 'bg-gray-100 text-gray-800';
    case 'LOW':
      return 'bg-gray-50 text-gray-600';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

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
    if (!onReview) return;
    onReview(submission.id, 'APPROVED', reviewNotes || undefined);
    setShowReviewForm(false);
    setReviewNotes('');
  };

  const handleReject = () => {
    if (!onReview || !rejectionReason.trim()) return;
    onReview(
      submission.id,
      'REJECTED',
      reviewNotes || undefined,
      rejectionReason
    );
    setShowReviewForm(false);
    setReviewNotes('');
    setRejectionReason('');
  };

  const handleCancel = () => {
    setShowReviewForm(false);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-start justify-between">
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
          {submission.imageUrl && (
            <div className="flex justify-center">
              <Image
                src={submission.imageUrl}
                alt={`Card preview for ${submission.name}`}
                width={192}
                height={256}
                className="max-h-64 max-w-48 rounded-lg border object-contain"
              />
            </div>
          )}

          <CardDetailsGrid submission={submission} />

          <CardTextSection
            description={submission.description}
            officialText={submission.officialText}
          />

          <KeywordsAndTags
            keywords={submission.keywords}
            tags={submission.tags}
          />

          <SpecialFlags
            isFoil={submission.isFoil}
            isPromo={submission.isPromo}
            isAlternate={submission.isAlternate}
            isLeak={submission.isLeak}
            isPreview={submission.isPreview}
          />

          <ReviewHistory
            reviewNotes={submission.reviewNotes}
            rejectionReason={submission.rejectionReason}
            reviewedBy={submission.reviewedBy}
            reviewedAt={submission.reviewedAt}
          />

          {submission.status === 'PENDING' && (
            <ReviewForm
              show={showReviewForm}
              reviewNotes={reviewNotes}
              rejectionReason={rejectionReason}
              isLoading={isLoading}
              onReviewNotesChange={setReviewNotes}
              onRejectionReasonChange={setRejectionReason}
              onApprove={handleApprove}
              onReject={handleReject}
              onCancel={handleCancel}
            />
          )}

          <ActionButtons
            submissionId={submission.id}
            status={submission.status}
            isLoading={isLoading}
            showReviewForm={showReviewForm}
            onReviewClick={() => setShowReviewForm(true)}
            onPublish={onPublish}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default SubmissionReviewCard;
