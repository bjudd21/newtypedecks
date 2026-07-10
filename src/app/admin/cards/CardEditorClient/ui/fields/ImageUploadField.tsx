/**
 * ImageUploadField — card image preview + drag-drop upload.
 * Uploads through /api/upload/card-image and reports the stored URLs.
 */

import React, { useState } from 'react';
import Image from 'next/image';
import { FileUpload } from '@/components/ui/FileUpload';
import { uploadCardImage, type UploadedImage } from '../../api';

interface ImageUploadFieldProps {
  imageUrl: string;
  cardName: string;
  onUploaded: (urls: UploadedImage) => void;
}

export function ImageUploadField({
  imageUrl,
  cardName,
  onUploaded,
}: ImageUploadFieldProps) {
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (file: File) => {
    setError(null);
    const urls = await uploadCardImage(file);
    onUploaded(urls);
  };

  return (
    <div>
      <span className="text-foreground mb-1.5 block text-sm font-medium">
        Card image
      </span>
      <div className="flex gap-4">
        <div className="bg-card border-border relative aspect-[5/7] w-32 shrink-0 overflow-hidden rounded-lg border">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={cardName || 'Card image preview'}
              fill
              sizes="128px"
              className="object-contain"
            />
          ) : (
            <div className="text-muted-foreground flex h-full items-center justify-center p-2 text-center text-xs">
              No image yet
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <FileUpload
            onUpload={handleUpload}
            onError={setError}
            accept="image/*"
          />
          {error && <p className="text-destructive mt-1 text-sm">{error}</p>}
        </div>
      </div>
    </div>
  );
}
