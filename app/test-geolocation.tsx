"use client";
import React, { useState, useEffect } from "react";
import geolocationService, {
  GeolocationData,
} from "./components/service/geolocation.service";

export default function TestGeolocation() {
  const [geolocationData, setGeolocationData] =
    useState<GeolocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testGeolocation = async () => {
      try {
        console.log("Testing geolocation service...");
        const data = await geolocationService.getCurrentUserGeolocation();
        setGeolocationData(data);
        console.log("Geolocation data:", data);
      } catch (err: any) {
        console.error("Error testing geolocation:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    testGeolocation();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Testing Geolocation Service</h1>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Testing Geolocation Service</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        Geolocation Service Test Results
      </h1>

      {geolocationData && (
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-green-800 mb-2">
              ✅ Service Working
            </h2>
            <p className="text-green-700">
              Geolocation data retrieved successfully!
            </p>
          </div>

          {/* Location Info */}
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-blue-800 mb-3">
              📍 Location Information
            </h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>IP Address:</strong> {geolocationData.geoplugin_request}
              </div>
              <div>
                <strong>Country:</strong>{" "}
                {geolocationData.geoplugin_countryName} (
                {geolocationData.geoplugin_countryCode})
              </div>
              <div>
                <strong>City:</strong> {geolocationData.geoplugin_city}
              </div>
              <div>
                <strong>Region:</strong> {geolocationData.geoplugin_regionName}
              </div>
              <div>
                <strong>Timezone:</strong> {geolocationData.geoplugin_timezone}
              </div>
              <div>
                <strong>Postal Code:</strong>{" "}
                {geolocationData.geoplugin_postal_code}
              </div>
            </div>
          </div>

          {/* Currency Info */}
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-yellow-800 mb-3">
              💰 Currency Information
            </h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Currency Code:</strong>{" "}
                {geolocationData.geoplugin_currencyCode}
              </div>
              <div>
                <strong>Currency Symbol:</strong>{" "}
                {geolocationData.geoplugin_currencySymbol_UTF8}
              </div>
              <div>
                <strong>Conversion Rate:</strong>{" "}
                {geolocationData.geoplugin_currencyConverter}
              </div>
            </div>
          </div>

          {/* Price Conversion Test */}
          <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-purple-800 mb-3">
              🧮 Price Conversion Test
            </h2>
            <div className="space-y-2 text-sm">
              {[100, 500, 1000, 2000].map((usdPrice) => {
                const localPrice = geolocationService.convertUSDToLocalCurrency(
                  usdPrice,
                  geolocationData.geoplugin_currencyConverter
                );
                const formattedPrice = geolocationService.formatCurrency(
                  localPrice,
                  geolocationData.geoplugin_currencySymbol_UTF8,
                  geolocationData.geoplugin_currencyCode
                );

                return (
                  <div key={usdPrice} className="flex justify-between">
                    <span>USD ${usdPrice}</span>
                    <span>→</span>
                    <span className="font-semibold">{formattedPrice}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Raw Data */}
          <details className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
            <summary className="text-lg font-semibold text-gray-800 cursor-pointer">
              🔧 Raw API Response
            </summary>
            <pre className="mt-3 text-xs overflow-auto bg-white p-3 rounded border">
              {JSON.stringify(geolocationData, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}
