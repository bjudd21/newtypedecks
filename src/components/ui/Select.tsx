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

  // Safeguard against undefined options
  const safeOptions = options || [];

  const selectedOption = safeOptions.find((option) => option.value === value);

  const filteredOptions = safeOptions.filter((option) =>
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
        <label className="text-muted-foreground mb-2 block text-sm font-medium">
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
            'bg-background focus:border-primary focus:ring-ring relative w-full cursor-default rounded-md border py-2 pr-10 pl-3 text-left shadow-sm focus:ring-1 focus:outline-none sm:text-sm',
            error
              ? 'border-red-900/50 text-red-400 placeholder-red-400 focus:border-red-500 focus:ring-red-500'
              : 'border-border placeholder:text-muted-foreground/50 text-white',
            disabled && 'bg-card text-muted-foreground/70 cursor-not-allowed'
          )}
        >
          <span
            className={cn(
              'block truncate',
              !selectedOption && 'text-muted-foreground'
            )}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <svg
              className={cn(
                'text-muted-foreground h-5 w-5 transition-transform duration-200',
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
          <div className="ring-opacity-5 bg-card ring-border absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md py-1 text-base shadow-lg ring-1 focus:outline-none sm:text-sm">
            {safeOptions.length > 10 && (
              <div className="px-3 py-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search..."
                  className="border-border bg-background placeholder:text-muted-foreground/50 focus:border-primary focus:ring-ring w-full rounded-md border px-3 py-2 text-sm text-white focus:ring-1 focus:outline-none"
                />
              </div>
            )}

            {filteredOptions.length === 0 ? (
              <div className="text-muted-foreground relative cursor-default px-4 py-2 select-none">
                No options found.
              </div>
            ) : (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => handleSelect(option)}
                  className={cn(
                    'hover:bg-accent relative cursor-pointer px-4 py-2 text-white select-none',
                    option.value === value && 'bg-primary/30 text-primary/80',
                    option.disabled &&
                      'text-muted-foreground/70 hover:bg-card cursor-not-allowed'
                  )}
                >
                  <span className="block truncate font-normal">
                    {option.label}
                  </span>
                  {option.value === value && (
                    <span className="text-primary absolute inset-y-0 right-0 flex items-center pr-4">
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
