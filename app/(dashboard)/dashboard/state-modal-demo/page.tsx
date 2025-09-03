"use client";

import React, { useState } from "react";
import StateButton from "@/app/components/StateButton";
import CountryButton from "@/app/components/CountryButton";
import { CountryData } from "@/app/context/LocationContext";
import { StateData } from "@/app/components/service/enhancedLocationData";

export default function StateModalDemoPage() {
  const [selectedCountry, setSelectedCountry] = useState<string>("US");
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCountry2, setSelectedCountry2] = useState<string>("IN");
  const [selectedState2, setSelectedState2] = useState<string>("");

  const handleCountrySelect = (country: CountryData) => {
    setSelectedCountry(country.code);
    setSelectedState(""); // Reset state when country changes
  };

  const handleStateSelect = (state: StateData) => {
    setSelectedState(state.code);
  };

  const handleCountrySelect2 = (country: CountryData) => {
    setSelectedCountry2(country.code);
    setSelectedState2(""); // Reset state when country changes
  };

  const handleStateSelect2 = (state: StateData) => {
    setSelectedState2(state.code);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            State Selection Modal Demo
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Showcase of the unified state selection modal system that works with the existing country selection
          </p>
        </div>

        {/* Demo Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Example 1: US States */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              🇺🇸 US State Selection
            </h2>
            
            <div className="space-y-4">
              <CountryButton
                label="Country"
                selectedCountryCode={selectedCountry}
                onCountrySelect={handleCountrySelect}
                placeholder="Select Country"
              />
              
              <StateButton
                label="State"
                selectedCountryCode={selectedCountry}
                selectedStateCode={selectedState}
                onStateSelect={handleStateSelect}
                placeholder="Select State"
                disabled={!selectedCountry}
              />
            </div>

            {selectedState && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-green-800 font-semibold">Selection Complete!</div>
                <div className="text-green-600 text-sm">
                  Country: {selectedCountry} • State: {selectedState}
                </div>
              </div>
            )}
          </div>

          {/* Example 2: India States */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              🇮🇳 India State Selection
            </h2>
            
            <div className="space-y-4">
              <CountryButton
                label="Country"
                selectedCountryCode={selectedCountry2}
                onCountrySelect={handleCountrySelect2}
                placeholder="Select Country"
              />
              
              <StateButton
                label="State/Union Territory"
                selectedCountryCode={selectedCountry2}
                selectedStateCode={selectedState2}
                onStateSelect={handleStateSelect2}
                placeholder="Select State"
                disabled={!selectedCountry2}
              />
            </div>

            {selectedState2 && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="text-blue-800 font-semibold">Selection Complete!</div>
                <div className="text-blue-600 text-sm">
                  Country: {selectedCountry2} • State: {selectedState2}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Button Variants Demo */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            🎨 Button Variants & Sizes
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Default Variant */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Default</h3>
              <StateButton
                selectedCountryCode="US"
                selectedStateCode=""
                onStateSelect={(state) => {}}
                placeholder="Any State"
                variant="default"
              />
            </div>

            {/* Outlined Variant */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Outlined</h3>
              <StateButton
                selectedCountryCode="US"
                selectedStateCode=""
                onStateSelect={(state) => {}}
                placeholder="Any State"
                variant="outlined"
              />
            </div>

            {/* Minimal Variant */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Minimal</h3>
              <StateButton
                selectedCountryCode="US"
                selectedStateCode=""
                onStateSelect={(state) => {}}
                placeholder="Any State"
                variant="minimal"
              />
            </div>
          </div>

          <div className="mt-8">
            <h3 className="font-semibold text-gray-700 mb-3">Sizes</h3>
            <div className="space-y-3">
              <StateButton
                selectedCountryCode="US"
                selectedStateCode=""
                onStateSelect={(state) => {}}
                placeholder="Small Size"
                size="sm"
              />
              <StateButton
                selectedCountryCode="US"
                selectedStateCode=""
                onStateSelect={(state) => {}}
                placeholder="Medium Size (Default)"
                size="md"
              />
              <StateButton
                selectedCountryCode="US"
                selectedStateCode=""
                onStateSelect={(state) => {}}
                placeholder="Large Size"
                size="lg"
              />
            </div>
          </div>
        </div>

        {/* Integration Guide */}
        <div className="bg-gray-900 rounded-2xl shadow-xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-6">🔧 Integration Guide</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-blue-400 mb-2">Basic Usage</h3>
              <pre className="bg-gray-800 rounded-lg p-4 text-sm overflow-x-auto">
                <code>{`import StateButton from "@/app/components/StateButton";
import { StateData } from "@/app/components/service/enhancedLocationData";

<StateButton
  selectedCountryCode="US"
  selectedStateCode={selectedState}
  onStateSelect={(state: StateData) => setSelectedState(state.code)}
  placeholder="Any State"
/>`}</code>
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-green-400 mb-2">Key Features</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-300">
                <li>Unified modal design matching the country selection</li>
                <li>Automatic state filtering based on selected country</li>
                <li>Search functionality for quick state finding</li>
                <li>Support for different state types (State, Province, Territory, etc.)</li>
                <li>Responsive design for all device sizes</li>
                <li>Multiple variants and sizes for different use cases</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-yellow-400 mb-2">Available Countries</h3>
              <p className="text-gray-300 text-sm">
                Currently supports detailed state data for: United States (50 states + DC), 
                Canada (13 provinces), India (29 states + UTs), United Kingdom (4 countries), 
                Australia (8 states), Germany (16 states), and more.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 