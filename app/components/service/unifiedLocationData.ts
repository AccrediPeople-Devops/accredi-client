// Unified Location Data Service
// This file provides a unified interface for location data used across the application

export interface UnifiedCountryData {
  code: string;
  name: string;
  flag: string;
  region: string;
  capital: string;
  population: number;
}

export interface UnifiedStateData {
  id: number;
  name: string;
  code: string;
  countryCode: string;
  countryId: number;
  type?: string;
}

export interface UnifiedCityData {
  id: number;
  name: string;
  stateId: number;
  stateCode: string;
  countryId: number;
  countryCode: string;
  isCapital?: boolean;
  population?: number;
}

export interface UnifiedScheduleLocationFilter {
  availableCountries?: string[];
  availableStates?: { [countryCode: string]: string[] };
  availableCities?: { [stateCode: string]: string[] };
}

// Re-export from enhancedLocationData for backward compatibility
export type { 
  StateData, 
  CityData, 
  CountryData, 
  ScheduleLocationFilter
} from './enhancedLocationData';

export { 
  EnhancedLocationService,
  ENHANCED_LOCATION_DATA 
} from './enhancedLocationData';

export class UnifiedLocationService {
  /**
   * Get all available countries
   */
  static getAllCountries(): UnifiedCountryData[] {
    try {
      const { EnhancedLocationService } = require('./enhancedLocationData');
      return EnhancedLocationService.getAllCountries();
    } catch (error) {
      console.error('Error loading countries:', error);
      return [];
    }
  }

  /**
   * Get popular countries
   */
  static getPopularCountries(): UnifiedCountryData[] {
    try {
      const { EnhancedLocationService } = require('./enhancedLocationData');
      return EnhancedLocationService.getPopularCountries();
    } catch (error) {
      console.error('Error loading popular countries:', error);
      return [];
    }
  }

  /**
   * Get states by country
   */
  static getStatesByCountry(countryCode: string, scheduleFilter?: UnifiedScheduleLocationFilter): UnifiedStateData[] {
    try {
      const { EnhancedLocationService } = require('./enhancedLocationData');
      return EnhancedLocationService.getStatesByCountry(countryCode, scheduleFilter);
    } catch (error) {
      console.error('Error loading states:', error);
      return [];
    }
  }

  /**
   * Get cities by state
   */
  static getCitiesByState(countryCode: string, stateCode: string, scheduleFilter?: UnifiedScheduleLocationFilter): UnifiedCityData[] {
    try {
      const { EnhancedLocationService } = require('./enhancedLocationData');
      return EnhancedLocationService.getCitiesByState(countryCode, stateCode, scheduleFilter);
    } catch (error) {
      console.error('Error loading cities:', error);
      return [];
    }
  }

  /**
   * Search countries
   */
  static searchCountries(query: string): UnifiedCountryData[] {
    try {
      const { EnhancedLocationService } = require('./enhancedLocationData');
      return EnhancedLocationService.searchCountries(query);
    } catch (error) {
      console.error('Error searching countries:', error);
      return [];
    }
  }

  /**
   * Format location string
   */
  static formatLocation(city?: string, state?: string, country?: string): string {
    try {
      const { EnhancedLocationService } = require('./enhancedLocationData');
      return EnhancedLocationService.formatLocation(city, state, country);
    } catch (error) {
      console.error('Error formatting location:', error);
      return [city, state, country].filter(Boolean).join(', ');
    }
  }

  /**
   * Check if country has detailed state/city data
   */
  static hasDetailedData(countryCode: string): boolean {
    try {
      const { EnhancedLocationService } = require('./enhancedLocationData');
      return EnhancedLocationService.hasDetailedData(countryCode);
    } catch (error) {
      console.error('Error checking detailed data:', error);
      return false;
    }
  }

  /**
   * Create schedule filter from schedules data
   */
  static createScheduleFilter(schedules: any[]): UnifiedScheduleLocationFilter {
    try {
      const { EnhancedLocationService } = require('./enhancedLocationData');
      return EnhancedLocationService.createScheduleFilter(schedules);
    } catch (error) {
      console.error('Error creating schedule filter:', error);
      return {};
    }
  }
}

export default UnifiedLocationService; 