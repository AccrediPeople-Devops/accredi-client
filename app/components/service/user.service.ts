import axiosInstance from "../config/axiosInstance";
import { UserFormData } from "../../types/user";

/**
 * API response type for user endpoints
 * @typedef {Object} UserApiResponse
 * @property {boolean} status - Success status
 * @property {User|User[]} users - Single user or array of users
 */

class UserService {
  /**
   * Get all users
   * @returns {Promise<{status: boolean, users: User[]}>}
   */
  async getAllUsers() {
    try {
      const response = await axiosInstance.get("/users/v1");
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get user by ID
   * @param {string} id - User ID
   * @returns {Promise<{status: boolean, user: User}>}
   */
  async getUserById(id: string) {
    try {
      const response = await axiosInstance.get(`/users/v1/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create a new user
   * @param {UserFormData} data - User data
   * @returns {Promise<{status: boolean, user: User}>}
   */
  async createUser(data: UserFormData) {
    try {
      const response = await axiosInstance.post("/users/v1", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update an existing user
   * @param {string} id - User ID
   * @param {Partial<UserFormData>} data - Updated user data
   * @returns {Promise<{status: boolean, user: User}>}
   */
  async updateUser(id: string, data: Partial<UserFormData>) {
    try {
      const response = await axiosInstance.put(`/users/v1/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete a user
   * @param {string} id - User ID
   * @returns {Promise<{status: boolean, message: string}>}
   */
  async deleteUser(id: string) {
    try {
      const response = await axiosInstance.delete(`/users/v1/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Restore a deleted user
   * @param {string} id - User ID
   * @returns {Promise<{status: boolean, user: User}>}
   */
  async undoDelete(id: string) {
    try {
      const response = await axiosInstance.put(`/users/v1/${id}/undo-delete`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new UserService();
