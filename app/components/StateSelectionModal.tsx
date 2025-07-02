"use client";
import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { HiSearch, HiX, HiCheck } from "react-icons/hi";
import { useLocation } from "@/app/context/LocationContext";
import { EnhancedLocationService, StateData } from "@/app/components/service/enhancedLocationData";

interface StateSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCountryCode?: string;
  selectedStateCode?: string;
  onStateSelect?: (state: StateData) => void;
  title?: string;
  subtitle?: string;
}

export default function StateSelectionModal({ 
  isOpen, 
  onClose,
  selectedCountryCode,
  selectedStateCode,
  onStateSelect,
  title,
  subtitle
}: StateSelectionModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const { currentCountry } = useLocation();

  // Get states for the selected country (or current country as fallback)
  const countryCode = selectedCountryCode || currentCountry?.code || 'US';
  const states = EnhancedLocationService.getStatesByCountry(countryCode);
  const selectedState = selectedStateCode ? states.find(s => s.code === selectedStateCode) : null;

  // Filter states based on search term
  const filteredStates = states.filter(state =>
    state.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    state.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (state.type && state.type.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Focus search input when modal opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleStateSelect = (state: StateData) => {
    onStateSelect?.(state);
    handleClose();
  };

  const handleClose = () => {
    setSearchTerm("");
    onClose();
  };

  if (!isOpen) return null;

  // Get country name for display
  const countryName = selectedCountryCode 
    ? EnhancedLocationService.getAllCountries().find(c => c.code === selectedCountryCode)?.name
    : currentCountry?.name || 'Unknown';

  // Default titles
  const modalTitle = title || 'Select State/Province';
  const modalSubtitle = subtitle || `Choose a state or province in ${countryName}`;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-4 bg-gradient-to-br from-[#0F0F23] via-[#1A1A3E] to-[#2D1B69] border border-white/20 rounded-2xl shadow-2xl max-h-[80vh] overflow-hidden z-[10000]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <div>
            <h2 className="text-2xl font-bold text-white">{modalTitle}</h2>
            <p className="text-gray-400 text-sm mt-1">
              {modalSubtitle}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <HiX className="w-6 h-6 text-gray-400 hover:text-white" />
          </button>
        </div>

        {/* Current Selection */}
        {selectedState && (
          <div className="p-4 bg-white/5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {selectedState.code}
                </span>
              </div>
              <div>
                <div className="text-white font-semibold">{selectedState.name}</div>
                <div className="text-gray-400 text-sm">
                  Currently selected {selectedState.type || 'region'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="p-4 border-b border-white/10">
          <div className="relative">
            <HiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search states, provinces, or codes..."
              className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20 transition-all"
            />
          </div>
        </div>

        {/* States List */}
        <div className="flex-1 overflow-y-auto max-h-96">
          {states.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-6xl mb-4">🗺️</div>
              <div className="text-gray-400 text-center">
                <div className="font-semibold mb-1">No states available</div>
                <div className="text-sm">This country doesn't have detailed state data</div>
              </div>
            </div>
          ) : filteredStates.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <div className="text-gray-400 text-center">
                <div className="font-semibold mb-1">No states found</div>
                <div className="text-sm">Try searching for "{searchTerm}"</div>
              </div>
            </div>
          ) : (
            <div className="p-4 space-y-2">
              {filteredStates.map((state) => (
                <StateOption
                  key={state.code}
                  state={state}
                  isSelected={selectedState?.code === state.code}
                  onClick={() => handleStateSelect(state)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/20 bg-white/5">
          <div className="flex items-center justify-between">
            <div className="text-gray-400 text-sm">
              {filteredStates.length} of {states.length} states shown
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleClose}
                className="px-6 py-2 text-gray-400 hover:text-white border border-white/20 rounded-lg hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

// State Option Component
interface StateOptionProps {
  state: StateData;
  isSelected: boolean;
  onClick: () => void;
}

function StateOption({ state, isSelected, onClick }: StateOptionProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200 ${
        isSelected
          ? 'bg-[#4F46E5]/20 border border-[#4F46E5]/40 text-[#4F46E5]'
          : 'hover:bg-white/10 border border-transparent text-gray-300'
      }`}
    >
      <div className="w-10 h-10 bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] rounded-lg flex items-center justify-center">
        <span className="text-white text-sm font-bold">
          {state.code}
        </span>
      </div>
      <div className="flex-1 text-left">
        <div className="font-semibold text-lg">{state.name}</div>
        <div className="text-sm opacity-75">
          {state.type || 'State'} • {state.countryCode}
        </div>
      </div>
      {isSelected && (
        <div className="flex items-center gap-2">
          <HiCheck className="w-5 h-5 text-[#4F46E5]" />
          <span className="text-sm font-medium">Selected</span>
        </div>
      )}
    </button>
  );
} 