// File upload component for card images
'use client';

import React, { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Button } from './Button';
import { Spinner } from './Spinner';

export interface FileUploadProps {
  onUpload: (file: File) => Promise<void>;
  onError?: (error: string) => void;
  accept?: string;
  maxSize?: number; // in bytes
  className?: string;
  disabled?: boolean;
  multiple?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onUpload,
  onError,
  accept = 'image/*',
  maxSize = 5 * 1024 * 1024, // 5MB
  className,
  disabled = false,
  multiple = false,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      // Validate file size
      if (file.size > maxSize) {
        const errorMessage = `File size too large. Maximum size: ${Math.round(maxSize / (1024 * 1024))}MB`;
        onError?.(errorMessage);
        return;
      }

      // Validate file type
      if (accept && !file.type.match(accept.replace('*', '.*'))) {
        const errorMessage = `Invalid file type. Accepted types: ${accept}`;
        onError?.(errorMessage);
        return;
      }

      setIsUploading(true);
      try {
        await onUpload(file);
      } catch (error) {
        onError?.(error instanceof Error ? error.message : 'Upload failed');
      } finally {
        setIsUploading(false);
      }
    },
    [onUpload, onError, maxSize, accept]
  );

  const handleFiles = useCallback(
    (files: FileList) => {
      if (multiple) {
        Array.from(files).forEach(handleFile);
      } else {
        handleFile(files[0]);
      }
    },
    [handleFile, multiple]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (disabled) return;

      const files = e.dataTransfer.files;
      if (files && files[0]) {
        handleFiles(files);
      }
    },
    [handleFiles, disabled]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      if (disabled) return;

      const files = e.target.files;
      if (files && files[0]) {
        handleFiles(files);
      }
    },
    [handleFiles, disabled]
  );

  const handleClick = useCallback(() => {
    if (disabled || isUploading) return;
    fileInputRef.current?.click();
  }, [disabled, isUploading]);

  return (
    <div className={cn('w-full', className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        className="hidden"
        disabled={disabled}
      />

      <div
        className={cn(
          'relative rounded-lg border-2 border-dashed p-6 text-center transition-colors',
          dragActive
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400',
          disabled && 'cursor-not-allowed opacity-50',
          isUploading && 'cursor-not-allowed opacity-50'
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="space-y-4">
          {isUploading ? (
            <div className="flex flex-col items-center space-y-2">
              <Spinner size="lg" />
              <p className="text-sm text-gray-600">Uploading...</p>
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center space-y-2">
                <svg
                  className="h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="text-sm text-gray-600">
                  <p className="font-medium">
                    {dragActive ? 'Drop files here' : 'Upload card image'}
                  </p>
                  <p className="text-xs">
                    PNG, JPG, JPEG, WEBP up to{' '}
                    {Math.round(maxSize / (1024 * 1024))}MB
                  </p>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={handleClick}
                disabled={disabled}
                className="mt-2"
              >
                Choose File
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
