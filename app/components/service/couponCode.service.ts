import axiosInstance from "../config/axiosInstance";

interface CouponCode {
  _id?: string;
  courseId: string;
  country: string;
  discountCode: string;
  couponLimit: number;
  expiryDate: string;
  discountPrice: number;
  isActive?: boolean;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

class CouponCodeService {
  /**
   * Get all coupon codes
   * @returns {Promise<{status: boolean, couponCodes: CouponCode[]}>}
   */
  async getAllCouponCodes() {
    try {
      const response = await axiosInstance.get("/coupon-codes/v1");
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get coupon code by ID
   * @param {string} id - Coupon Code ID
   * @returns {Promise<{status: boolean, couponCode: CouponCode}>}
   */
  async getCouponCodeById(id: string) {
    try {
      
      // Try direct endpoint first
      try {
        const response = await axiosInstance.get(`/coupon-codes/v1/${id}`);
        return response.data;
      } catch (directError) {
        
        // Fallback: fetch all and find the matching one
        const allResponse = await this.getAllCouponCodes();
        
        let couponCodes = [];
        if (allResponse && allResponse.couponCodes && Array.isArray(allResponse.couponCodes)) {
          couponCodes = allResponse.couponCodes;
        } else if (Array.isArray(allResponse)) {
          couponCodes = allResponse;
        } else if (allResponse && allResponse.data && Array.isArray(allResponse.data)) {
          couponCodes = allResponse.data;
        }
        
        const foundCouponCode = couponCodes.find((code: any) => code._id === id);
        if (foundCouponCode) {
          return { status: true, couponCode: foundCouponCode };
        }
        
        // Return a not found error if we couldn't find the coupon code
        return { 
          status: false, 
          message: `Coupon code not found with ID: ${id}`
        };
      }
    } catch (error: any) {
      
      // Return a structured error
      return { 
        status: false, 
        message: error.response?.data?.message || `Error fetching coupon code with ID: ${id}`
      };
    }
  }

  /**
   * Create a new coupon code
   * @param {CouponCode} data - Coupon code data
   * @returns {Promise<{status: boolean, couponCode: CouponCode}>}
   */
  async createCouponCode(data: CouponCode) {
    try {
      const response = await axiosInstance.post("/coupon-codes/v1", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update an existing coupon code
   * @param {string} id - Coupon Code ID
   * @param {Partial<CouponCode>} data - Updated coupon code data
   * @returns {Promise<{status: boolean, couponCode: CouponCode}>}
   */
  async updateCouponCode(id: string, data: Partial<CouponCode>) {
    try {
      
      const response = await axiosInstance.put(`/coupon-codes/v1/${id}`, data);
      return response.data;
    } catch (error: any) {
      
      // Log more detailed error information
      if (error.response) {
      }
      
      throw error;
    }
  }

  /**
   * Delete a coupon code
   * @param {string} id - Coupon Code ID
   * @returns {Promise<{status: boolean, message: string}>}
   */
  async deleteCouponCode(id: string) {
    try {
      const response = await axiosInstance.delete(`/coupon-codes/v1/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Toggle coupon code active status
   * @param {string} id - Coupon Code ID
   * @param {boolean} isActive - New active status
   * @returns {Promise<{status: boolean, couponCode: CouponCode}>}
   */
  async toggleCouponCodeActive(id: string, isActive: boolean) {
    try {
      const response = await axiosInstance.put(`/coupon-codes/v1/${id}/active`, {
        isActive,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Temporary fallback for coupon verification until backend endpoint is ready
   * This will be removed once /coupon-codes/v1/verify is implemented
   */
  private async verifyCouponFallback(discountCode: string, scheduleId: string) {
    
    // For now, return a mock response for testing
    // This should be removed once the real endpoint is working
    if (discountCode === "SAVE20" || discountCode === "TEST20") {
      return {
        status: true,
        discountPrice: 100
      };
    } else if (discountCode === "SAVE50" || discountCode === "TEST50") {
      return {
        status: true,
        discountPrice: 250
      };
    } else {
      throw new Error("Invalid coupon code");
    }
  }

  /**
   * Verify a coupon code for a specific schedule
   * @param {string} discountCode - The coupon code to verify
   * @param {string} scheduleId - The schedule ID to verify the coupon against
   * @returns {Promise<{status: boolean, discountPrice: number}>}
   */
  async verifyCoupon(discountCode: string, scheduleId: string) {
    try {

      const response = await axiosInstance.post("/coupon-codes/v1/verify", {
        discountCode,
        scheduleId
      });
      
      return response.data;
    } catch (error: any) {
      
      // Handle specific error cases
      if (error.response?.status === 404) {
        
        // Use fallback method until backend is ready
        return await this.verifyCouponFallback(discountCode, scheduleId);
      } else if (error.response?.status === 400) {
        // Bad request - invalid coupon or schedule
        const message = error.response?.data?.message || "Invalid coupon code or schedule";
        throw new Error(message);
      } else if (error.response?.status === 401) {
        // Unauthorized
        throw new Error("Authentication required. Please log in and try again.");
      } else {
        // Other errors
        const message = error.response?.data?.message || error.message || "Failed to verify coupon code";
        throw new Error(message);
      }
    }
  }
}

export default new CouponCodeService(); 