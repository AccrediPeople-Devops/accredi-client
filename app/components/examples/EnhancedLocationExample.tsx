'use client';

import React, { useState } from 'react';
import EnhancedLocationSelector from '../EnhancedLocationSelector';
import { EnhancedLocationService, ScheduleLocationFilter } from '../service/enhancedLocationData';

// Mock schedule data for demonstration
const MOCK_SCHEDULES = [
  { id: 1, country: 'US', state: 'CA', city: 'Los Angeles', course: 'PMP Certification' },
  { id: 2, country: 'US', state: 'NY', city: 'New York City', course: 'PMP Certification' },
  { id: 3, country: 'US', state: 'TX', city: 'Houston', course: 'PMP Certification' },
  { id: 4, country: 'CA', state: 'ON', city: 'Toronto', course: 'PMP Certification' },
  { id: 5, country: 'CA', state: 'BC', city: 'Vancouver', course: 'PMP Certification' },
  { id: 6, country: 'IN', state: 'MH', city: 'Mumbai', course: 'PMP Certification' },
  { id: 7, country: 'IN', state: 'DL', city: 'New Delhi', course: 'PMP Certification' },
  { id: 8, country: 'IN', state: 'KA', city: 'Bangalore', course: 'PMP Certification' },
  { id: 9, country: 'GB', state: 'ENG', city: 'London', course: 'PMP Certification' },
  { id: 10, country: 'AU', state: 'NSW', city: 'Sydney', course: 'PMP Certification' },
];

