import axiosInstance from "../config/axiosInstance";

/**
 * API response type for dashboard statistics
 * @typedef {Object} DashboardApiResponse
 * @property {boolean} status - Success status
 * @property {Object} dashboard - Dashboard statistics data
 */

class DashboardService {
  /**
   * Get dashboard statistics
   * @returns {Promise<{status: boolean, dashboard: Object}>}
   */
  async getDashboardStats() {
    try {
      const response = await axiosInstance.get("/dashboard/v1");
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new DashboardService(); 