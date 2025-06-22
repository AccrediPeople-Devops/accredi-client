'use client';

import React, { useState } from 'react';
import LocationSelector from '../LocationSelector';
import { CountryData, StateData, CityData } from '../service/locationData';

const LocationSelectorExample: React.FC = () => {
  // Example 1: Full location selector
  const [fullLocation, setFullLocation] = useState({
    country: '',
    state: '',
    city: ''
  });

  // Example 2: Country only selector
  const [countryOnly, setCountryOnly] = useState('');

  // Example 3: Country and state only
  const [countryState, setCountryState] = useState({
    country: '',
    state: ''
  });

  const handleFullLocationChange = {
    country: (country: CountryData | null) => {
      setFullLocation(prev => ({
        ...prev,
        country: country?.code || '',
        state: '',
        city: ''
      }));
    },
    state: (state: StateData | null) => {
      setFullLocation(prev => ({
        ...prev,
        state: state?.code || '',
        city: ''
      }));
    },
    city: (city: CityData | null) => {
      setFullLocation(prev => ({
        ...prev,
        city: city?.name || ''
      }));
    }
  };

  const handleCountryOnlyChange = (country: CountryData | null) => {
    setCountryOnly(country?.code || '');
  };

  const handleCountryStateChange = {
    country: (country: CountryData | null) => {
      setCountryState(prev => ({
        ...prev,
        country: country?.code || '',
        state: ''
      }));
    },
    state: (state: StateData | null) => {
      setCountryState(prev => ({
        ...prev,
        state: state?.code || ''
      }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          LocationSelector Component Examples
        </h1>
        <p className="text-gray-600">
          Unified location selection for the entire application
        </p>
      </div>

      {/* Example 1: Full Location Selector */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Example 1: Full Location Selector (Country → State → City)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <LocationSelector
              selectedCountry={fullLocation.country}
              selectedState={fullLocation.state}
              selectedCity={fullLocation.city}
              onCountryChange={handleFullLocationChange.country}
              onStateChange={handleFullLocationChange.state}
              onCityChange={handleFullLocationChange.city}
              required={true}
              placeholder={{
                country: 'Choose your country',
                state: 'Choose your state/province',
                city: 'Choose your city'
              }}
            />
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Selected Values:</h3>
            <div className="space-y-1 text-sm">
              <p><strong>Country:</strong> {fullLocation.country || 'None'}</p>
              <p><strong>State:</strong> {fullLocation.state || 'None'}</p>
              <p><strong>City:</strong> {fullLocation.city || 'None'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Example 2: Country Only */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Example 2: Country Only Selector
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <LocationSelector
              selectedCountry={countryOnly}
              onCountryChange={handleCountryOnlyChange}
              showState={false}
              showCity={false}
              placeholder={{
                country: 'Select your country'
              }}
            />
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Selected Value:</h3>
            <p className="text-sm"><strong>Country:</strong> {countryOnly || 'None'}</p>
          </div>
        </div>
      </div>

      {/* Example 3: Country and State Only */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Example 3: Country and State Only
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <LocationSelector
              selectedCountry={countryState.country}
              selectedState={countryState.state}
              onCountryChange={handleCountryStateChange.country}
              onStateChange={handleCountryStateChange.state}
              showCity={false}
              placeholder={{
                country: 'Select country',
                state: 'Select state/province'
              }}
            />
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Selected Values:</h3>
            <div className="space-y-1 text-sm">
              <p><strong>Country:</strong> {countryState.country || 'None'}</p>
              <p><strong>State:</strong> {countryState.state || 'None'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Instructions */}
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h2 className="text-xl font-semibold text-blue-900 mb-4">
          Usage Instructions
        </h2>
        <div className="space-y-4 text-sm text-blue-800">
          <div>
            <h3 className="font-medium mb-2">Basic Usage:</h3>
            <pre className="bg-white p-3 rounded border text-xs overflow-x-auto">
{`import LocationSelector from '@/components/LocationSelector';

<LocationSelector
  selectedCountry={selectedCountry}
  selectedState={selectedState}
  selectedCity={selectedCity}
  onCountryChange={(country) => setSelectedCountry(country?.code || '')}
  onStateChange={(state) => setSelectedState(state?.code || '')}
  onCityChange={(city) => setSelectedCity(city?.name || '')}
/>`}
            </pre>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Props:</h3>
            <ul className="space-y-1 text-xs">
              <li><code>selectedCountry, selectedState, selectedCity</code> - Current selected values</li>
              <li><code>onCountryChange, onStateChange, onCityChange</code> - Change handlers</li>
              <li><code>showCountry, showState, showCity</code> - Control which selectors to show</li>
              <li><code>required</code> - Make fields required</li>
              <li><code>disabled</code> - Disable all selectors</li>
              <li><code>placeholder</code> - Custom placeholder text</li>
              <li><code>className</code> - Additional CSS classes</li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-2">Features:</h3>
            <ul className="space-y-1 text-xs">
              <li>✅ 195 countries with flags and currency data</li>
              <li>✅ Detailed state/province data for major countries (US, CA, IN, GB, AU)</li>
              <li>✅ City data with population and capital indicators</li>
              <li>✅ Popular countries grouped at the top</li>
              <li>✅ Automatic cascading selection (country → state → city)</li>
              <li>✅ Loading states and error handling</li>
              <li>✅ Responsive design with Tailwind CSS</li>
              <li>✅ TypeScript support with full type safety</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationSelectorExample; 