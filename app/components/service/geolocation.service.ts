import axiosInstance from "../config/axiosInstance";

export interface GeolocationData {
  status: boolean;
  message: string;
  geoplugin_request: string;
  geoplugin_status: number;
  geoplugin_credit: string;
  geoplugin_region: string;
  geoplugin_areaCode: string | null;
  geoplugin_dmaCode: string | null;
  geoplugin_countryName: string;
  geoplugin_countryCode: string;
  geoplugin_euVATrate: string | null;
  geoplugin_continentName: string;
  geoplugin_inEU: string | null;
  geoplugin_continentCode: string;
  geoplugin_city: string;
  geoplugin_regionName: string;
  geoplugin_regionCode: string;
  geoplugin_postal_code: string;
  geoplugin_longitude: number;
  geoplugin_latitude: number;
  geoplugin_locationAccuracyRadius: string | null;
  geoplugin_timezone: string;
  geoplugin_currencyCode: string;
  geoplugin_currencySymbol: string;
  geoplugin_currencyConverter: number;
  geoplugin_currencySymbol_UTF8: string;
  languages: string[];
}

class GeolocationService {
  /**
   * Get user's IP address from a third-party service
   * @returns {Promise<string>} User's IP address
   */
  async getUserIP(): Promise<string> {
    try {
      // Use a public IP service to get user's IP with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch("https://api.ipify.org?format=json", {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.ip;
    } catch (error) {
      // Fallback IP for testing
      return "49.43.241.226";
    }
  }

  /**
   * Get geolocation data for a specific IP
   * @param {string} ip - IP address to lookup
   * @returns {Promise<GeolocationData>} Geolocation data
   */
  async getGeolocationByIP(ip: string): Promise<GeolocationData> {
    try {
      const response = await axiosInstance.get(`/geolocation/v1?ip=${ip}`, {
        timeout: 10000 // 10 second timeout for this specific call
      });
      return response.data;
    } catch (error: any) {
      // Return fallback data if API fails
      return {
        status: false,
        message: "Geolocation service unavailable",
        geoplugin_request: ip,
        geoplugin_status: 0,
        geoplugin_credit: "",
        geoplugin_region: "",
        geoplugin_areaCode: null,
        geoplugin_dmaCode: null,
        geoplugin_countryName: "United States",
        geoplugin_countryCode: "US",
        geoplugin_euVATrate: null,
        geoplugin_continentName: "North America",
        geoplugin_inEU: null,
        geoplugin_continentCode: "NA",
        geoplugin_city: "New York",
        geoplugin_regionName: "New York",
        geoplugin_regionCode: "NY",
        geoplugin_postal_code: "10001",
        geoplugin_longitude: -74.0059,
        geoplugin_latitude: 40.7128,
        geoplugin_locationAccuracyRadius: null,
        geoplugin_timezone: "America/New_York",
        geoplugin_currencyCode: "USD",
        geoplugin_currencySymbol: "$",
        geoplugin_currencyConverter: 1,
        geoplugin_currencySymbol_UTF8: "$",
        languages: ["en"]
      };
    }
  }

  /**
   * Get current user's geolocation data
   * @returns {Promise<GeolocationData>} Current user's geolocation data
   */
  async getCurrentUserGeolocation(): Promise<GeolocationData> {
    try {
      const userIP = await this.getUserIP();
      return await this.getGeolocationByIP(userIP);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Convert USD amount to user's local currency
   * @param {number} usdAmount - Amount in USD
   * @param {number} currencyConverter - Currency conversion rate from geolocation API
   * @returns {number} Converted amount in local currency
   */
  convertUSDToLocalCurrency(
    usdAmount: number,
    currencyConverter: number
  ): number {
    return Math.round(usdAmount * currencyConverter * 100) / 100;
  }

  /**
   * Format currency amount with appropriate symbol
   * @param {number} amount - Amount to format
   * @param {string} currencySymbol - Currency symbol (UTF8)
   * @param {string} currencyCode - Currency code (e.g., 'INR', 'USD')
   * @returns {string} Formatted currency string
   */
  formatCurrency(
    amount: number,
    currencySymbol: string,
    currencyCode: string
  ): string {
    // Handle HTML entities in currency symbols
    const symbol = currencySymbol
      .replace(/&#8377;/g, "₹")
      .replace(/&#36;/g, "$");

    // Format number with commas for better readability
    const formattedAmount = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);

    return `${symbol}${formattedAmount}`;
  }
}

export default new GeolocationService();
