// Select component for dropdowns and filtering
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  error?: string;
  required?: boolean;
}

const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  className,
  label,
  error,
  required = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const selectRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find((option) => option.value === value);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      setSearchTerm('');
    }
  };

  const handleSelect = (option: SelectOption) => {
    if (!option.disabled) {
      onChange(option.value);
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  return (
    <div className={cn('relative', className)}>
      {label && (
        <label className="mb-2 block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      <div ref={selectRef} className="relative">
        <button
          type="button"
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className={cn(
            'relative w-full cursor-default rounded-md border bg-[#1a1625] py-2 pr-10 pl-3 text-left shadow-sm focus:border-[#8b7aaa] focus:ring-1 focus:ring-[#8b7aaa] focus:outline-none sm:text-sm',
            error
              ? 'border-red-900/50 text-red-400 placeholder-red-400 focus:border-red-500 focus:ring-red-500'
              : 'border-[#443a5c] text-white placeholder-gray-500',
            disabled && 'cursor-not-allowed bg-[#2d2640] text-gray-500'
          )}
        >
          <span
            className={cn('block truncate', !selectedOption && 'text-gray-400')}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <svg
              className={cn(
                'h-5 w-5 text-gray-400 transition-transform duration-200',
                isOpen && 'rotate-180'
              )}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </span>
        </button>

        {isOpen && (
          <div className="ring-opacity-5 absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-[#2d2640] py-1 text-base shadow-lg ring-1 ring-[#443a5c] focus:outline-none sm:text-sm">
            {options.length > 10 && (
              <div className="px-3 py-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search..."
                  className="w-full rounded-md border border-[#443a5c] bg-[#1a1625] px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-[#8b7aaa] focus:ring-1 focus:ring-[#8b7aaa] focus:outline-none"
                />
              </div>
            )}

            {filteredOptions.length === 0 ? (
              <div className="relative cursor-default px-4 py-2 text-gray-400 select-none">
                No options found.
              </div>
            ) : (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => handleSelect(option)}
                  className={cn(
                    'relative cursor-pointer px-4 py-2 select-none text-white hover:bg-[#3a3050]',
                    option.value === value && 'bg-[#8b7aaa]/30 text-[#a89ec7]',
                    option.disabled &&
                      'cursor-not-allowed text-gray-500 hover:bg-[#2d2640]'
                  )}
                >
                  <span className="block truncate font-normal">
                    {option.label}
                  </span>
                  {option.value === value && (
                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-[#8b7aaa]">
                      <svg
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export { Select };
