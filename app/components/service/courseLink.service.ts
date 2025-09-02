import axiosInstance from "../config/axiosInstance";
import { CourseLink } from "../../types/courseLink";

/**
 * API response type for course link endpoints
 * @typedef {Object} CourseLinkApiResponse
 * @property {boolean} status - Success status
 * @property {CourseLink|CourseLink[]} courseLinks - Single course link or array of course links
 */

class CourseLinkService {
  /**
   * Get all course links
   * @returns {Promise<{status: boolean, courseLinks: CourseLink[]}>}
   */
  async getAllCourseLinks() {
    try {
      const response = await axiosInstance.get("/course-links/v1");
      
      // Format the response based on different possible formats
      if (response.data) {
        // Check if the response is a direct array
        if (Array.isArray(response.data)) {
          return { status: true, courseLinks: response.data };
        }
        
        // Check if using standard format with courseLinks array
        if (response.data.courseLinks && Array.isArray(response.data.courseLinks)) {
          return response.data;
        }
        
        // Check if the data is in a nested data property
        if (response.data.data && Array.isArray(response.data.data)) {
          return { status: true, courseLinks: response.data.data };
        }
      }
      
      // If we couldn't find course links in any expected format, return empty array
      return { status: true, courseLinks: [] };
    } catch (error: any) {
      if (error.response) {
        return { 
          status: false, 
          message: error.response.data?.message || "Error fetching course links",
          courseLinks: []
        };
      }
      throw error;
    }
  }

  /**
   * Get course link by ID
   * @param {string} id - Course Link ID
   * @returns {Promise<{status: boolean, courseLink: CourseLink}>}
   */
  async getCourseLinkById(id: string) {
    try {
      
      // Skip the direct endpoint call and go straight to fetching all course links
      
      const allResponse = await this.getAllCourseLinks();
      
      // Handle different response formats
      let courseLinks = [];
      
      if (allResponse.courseLinks && Array.isArray(allResponse.courseLinks)) {
        courseLinks = allResponse.courseLinks;
      } else if (Array.isArray(allResponse)) {
        courseLinks = allResponse;
      } else if (allResponse.data && Array.isArray(allResponse.data)) {
        courseLinks = allResponse.data;
      }
      
      // Find the course link with matching ID
      const foundCourseLink = courseLinks.find((courseLink: any) => courseLink._id === id);
      
      if (foundCourseLink) {
        return { status: true, courseLink: foundCourseLink };
      }
      
      // If we couldn't find it, return a not found error
      return { status: false, message: `Course link not found with ID: ${id}` };
    } catch (error: any) {
      
      if (error.response) {
        return { 
          status: false, 
          message: error.response.data?.message || `Error fetching course link with ID: ${id}`
        };
      }
      
      throw error;
    }
  }

  /**
   * Get course links by course ID
   * @param {string} courseId - Course ID
   * @returns {Promise<{status: boolean, courseLinks: CourseLink[]}>}
   */
  async getCourseLinksByCourseId(courseId: string) {
    try {
      const response = await axiosInstance.get(`/course-links/v1/course/${courseId}`);
      // Format the response if needed
      if (response.data && Array.isArray(response.data)) {
        return { status: true, courseLinks: response.data };
      }
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return { status: false, message: error.response.data?.message || "Error fetching course links" };
      }
      throw error;
    }
  }

  /**
   * Create a new course link
   * @param {CourseLinkFormData} data - Course link data
   * @returns {Promise<{status: boolean, courseLink: CourseLink}>}
   */
  async createCourseLink(data: any) {
    try {
      const response = await axiosInstance.post("/course-links/v1", data);
      
      // Format the response if needed
      if (response.data && !response.data.status && response.data._id) {
        return { status: true, courseLink: response.data };
      }
      
      return response.data;
    } catch (error: any) {
      if (error.response) {
        // Return the error message from the server if available
        return { 
          status: false, 
          message: error.response.data?.message || "Server error. Please try again."
        };
      }
      throw error;
    }
  }

  /**
   * Update an existing course link
   * @param {string} id - Course Link ID
   * @param {Partial<CourseLinkFormData>} data - Updated course link data
   * @returns {Promise<{status: boolean, courseLink: CourseLink}>}
   */
  async updateCourseLink(id: string, data: any) {
    try {
      
      const response = await axiosInstance.put(`/course-links/v1/${id}`, data);
      
      // Format the response if needed
      if (response.data) {
        // Check if we got a standard response format
        if (response.data.courseLink && response.data.status === true) {
          return response.data;
        }
        
        // Check if we got a direct object response with the correct ID
        if (response.data._id === id) {
          return { status: true, courseLink: response.data };
        }
        
        // Check if the response is in a nested data property
        if (response.data.data && response.data.data._id === id) {
          return { status: true, courseLink: response.data.data };
        }
        
        // If we can't determine a specific pattern but got a response object,
        // return it and let the component handle it
        return { status: true, courseLink: response.data };
      }
      
      // If the response is empty, try to fetch the updated course link
      return await this.getCourseLinkById(id);
    } catch (error: any) {
      if (error.response) {
        
        // Return the error message from the server if available
        return { 
          status: false, 
          message: error.response.data?.message || "Server error. Please try again."
        };
      }
      throw error;
    }
  }

  /**
   * Delete a course link
   * @param {string} id - Course Link ID
   * @returns {Promise<{status: boolean, message: string}>}
   */
  async deleteCourseLink(id: string) {
    try {
      const response = await axiosInstance.delete(`/course-links/v1/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return { 
          status: false, 
          message: error.response.data?.message || "Error deleting course link"
        };
      }
      throw error;
    }
  }

  /**
   * Toggle course link active status
   * @param {string} id - Course Link ID
   * @param {boolean} isActive - New active status
   * @returns {Promise<{status: boolean, courseLink: CourseLink}>}
   */
  async updateCourseLinkStatus(id: string, isActive: boolean) {
    try {
      const response = await axiosInstance.put(`/course-links/v1/${id}/active`, {
        isActive,
      });
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return { 
          status: false, 
          message: error.response.data?.message || "Error updating status"
        };
      }
      throw error;
    }
  }

  /**
   * Restore a deleted course link
   * @param {string} id - Course Link ID
   * @returns {Promise<{status: boolean, courseLink: CourseLink}>}
   */
  async restoreCourseLink(id: string) {
    try {
      
      // Skip direct endpoint and go straight to update approach
      const allResponse = await this.getAllCourseLinks();
      let courseLinks = [];
      
      if (allResponse.courseLinks && Array.isArray(allResponse.courseLinks)) {
        courseLinks = allResponse.courseLinks;
      } else if (Array.isArray(allResponse)) {
        courseLinks = allResponse;
      } else if (allResponse.data && Array.isArray(allResponse.data)) {
        courseLinks = allResponse.data;
      }
      
      const foundCourseLink = courseLinks.find((courseLink: any) => courseLink._id === id);
      
      if (foundCourseLink) {
        // Update just the isDeleted property
        const updateResponse = await axiosInstance.put(`/course-links/v1/${id}`, {
          ...foundCourseLink,
          isDeleted: false
        });
        return updateResponse.data;
      } else {
        return { 
          status: false, 
          message: `Course link not found with ID: ${id}`
        };
      }
    } catch (error: any) {
      if (error.response) {
        return { 
          status: false, 
          message: error.response.data?.message || "Error restoring course link"
        };
      }
      throw error;
    }
  }
}

export default new CourseLinkService(); 