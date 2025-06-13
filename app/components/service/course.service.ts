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
      const response = await axiosInstance.get("/courses");
      return response.data;
    } catch (error: any) {
      // If it's an authentication error and we're on a public page, return empty data
      if (error.response?.status === 401 || error.message === "Authentication required") {
        console.warn("Authentication failed for courses, returning empty data for public access");
        return { status: true, courses: [] };
      }
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

      // Fetch all courses from the /courses endpoint
      const allResponse = await this.getAllCourses();

      if (
        allResponse &&
        allResponse.status &&
        allResponse.courses &&
        Array.isArray(allResponse.courses)
      ) {
        const foundCourse = allResponse.courses.find(
          (course: any) => course._id === id
        );
        if (foundCourse) {
          console.log("CourseService: Found course:", foundCourse);
          return { status: true, course: foundCourse };
        }
      }

      // Return a not found error if we couldn't find the course
      return {
        status: false,
        message: `Course not found with ID: ${id}`,
      };
    } catch (error: any) {
      console.error("CourseService: Error fetching course:", error);

      // Return a structured error
      return {
        status: false,
        message:
          error.response?.data?.message ||
          `Error fetching course with ID: ${id}`,
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
      // Get all courses and filter by category
      const allResponse = await this.getAllCourses();

      if (
        allResponse &&
        allResponse.status &&
        allResponse.courses &&
        Array.isArray(allResponse.courses)
      ) {
        // Filter courses by categoryId
        const filteredCourses = allResponse.courses.filter((course: any) => {
          // Check different possible field names for the category ID
          return (
            course.categoryId === categoryId ||
            course.category === categoryId ||
            (course.categoryId && course.categoryId._id === categoryId) ||
            (course.category && course.category._id === categoryId)
          );
        });

        console.log(
          `Found ${filteredCourses.length} courses for category ${categoryId}`
        );
        return {
          status: true,
          courses: filteredCourses,
        };
      }

      return { status: false, courses: [] };
    } catch (error) {
      console.error("Error getting courses by category:", error);
      return { status: false, courses: [] };
    }
  }

  /**
   * Create a new course
   * @param {CourseFormData} data - Course data
   * @returns {Promise<{status: boolean, course: Course}>}
   */
  async createCourse(data: any) {
    try {
      const response = await axiosInstance.post("/courses", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update a course
   * @param {string} id - Course ID
   * @param {CourseFormData} data - Updated course data
   * @returns {Promise<{status: boolean, course: Course}>}
   */
  async updateCourse(id: string, data: any) {
    try {
      const response = await axiosInstance.put(`/courses/${id}`, data);
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
      const response = await axiosInstance.delete(`/courses/${id}`);
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
      const response = await axiosInstance.put(`/courses/${id}/active`, {
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
      const response = await axiosInstance.put(`/courses/${id}/undo-delete`);
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
      const response = await axiosInstance.put(`/courses/${id}/active`, {
        isActive,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get course statistics
   * @returns {Promise<{status: boolean, stats: Object}>}
   */
  async getCourseStats() {
    try {
      const response = await axiosInstance.get("/courses/stats");
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Search courses by title or description
   * @param {string} query - Search query
   * @returns {Promise<{status: boolean, courses: Course[]}>}
   */
  async searchCourses(query: string) {
    try {
      const response = await axiosInstance.get(`/courses/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get recent courses with optional limit
   * @param {number} limit - Maximum number of courses to return
   * @returns {Promise<{status: boolean, courses: Course[]}>}
   */
  async getRecentCourses(limit: number = 4) {
    try {
      // First try the dedicated endpoint for recent courses
      try {
        const response = await axiosInstance.get(
          `/courses/recent?limit=${limit}`
        );
        return response.data;
      } catch (directError: any) {
        console.log(
          "Direct recent courses endpoint failed:",
          directError.message
        );

        // Fallback: get all courses and sort manually
        console.log(
          "Using fallback method - fetch all courses and sort by date"
        );
        const allResponse = await this.getAllCourses();

        // Extract courses from the response with flexible handling of response structure
        let allCourses = [];
        if (
          allResponse &&
          allResponse.courses &&
          Array.isArray(allResponse.courses)
        ) {
          allCourses = allResponse.courses;
        } else if (Array.isArray(allResponse)) {
          allCourses = allResponse;
        } else if (
          allResponse &&
          allResponse.data &&
          Array.isArray(allResponse.data)
        ) {
          allCourses = allResponse.data;
        }

        // Handle empty courses array
        if (allCourses.length === 0) {
          return { status: true, courses: [] };
        }

        // Filter out duplicates by ID (just in case)
        const uniqueCoursesMap = new Map();
        allCourses.forEach((course: any) => {
          if (course._id && !uniqueCoursesMap.has(course._id)) {
            uniqueCoursesMap.set(course._id, course);
          }
        });

        const uniqueCourses = Array.from(uniqueCoursesMap.values());

        // Sort by creation date (newest first)
        const sortedCourses = uniqueCourses.sort((a: any, b: any) => {
          const dateA = new Date(a.createdAt || "0").getTime();
          const dateB = new Date(b.createdAt || "0").getTime();
          return dateB - dateA; // Newest first
        });

        // Return the requested number of courses
        const recentCourses = sortedCourses.slice(0, limit);

        console.log(
          `Returning ${recentCourses.length} recent courses out of ${uniqueCourses.length} total`
        );

        return {
          status: true,
          courses: recentCourses,
        };
      }
    } catch (error: any) {
      console.error("Error getting recent courses:", error);
      return { status: false, courses: [] };
    }
  }
}

export default new CourseService();
