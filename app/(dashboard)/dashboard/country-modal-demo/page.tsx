"use client";

import React, { useState } from "react";
import CountryButton from "@/app/components/CountryButton";
import CountrySelectionModal from "@/app/components/CountrySelectionModal";
import { CountryData, useLocation } from "@/app/context/LocationContext";

export default function CountryModalDemoPage() {
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [formCountry, setFormCountry] = useState<string>("");
  const [formCountry2, setFormCountry2] = useState<string>("");
  
  const { currentCountry } = useLocation();

  const handleFormCountrySelect = (country: CountryData) => {
    setFormCountry(country.code);
  };

  const handleFormCountry2Select = (country: CountryData) => {
    setFormCountry2(country.code);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">
          🌍 Country Selection Modal Demo
        </h1>
        <p className="text-[var(--foreground-muted)]">
          Unified modal system for both currency selection and form fields
        </p>
      </div>

      {/* Currency Mode Demo */}
      <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-[var(--radius-lg)] p-6">
        <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">
          💰 Currency Selection Mode
        </h2>
        <p className="text-[var(--foreground-muted)] mb-6">
          Used in the footer and course pages for price display. Integrates with LocationContext.
        </p>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="text-sm text-[var(--foreground-muted)]">Current Country:</div>
            <div className="flex items-center gap-2">
              <span className="text-xl">{currentCountry?.flag || "🌍"}</span>
              <span className="font-medium">{currentCountry?.name || "Unknown"}</span>
              <span className="text-[var(--foreground-muted)]">({currentCountry?.currencyCode || "USD"})</span>
            </div>
          </div>
          
          <button
            onClick={() => setShowCurrencyModal(true)}
            className="px-4 py-2 bg-[var(--primary)] text-white rounded-[var(--radius-md)] hover:bg-[var(--primary-hover)] transition-colors"
          >
            Change Currency Country
          </button>
        </div>
      </div>

      {/* Form Mode Demo */}
      <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-[var(--radius-lg)] p-6">
        <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">
          📝 Form Field Mode
        </h2>
        <p className="text-[var(--foreground-muted)] mb-6">
          Used in forms throughout the application. Independent of LocationContext.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Form Field 1 */}
          <div>
            <CountryButton
              label="Registration Country"
              selectedCountryCode={formCountry}
              onCountrySelect={handleFormCountrySelect}
              placeholder="Select your country"
              required
            />
            {formCountry && (
              <div className="mt-2 text-sm text-[var(--foreground-muted)]">
                Selected: {formCountry}
              </div>
            )}
          </div>

          {/* Form Field 2 */}
          <div>
            <CountryButton
              label="Business Country"
              selectedCountryCode={formCountry2}
              onCountrySelect={handleFormCountry2Select}
              placeholder="Select business country"
              variant="outlined"
              showCode={true}
            />
            {formCountry2 && (
              <div className="mt-2 text-sm text-[var(--foreground-muted)]">
                Selected: {formCountry2}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Button Variants Demo */}
      <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-[var(--radius-lg)] p-6">
        <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">
          🎨 Button Variants & Sizes
        </h2>
        <p className="text-[var(--foreground-muted)] mb-6">
          Different styling options for the CountryButton component.
        </p>
        
        <div className="space-y-6">
          {/* Variants */}
          <div>
            <h3 className="font-medium text-[var(--foreground)] mb-3">Variants</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <CountryButton
                selectedCountryCode="US"
                onCountrySelect={() => {}}
                variant="default"
                placeholder="Default variant"
              />
              <CountryButton
                selectedCountryCode="CA"
                onCountrySelect={() => {}}
                variant="outlined"
                placeholder="Outlined variant"
              />
              <CountryButton
                selectedCountryCode="GB"
                onCountrySelect={() => {}}
                variant="minimal"
                placeholder="Minimal variant"
              />
            </div>
          </div>

          {/* Sizes */}
          <div>
            <h3 className="font-medium text-[var(--foreground)] mb-3">Sizes</h3>
            <div className="space-y-3">
              <CountryButton
                selectedCountryCode="IN"
                onCountrySelect={() => {}}
                size="sm"
                placeholder="Small size"
              />
              <CountryButton
                selectedCountryCode="AU"
                onCountrySelect={() => {}}
                size="md"
                placeholder="Medium size (default)"
              />
              <CountryButton
                selectedCountryCode="DE"
                onCountrySelect={() => {}}
                size="lg"
                placeholder="Large size"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Implementation Examples */}
      <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-[var(--radius-lg)] p-6">
        <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">
          💻 Implementation Examples
        </h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-[var(--foreground)] mb-2">Currency Selection (Footer/Course Pages)</h3>
            <pre className="bg-[var(--input-bg)] p-4 rounded-[var(--radius-md)] text-sm overflow-x-auto">
{`<CountrySelectionModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  mode="currency"
/>`}
            </pre>
          </div>

          <div>
            <h3 className="font-medium text-[var(--foreground)] mb-2">Form Field</h3>
            <pre className="bg-[var(--input-bg)] p-4 rounded-[var(--radius-md)] text-sm overflow-x-auto">
{`<CountryButton
  label="Country"
  selectedCountryCode={formData.country}
  onCountrySelect={(country) => setFormData(prev => ({
    ...prev,
    country: country.code
  }))}
  placeholder="Select a country"
  required
/>`}
            </pre>
          </div>

          <div>
            <h3 className="font-medium text-[var(--foreground)] mb-2">Direct Modal (Form Mode)</h3>
            <pre className="bg-[var(--input-bg)] p-4 rounded-[var(--radius-md)] text-sm overflow-x-auto">
{`<CountrySelectionModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  mode="form"
  selectedCountryCode={selectedCountry}
  onCountrySelect={handleCountrySelect}
  title="Select Country"
  subtitle="Choose your country from the list"
/>`}
            </pre>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-gradient-to-r from-[var(--primary)]/10 to-[var(--primary)]/5 border border-[var(--primary)]/20 rounded-[var(--radius-lg)] p-6">
        <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">
          ✨ Benefits of Unified System
        </h2>
        <ul className="space-y-2 text-[var(--foreground-muted)]">
          <li>• <strong>Consistent UX:</strong> Same beautiful modal experience everywhere</li>
          <li>• <strong>250+ Countries:</strong> Complete world database with flags and currencies</li>
          <li>• <strong>Smart Search:</strong> Search by name, code, or currency</li>
          <li>• <strong>Popular Countries:</strong> Frequently used countries shown first</li>
          <li>• <strong>Dual Mode:</strong> Currency selection + form field selection</li>
          <li>• <strong>Flexible Styling:</strong> Multiple variants, sizes, and customization</li>
          <li>• <strong>Type Safe:</strong> Full TypeScript support</li>
          <li>• <strong>Easy Integration:</strong> Drop-in replacement for dropdowns</li>
        </ul>
      </div>

      {/* Currency Selection Modal */}
      <CountrySelectionModal
        isOpen={showCurrencyModal}
        onClose={() => setShowCurrencyModal(false)}
        mode="currency"
      />
    </div>
  );
} 