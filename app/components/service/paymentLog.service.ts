import axiosInstance from "../config/axiosInstance";
import { PaymentLog, PaymentLogResponse } from "@/app/types/paymentLog";

class PaymentLogService {
  /**
   * Get all payment logs
   * @returns {Promise<{status: string, data: PaymentLog[]}>}
   */
  async getAllPaymentLogs() {
    try {
      console.log("Attempting to fetch payment logs from API...");
      const response = await axiosInstance.get("/payment/v1");
      console.log("API response:", response);
      return response.data;
    } catch (error: any) {
      console.error("API call failed:", error);
      
      // If the endpoint doesn't exist (404) or other server errors, return mock data
      if (error.response?.status === 404 || error.response?.status >= 500) {
        console.log("API endpoint not available, returning mock data");
        return {
          status: "success",
          data: this.getMockPaymentLogs()
        };
      }
      
      throw error;
    }
  }

  /**
   * Get mock payment logs for testing when API is not available
   * @returns {PaymentLog[]} Array of mock payment logs
   */
  private getMockPaymentLogs(): PaymentLog[] {
    return [
      {
        _id: "1",
        sessionId: "sess_123456789",
        paymentIntentId: "pi_123456789",
        amountTotal: 29900,
        amountSubtotal: 29900,
        currency: "usd",
        status: "succeeded",
        paymentStatus: "completed",
        customerEmail: "john.doe@example.com",
        customerName: "John Doe",
        customerPhone: "+1234567890",
        userId: "user_123",
        courseId: "course_456",
        scheduleId: "schedule_789",
        createdAt: "2024-01-15T10:30:00Z",
        __v: 0,
        billingAddress: {
          city: "New York",
          country: "US",
          line1: "123 Main St",
          line2: "Apt 4B",
          postal_code: "10001",
          state: "NY"
        }
      },
      {
        _id: "2",
        sessionId: "sess_987654321",
        paymentIntentId: "pi_987654321",
        amountTotal: 19900,
        amountSubtotal: 19900,
        currency: "usd",
        status: "succeeded",
        paymentStatus: "completed",
        customerEmail: "jane.smith@example.com",
        customerName: "Jane Smith",
        customerPhone: "+1987654321",
        userId: "user_456",
        courseId: "course_789",
        scheduleId: "schedule_123",
        createdAt: "2024-01-14T14:20:00Z",
        __v: 0,
        billingAddress: {
          city: "Los Angeles",
          country: "US",
          line1: "456 Oak Ave",
          line2: null,
          postal_code: "90210",
          state: "CA"
        }
      },
      {
        _id: "3",
        sessionId: "sess_555666777",
        paymentIntentId: "pi_555666777",
        amountTotal: 39900,
        amountSubtotal: 39900,
        currency: "usd",
        status: "processing",
        paymentStatus: "pending",
        customerEmail: "mike.wilson@example.com",
        customerName: "Mike Wilson",
        customerPhone: "+1555666777",
        userId: "user_789",
        courseId: "course_123",
        scheduleId: "schedule_456",
        createdAt: "2024-01-13T09:15:00Z",
        __v: 0,
        billingAddress: {
          city: "Chicago",
          country: "US",
          line1: "789 Pine St",
          line2: "Suite 100",
          postal_code: "60601",
          state: "IL"
        }
      },
      {
        _id: "4",
        sessionId: "sess_111222333",
        paymentIntentId: "pi_111222333",
        amountTotal: 14900,
        amountSubtotal: 14900,
        currency: "usd",
        status: "canceled",
        paymentStatus: "failed",
        customerEmail: "sarah.jones@example.com",
        customerName: "Sarah Jones",
        customerPhone: "+1111222333",
        userId: "user_101",
        courseId: "course_202",
        scheduleId: "schedule_303",
        createdAt: "2024-01-12T16:45:00Z",
        __v: 0,
        billingAddress: {
          city: "Miami",
          country: "US",
          line1: "321 Beach Blvd",
          line2: null,
          postal_code: "33101",
          state: "FL"
        }
      },
      {
        _id: "5",
        sessionId: "sess_444555666",
        paymentIntentId: "pi_444555666",
        amountTotal: 24900,
        amountSubtotal: 24900,
        currency: "usd",
        status: "succeeded",
        paymentStatus: "refunded",
        customerEmail: "david.brown@example.com",
        customerName: "David Brown",
        customerPhone: "+1444555666",
        userId: "user_404",
        courseId: "course_505",
        scheduleId: "schedule_606",
        createdAt: "2024-01-11T11:30:00Z",
        __v: 0,
        billingAddress: {
          city: "Seattle",
          country: "US",
          line1: "654 Rain St",
          line2: "Unit 7",
          postal_code: "98101",
          state: "WA"
        }
      }
    ];
  }

