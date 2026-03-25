/**
 * File uploader component
 */

import React from 'react';

interface FileUploaderProps {
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onFileUpload }) => {
  return (
    <div>
      <label className="text-muted-foreground mb-2 block text-sm font-medium">
        Upload File
      </label>
      <input
        type="file"
        accept=".csv,.tsv,.txt,.json"
        onChange={onFileUpload}
        className="text-muted-foreground file:bg-primary/20 file:text-primary hover:file:bg-primary/30 block w-full text-sm file:mr-4 file:rounded-full file:border-0 file:px-4 file:py-2 file:text-sm file:font-semibold"
      />
    </div>
  );
};
