"use client";

import React, { useState } from "react";
import CountryButton from "@/app/components/CountryButton";
import StateButton from "@/app/components/StateButton";
import { DashboardInput } from "@/app/components/DashboardInput";
import { CountryData } from "@/app/context/LocationContext";
import { StateData, EnhancedLocationService } from "@/app/components/service/enhancedLocationData";

export default function LocationSelectionDemoPage() {
  const [selectedCountryCode, setSelectedCountryCode] = useState("US");
  const [selectedStateCode, setSelectedStateCode] = useState("CA");
  const [selectedCity, setSelectedCity] = useState("");

  const handleCountrySelect = (country: CountryData) => {
    setSelectedCountryCode(country.code);
    setSelectedStateCode("");
    setSelectedCity("");
  };

  const handleStateSelect = (state: StateData) => {
    setSelectedStateCode(state.code);
    setSelectedCity("");
  };

  const handleCityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedCity(e.target.value);
  };

  // Get available countries and states for display
  const availableCountries = EnhancedLocationService.getAllCountries().filter(country => 
    EnhancedLocationService.hasDetailedData(country.code)
  );

  const availableStates = selectedCountryCode 
    ? EnhancedLocationService.getStatesByCountry(selectedCountryCode)
    : [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-4">Location Selection Demo</h1>
        <p className="text-blue-100 text-lg">
          Experience our location selection system with modal-based country and state selection, plus text input for cities
        </p>
      </div>

      {/* Interactive Demo */}
      <div className="bg-[var(--background)] rounded-2xl p-8 border border-[var(--primary)]/20">
        <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-6">Interactive Demo</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Country Selection */}
          <div>
            <CountryButton
              label="Country"
              selectedCountryCode={selectedCountryCode}
              onCountrySelect={handleCountrySelect}
              placeholder="Select a country"
            />
          </div>

          {/* State Selection */}
          <div>
            <StateButton
              label="State/Province"
              selectedCountryCode={selectedCountryCode}
              selectedStateCode={selectedStateCode}
              onStateSelect={handleStateSelect}
              placeholder="Select a state"
              disabled={!selectedCountryCode}
            />
          </div>

          {/* City Input */}
          <div>
            <DashboardInput
              label="City"
              name="city"
              value={selectedCity}
              onChange={handleCityInputChange}
              placeholder={!selectedStateCode ? "Select a state first" : "Enter city name"}
              disabled={!selectedStateCode}
            />
          </div>
        </div>

        {/* Current Selection Display */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-green-800 mb-3">Current Selection</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-green-700">Country:</span>
              <span className="text-green-600">
                {selectedCountryCode ? `${selectedCountryCode}` : "None selected"}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium text-green-700">State:</span>
              <span className="text-green-600">
                {selectedStateCode ? `${selectedStateCode}` : "None selected"}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium text-green-700">City:</span>
              <span className="text-green-600">
                {selectedCity || "None entered"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Week Type Auto-Selection Demo */}
      <div className="bg-[var(--background)] rounded-2xl p-8 border border-[var(--primary)]/20">
        <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-6">Week Type Auto-Selection Demo</h2>
        
        <div className="space-y-6">
          <p className="text-[var(--foreground)]/70">
            This demo shows how selecting a week type automatically selects the appropriate days in the schedule form.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Weekday */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">Weekday</h3>
              <p className="text-blue-600 text-sm mb-4">Automatically selects Monday through Friday</p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-blue-700">Monday</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-blue-700">Tuesday</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-blue-700">Wednesday</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-blue-700">Thursday</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-blue-700">Friday</span>
                </div>
              </div>
            </div>

            {/* Weekend */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-green-800 mb-3">Weekend</h3>
              <p className="text-green-600 text-sm mb-4">Automatically selects Saturday and Sunday</p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-700">Saturday</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-700">Sunday</span>
                </div>
              </div>
            </div>

            {/* All Days */}
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-purple-800 mb-3">All Days</h3>
              <p className="text-purple-600 text-sm mb-4">Automatically selects all seven days</p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-purple-700">Monday</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-purple-700">Tuesday</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-purple-700">Wednesday</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-purple-700">Thursday</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-purple-700">Friday</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-purple-700">Saturday</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-purple-700">Sunday</span>
                </div>
              </div>
            </div>

            {/* Manual */}
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-orange-800 mb-3">Manual</h3>
              <p className="text-orange-600 text-sm mb-4">Automatically set when you customize day selection</p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-sm text-orange-700">Custom selection</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-orange-300 rounded-full"></div>
                  <span className="text-sm text-orange-600">e.g., Mon, Wed, Fri</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-orange-300 rounded-full"></div>
                  <span className="text-sm text-orange-600">or Tue, Thu, Sat</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-orange-300 rounded-full"></div>
                  <span className="text-sm text-orange-600">Any combination</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-yellow-800 mb-1">Smart Auto-Selection & Manual Override</h4>
                <p className="text-yellow-700 text-sm">
                  When you change the week type, the corresponding days are automatically selected. 
                  If you manually check/uncheck any days that don't match a standard pattern, 
                  the week type will automatically switch to "Manual" to reflect your custom selection.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Button Variants Demo */}
      <div className="bg-[var(--background)] rounded-2xl p-8 border border-[var(--primary)]/20">
        <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-6">Button Variants & Sizes</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Country Button Variants */}
          <div>
            <h3 className="text-lg font-medium text-[var(--foreground)] mb-4">Country Button Variants</h3>
            <div className="space-y-4">
              <CountryButton
                selectedCountryCode=""
                onCountrySelect={handleCountrySelect}
                placeholder="Default variant"
                size="md"
              />
              <CountryButton
                selectedCountryCode=""
                onCountrySelect={handleCountrySelect}
                placeholder="Outlined variant"
                variant="outlined"
                size="md"
              />
              <CountryButton
                selectedCountryCode=""
                onCountrySelect={handleCountrySelect}
                placeholder="Minimal variant"
                variant="minimal"
                size="md"
              />
            </div>
          </div>

          {/* State Button Variants */}
          <div>
            <h3 className="text-lg font-medium text-[var(--foreground)] mb-4">State Button Variants</h3>
            <div className="space-y-4">
              <StateButton
                selectedCountryCode="US"
                selectedStateCode=""
                onStateSelect={handleStateSelect}
                placeholder="Default variant"
                variant="default"
                size="md"
              />
              <StateButton
                selectedCountryCode="US"
                selectedStateCode=""
                onStateSelect={handleStateSelect}
                placeholder="Outlined variant"
                variant="outlined"
                size="md"
              />
              <StateButton
                selectedCountryCode="US"
                selectedStateCode=""
                onStateSelect={handleStateSelect}
                placeholder="Minimal variant"
                variant="minimal"
                size="md"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Data Overview */}
      <div className="bg-[var(--background)] rounded-2xl p-8 border border-[var(--primary)]/20">
        <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-6">Available Data</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Countries */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">Countries with State Data</h3>
            <p className="text-3xl font-bold text-blue-600 mb-2">{availableCountries.length}</p>
            <p className="text-blue-600 text-sm">Countries with detailed state information</p>
            <div className="mt-4 space-y-1">
              {availableCountries.slice(0, 5).map(country => (
                <div key={country.code} className="text-sm text-blue-700">
                  {country.name} ({country.code})
                </div>
              ))}
              {availableCountries.length > 5 && (
                <div className="text-sm text-blue-600 font-medium">
                  +{availableCountries.length - 5} more...
                </div>
              )}
            </div>
          </div>

          {/* States */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-green-800 mb-3">States/Provinces</h3>
            <p className="text-3xl font-bold text-green-600 mb-2">{availableStates.length}</p>
            <p className="text-green-600 text-sm">
              {selectedCountryCode ? `Available in ${selectedCountryCode}` : "Select a country to view"}
            </p>
            {selectedCountryCode && availableStates.length > 0 && (
              <div className="mt-4 space-y-1">
                {availableStates.slice(0, 5).map(state => (
                  <div key={state.code} className="text-sm text-green-700">
                    {state.name} ({state.code})
                  </div>
                ))}
                {availableStates.length > 5 && (
                  <div className="text-sm text-green-600 font-medium">
                    +{availableStates.length - 5} more...
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-[var(--background)] rounded-2xl p-8 border border-[var(--primary)]/20">
        <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-6">Key Features</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-[var(--foreground)]">Modal Selection</h3>
              <p className="text-[var(--foreground)]/70 text-sm">Beautiful modals for country and state selection</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-[var(--foreground)]">City Input</h3>
              <p className="text-[var(--foreground)]/70 text-sm">Text input for city names, enabled after state selection</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-[var(--foreground)]">Hierarchical Flow</h3>
              <p className="text-[var(--foreground)]/70 text-sm">Country → State → City dependency chain</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-[var(--foreground)]">Multiple Variants</h3>
              <p className="text-[var(--foreground)]/70 text-sm">Default, outlined, and minimal button styles</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-[var(--foreground)]">Smart Disabling</h3>
              <p className="text-[var(--foreground)]/70 text-sm">Fields disabled until prerequisites are met</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-[var(--foreground)]">High Performance</h3>
              <p className="text-[var(--foreground)]/70 text-sm">Local data, no API calls during selection</p>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Instructions */}
      <div className="bg-[var(--background)] rounded-2xl p-8 border border-[var(--primary)]/20">
        <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-6">Usage Instructions</h2>
        
        <div className="prose prose-gray max-w-none">
          <div className="bg-gray-50 rounded-lg p-6 font-mono text-sm">
            <div className="text-gray-600 mb-2">// Country selection with modal</div>
            <div className="text-purple-600">&lt;CountryButton</div>
            <div className="text-green-600 ml-4">selectedCountryCode={`{countryCode}`}</div>
            <div className="text-green-600 ml-4">onCountrySelect={`{handleCountrySelect}`}</div>
            <div className="text-purple-600">/&gt;</div>
            <br />
            <div className="text-gray-600 mb-2">// State selection with modal</div>
            <div className="text-purple-600">&lt;StateButton</div>
            <div className="text-green-600 ml-4">selectedCountryCode={`{countryCode}`}</div>
            <div className="text-green-600 ml-4">selectedStateCode={`{stateCode}`}</div>
            <div className="text-green-600 ml-4">onStateSelect={`{handleStateSelect}`}</div>
            <div className="text-purple-600">/&gt;</div>
            <br />
            <div className="text-gray-600 mb-2">// City input field (disabled until state selected)</div>
            <div className="text-purple-600">&lt;DashboardInput</div>
            <div className="text-green-600 ml-4">name="city"</div>
            <div className="text-green-600 ml-4">value={`{city}`}</div>
            <div className="text-green-600 ml-4">onChange={`{handleCityChange}`}</div>
            <div className="text-green-600 ml-4">disabled={`{!stateCode}`}</div>
            <div className="text-purple-600">/&gt;</div>
          </div>
        </div>
      </div>
    </div>
  );
} 