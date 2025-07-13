// Comprehensive Location Data Service
// Unified location data for the entire application

import { WORLD_COUNTRIES, CountryData } from './worldLocationData';

// Enhanced interfaces
export interface StateData {
  name: string;
  code: string;
  countryCode: string;
}

export interface CityData {
  name: string;
  stateCode: string;
  countryCode: string;
  isCapital?: boolean;
  population?: number;
}

export interface LocationHierarchy {
  country: CountryData;
  states: StateData[];
  cities: { [stateCode: string]: CityData[] };
}

// Major countries with detailed state and city data
export const LOCATION_DATA: { [countryCode: string]: LocationHierarchy } = {
  // United States
  US: {
    country: WORLD_COUNTRIES.find(c => c.code === 'US')!,
    states: [
      { name: 'Alabama', code: 'AL', countryCode: 'US' },
      { name: 'Alaska', code: 'AK', countryCode: 'US' },
      { name: 'Arizona', code: 'AZ', countryCode: 'US' },
      { name: 'Arkansas', code: 'AR', countryCode: 'US' },
      { name: 'California', code: 'CA', countryCode: 'US' },
      { name: 'Colorado', code: 'CO', countryCode: 'US' },
      { name: 'Connecticut', code: 'CT', countryCode: 'US' },
      { name: 'Delaware', code: 'DE', countryCode: 'US' },
      { name: 'Florida', code: 'FL', countryCode: 'US' },
      { name: 'Georgia', code: 'GA', countryCode: 'US' },
      { name: 'Hawaii', code: 'HI', countryCode: 'US' },
      { name: 'Idaho', code: 'ID', countryCode: 'US' },
      { name: 'Illinois', code: 'IL', countryCode: 'US' },
      { name: 'Indiana', code: 'IN', countryCode: 'US' },
      { name: 'Iowa', code: 'IA', countryCode: 'US' },
      { name: 'Kansas', code: 'KS', countryCode: 'US' },
      { name: 'Kentucky', code: 'KY', countryCode: 'US' },
      { name: 'Louisiana', code: 'LA', countryCode: 'US' },
      { name: 'Maine', code: 'ME', countryCode: 'US' },
      { name: 'Maryland', code: 'MD', countryCode: 'US' },
      { name: 'Massachusetts', code: 'MA', countryCode: 'US' },
      { name: 'Michigan', code: 'MI', countryCode: 'US' },
      { name: 'Minnesota', code: 'MN', countryCode: 'US' },
      { name: 'Mississippi', code: 'MS', countryCode: 'US' },
      { name: 'Missouri', code: 'MO', countryCode: 'US' },
      { name: 'Montana', code: 'MT', countryCode: 'US' },
      { name: 'Nebraska', code: 'NE', countryCode: 'US' },
      { name: 'Nevada', code: 'NV', countryCode: 'US' },
      { name: 'New Hampshire', code: 'NH', countryCode: 'US' },
      { name: 'New Jersey', code: 'NJ', countryCode: 'US' },
      { name: 'New Mexico', code: 'NM', countryCode: 'US' },
      { name: 'New York', code: 'NY', countryCode: 'US' },
      { name: 'North Carolina', code: 'NC', countryCode: 'US' },
      { name: 'North Dakota', code: 'ND', countryCode: 'US' },
      { name: 'Ohio', code: 'OH', countryCode: 'US' },
      { name: 'Oklahoma', code: 'OK', countryCode: 'US' },
      { name: 'Oregon', code: 'OR', countryCode: 'US' },
      { name: 'Pennsylvania', code: 'PA', countryCode: 'US' },
      { name: 'Rhode Island', code: 'RI', countryCode: 'US' },
      { name: 'South Carolina', code: 'SC', countryCode: 'US' },
      { name: 'South Dakota', code: 'SD', countryCode: 'US' },
      { name: 'Tennessee', code: 'TN', countryCode: 'US' },
      { name: 'Texas', code: 'TX', countryCode: 'US' },
      { name: 'Utah', code: 'UT', countryCode: 'US' },
      { name: 'Vermont', code: 'VT', countryCode: 'US' },
      { name: 'Virginia', code: 'VA', countryCode: 'US' },
      { name: 'Washington', code: 'WA', countryCode: 'US' },
      { name: 'West Virginia', code: 'WV', countryCode: 'US' },
      { name: 'Wisconsin', code: 'WI', countryCode: 'US' },
      { name: 'Wyoming', code: 'WY', countryCode: 'US' },
    ],
    cities: {
      CA: [
        { name: 'Los Angeles', stateCode: 'CA', countryCode: 'US' },
        { name: 'San Francisco', stateCode: 'CA', countryCode: 'US' },
        { name: 'San Diego', stateCode: 'CA', countryCode: 'US' },
      ],
      NY: [
        { name: 'New York City', stateCode: 'NY', countryCode: 'US' },
        { name: 'Buffalo', stateCode: 'NY', countryCode: 'US' },
        { name: 'Albany', stateCode: 'NY', countryCode: 'US' },
      ],
      TX: [
        { name: 'Houston', stateCode: 'TX', countryCode: 'US' },
        { name: 'Dallas', stateCode: 'TX', countryCode: 'US' },
        { name: 'Austin', stateCode: 'TX', countryCode: 'US' },
      ],
      FL: [
        { name: 'Miami', stateCode: 'FL', countryCode: 'US' },
        { name: 'Tampa', stateCode: 'FL', countryCode: 'US' },
        { name: 'Orlando', stateCode: 'FL', countryCode: 'US' },
      ],
      IL: [
        { name: 'Chicago', stateCode: 'IL', countryCode: 'US' },
        { name: 'Rockford', stateCode: 'IL', countryCode: 'US' },
        { name: 'Springfield', stateCode: 'IL', countryCode: 'US' },
      ],
    }
  },

  // Canada
  CA: {
    country: WORLD_COUNTRIES.find(c => c.code === 'CA')!,
    states: [
      { name: 'Alberta', code: 'AB', countryCode: 'CA' },
      { name: 'British Columbia', code: 'BC', countryCode: 'CA' },
      { name: 'Manitoba', code: 'MB', countryCode: 'CA' },
      { name: 'New Brunswick', code: 'NB', countryCode: 'CA' },
      { name: 'Newfoundland and Labrador', code: 'NL', countryCode: 'CA' },
      { name: 'Northwest Territories', code: 'NT', countryCode: 'CA' },
      { name: 'Nova Scotia', code: 'NS', countryCode: 'CA' },
      { name: 'Nunavut', code: 'NU', countryCode: 'CA' },
      { name: 'Ontario', code: 'ON', countryCode: 'CA' },
      { name: 'Prince Edward Island', code: 'PE', countryCode: 'CA' },
      { name: 'Quebec', code: 'QC', countryCode: 'CA' },
      { name: 'Saskatchewan', code: 'SK', countryCode: 'CA' },
      { name: 'Yukon', code: 'YT', countryCode: 'CA' },
    ],
    cities: {
      ON: [
        { name: 'Toronto', stateCode: 'ON', countryCode: 'CA', isCapital: true, population: 2930000 },
        { name: 'Ottawa', stateCode: 'ON', countryCode: 'CA', population: 994837 },
        { name: 'Hamilton', stateCode: 'ON', countryCode: 'CA', population: 536917 },
        { name: 'London', stateCode: 'ON', countryCode: 'CA', population: 422324 },
        { name: 'Kitchener', stateCode: 'ON', countryCode: 'CA', population: 256885 },
      ],
      BC: [
        { name: 'Vancouver', stateCode: 'BC', countryCode: 'CA', population: 631486 },
        { name: 'Victoria', stateCode: 'BC', countryCode: 'CA', isCapital: true, population: 91867 },
        { name: 'Surrey', stateCode: 'BC', countryCode: 'CA', population: 568322 },
        { name: 'Burnaby', stateCode: 'BC', countryCode: 'CA', population: 249125 },
      ],
      QC: [
        { name: 'Montreal', stateCode: 'QC', countryCode: 'CA', population: 1704694 },
        { name: 'Quebec City', stateCode: 'QC', countryCode: 'CA', isCapital: true, population: 531902 },
        { name: 'Laval', stateCode: 'QC', countryCode: 'CA', population: 438366 },
        { name: 'Gatineau', stateCode: 'QC', countryCode: 'CA', population: 281392 },
      ],
    }
  },

  // India
  IN: {
    country: WORLD_COUNTRIES.find(c => c.code === 'IN')!,
    states: [
      { name: 'Andhra Pradesh', code: 'AP', countryCode: 'IN' },
      { name: 'Arunachal Pradesh', code: 'AR', countryCode: 'IN' },
      { name: 'Assam', code: 'AS', countryCode: 'IN' },
      { name: 'Bihar', code: 'BR', countryCode: 'IN' },
      { name: 'Chhattisgarh', code: 'CG', countryCode: 'IN' },
      { name: 'Delhi', code: 'DL', countryCode: 'IN' },
      { name: 'Goa', code: 'GA', countryCode: 'IN' },
      { name: 'Gujarat', code: 'GJ', countryCode: 'IN' },
      { name: 'Haryana', code: 'HR', countryCode: 'IN' },
      { name: 'Himachal Pradesh', code: 'HP', countryCode: 'IN' },
      { name: 'Jharkhand', code: 'JH', countryCode: 'IN' },
      { name: 'Karnataka', code: 'KA', countryCode: 'IN' },
      { name: 'Kerala', code: 'KL', countryCode: 'IN' },
      { name: 'Madhya Pradesh', code: 'MP', countryCode: 'IN' },
      { name: 'Maharashtra', code: 'MH', countryCode: 'IN' },
      { name: 'Manipur', code: 'MN', countryCode: 'IN' },
      { name: 'Meghalaya', code: 'ML', countryCode: 'IN' },
      { name: 'Mizoram', code: 'MZ', countryCode: 'IN' },
      { name: 'Nagaland', code: 'NL', countryCode: 'IN' },
      { name: 'Odisha', code: 'OR', countryCode: 'IN' },
      { name: 'Punjab', code: 'PB', countryCode: 'IN' },
      { name: 'Rajasthan', code: 'RJ', countryCode: 'IN' },
      { name: 'Sikkim', code: 'SK', countryCode: 'IN' },
      { name: 'Tamil Nadu', code: 'TN', countryCode: 'IN' },
      { name: 'Telangana', code: 'TS', countryCode: 'IN' },
      { name: 'Tripura', code: 'TR', countryCode: 'IN' },
      { name: 'Uttar Pradesh', code: 'UP', countryCode: 'IN' },
      { name: 'Uttarakhand', code: 'UK', countryCode: 'IN' },
      { name: 'West Bengal', code: 'WB', countryCode: 'IN' },
    ],
    cities: {
      MH: [
        { name: 'Mumbai', stateCode: 'MH', countryCode: 'IN', population: 12442373 },
        { name: 'Pune', stateCode: 'MH', countryCode: 'IN', population: 3124458 },
        { name: 'Nagpur', stateCode: 'MH', countryCode: 'IN', population: 2405421 },
        { name: 'Thane', stateCode: 'MH', countryCode: 'IN', population: 1841488 },
        { name: 'Mumbai Suburban', stateCode: 'MH', countryCode: 'IN', population: 9332481 },
      ],
      DL: [
        { name: 'New Delhi', stateCode: 'DL', countryCode: 'IN', isCapital: true, population: 16787941 },
      ],
      KA: [
        { name: 'Bangalore', stateCode: 'KA', countryCode: 'IN', population: 8443675 },
        { name: 'Mysore', stateCode: 'KA', countryCode: 'IN', population: 887446 },
        { name: 'Hubli-Dharwad', stateCode: 'KA', countryCode: 'IN', population: 943857 },
      ],
      TN: [
        { name: 'Chennai', stateCode: 'TN', countryCode: 'IN', population: 4646732 },
        { name: 'Coimbatore', stateCode: 'TN', countryCode: 'IN', population: 1061447 },
        { name: 'Madurai', stateCode: 'TN', countryCode: 'IN', population: 1561129 },
      ],
      WB: [
        { name: 'Kolkata', stateCode: 'WB', countryCode: 'IN', population: 4496694 },
        { name: 'Howrah', stateCode: 'WB', countryCode: 'IN', population: 1077075 },
      ],
    }
  },

  // United Kingdom
  GB: {
    country: WORLD_COUNTRIES.find(c => c.code === 'GB')!,
    states: [
      { name: 'England', code: 'ENG', countryCode: 'GB' },
      { name: 'Scotland', code: 'SCT', countryCode: 'GB' },
      { name: 'Wales', code: 'WLS', countryCode: 'GB' },
      { name: 'Northern Ireland', code: 'NIR', countryCode: 'GB' },
    ],
    cities: {
      ENG: [
        { name: 'London', stateCode: 'ENG', countryCode: 'GB', isCapital: true, population: 8982000 },
        { name: 'Birmingham', stateCode: 'ENG', countryCode: 'GB', population: 1141816 },
        { name: 'Manchester', stateCode: 'ENG', countryCode: 'GB', population: 547858 },
        { name: 'Liverpool', stateCode: 'ENG', countryCode: 'GB', population: 498042 },
        { name: 'Leeds', stateCode: 'ENG', countryCode: 'GB', population: 789194 },
      ],
      SCT: [
        { name: 'Edinburgh', stateCode: 'SCT', countryCode: 'GB', isCapital: true, population: 518500 },
        { name: 'Glasgow', stateCode: 'SCT', countryCode: 'GB', population: 635130 },
        { name: 'Aberdeen', stateCode: 'SCT', countryCode: 'GB', population: 198590 },
      ],
      WLS: [
        { name: 'Cardiff', stateCode: 'WLS', countryCode: 'GB', isCapital: true, population: 362400 },
        { name: 'Swansea', stateCode: 'WLS', countryCode: 'GB', population: 246466 },
      ],
      NIR: [
        { name: 'Belfast', stateCode: 'NIR', countryCode: 'GB', isCapital: true, population: 343542 },
      ],
    }
  },

  // Australia
  AU: {
    country: WORLD_COUNTRIES.find(c => c.code === 'AU')!,
    states: [
      { name: 'Australian Capital Territory', code: 'ACT', countryCode: 'AU' },
      { name: 'New South Wales', code: 'NSW', countryCode: 'AU' },
      { name: 'Northern Territory', code: 'NT', countryCode: 'AU' },
      { name: 'Queensland', code: 'QLD', countryCode: 'AU' },
      { name: 'South Australia', code: 'SA', countryCode: 'AU' },
      { name: 'Tasmania', code: 'TAS', countryCode: 'AU' },
      { name: 'Victoria', code: 'VIC', countryCode: 'AU' },
      { name: 'Western Australia', code: 'WA', countryCode: 'AU' },
    ],
    cities: {
      NSW: [
        { name: 'Sydney', stateCode: 'NSW', countryCode: 'AU', population: 5312163 },
        { name: 'Newcastle', stateCode: 'NSW', countryCode: 'AU', population: 322278 },
        { name: 'Wollongong', stateCode: 'NSW', countryCode: 'AU', population: 295669 },
      ],
      VIC: [
        { name: 'Melbourne', stateCode: 'VIC', countryCode: 'AU', population: 5078193 },
        { name: 'Geelong', stateCode: 'VIC', countryCode: 'AU', population: 253269 },
      ],
      QLD: [
        { name: 'Brisbane', stateCode: 'QLD', countryCode: 'AU', population: 2514184 },
        { name: 'Gold Coast', stateCode: 'QLD', countryCode: 'AU', population: 679127 },
        { name: 'Cairns', stateCode: 'QLD', countryCode: 'AU', population: 153075 },
      ],
      WA: [
        { name: 'Perth', stateCode: 'WA', countryCode: 'AU', population: 2125114 },
      ],
      SA: [
        { name: 'Adelaide', stateCode: 'SA', countryCode: 'AU', population: 1345777 },
      ],
      ACT: [
        { name: 'Canberra', stateCode: 'ACT', countryCode: 'AU', isCapital: true, population: 453558 },
      ],
    }
  },
};

