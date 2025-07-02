'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { LoadingSpinner } from './LoadingSpinner';
import { 
  EnhancedLocationService, 
  StateData, 
  CityData, 
  ScheduleLocationFilter,
  CountryData 
} from './service/enhancedLocationData';

interface EnhancedLocationSelectorProps {
  // Current selections
  selectedCountry?: string | null;
  selectedState?: string | null;
  selectedCity?: string | null;
  
  // Change handlers
  onCountryChange?: (country: string | null) => void;
  onStateChange?: (state: string | null) => void;
  onCityChange?: (city: string | null) => void;
  
  // Display options
  showCountry?: boolean;
  showState?: boolean;
  showCity?: boolean;
  
  // Schedule filtering
  scheduleFilter?: ScheduleLocationFilter;
  
  // Validation
  required?: boolean;
  disabled?: boolean;
  
  // Styling
  className?: string;
  
  // Placeholders
  countryPlaceholder?: string;
  statePlaceholder?: string;
  cityPlaceholder?: string;
  
  // Labels
  countryLabel?: string;
  stateLabel?: string;
  cityLabel?: string;
}

export const EnhancedLocationSelector: React.FC<EnhancedLocationSelectorProps> = ({
  selectedCountry,
  selectedState,
  selectedCity,
  onCountryChange,
  onStateChange,
  onCityChange,
  showCountry = true,
  showState = true,
  showCity = true,
  scheduleFilter,
  required = false,
  disabled = false,
  className = '',
  countryPlaceholder = 'Select Country',
  statePlaceholder = 'Select State/Province',
  cityPlaceholder = 'Select City',
  countryLabel = 'Country',
  stateLabel = 'State/Province',
  cityLabel = 'City'
}) => {
  const [countries, setCountries] = useState<CountryData[]>([]);
  const [states, setStates] = useState<StateData[]>([]);
  const [cities, setCities] = useState<CityData[]>([]);
  const [loading, setLoading] = useState({
    countries: false,
    states: false,
    cities: false
  });

  // Load countries on component mount
  useEffect(() => {
    if (showCountry) {
      setLoading(prev => ({ ...prev, countries: true }));
      try {
        const availableCountries = EnhancedLocationService.getAvailableCountries(scheduleFilter);
        setCountries(availableCountries);
      } catch (error) {
        console.error('Error loading countries:', error);
      } finally {
        setLoading(prev => ({ ...prev, countries: false }));
      }
    }
  }, [showCountry, scheduleFilter]);

  // Load states when country changes
  useEffect(() => {
    if (showState && selectedCountry) {
      setLoading(prev => ({ ...prev, states: true }));
      try {
        const availableStates = EnhancedLocationService.getStatesByCountry(selectedCountry, scheduleFilter);
        setStates(availableStates);
        
        // Reset state and city selections if current state is not available
        if (selectedState && !availableStates.find(s => s.code === selectedState)) {
          onStateChange?.(null);
        }
      } catch (error) {
        console.error('Error loading states:', error);
        setStates([]);
      } finally {
        setLoading(prev => ({ ...prev, states: false }));
      }
    } else {
      setStates([]);
      if (selectedState) {
        onStateChange?.(null);
      }
    }
  }, [selectedCountry, showState, scheduleFilter]);

  // Load cities when state changes
  useEffect(() => {
    if (showCity && selectedCountry && selectedState) {
      setLoading(prev => ({ ...prev, cities: true }));
      try {
        const availableCities = EnhancedLocationService.getCitiesByState(
          selectedCountry, 
          selectedState, 
          scheduleFilter
        );
        setCities(availableCities);
        
        // Reset city selection if current city is not available
        if (selectedCity && !availableCities.find(c => c.name === selectedCity)) {
          onCityChange?.(null);
        }
      } catch (error) {
        console.error('Error loading cities:', error);
        setCities([]);
      } finally {
        setLoading(prev => ({ ...prev, cities: false }));
      }
    } else {
      setCities([]);
      if (selectedCity) {
        onCityChange?.(null);
      }
    }
  }, [selectedCountry, selectedState, showCity, scheduleFilter]);

  const handleCountryChange = (countryCode: string) => {
    onCountryChange?.(countryCode);
    // Reset dependent selections
    if (selectedState) onStateChange?.(null);
    if (selectedCity) onCityChange?.(null);
  };

  const handleStateChange = (stateCode: string) => {
    onStateChange?.(stateCode);
    // Reset dependent selections
    if (selectedCity) onCityChange?.(null);
  };

  const handleCityChange = (cityName: string) => {
    onCityChange?.(cityName);
  };

  // Get popular countries for better UX
  const popularCountries = EnhancedLocationService.getPopularCountries();
  const otherCountries = countries.filter(
    country => !popularCountries.find(popular => popular.code === country.code)
  );

  const renderDropdown = (
    label: string,
    value: string | null,
    options: any[],
    onChange: (value: string) => void,
    placeholder: string,
    isLoading: boolean,
    isDisabled: boolean,
    renderOption: (option: any) => { value: string; label: string; extra?: string }
  ) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium site-text-primary">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <select
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          disabled={isDisabled || isLoading}
          className={`
            w-full px-4 py-3 border border-gray-300 rounded-lg 
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            disabled:bg-gray-100 disabled:cursor-not-allowed
            appearance-none bg-white site-text-primary
            ${className}
          `}
        >
          <option value="" disabled>
            {isLoading ? 'Loading...' : placeholder}
          </option>
          {options.map((option) => {
            const rendered = renderOption(option);
            return (
              <option key={rendered.value} value={rendered.value}>
                {rendered.label} {rendered.extra || ''}
              </option>
            );
          })}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          {isLoading ? (
            <LoadingSpinner size="small" />
          ) : (
            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Country Selection */}
      {showCountry && (
        <div className="space-y-2">
          <label className="block text-sm font-medium site-text-primary">
            {countryLabel} {required && <span className="text-red-500">*</span>}
          </label>
          <div className="relative">
            <select
              value={selectedCountry || ''}
              onChange={(e) => handleCountryChange(e.target.value)}
              disabled={disabled || loading.countries}
              className={`
                w-full px-4 py-3 border border-gray-300 rounded-lg 
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                disabled:bg-gray-100 disabled:cursor-not-allowed
                appearance-none bg-white site-text-primary
                ${className}
              `}
            >
              <option value="" disabled>
                {loading.countries ? 'Loading countries...' : countryPlaceholder}
              </option>
              
              {/* Popular Countries */}
              {popularCountries.length > 0 && (
                <>
                  <optgroup label="🌟 Popular Countries">
                    {popularCountries.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.flag} {country.name}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="🌍 All Countries">
                    {otherCountries.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.flag} {country.name}
                      </option>
                    ))}
                  </optgroup>
                </>
              )}
              
              {/* Fallback if no popular countries */}
              {popularCountries.length === 0 && countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.flag} {country.name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              {loading.countries ? (
                <LoadingSpinner size="small" />
              ) : (
                <ChevronDownIcon className="h-5 w-5 text-gray-400" />
              )}
            </div>
          </div>
        </div>
      )}

      {/* State Selection - Only enabled after country selection */}
      {showState && (
        renderDropdown(
          stateLabel,
          selectedState || null,
          states,
          handleStateChange,
          !selectedCountry 
            ? 'Please select a country first' 
            : states.length === 0 
              ? 'No states available' 
              : statePlaceholder,
          loading.states,
          !EnhancedLocationService.shouldEnableStateSelection(selectedCountry || null) || disabled,
          (state: StateData) => ({
            value: state.code,
            label: state.name,
            extra: state.type ? `(${state.type})` : ''
          })
        )
      )}

      {/* City Selection - Only enabled after state selection */}
      {showCity && (
        renderDropdown(
          cityLabel,
          selectedCity || null,
          cities,
          handleCityChange,
          !selectedState 
            ? 'Please select a state first' 
            : cities.length === 0 
              ? 'No cities available' 
              : cityPlaceholder,
          loading.cities,
          !EnhancedLocationService.shouldEnableCitySelection(selectedCountry || null, selectedState || null) || disabled,
          (city: CityData) => ({
            value: city.name,
            label: city.name,
            extra: city.isCapital ? '⭐' : city.population ? `(${city.population.toLocaleString()})` : ''
          })
        )
      )}

      {/* Schedule Filter Info */}
      {scheduleFilter && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-medium text-blue-800">Schedule-Based Filtering Active</h4>
              <p className="text-sm text-blue-600">
                Only locations with available schedules are shown.
                {scheduleFilter.availableCountries && (
                  <span className="block">
                    Available in {scheduleFilter.availableCountries.length} countries.
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Validation Messages */}
      {required && (
        <div className="text-xs text-gray-500">
          <span className="text-red-500">*</span> Required fields must be completed in order: Country → State → City
        </div>
      )}
    </div>
  );
};

export default EnhancedLocationSelector;