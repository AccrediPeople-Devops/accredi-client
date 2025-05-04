import axiosInstance from "../config/axiosInstance";

/**
 * API response type for course endpoints
 * @typedef {Object} CourseApiResponse
 * @property {boolean} status - Success status
 * @property {Course|Course[]} courses - Single course or array of courses
 */

class CourseService {
  /**
   * Get all courses
   * @returns {Promise<{status: boolean, courses: Course[]}>}
   */
  async getAllCourses() {
    try {
      const response = await axiosInstance.get("/courses/v1");
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get course by ID
   * @param {string} id - Course ID
   * @returns {Promise<{status: boolean, course: Course}>}
   */
  async getCourseById(id: string) {
    try {
      const response = await axiosInstance.get(`/courses/v1/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get courses by category ID
   * @param {string} categoryId - Category ID
   * @returns {Promise<{status: boolean, courses: Course[]}>}
   */
  async getCoursesByCategory(categoryId: string) {
    try {
      const response = await axiosInstance.get(
        `/courses/v1/category/${categoryId}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create a new course
   * @param {CourseFormData} data - Course data
   * @returns {Promise<{status: boolean, course: Course}>}
   */
  async createCourse(data: any) {
    try {
      const response = await axiosInstance.post("/courses/v1", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update an existing course
   * @param {string} id - Course ID
   * @param {Partial<CourseFormData>} data - Updated course data
   * @returns {Promise<{status: boolean, course: Course}>}
   */
  async updateCourse(id: string, data: any) {
    try {
      const response = await axiosInstance.put(`/courses/v1/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete a course
   * @param {string} id - Course ID
   * @returns {Promise<{status: boolean, message: string}>}
   */
  async deleteCourse(id: string) {
    try {
      const response = await axiosInstance.delete(`/courses/v1/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Toggle course active status
   * @param {string} id - Course ID
   * @param {boolean} isActive - New active status
   * @returns {Promise<{status: boolean, course: Course}>}
   */
  async toggleCourseActive(id: string, isActive: boolean) {
    try {
      const response = await axiosInstance.put(`/courses/v1/${id}/active`, {
        isActive,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Restore a deleted course
   * @param {string} id - Course ID
   * @returns {Promise<{status: boolean, course: Course}>}
   */
  async restoreCourse(id: string) {
    try {
      const response = await axiosInstance.put(`/courses/v1/${id}/undo-delete`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new CourseService();
