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
      console.log('=== COURSE UPDATE DEBUG ===');
      console.log('Course ID:', id);
      console.log('Update data structure:', JSON.stringify(data, null, 2));
      console.log('Data keys:', Object.keys(data));
      console.log('Upload structure:', data.upload ? JSON.stringify(data.upload, null, 2) : 'No upload data');
      console.log('Components length:', data.components ? data.components.length : 'No components');
      console.log('Key features length:', data.keyFeatures ? data.keyFeatures.length : 'No key features');
      
      // Try different data formats to see which one works
      try {
        console.log('Trying direct data format...');
        const response = await axiosInstance.put(`/courses/v1/${id}`, data);
        console.log('Update successful with direct format:', response.data);
        return response.data;
      } catch (directError: any) {
        console.log('Direct format failed, trying wrapped format...');
        
        // Try wrapping the data in a 'course' object
        try {
          const wrappedData = { course: data };
          console.log('Trying wrapped data:', JSON.stringify(wrappedData, null, 2));
          const response = await axiosInstance.put(`/courses/v1/${id}`, wrappedData);
          console.log('Update successful with wrapped format:', response.data);
          return response.data;
        } catch (wrappedError: any) {
          console.log('Wrapped format also failed, trying minimal data...');
          
          // Try with only essential fields
          const minimalData = {
            title: data.title,
            categoryId: data.categoryId,
            shortDescription: data.shortDescription,
            description: data.description
          };
          console.log('Trying minimal data:', JSON.stringify(minimalData, null, 2));
          const response = await axiosInstance.put(`/courses/v1/${id}`, minimalData);
          console.log('Update successful with minimal format:', response.data);
          return response.data;
        }
      }
    } catch (error: any) {
      console.error('=== COURSE UPDATE ERROR ===');
      console.error('Course update error:', error.message);
      
      // Log more detailed error information
      if (error.response) {
        console.error('Error response status:', error.response.status);
        console.error('Error response data:', error.response.data);
        console.error('Error response headers:', error.response.headers);
        
        // Try to get more details from the error
        if (error.response.data) {
          console.error('Error message:', error.response.data.message);
          console.error('Error details:', error.response.data.details);
          console.error('Validation errors:', error.response.data.errors);
        }
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Request setup error:', error.message);
      }
      
      console.error('Error config:', error.config);
      console.error('=== END ERROR DEBUG ===');
      
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

  /**
   * Get recent courses with optional limit
   * @param {number} limit - Maximum number of courses to return
   * @returns {Promise<{status: boolean, courses: Course[]}>}
   */
  async getRecentCourses(limit: number = 4) {
    try {
      // First try the dedicated endpoint for recent courses
      try {
        const response = await axiosInstance.get(`/courses/v1/recent?limit=${limit}`);
        return response.data;
      } catch (directError: any) {
        console.log("Direct recent courses endpoint failed:", directError.message);
        
        // Fallback: get all courses and sort manually
        console.log("Using fallback method - fetch all courses and sort by date");
        const allResponse = await this.getAllCourses();
        
        // Extract courses from the response with flexible handling of response structure
        let allCourses = [];
        if (allResponse && allResponse.courses && Array.isArray(allResponse.courses)) {
          allCourses = allResponse.courses;
        } else if (Array.isArray(allResponse)) {
          allCourses = allResponse;
        } else if (allResponse && allResponse.data && Array.isArray(allResponse.data)) {
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
        const sortedCourses = uniqueCourses.sort((a, b) => {
          const dateA = new Date(a.createdAt || a.created || 0).getTime();
          const dateB = new Date(b.createdAt || b.created || 0).getTime();
          return dateB - dateA;
        });
        
        // Return only the requested number of courses
        const recentCourses = sortedCourses.slice(0, limit);
        
        return { 
          status: true, 
          courses: recentCourses 
        };
      }
    } catch (error) {
      console.error("Error getting recent courses:", error);
      return { status: false, courses: [] };
    }
  }
}

export default new CourseService();
