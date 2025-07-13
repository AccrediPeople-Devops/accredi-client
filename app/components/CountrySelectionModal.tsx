"use client";
import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { HiSearch, HiX, HiCheck } from "react-icons/hi";
import { useLocation, COUNTRIES_DATA, CountryData } from "@/app/context/LocationContext";

interface CountrySelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  // New props for form field mode
  mode?: 'currency' | 'form';
  selectedCountryCode?: string;
  onCountrySelect?: (country: CountryData) => void;
  title?: string;
  subtitle?: string;
}

export default function CountrySelectionModal({ 
  isOpen, 
  onClose,
  mode = 'currency',
  selectedCountryCode,
  onCountrySelect,
  title,
  subtitle
}: CountrySelectionModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const { currentCountry, setManualCountry, geolocationLoading } = useLocation();

  // Determine which country is currently selected based on mode
  const getSelectedCountry = () => {
    if (mode === 'form') {
      return selectedCountryCode ? COUNTRIES_DATA.find(c => c.code === selectedCountryCode) : null;
    }
    return currentCountry;
  };

  const selectedCountry = getSelectedCountry();

  // Filter countries based on search term
  const filteredCountries = COUNTRIES_DATA.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.currencyCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Separate popular countries for better UX
  const popularCountryCodes = ['US', 'CA', 'GB', 'IN', 'AU', 'DE', 'FR', 'SG', 'MY', 'JP', 'BR', 'MX', 'NL', 'ZA', 'AE'];
  const popularCountries = filteredCountries.filter(country => 
    popularCountryCodes.includes(country.code)
  );
  const otherCountries = filteredCountries.filter(country => 
    !popularCountryCodes.includes(country.code)
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

  const handleCountrySelect = (country: CountryData) => {
    if (mode === 'currency') {
      // Original currency selection behavior
      setManualCountry(country);
    } else {
      // Form field selection behavior
      onCountrySelect?.(country);
    }
    handleClose();
  };

  const handleAutoDetect = () => {
    if (mode === 'currency') {
      setManualCountry(null);
    }
    handleClose();
  };

  const handleClose = () => {
    setSearchTerm("");
    onClose();
  };

  if (!isOpen) return null;

  // Default titles based on mode
  const modalTitle = title || (mode === 'currency' ? 'Choose Your Country' : 'Select Country');
  const modalSubtitle = subtitle || (mode === 'currency' 
    ? 'Select your country to display prices in your local currency'
    : 'Choose a country from the list below'
  );

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
        {selectedCountry && !geolocationLoading && (
          <div className="p-4 bg-white/5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{selectedCountry.flag}</span>
              <div>
                <div className="text-white font-semibold">{selectedCountry.name}</div>
                <div className="text-gray-400 text-sm">
                  {mode === 'currency' 
                    ? `Currently showing prices in ${selectedCountry.currencyCode}`
                    : `Currently selected: ${selectedCountry.code}`
                  }
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
              placeholder="Search countries or currencies..."
              className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20 transition-all"
            />
          </div>
        </div>

        {/* Countries List */}
        <div className="flex-1 overflow-y-auto max-h-96">
          {filteredCountries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <div className="text-gray-400 text-center">
                <div className="font-semibold mb-1">No countries found</div>
                <div className="text-sm">Try searching for "{searchTerm}"</div>
              </div>
            </div>
          ) : (
            <div className="p-4 space-y-2">
              {/* Popular Countries */}
              {popularCountries.length > 0 && !searchTerm && (
                <>
                  <div className="text-gray-400 text-sm font-medium mb-3 px-2">
                    🌟 Popular Countries
                  </div>
                  {popularCountries.map((country) => (
                    <CountryOption
                      key={country.code}
                      country={country}
                      isSelected={selectedCountry?.code === country.code}
                      onClick={() => handleCountrySelect(country)}
                      mode={mode}
                    />
                  ))}
                  
                  {otherCountries.length > 0 && (
                    <div className="text-gray-400 text-sm font-medium mb-3 px-2 mt-6">
                      🌍 All Countries
                    </div>
                  )}
                </>
              )}
              
              {/* Other Countries */}
              {(searchTerm ? filteredCountries : otherCountries).map((country) => (
                <CountryOption
                  key={country.code}
                  country={country}
                  isSelected={selectedCountry?.code === country.code}
                  onClick={() => handleCountrySelect(country)}
                  mode={mode}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/20 bg-white/5">
          <div className="flex items-center justify-between">
            {mode === 'currency' && (
              <button
                onClick={handleAutoDetect}
                className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <span className="text-lg">🌐</span>
                <span className="text-sm">Auto-detect my location</span>
              </button>
            )}
            
            <div className="flex gap-3 ml-auto">
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

// Country Option Component
interface CountryOptionProps {
  country: CountryData;
  isSelected: boolean;
  onClick: () => void;
  mode: 'currency' | 'form';
}

function CountryOption({ country, isSelected, onClick, mode }: CountryOptionProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200 ${
        isSelected
          ? 'bg-[#4F46E5]/20 border border-[#4F46E5]/40 text-[#4F46E5]'
          : 'hover:bg-white/10 border border-transparent text-gray-300'
      }`}
    >
      <span className="text-3xl">{country.flag}</span>
      <div className="flex-1 text-left">
        <div className="font-semibold text-lg">{country.name}</div>
        <div className="text-sm opacity-75">
          {mode === 'currency' 
            ? `${country.currencyCode} (${country.currencySymbol})`
            : country.code
          }
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