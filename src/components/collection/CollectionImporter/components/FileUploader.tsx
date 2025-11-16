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
      <label className="mb-2 block text-sm font-medium text-gray-400">
        Upload File
      </label>
      <input
        type="file"
        accept=".csv,.tsv,.txt,.json"
        onChange={onFileUpload}
        className="block w-full text-sm text-gray-400 file:mr-4 file:rounded-full file:border-0 file:bg-[#8b7aaa]/20 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#8b7aaa] hover:file:bg-[#8b7aaa]/30"
      />
    </div>
  );
};
