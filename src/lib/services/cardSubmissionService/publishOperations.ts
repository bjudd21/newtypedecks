/**
 * Card submission publish operations
 */

import { prisma } from '@/lib/database';
import { CardService } from '../cardService';
import type { CardSubmissionWithRelations } from '@/lib/types/submission';
import { transformSubmissionToCardData } from './transformers';
import { getSubmissionById } from './crudOperations';

/**
 * Publish approved submission as card
 */
export async function publishSubmission(
  submissionId: string,
  _publishedBy: string
): Promise<{
  submission: CardSubmissionWithRelations;
  card: import('@prisma/client').Card;
}> {
  const submission = await getSubmissionById(submissionId);

  if (!submission) {
    throw new Error('Submission not found');
  }

  if (submission.status !== 'APPROVED') {
    throw new Error('Submission must be approved before publishing');
  }

  if (submission.publishedCardId) {
    throw new Error('Submission has already been published');
  }

  // Transform submission to card data
  const cardData = await transformSubmissionToCardData(submission);

  // Create the card
  const card = await CardService.createCard(cardData);

  // Update submission status
  const updatedSubmission = (await prisma.cardSubmission.update({
    where: { id: submissionId },
    data: {
      status: 'PUBLISHED',
      publishedCardId: card.id,
      publishedAt: new Date(),
    },
    include: {
      user: true,
      reviewer: true,
      publishedCard: true,
    },
  })) as CardSubmissionWithRelations;

  return { submission: updatedSubmission, card };
}