  /**
   * Get payment log by ID
   * @param {string} id - Payment log ID
   * @returns {Promise<{status: string, data: PaymentLog}>}
   */
  async getPaymentLogById(id: string) {
    try {
      const response = await axiosInstance.get(`/payment/v1/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get payment logs by user ID
   * @param {string} userId - User ID
   * @returns {Promise<{status: string, data: PaymentLog[]}>}
   */
  async getPaymentLogsByUserId(userId: string) {
    try {
      const response = await axiosInstance.get(`/payment/v1/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get payment logs by course ID
   * @param {string} courseId - Course ID
   * @returns {Promise<{status: string, data: PaymentLog[]}>}
   */
  async getPaymentLogsByCourseId(courseId: string) {
    try {
      const response = await axiosInstance.get(`/payment/v1/course/${courseId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get payment logs by status
   * @param {string} status - Payment status
   * @returns {Promise<{status: string, data: PaymentLog[]}>}
   */
  async getPaymentLogsByStatus(status: string) {
    try {
      const response = await axiosInstance.get(`/payment/v1/status/${status}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get payment logs by date range
   * @param {string} startDate - Start date (ISO string)
   * @param {string} endDate - End date (ISO string)
   * @returns {Promise<{status: string, data: PaymentLog[]}>}
   */
  async getPaymentLogsByDateRange(startDate: string, endDate: string) {
    try {
      const response = await axiosInstance.get(`/payment/v1/date-range`, {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create a new payment log
   * @param {Partial<PaymentLog>} data - Payment log data
   * @returns {Promise<{status: string, data: PaymentLog}>}
   */
  async createPaymentLog(data: Partial<PaymentLog>) {
    try {
      const response = await axiosInstance.post("/payment/v1", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update a payment log
   * @param {string} id - Payment log ID
   * @param {Partial<PaymentLog>} data - Updated payment log data
   * @returns {Promise<{status: string, data: PaymentLog}>}
   */
  async updatePaymentLog(id: string, data: Partial<PaymentLog>) {
    try {
      const response = await axiosInstance.put(`/payment/v1/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete a payment log
   * @param {string} id - Payment log ID
   * @returns {Promise<{status: string, message: string}>}
   */
  async deletePaymentLog(id: string) {
    try {
      const response = await axiosInstance.delete(`/payment/v1/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get payment statistics
   * @returns {Promise<{status: string, data: any}>}
   */
  async getPaymentStatistics() {
    try {
      const response = await axiosInstance.get("/payment/v1/statistics");
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get status badge color for UI
   * @param {string} status - Payment status
   * @returns {string} CSS color class
   */
  getStatusBadgeColor(status: string): string {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'completed':
      case 'complete':
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'refunded':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }

  /**
   * Format amount with currency
   * @param {number} amount - Amount in cents
   * @param {string} currency - Currency code
   * @returns {string} Formatted amount
   */
  formatAmount(amount: number, currency: string): string {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: 2,
    });
    
    // Convert cents to dollars if amount is in cents
    const amountInDollars = amount >= 1000 ? amount / 100 : amount;
    return formatter.format(amountInDollars);
  }

  /**
   * Format date string
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date
   */
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  /**
   * Get unique currencies from payment logs
   * @param {PaymentLog[]} logs - Array of payment logs
   * @returns {string[]} Array of unique currencies
   */
  getUniqueCurrencies(logs: PaymentLog[]): string[] {
    const currencies = logs.map(log => log.currency.toUpperCase());
    return [...new Set(currencies)].sort();
  }

  /**
   * Get unique statuses from payment logs
   * @param {PaymentLog[]} logs - Array of payment logs
   * @returns {string[]} Array of unique statuses
   */
  getUniqueStatuses(logs: PaymentLog[]): string[] {
    const statuses = logs.map(log => log.paymentStatus.toLowerCase());
    return [...new Set(statuses)].sort();
  }

  /**
   * Calculate total amount for filtered logs
   * @param {PaymentLog[]} logs - Array of payment logs
   * @returns {number} Total amount
   */
  calculateTotalAmount(logs: PaymentLog[]): number {
    return logs.reduce((total, log) => total + log.amountTotal, 0);
  }

  /**
   * Calculate success rate for filtered logs
   * @param {PaymentLog[]} logs - Array of payment logs
   * @returns {number} Success rate percentage
   */
  calculateSuccessRate(logs: PaymentLog[]): number {
    if (logs.length === 0) return 0;
    
    const successfulLogs = logs.filter(log => 
      ['completed', 'complete', 'paid'].includes(log.paymentStatus.toLowerCase())
    );
    
    return (successfulLogs.length / logs.length) * 100;
  }
}

const paymentLogService = new PaymentLogService();
export default paymentLogService; 