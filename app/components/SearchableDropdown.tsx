import React, { useState, useRef, useEffect } from 'react';

interface Option {
  value: string;
  label: string;
  code?: string;
}

interface SearchableDropdownProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string, code?: string) => void;
  options: Option[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  searchPlaceholder?: string;
  noOptionsMessage?: string;
  className?: string;
}

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  placeholder = "Select an option",
  required = false,
  disabled = false,
  searchPlaceholder = "Search...",
  noOptionsMessage = "No options found",
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter options based on search term
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Find selected option
  const selectedOption = options.find(option => option.value === value);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Reset highlighted index when search term changes
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [searchTerm]);

  const handleToggle = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
    setSearchTerm('');
    setHighlightedIndex(-1);
  };

  const handleSelect = (option: Option) => {
    onChange(option.value, option.code);
    setIsOpen(false);
    setSearchTerm('');
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        if (isOpen) {
          if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
            handleSelect(filteredOptions[highlightedIndex]);
          }
        } else {
          setIsOpen(true);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex(prev => 
            prev < filteredOptions.length - 1 ? prev + 1 : 0
          );
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (isOpen) {
          setHighlightedIndex(prev => 
            prev > 0 ? prev - 1 : filteredOptions.length - 1
          );
        }
        break;
      case 'Tab':
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
        break;
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Label */}
      <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Dropdown Trigger */}
      <div
        className={`
          relative w-full px-4 py-3 bg-[var(--input-bg)] border border-[var(--border)] 
          rounded-[var(--radius-md)] cursor-pointer transition-all duration-200
          ${disabled 
            ? 'opacity-50 cursor-not-allowed bg-gray-100' 
            : 'hover:border-[var(--primary)] focus-within:border-[var(--primary)] focus-within:ring-2 focus-within:ring-[var(--primary)]/20'
          }
          ${isOpen ? 'border-[var(--primary)] ring-2 ring-[var(--primary)]/20' : ''}
        `}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
      >
        <div className="flex items-center justify-between">
          <span className={`
            block truncate text-[var(--foreground)]
            ${selectedOption ? '' : 'text-[var(--foreground-muted)]'}
          `}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          
          <svg
            className={`
              w-5 h-5 text-[var(--foreground-muted)] transition-transform duration-200
              ${isOpen ? 'rotate-180' : ''}
            `}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-[var(--background)] border border-[var(--border)] rounded-[var(--radius-md)] shadow-lg max-h-60 overflow-hidden">
          {/* Search Input */}
          <div className="p-3 border-b border-[var(--border)]">
            <div className="relative">
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full px-3 py-2 pl-9 bg-[var(--input-bg)] border border-[var(--border)] rounded-[var(--radius-sm)] text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
                onKeyDown={handleKeyDown}
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--foreground-muted)]"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <div
                  key={option.value}
                  className={`
                    px-4 py-3 cursor-pointer transition-colors duration-150
                    ${index === highlightedIndex 
                      ? 'bg-[var(--primary)] text-white' 
                      : 'hover:bg-[var(--input-bg)] text-[var(--foreground)]'
                    }
                    ${selectedOption?.value === option.value 
                      ? 'bg-[var(--primary)]/10 font-medium' 
                      : ''
                    }
                  `}
                  onClick={() => handleSelect(option)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  <div className="flex items-center justify-between">
                    <span className="truncate">{option.label}</span>
                    {selectedOption?.value === option.value && (
                      <svg
                        className="w-4 h-4 ml-2 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-6 text-center text-[var(--foreground-muted)]">
                {noOptionsMessage}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hidden input for form submission */}
      <input
        type="hidden"
        name={name}
        value={value}
      />
    </div>
  );
};

export default SearchableDropdown; 