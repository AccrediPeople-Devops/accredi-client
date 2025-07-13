"use client";
import React, { useState } from "react";
import { HiChevronDown } from "react-icons/hi";
import StateSelectionModal from "./StateSelectionModal";
import { StateData } from "@/app/components/service/enhancedLocationData";

interface StateButtonProps {
  selectedCountryCode?: string;
  selectedStateCode?: string;
  onStateSelect: (state: StateData) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  label?: string;
  error?: string;
  variant?: 'default' | 'minimal' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
  showCode?: boolean;
}

export default function StateButton({
  selectedCountryCode,
  selectedStateCode,
  onStateSelect,
  placeholder = "Any State",
  disabled = false,
  required = false,
  className = "",
  label,
  error,
  variant = 'default',
  size = 'md',
  showCode = true
}: StateButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleStateSelect = (state: StateData) => {
    onStateSelect(state);
    setIsModalOpen(false);
  };

  // Get size classes
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'px-3 py-2 text-sm';
      case 'lg': return 'px-6 py-4 text-lg';
      default: return 'px-4 py-3 text-base';
    }
  };

  // Get variant classes
  const getVariantClasses = () => {
    const baseClasses = "border rounded-2xl transition-all duration-300 flex items-center justify-between w-full";
    
    switch (variant) {
      case 'minimal':
        return `${baseClasses} bg-transparent border-gray-300 site-text-primary hover:border-[#F59E0B] focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B]/20`;
      case 'outlined':
        return `${baseClasses} bg-white border-gray-300 site-text-primary hover:border-[#F59E0B] focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B]/20`;
      default:
        return `${baseClasses} site-glass backdrop-blur-sm site-border border focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent site-text-primary`;
    }
  };

  const buttonClasses = `
    ${getVariantClasses()}
    ${getSizeClasses()}
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-[1.02]'}
    ${className}
  `;

  // Get the selected state name for display
  const getDisplayText = () => {
    if (!selectedStateCode) return placeholder;
    
    // You might want to get the state name from the service
    // For now, just show the code or a formatted version
    return showCode ? selectedStateCode : selectedStateCode;
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium site-text-primary">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <button
        type="button"
        onClick={() => !disabled && setIsModalOpen(true)}
        disabled={disabled}
        className={buttonClasses}
      >
        <span className={selectedStateCode ? 'site-text-primary' : 'site-text-secondary'}>
          {getDisplayText()}
        </span>
        <HiChevronDown className={`w-5 h-5 site-text-secondary transition-transform duration-200 ${isModalOpen ? 'rotate-180' : ''}`} />
      </button>

      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}

      <StateSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedCountryCode={selectedCountryCode}
        selectedStateCode={selectedStateCode}
        onStateSelect={handleStateSelect}
      />
    </div>
  );
} 