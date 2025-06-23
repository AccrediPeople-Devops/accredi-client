"use client";
import React, { useState } from "react";
import { HiChevronDown } from "react-icons/hi";
import CountrySelectionModal from "./CountrySelectionModal";
import { COUNTRIES_DATA, CountryData } from "@/app/context/LocationContext";

interface CountryButtonProps {
  selectedCountryCode?: string;
  onCountrySelect: (country: CountryData) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  label?: string;
  error?: string;
  variant?: 'default' | 'minimal' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
  showFlag?: boolean;
  showCode?: boolean;
}

export default function CountryButton({
  selectedCountryCode,
  onCountrySelect,
  placeholder = "Select Country",
  disabled = false,
  required = false,
  className = "",
  label,
  error,
  variant = 'default',
  size = 'md',
  showFlag = true,
  showCode = false
}: CountryButtonProps) {
  const [showModal, setShowModal] = useState(false);

  const selectedCountry = selectedCountryCode 
    ? COUNTRIES_DATA.find(c => c.code === selectedCountryCode)
    : null;

  const handleCountrySelect = (country: CountryData) => {
    onCountrySelect(country);
    setShowModal(false);
  };

  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg'
  };

  // Variant classes
  const variantClasses = {
    default: 'bg-[var(--input-bg)] border border-[var(--border)] hover:bg-[var(--border)] focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent',
    minimal: 'bg-transparent border-0 hover:bg-[var(--input-bg)] focus:bg-[var(--input-bg)]',
    outlined: 'bg-transparent border-2 border-[var(--border)] hover:border-[var(--primary)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20'
  };

  const buttonClasses = `
    w-full flex items-center justify-between rounded-[var(--radius-md)] 
    text-[var(--foreground)] transition-all duration-200 
    focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed
    ${sizeClasses[size]} ${variantClasses[variant]} ${className}
    ${error ? 'border-red-500 focus:ring-red-500' : ''}
  `.trim();

  return (
    <div className="w-full">
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Button */}
      <button
        type="button"
        onClick={() => setShowModal(true)}
        disabled={disabled}
        className={buttonClasses}
      >
        <div className="flex items-center gap-3">
          {selectedCountry ? (
            <>
              {showFlag && <span className="text-xl">{selectedCountry.flag}</span>}
              <div className="text-left">
                <div className="font-medium">{selectedCountry.name}</div>
                {showCode && (
                  <div className="text-xs text-[var(--foreground-muted)]">
                    {selectedCountry.code}
                  </div>
                )}
              </div>
            </>
          ) : (
            <span className="text-[var(--foreground-muted)]">{placeholder}</span>
          )}
        </div>
        
        <HiChevronDown className="w-5 h-5 text-[var(--foreground-muted)]" />
      </button>

      {/* Error message */}
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}

      {/* Country Selection Modal */}
      <CountrySelectionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        mode="form"
        selectedCountryCode={selectedCountryCode}
        onCountrySelect={handleCountrySelect}
      />
    </div>
  );
} 