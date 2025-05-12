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
      
      // Skip the direct endpoint call that was causing 404 errors
      // and go straight to fetching all courses and finding the matching one
      console.log("CourseService: Using fallback method - fetch all courses");
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
      
      // Return a not found error if we couldn't find the course
      return { 
        status: false, 
        message: `Course not found with ID: ${id}`
      };
    } catch (error: any) {
      console.error("CourseService: Error fetching course:", error);
      
      // Return a structured error
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
      try {
        // First try the direct endpoint
        const response = await axiosInstance.get(`/courses/v1/category/${categoryId}`);
        return response.data;
      } catch (directError: any) {
        console.log("Direct category endpoint failed:", directError.message);
        
        // Fallback: get all courses and filter by category
        console.log("Using fallback method - fetch all courses and filter by category");
        const allResponse = await this.getAllCourses();
        
        let allCourses = [];
        if (allResponse && allResponse.courses && Array.isArray(allResponse.courses)) {
          allCourses = allResponse.courses;
        } else if (Array.isArray(allResponse)) {
          allCourses = allResponse;
        } else if (allResponse && allResponse.data && Array.isArray(allResponse.data)) {
          allCourses = allResponse.data;
        }
        
        // Log the first course to see its structure
        if (allCourses.length > 0) {
          console.log("First course structure:", JSON.stringify(allCourses[0], null, 2));
        }
        
        // Filter courses by categoryId
        const filteredCourses = allCourses.filter((course: any) => {
          // Check different possible field names for the category ID
          return (
            course.categoryId === categoryId || 
            course.category === categoryId ||
            (course.category && course.category._id === categoryId) ||
            (course.categoryDetails && course.categoryDetails._id === categoryId)
          );
        });
        
        console.log(`Found ${filteredCourses.length} courses for category ${categoryId}`);
        return { 
          status: true, 
          courses: filteredCourses 
        };
      }
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
      console.log('Updating course with ID:', id);
      console.log('Update data:', JSON.stringify(data, null, 2));
      
      // Try multiple endpoint formats and HTTP methods
      try {
        console.log('Trying PUT to /courses/v1/update/{id}');
        const response = await axiosInstance.put(`/courses/v1/update/${id}`, data);
        return response.data;
      } catch (firstError) {
        console.log('First attempt failed, trying standard PUT...');
        try {
          console.log('Trying PUT to /courses/v1/{id}');
          const response = await axiosInstance.put(`/courses/v1/${id}`, data);
          return response.data;
        } catch (secondError) {
          console.log('Second attempt failed, trying with course wrapper...');
          try {
            console.log('Trying PUT with course wrapper');
            const response = await axiosInstance.put(`/courses/v1/${id}`, { course: data });
            return response.data;
          } catch (thirdError) {
            console.log('Third attempt failed, trying POST method...');
            // Try POST method as some APIs use POST for updates
            const response = await axiosInstance.post(`/courses/v1/${id}/update`, data);
            return response.data;
          }
        }
      }
    } catch (error: any) {
      console.error('Course update error:', error);
      
      // Log more detailed error information
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
      }
      
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

  /**
   * Check if a category has associated courses
   * @param {string} categoryId - Category ID
   * @returns {Promise<boolean>}
   */
  async hasCoursesByCategory(categoryId: string) {
    try {
      const response = await this.getCoursesByCategory(categoryId);
      return response && response.courses && response.courses.length > 0;
    } catch (error) {
      console.error("Error checking if category has courses:", error);
      return false;
    }
  }

  /**
   * Count courses by category
   * @param {string} categoryId - Category ID
   * @returns {Promise<number>}
   */
  async countCoursesByCategory(categoryId: string) {
    try {
      const response = await this.getCoursesByCategory(categoryId);
      return response && response.courses ? response.courses.length : 0;
    } catch (error) {
      console.error("Error counting courses by category:", error);
      return 0;
    }
  }
}

export default new CourseService();
