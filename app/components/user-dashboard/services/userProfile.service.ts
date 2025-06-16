import axiosInstance from "../../config/axiosInstance";
import { User, UserFormData } from "../../../types/user";

/**
 * Password change request interface
 */
interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  is2FAEnabled: boolean;
}

/**
 * User Profile Service for User Dashboard
 * Handles profile-related API calls for regular users
 */
class UserProfileService {
  /**
   * Get current user's profile
   * @returns {Promise<User>}
   */
  async getCurrentUserProfile(): Promise<User> {
    try {
      const response = await axiosInstance.get("/users/profile");
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update current user's profile
   * @param {Partial<UserFormData>} data - Updated profile data
   * @returns {Promise<User>}
   */
  async updateCurrentUserProfile(data: Partial<UserFormData>): Promise<User> {
    try {
      const response = await axiosInstance.put("/users/profile", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Change user password
   * @param {ChangePasswordRequest} data - Password change data
   * @returns {Promise<any>}
   */
  async changePassword(data: ChangePasswordRequest): Promise<any> {
    try {
      const response = await axiosInstance.post("/users/change-password", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update 2FA setting
   * @param {boolean} is2FAEnabled - 2FA enabled status
   * @returns {Promise<User>}
   */
  async update2FA(is2FAEnabled: boolean): Promise<User> {
    try {
      const response = await axiosInstance.put("/users/profile", {
        is2FAEnabled: is2FAEnabled
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new UserProfileService(); 