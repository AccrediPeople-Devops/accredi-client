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
      console.error("Error fetching coupon codes:", error);
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
      console.log("CouponCodeService: Fetching coupon code with ID:", id);
      
      // Try direct endpoint first
      try {
        const response = await axiosInstance.get(`/coupon-codes/v1/${id}`);
        return response.data;
      } catch (directError) {
        console.log("Direct endpoint failed, using fallback method");
        
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
          console.log("CouponCodeService: Found coupon code in all codes:", foundCouponCode);
          return { status: true, couponCode: foundCouponCode };
        }
        
        // Return a not found error if we couldn't find the coupon code
        return { 
          status: false, 
          message: `Coupon code not found with ID: ${id}`
        };
      }
    } catch (error: any) {
      console.error("CouponCodeService: Error fetching coupon code:", error);
      
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
      console.log("Creating coupon code with data:", JSON.stringify(data, null, 2));
      const response = await axiosInstance.post("/coupon-codes/v1", data);
      return response.data;
    } catch (error) {
      console.error("Error creating coupon code:", error);
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
      console.log("Updating coupon code with ID:", id);
      console.log("Update data:", JSON.stringify(data, null, 2));
      
      const response = await axiosInstance.put(`/coupon-codes/v1/${id}`, data);
      return response.data;
    } catch (error: any) {
      console.error("Coupon code update error:", error);
      
      // Log more detailed error information
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
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
      console.error("Error deleting coupon code:", error);
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
      console.error("Error toggling coupon code status:", error);
      throw error;
    }
  }
}

export default new CouponCodeService(); 