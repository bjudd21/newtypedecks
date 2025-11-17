/**
 * Card submission image operations
 */

import { prisma } from '@/lib/database';
import { SubmissionImageService } from '../submissionImageService';

/**
 * Upload image for submission
 */
export async function uploadSubmissionImage(
  submissionId: string,
  file: File
): Promise<{ imageUrl: string; imageFile: string }> {
  const submission = await prisma.cardSubmission.findUnique({
    where: { id: submissionId },
  });

  if (!submission) {
    throw new Error('Submission not found');
  }

  // Upload and process the image
  const uploadResult = await SubmissionImageService.uploadSubmissionImage(
    file,
    {
      cardName: submission.name,
      setCode: 'SUB', // Default set code for submissions
      setNumber: submission.setNumber,
    }
  );

  if (!uploadResult.success) {
    throw new Error(uploadResult.message || 'Failed to upload image');
  }

  // Update submission with image URLs
  await prisma.cardSubmission.update({
    where: { id: submissionId },
    data: {
      imageUrl: uploadResult.imageUrl,
      imageFile: uploadResult.imageFile,
    },
  });

  return {
    imageUrl: uploadResult.imageUrl!,
    imageFile: uploadResult.imageFile!,
  };
}
