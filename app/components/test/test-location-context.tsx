"use client";
import React, { useState } from "react";
import { useLocation } from "@/app/context/LocationContext";
import Link from "next/link";
import CountrySelectionModal from "@/app/components/CountrySelectionModal";

export default function TestLocationContext() {
  const [showCountryModal, setShowCountryModal] = useState(false);
  
  const {
    currentCountry,
    geolocationLoading,
    geolocationData,
    manuallySelectedCountry,
    setManualCountry,
    formatPrice,
    getCurrentCurrencyCode,
    getCurrentCurrencySymbol,
  } = useLocation();

  const samplePrices = [100, 500, 999, 1500, 2000];

  const clearSelection = () => {
    setManualCountry(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0F23] via-[#1A1A3E] to-[#2D1B69] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-[#4F46E5] to-[#10B981] bg-clip-text text-transparent">
          Enhanced Location Context Test
        </h1>
        <p className="text-gray-300 mb-8">
          Testing the new location-based currency display with country selection override
        </p>

        <div className="grid gap-6">
          {/* Current Location Status */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <h2 className="text-xl font-semibold mb-4 text-[#4F46E5]">
              🌍 Current Location Status
            </h2>
            
            {geolocationLoading ? (
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Loading location data...</span>
              </div>
            ) : currentCountry ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{currentCountry.flag}</span>
                  <div>
                    <div className="font-semibold">{currentCountry.name}</div>
                    <div className="text-sm text-gray-400">
                      Currency: {currentCountry.currencyCode} ({currentCountry.currencySymbol})
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-white/5 rounded-lg">
                  <div className="text-sm text-gray-400 mb-2">Selection Method:</div>
                  <div className="flex items-center gap-2">
                    {manuallySelectedCountry ? (
                      <>
                        <span className="text-green-400">✅ Manual Selection</span>
                        <button
                          onClick={clearSelection}
                          className="text-xs px-2 py-1 bg-red-500/20 text-red-300 rounded border border-red-500/30 hover:bg-red-500/30 transition-colors"
                        >
                          Clear & Auto-detect
                        </button>
                      </>
                    ) : (
                      <span className="text-blue-400">🌐 Auto-detected</span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-red-400">❌ Failed to load location data</div>
            )}
          </div>

          {/* Geolocation Raw Data */}
          {geolocationData && (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-semibold mb-4 text-[#10B981]">
                🔧 Raw Geolocation API Data
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-400">IP Address:</div>
                  <div>{geolocationData.geoplugin_request}</div>
                </div>
                <div>
                  <div className="text-gray-400">Country:</div>
                  <div>{geolocationData.geoplugin_countryName} ({geolocationData.geoplugin_countryCode})</div>
                </div>
                <div>
                  <div className="text-gray-400">City:</div>
                  <div>{geolocationData.geoplugin_city}</div>
                </div>
                <div>
                  <div className="text-gray-400">Currency:</div>
                  <div>{geolocationData.geoplugin_currencyCode}</div>
                </div>
                <div>
                  <div className="text-gray-400">Timezone:</div>
                  <div>{geolocationData.geoplugin_timezone}</div>
                </div>
                <div>
                  <div className="text-gray-400">Conversion Rate:</div>
                  <div>{geolocationData.geoplugin_currencyConverter}</div>
                </div>
              </div>
            </div>
          )}

          {/* Price Formatting Test */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <h2 className="text-xl font-semibold mb-4 text-[#B39DDB]">
              💰 Price Formatting Test
            </h2>
            <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
              <div className="text-green-400 font-semibold">✨ New Behavior:</div>
              <div className="text-sm text-gray-300">
                Same amount, different currency code - no conversion!
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {samplePrices.map((price) => (
                <div
                  key={price}
                  className="bg-white/5 rounded-lg p-4 text-center border border-white/10"
                >
                  <div className="text-xs text-gray-400 mb-1">USD {price}</div>
                  <div className="text-lg font-bold text-[#4F46E5]">
                    {formatPrice(price)}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <div className="text-blue-400 font-semibold mb-2">Current Settings:</div>
              <div className="text-sm text-gray-300">
                Currency Code: <span className="text-white font-mono">{getCurrentCurrencyCode()}</span>
                <br />
                Currency Symbol: <span className="text-white font-mono">{getCurrentCurrencySymbol()}</span>
              </div>
            </div>
          </div>

          {/* Footer Demo */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <h2 className="text-xl font-semibold mb-4 text-[#F59E0B]">
              🔧 Country Selection
            </h2>
            <p className="text-gray-300 mb-4">
              The enhanced country selector is available in the footer of the site. 
              It includes:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-300 mb-6">
              <li>Search functionality by country name or currency</li>
              <li>53+ countries with accurate currency mapping</li>
              <li>Auto-detection with manual override</li>
              <li>Persistent selection across page reloads</li>
              <li>Real-time price updates</li>
            </ul>
            
            <div className="flex gap-4">
              <button
                onClick={() => setShowCountryModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-[#4F46E5] to-[#10B981] text-white rounded-xl hover:from-[#4338CA] hover:to-[#059669] transition-all duration-300"
              >
                Open Country Modal
              </button>
              <Link
                href="/courses"
                className="px-6 py-3 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300"
              >
                Test on Course Page
              </Link>
              <Link
                href="/"
                className="px-6 py-3 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300"
              >
                Check Footer
              </Link>
            </div>
          </div>

          {/* Implementation Summary */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <h2 className="text-xl font-semibold mb-4 text-[#EF4444]">
              📋 Implementation Summary
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <span className="text-green-400">✅</span>
                <div>
                  <div className="text-white font-semibold">LocationContext Created</div>
                  <div className="text-gray-400">Manages both auto-detection and manual selection</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-400">✅</span>
                <div>
                  <div className="text-white font-semibold">Enhanced Footer Dropdown</div>
                  <div className="text-gray-400">53+ countries with search functionality</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-400">✅</span>
                <div>
                  <div className="text-white font-semibold">Currency Display Logic</div>
                  <div className="text-gray-400">Same amount, different currency codes (no conversion)</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-400">✅</span>
                <div>
                  <div className="text-white font-semibold">Course Page Integration</div>
                  <div className="text-gray-400">Updated to use new location context</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-400">✅</span>
                <div>
                  <div className="text-white font-semibold">Payment Gateway Ready</div>
                  <div className="text-gray-400">Currency code passed to payment service</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Country Selection Modal */}
      <CountrySelectionModal 
        isOpen={showCountryModal} 
        onClose={() => setShowCountryModal(false)} 
      />
    </div>
  );
} 