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
      console.log("CourseService: Fetching course with ID:", id);
      const response = await axiosInstance.get(`/courses/v1/${id}`);
      console.log("CourseService: Direct endpoint response:", response.data);
      
      if (response.data) {
        // Check if we got a direct object with _id
        if (response.data._id === id) {
          return { status: true, course: response.data };
        }
        
        // Check if we got a standard response format
        if (response.data.course && response.data.status === true) {
          return response.data;
        }
      }
      
      return response.data;
    } catch (error: any) {
      console.error("CourseService: Error fetching course:", error);
      
      // If direct fetch fails, try to get all courses and find the one with matching ID
      try {
        console.log("CourseService: Trying fallback method - fetch all courses");
        const allResponse = await this.getAllCourses();
        
        let courses = [];
        if (allResponse && allResponse.courses && Array.isArray(allResponse.courses)) {
          courses = allResponse.courses;
        } else if (Array.isArray(allResponse)) {
          courses = allResponse;
        } else if (allResponse && allResponse.data && Array.isArray(allResponse.data)) {
          courses = allResponse.data;
        }
        
        const foundCourse = courses.find((course: any) => course._id === id);
        if (foundCourse) {
          console.log("CourseService: Found course in all courses:", foundCourse);
          return { status: true, course: foundCourse };
        }
      } catch (fallbackError) {
        console.error("CourseService: Fallback method also failed:", fallbackError);
      }
      
      // Return a structured error if all attempts fail
      return { 
        status: false, 
        message: error.response?.data?.message || `Error fetching course with ID: ${id}`
      };
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

  /**
   * Toggle course active status
   * @param {string} id - Course ID
   * @param {boolean} isActive - New active status
   * @returns {Promise<{status: boolean, course: Course}>}
   */
  async activeStatus(id: string, isActive: boolean) {
    try {
      const response = await axiosInstance.put(`/courses/v1/${id}/active`, {
        isActive,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new CourseService();