// Utility functions
export class LocationService {
  
  // Get all countries
  static getAllCountries(): CountryData[] {
    return WORLD_COUNTRIES;
  }

  // Get popular countries
  static getPopularCountries(): CountryData[] {
    const popularCodes = ['US', 'CA', 'GB', 'IN', 'AU', 'SG', 'MY', 'NZ', 'IE', 'AE'];
    return popularCodes.map(code => WORLD_COUNTRIES.find(c => c.code === code)!).filter(Boolean);
  }

  // Get country by code
  static getCountryByCode(code: string): CountryData | undefined {
    return WORLD_COUNTRIES.find(c => c.code === code);
  }

  // Get states for a country
  static getStatesByCountry(countryCode: string): StateData[] {
    const locationData = LOCATION_DATA[countryCode];
    return locationData ? locationData.states : [];
  }

  // Get cities for a state
  static getCitiesByState(countryCode: string, stateCode: string): CityData[] {
    const locationData = LOCATION_DATA[countryCode];
    return locationData && locationData.cities[stateCode] ? locationData.cities[stateCode] : [];
  }

  // Get all cities for a country
  static getCitiesByCountry(countryCode: string): CityData[] {
    const locationData = LOCATION_DATA[countryCode];
    if (!locationData) return [];
    
    const allCities: CityData[] = [];
    Object.values(locationData.cities).forEach(cities => {
      allCities.push(...cities);
    });
    return allCities;
  }

