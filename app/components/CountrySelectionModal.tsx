"use client";
import React, { useState, useRef, useEffect } from "react";
import { HiSearch, HiX } from "react-icons/hi";
import { useLocation, COUNTRIES_DATA, CountryData } from "@/app/context/LocationContext";

interface CountrySelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CountrySelectionModal({ isOpen, onClose }: CountrySelectionModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const { currentCountry, setManualCountry, geolocationLoading } = useLocation();

  // Filter countries based on search term
  const filteredCountries = COUNTRIES_DATA.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.currencyCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.code.toLowerCase().includes(searchTerm.toLowerCase())
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
    setManualCountry(country);
    handleClose();
  };

  const handleAutoDetect = () => {
    setManualCountry(null);
    handleClose();
  };

  const handleClose = () => {
    setSearchTerm("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-4 bg-gradient-to-br from-[#0F0F23] via-[#1A1A3E] to-[#2D1B69] border border-white/20 rounded-2xl shadow-2xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <div>
            <h2 className="text-2xl font-bold text-white">Choose Your Country</h2>
            <p className="text-gray-400 text-sm mt-1">
              Select your country to display prices in your local currency
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
        {currentCountry && !geolocationLoading && (
          <div className="p-4 bg-white/5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{currentCountry.flag}</span>
              <div>
                <div className="text-white font-semibold">{currentCountry.name}</div>
                <div className="text-gray-400 text-sm">
                  Currently showing prices in {currentCountry.currencyCode}
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
          {geolocationLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span className="text-gray-400">Loading location data...</span>
              </div>
            </div>
          ) : filteredCountries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <div className="text-gray-400 text-center">
                <div className="font-semibold mb-1">No countries found</div>
                <div className="text-sm">Try searching for "{searchTerm}"</div>
              </div>
            </div>
          ) : (
            <div className="p-4 space-y-2">
              {filteredCountries.map((country) => (
                <button
                  key={country.code}
                  onClick={() => handleCountrySelect(country)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200 ${
                    currentCountry?.code === country.code
                      ? 'bg-[#4F46E5]/20 border border-[#4F46E5]/40 text-[#4F46E5]'
                      : 'hover:bg-white/10 border border-transparent text-gray-300'
                  }`}
                >
                  <span className="text-3xl">{country.flag}</span>
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-lg">{country.name}</div>
                    <div className="text-sm opacity-75">
                      {country.currencyCode} ({country.currencySymbol})
                    </div>
                  </div>
                  {currentCountry?.code === country.code && (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-[#4F46E5] rounded-full"></div>
                      <span className="text-sm font-medium">Selected</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/20 bg-white/5">
          <div className="flex items-center justify-between">
            <button
              onClick={handleAutoDetect}
              className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <span className="text-lg">🌐</span>
              <span className="text-sm">Auto-detect my location</span>
            </button>
            
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
} 