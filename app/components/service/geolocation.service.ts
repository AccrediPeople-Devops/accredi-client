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
      // Use a public IP service to get user's IP
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error("Error fetching user IP:", error);
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
      const response = await axiosInstance.get(`/geolocation/v1?ip=${ip}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching geolocation data:", error);
      throw error;
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
      console.error("Error fetching current user geolocation:", error);
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
