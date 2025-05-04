import axiosInstance from "../config/axiosInstance";
import { Curriculum, CurriculumFormData } from "../../types/curriculum";

/**
 * API response type for curriculum endpoints
 * @typedef {Object} CurriculumApiResponse
 * @property {boolean} status - Success status
 * @property {Curriculum|Curriculum[]} curriculum - Single curriculum or array of curriculums
 */

class CurriculumService {
  /**
   * Get all curriculums
   * @returns {Promise<{status: boolean, curriculum: Curriculum[]}>}
   */
  async getAllCurriculums() {
    try {
      const response = await axiosInstance.get("/curriculums/v1");
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get curriculum by course ID
   * @param {string} courseId - Course ID
   * @returns {Promise<{status: boolean, curriculum: Curriculum}>}
   */
  async getCurriculumByCourseId(courseId: string) {
    try {
      const response = await axiosInstance.get(
        `/curriculums/v1/course/${courseId}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create a new curriculum
   * @param {CurriculumFormData} data - Curriculum data
   * @returns {Promise<{status: boolean, curriculum: Curriculum}>}
   */
  async createCurriculum(data: CurriculumFormData) {
    try {
      const response = await axiosInstance.post("/curriculums/v1", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update an existing curriculum
   * @param {string} id - Curriculum ID
   * @param {Partial<CurriculumFormData>} data - Updated curriculum data
   * @returns {Promise<{status: boolean, curriculum: Curriculum}>}
   */
  async updateCurriculum(id: string, data: Partial<CurriculumFormData>) {
    try {
      const response = await axiosInstance.put(`/curriculums/v1/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete a curriculum
   * @param {string} id - Curriculum ID
   * @returns {Promise<{status: boolean, message: string}>}
   */
  async deleteCurriculum(id: string) {
    try {
      const response = await axiosInstance.delete(`/curriculums/v1/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Toggle curriculum active status
   * @param {string} id - Curriculum ID
   * @param {boolean} isActive - New active status
   * @returns {Promise<{status: boolean, curriculum: Curriculum}>}
   */
  async toggleCurriculumActive(id: string, isActive: boolean) {
    try {
      const response = await axiosInstance.put(`/curriculums/v1/${id}/active`, {
        isActive,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new CurriculumService();