  // Search countries by name
  static searchCountries(query: string): CountryData[] {
    const lowercaseQuery = query.toLowerCase();
    return WORLD_COUNTRIES.filter(country => 
      country.name.toLowerCase().includes(lowercaseQuery) ||
      country.code.toLowerCase().includes(lowercaseQuery)
    );
  }

  // Search states by name
  static searchStates(countryCode: string, query: string): StateData[] {
    const states = this.getStatesByCountry(countryCode);
    const lowercaseQuery = query.toLowerCase();
    return states.filter(state => 
      state.name.toLowerCase().includes(lowercaseQuery) ||
      state.code.toLowerCase().includes(lowercaseQuery)
    );
  }

  // Search cities by name
  static searchCities(countryCode: string, stateCode: string | null, query: string): CityData[] {
    let cities: CityData[] = [];
    
    if (stateCode) {
      cities = this.getCitiesByState(countryCode, stateCode);
    } else {
      cities = this.getCitiesByCountry(countryCode);
    }
    
    const lowercaseQuery = query.toLowerCase();
    return cities.filter(city => 
      city.name.toLowerCase().includes(lowercaseQuery)
    );
  }

  // Check if country has detailed location data
  static hasDetailedData(countryCode: string): boolean {
    return countryCode in LOCATION_DATA;
  }

  // Get location hierarchy for a country
  static getLocationHierarchy(countryCode: string): LocationHierarchy | null {
    return LOCATION_DATA[countryCode] || null;
  }

  // Format location string
  static formatLocation(city?: string, state?: string, country?: string): string {
    const parts = [city, state, country].filter(Boolean);
    return parts.join(', ');
  }

  // Get major cities for quick selection
  static getMajorCities(countryCode: string, limit: number = 10): CityData[] {
    const cities = this.getCitiesByCountry(countryCode);
    return cities
      .sort((a, b) => (b.population || 0) - (a.population || 0))
      .slice(0, limit);
  }
}

// Export commonly used data
export { WORLD_COUNTRIES } from './worldLocationData';
export type { CountryData } from './worldLocationData'; 