export const EnhancedLocationExample: React.FC = () => {
  // Example 1: Full location selector with schedule filtering
  const [example1, setExample1] = useState({
    country: null as string | null,
    state: null as string | null,
    city: null as string | null,
    useScheduleFilter: false
  });

  // Example 2: Country and state only
  const [example2, setExample2] = useState({
    country: null as string | null,
    state: null as string | null
  });

  // Example 3: Country only selector
  const [example3, setExample3] = useState({
    country: null as string | null
  });

  // Create schedule filter from mock data
  const scheduleFilter: ScheduleLocationFilter = EnhancedLocationService.createScheduleFilter(MOCK_SCHEDULES);

  const formatSelectedLocation = (country?: string | null, state?: string | null, city?: string | null) => {
    return EnhancedLocationService.formatLocation(
      city || undefined, 
      state || undefined, 
      country || undefined
    ) || 'None selected';
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold site-text-primary mb-4">
          Enhanced Location Selector Examples
        </h1>
        <p className="text-lg site-text-secondary">
          Comprehensive location selection with 250+ countries, 5,000+ states, and 150,000+ cities
        </p>
      </div>

      {/* System Overview */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-blue-800 mb-4">🌍 Global Coverage</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-blue-600">250+</div>
            <div className="text-sm text-gray-600">Countries</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-green-600">5,038</div>
            <div className="text-sm text-gray-600">States/Provinces</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-purple-600">151,024</div>
            <div className="text-sm text-gray-600">Cities</div>
          </div>
        </div>
      </div>

      {/* Example 1: Full Location Selector with Schedule Filtering */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-semibold site-text-primary mb-2">
            📍 Example 1: Full Location Selector with Schedule Filtering
          </h2>
          <p className="site-text-secondary">
            Complete country → state → city selection with optional schedule-based filtering.
            When schedule filtering is enabled, only locations with available courses are shown.
          </p>
        </div>

        <div className="space-y-4">
          {/* Schedule Filter Toggle */}
          <div className="flex items-center space-x-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={example1.useScheduleFilter}
                onChange={(e) => setExample1(prev => ({ 
                  ...prev, 
                  useScheduleFilter: e.target.checked,
                  // Reset selections when toggling filter
                  country: null,
                  state: null,
                  city: null
                }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm font-medium site-text-primary">
                Enable Schedule-Based Filtering
              </span>
            </label>
          </div>

          <EnhancedLocationSelector
            selectedCountry={example1.country}
            selectedState={example1.state}
            selectedCity={example1.city}
            onCountryChange={(country) => setExample1(prev => ({ ...prev, country }))}
            onStateChange={(state) => setExample1(prev => ({ ...prev, state }))}
            onCityChange={(city) => setExample1(prev => ({ ...prev, city }))}
            scheduleFilter={example1.useScheduleFilter ? scheduleFilter : undefined}
            required
            countryLabel="Training Country"
            stateLabel="Training State/Province"
            cityLabel="Training City"
          />

          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium site-text-primary mb-2">Selected Location:</h4>
            <p className="site-text-secondary">
              {formatSelectedLocation(example1.country, example1.state, example1.city)}
            </p>
            {example1.useScheduleFilter && (
              <p className="text-sm text-blue-600 mt-2">
                🎯 Schedule filtering active - showing {scheduleFilter.availableCountries?.length || 0} countries with available courses
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Example 2: Country and State Only */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-semibold site-text-primary mb-2">
            🏛️ Example 2: Country and State Only
          </h2>
          <p className="site-text-secondary">
            Sometimes you only need country and state/province selection without city details.
          </p>
        </div>

        <EnhancedLocationSelector
          selectedCountry={example2.country}
          selectedState={example2.state}
          onCountryChange={(country) => setExample2(prev => ({ ...prev, country }))}
          onStateChange={(state) => setExample2(prev => ({ ...prev, state }))}
          showCity={false}
          required
          countryLabel="Business Country"
          stateLabel="Business State/Province"
        />

        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium site-text-primary mb-2">Selected Location:</h4>
          <p className="site-text-secondary">
            {formatSelectedLocation(example2.country, example2.state)}
          </p>
        </div>
      </div>

      {/* Example 3: Country Only */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-semibold site-text-primary mb-2">
            🌎 Example 3: Country Selection Only
          </h2>
          <p className="site-text-secondary">
            For global applications where you only need country-level information.
          </p>
        </div>

        <EnhancedLocationSelector
          selectedCountry={example3.country}
          onCountryChange={(country) => setExample3(prev => ({ ...prev, country }))}
          showState={false}
          showCity={false}
          countryLabel="Target Market"
          countryPlaceholder="Select target country"
        />

        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium site-text-primary mb-2">Selected Country:</h4>
          <p className="site-text-secondary">
            {example3.country || 'None selected'}
          </p>
        </div>
      </div>

      {/* Features Overview */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold site-text-primary mb-4">✨ Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-medium site-text-primary">Mandatory Sequential Selection</h4>
                <p className="text-sm site-text-secondary">Country must be selected before state, state before city</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-medium site-text-primary">Schedule-Based Filtering</h4>
                <p className="text-sm site-text-secondary">Filter locations based on available schedules/courses</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-medium site-text-primary">Comprehensive Database</h4>
                <p className="text-sm site-text-secondary">Based on dr5hn database with 250+ countries</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-medium site-text-primary">Smart UX</h4>
                <p className="text-sm site-text-secondary">Popular countries first, loading states, validation</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-medium site-text-primary">Flexible Configuration</h4>
                <p className="text-sm site-text-secondary">Show/hide any level, custom labels and placeholders</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-2 h-2 bg-indigo-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-medium site-text-primary">TypeScript Support</h4>
                <p className="text-sm site-text-secondary">Full type safety with comprehensive interfaces</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-2 h-2 bg-pink-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-medium site-text-primary">Performance Optimized</h4>
                <p className="text-sm site-text-secondary">Efficient data loading and caching</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-2 h-2 bg-teal-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-medium site-text-primary">Free Database</h4>
                <p className="text-sm site-text-secondary">No API costs, all data included locally</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Instructions */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold site-text-primary mb-4">📖 Usage Instructions</h2>
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium site-text-primary mb-2">1. Basic Usage</h4>
            <pre className="text-sm bg-gray-800 text-green-400 p-3 rounded overflow-x-auto">
{`import EnhancedLocationSelector from './EnhancedLocationSelector';

<EnhancedLocationSelector
  selectedCountry={country}
  selectedState={state}
  selectedCity={city}
  onCountryChange={setCountry}
  onStateChange={setState}
  onCityChange={setCity}
  required
/>`}
            </pre>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium site-text-primary mb-2">2. With Schedule Filtering</h4>
            <pre className="text-sm bg-gray-800 text-green-400 p-3 rounded overflow-x-auto">
{`const scheduleFilter = EnhancedLocationService.createScheduleFilter(schedules);

<EnhancedLocationSelector
  scheduleFilter={scheduleFilter}
  // ... other props
/>`}
            </pre>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium site-text-primary mb-2">3. Partial Selection (Country + State only)</h4>
            <pre className="text-sm bg-gray-800 text-green-400 p-3 rounded overflow-x-auto">
{`<EnhancedLocationSelector
  showCity={false}
  // ... other props
/>`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedLocationExample;