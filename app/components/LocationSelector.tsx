'use client';

import React, { useState, useEffect } from 'react';
import { LocationService, CountryData, StateData, CityData } from './service/locationData';

interface LocationSelectorProps {
  selectedCountry?: string;
  selectedState?: string;
  selectedCity?: string;
  onCountryChange?: (country: CountryData | null) => void;
  onStateChange?: (state: StateData | null) => void;
  onCityChange?: (city: CityData | null) => void;
  showCountry?: boolean;
  showState?: boolean;
  showCity?: boolean;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  placeholder?: {
    country?: string;
    state?: string;
    city?: string;
  };
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  selectedCountry,
  selectedState,
  selectedCity,
  onCountryChange,
  onStateChange,
  onCityChange,
  showCountry = true,
  showState = true,
  showCity = true,
  className = '',
  disabled = false,
  required = false,
  placeholder = {}
}) => {
  const [countries, setCountries] = useState<CountryData[]>([]);
  const [states, setStates] = useState<StateData[]>([]);
  const [cities, setCities] = useState<CityData[]>([]);
  const [loading, setLoading] = useState(false);

  // Load countries on mount
  useEffect(() => {
    setCountries(LocationService.getAllCountries());
  }, []);

  // Load states when country changes
  useEffect(() => {
    if (selectedCountry) {
      setLoading(true);
      const countryStates = LocationService.getStatesByCountry(selectedCountry);
      setStates(countryStates);
      
      // Reset state and city when country changes
      if (onStateChange) onStateChange(null);
      if (onCityChange) onCityChange(null);
      setCities([]);
      setLoading(false);
    } else {
      setStates([]);
      setCities([]);
    }
  }, [selectedCountry, onStateChange, onCityChange]);

  // Load cities when state changes
  useEffect(() => {
    if (selectedCountry && selectedState) {
      setLoading(true);
      const stateCities = LocationService.getCitiesByState(selectedCountry, selectedState);
      setCities(stateCities);
      
      // Reset city when state changes
      if (onCityChange) onCityChange(null);
      setLoading(false);
    } else {
      setCities([]);
    }
  }, [selectedCountry, selectedState, onCityChange]);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const countryCode = e.target.value;
    const country = countries.find(c => c.code === countryCode) || null;
    if (onCountryChange) onCountryChange(country);
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const stateCode = e.target.value;
    const state = states.find(s => s.code === stateCode) || null;
    if (onStateChange) onStateChange(state);
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cityName = e.target.value;
    const city = cities.find(c => c.name === cityName) || null;
    if (onCityChange) onCityChange(city);
  };

  const selectClassName = `w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
    disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
  }`;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Country Selector */}
      {showCountry && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Country {required && <span className="text-red-500">*</span>}
          </label>
          <div className="relative">
            <select
              value={selectedCountry || ''}
              onChange={handleCountryChange}
              disabled={disabled}
              required={required}
              className={selectClassName}
            >
              <option value="">{placeholder.country || 'Select Country'}</option>
              {/* Popular Countries First */}
              <optgroup label="Popular Countries">
                {LocationService.getPopularCountries().map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.flag} {country.name}
                  </option>
                ))}
              </optgroup>
              {/* All Countries */}
              <optgroup label="All Countries">
                {countries
                  .filter(country => !LocationService.getPopularCountries().some(pc => pc.code === country.code))
                  .map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.flag} {country.name}
                    </option>
                  ))}
              </optgroup>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* State Selector */}
      {showState && selectedCountry && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            State/Province {required && <span className="text-red-500">*</span>}
          </label>
          <div className="relative">
            <select
              value={selectedState || ''}
              onChange={handleStateChange}
              disabled={disabled || loading || states.length === 0}
              required={required}
              className={selectClassName}
            >
              <option value="">{placeholder.state || 'Select State/Province'}</option>
              {states.map((state) => (
                <option key={state.code} value={state.code}>
                  {state.name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              {loading ? (
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </div>
          </div>
          {states.length === 0 && selectedCountry && !loading && (
            <p className="text-sm text-gray-500 mt-1">
              No states available for this country or you can enter manually.
            </p>
          )}
        </div>
      )}

      {/* City Selector */}
      {showCity && selectedCountry && selectedState && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City {required && <span className="text-red-500">*</span>}
          </label>
          <div className="relative">
            <select
              value={selectedCity || ''}
              onChange={handleCityChange}
              disabled={disabled || loading || cities.length === 0}
              required={required}
              className={selectClassName}
            >
              <option value="">{placeholder.city || 'Select City'}</option>
              {cities.map((city) => (
                <option key={city.name} value={city.name}>
                  {city.name} {city.isCapital && '⭐'}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              {loading ? (
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </div>
          </div>
          {cities.length === 0 && selectedState && !loading && (
            <p className="text-sm text-gray-500 mt-1">
              No cities available for this state or you can enter manually.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationSelector; 