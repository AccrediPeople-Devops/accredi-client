"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import geolocationService, { GeolocationData } from "@/app/components/service/geolocation.service";
import { WORLD_COUNTRIES, CountryData } from "@/app/components/service/worldLocationData";

// Re-export for backward compatibility
export type { CountryData } from "@/app/components/service/worldLocationData";
export const COUNTRIES_DATA = WORLD_COUNTRIES;

export interface LocationContextType {
  // Geolocation data from API
  geolocationData: GeolocationData | null;
  geolocationLoading: boolean;
  
  // Current display currency (either from geolocation or manual selection)
  currentCountry: CountryData | null;
  
  // Manual country selection
  manuallySelectedCountry: CountryData | null;
  setManualCountry: (country: CountryData | null) => void;
  
  // Helper functions
  formatPrice: (usdPrice: number) => string;
  getCurrentCurrencyCode: () => string;
  getCurrentCurrencySymbol: () => string;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [geolocationData, setGeolocationData] = useState<GeolocationData | null>(null);
  const [geolocationLoading, setGeolocationLoading] = useState(true);
  const [manuallySelectedCountry, setManuallySelectedCountry] = useState<CountryData | null>(null);

  // Load saved manual selection from localStorage
  useEffect(() => {
    const savedCountry = localStorage.getItem("manualCountrySelection");
    if (savedCountry) {
      try {
        const parsed = JSON.parse(savedCountry);
        const country = WORLD_COUNTRIES.find(c => c.code === parsed.code);
        if (country) {
          setManuallySelectedCountry(country);
        }
      } catch (error) {
        console.error("Error parsing saved country selection:", error);
      }
    }
  }, []);

  // Fetch geolocation data on mount
  useEffect(() => {
    const fetchGeolocationData = async () => {
      setGeolocationLoading(true);
      try {
        console.log("🌍 LOCATION CONTEXT: Fetching geolocation data...");
        const geoData = await geolocationService.getCurrentUserGeolocation();
        setGeolocationData(geoData);
        console.log("🌍 LOCATION CONTEXT: Geolocation data loaded:", geoData);
      } catch (error) {
        console.error("🌍 LOCATION CONTEXT: Error fetching geolocation data:", error);
      } finally {
        setGeolocationLoading(false);
      }
    };

    fetchGeolocationData();
  }, []);

  // Save manual selection to localStorage
  const setManualCountry = (country: CountryData | null) => {
    setManuallySelectedCountry(country);
    if (country) {
      localStorage.setItem("manualCountrySelection", JSON.stringify(country));
      console.log("🌍 LOCATION CONTEXT: Manual country set to:", country.name, country.currencyCode);
    } else {
      localStorage.removeItem("manualCountrySelection");
      console.log("🌍 LOCATION CONTEXT: Manual country selection cleared");
    }
  };

  // Determine current country to display (manual selection takes priority)
  const getCurrentCountry = (): CountryData | null => {
    if (manuallySelectedCountry) {
      return manuallySelectedCountry;
    }

    if (geolocationData?.geoplugin_countryCode) {
      const geoCountry = WORLD_COUNTRIES.find(
        country => country.code === geolocationData.geoplugin_countryCode
      );
      if (geoCountry) {
        return geoCountry;
      }
    }

    // Default to USD if no match found
    return WORLD_COUNTRIES.find(c => c.code === "US") || null;
  };

  const currentCountry = getCurrentCountry();

  // Helper functions
  const getCurrentCurrencyCode = (): string => {
    return currentCountry?.currencyCode || "USD";
  };

  const getCurrentCurrencySymbol = (): string => {
    return currentCountry?.currencySymbol || "$";
  };

  // Format price - SAME AMOUNT, DIFFERENT CURRENCY CODE
  const formatPrice = (usdPrice: number): string => {
    const currencyCode = getCurrentCurrencyCode();
    
    // Format number with commas for better readability
    const formattedAmount = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(usdPrice);

    return `${currencyCode} ${formattedAmount}`;
  };

  const value: LocationContextType = {
    geolocationData,
    geolocationLoading,
    currentCountry,
    manuallySelectedCountry,
    setManualCountry,
    formatPrice,
    getCurrentCurrencyCode,
    getCurrentCurrencySymbol,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
} 