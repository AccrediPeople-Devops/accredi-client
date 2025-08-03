import axiosInstance from "../config/axiosInstance";

interface CourseAssignmentData {
  userId: string;
  courseId: string;
  scheduleId: string;
}

interface CourseAssignmentResponse {
  success: boolean;
  message: string;
  data?: any;
}

class CourseAssignmentService {
  /**
   * Manually assign a course to a user
   * @param {CourseAssignmentData} data - Course assignment data
   * @returns {Promise<CourseAssignmentResponse>}
   */
  async assignCourseToUser(data: CourseAssignmentData): Promise<CourseAssignmentResponse> {
    try {
      console.log("CourseAssignmentService: Assigning course to user:", data);
      
      // Check if we have a token
      const token = localStorage.getItem('token');
      if (!token) {
        console.error("CourseAssignmentService: No authentication token found");
        return {
          success: false,
          message: "Authentication required. Please log in again."
        };
      }
      
      console.log("CourseAssignmentService: Using token:", token.substring(0, 20) + "...");
      
      const response = await axiosInstance.post("/users/v1/manually-assign-course", data);
      
      console.log("CourseAssignmentService: Assignment successful:", response.data);
      
      return {
        success: true,
        message: response.data?.message || "Course assigned successfully",
        data: response.data
      };
    } catch (error: any) {
      console.error("CourseAssignmentService: Error assigning course:", error);
      
      let errorMessage = 'An error occurred while assigning the course. Please try again.';
      
      if (error.response) {
        // Server responded with error status
        console.error('CourseAssignmentService: Response error:', error.response.data);
        console.error('CourseAssignmentService: Response status:', error.response.status);
        
        if (error.response.status === 401) {
          errorMessage = "Authentication failed. Please log in again.";
        } else if (error.response.status === 403) {
          errorMessage = "Access denied. You don't have permission to assign courses.";
        } else if (error.response.status === 404) {
          errorMessage = "Course assignment endpoint not found. Please contact support.";
        } else if (error.response.status === 400) {
          errorMessage = error.response.data?.message || "Invalid data provided. Please check your selection.";
        } else {
          errorMessage = error.response.data?.message || 
                       error.response.data?.error || 
                       `Server error (${error.response.status}). Please try again.`;
        }
      } else if (error.request) {
        // Request was made but no response received
        console.error('CourseAssignmentService: No response received:', error.request);
        errorMessage = 'Network error. Please check your connection and try again.';
      } else {
        // Something else happened
        console.error('CourseAssignmentService: Request setup error:', error.message);
        errorMessage = error.message || errorMessage;
      }
      
      return {
        success: false,
        message: errorMessage
      };
    }
  }

  /**
   * Get user's assigned courses
   * @param {string} userId - User ID
   * @returns {Promise<any>}
   */
  async getUserAssignedCourses(userId: string) {
    try {
      console.log("CourseAssignmentService: Fetching assigned courses for user:", userId);
      
      // Check if we have a token
      const token = localStorage.getItem('token');
      if (!token) {
        console.error("CourseAssignmentService: No authentication token found");
        return {
          success: true,
          courses: []
        };
      }
      
      const response = await axiosInstance.get(`/users/v1/${userId}/assigned-courses`);
      
      console.log("CourseAssignmentService: Assigned courses response:", response.data);
      
      return response.data;
    } catch (error: any) {
      console.error("CourseAssignmentService: Error fetching assigned courses:", error);
      
      // If the endpoint doesn't exist (404) or other server errors, return empty array
      if (error.response?.status === 404 || error.response?.status >= 500) {
        console.log("API endpoint not available, returning empty array");
        return {
          success: true,
          courses: []
        };
      }
      
      // For authentication errors, return empty array instead of throwing
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.log("Authentication error, returning empty array");
        return {
          success: true,
          courses: []
        };
      }
      
      throw error;
    }
  }

  /**
   * Remove a course from a user
   * @param {string} userId - User ID
   * @param {string} courseId - Course ID to remove
   * @param {string} scheduleId - Schedule ID (optional, can be null for removal)
   * @returns {Promise<CourseAssignmentResponse>}
   */
  async removeCourseFromUser(userId: string, courseId: string, scheduleId?: string): Promise<CourseAssignmentResponse> {
    try {
      console.log("CourseAssignmentService: Removing course from user:", { userId, courseId, scheduleId });
      console.log("CourseAssignmentService: User ID type:", typeof userId);
      console.log("CourseAssignmentService: Course ID type:", typeof courseId);
      console.log("CourseAssignmentService: Schedule ID type:", typeof scheduleId);
      
      // Check if we have a token
      const token = localStorage.getItem('token');
      if (!token) {
        console.error("CourseAssignmentService: No authentication token found");
        return {
          success: false,
          message: "Authentication required. Please log in again."
        };
      }
      
      console.log("CourseAssignmentService: Using token:", token.substring(0, 20) + "...");
      console.log("CourseAssignmentService: Attempting to remove course with endpoint: DELETE /users/v1/manually-remove-course");
      
      const requestData = {
        userId: userId,
        courseId: courseId,
        scheduleId: scheduleId || null // Include scheduleId even if null
      };
      
      // Use the correct endpoint for removing courses - same pattern as POST
      const response = await axiosInstance.delete("/users/v1/manually-remove-course", {
        data: {
          userId: userId,
          courseId: courseId,
          scheduleId: scheduleId || null
        }
      });
      
      console.log("CourseAssignmentService: Course removal successful:", response.data);
      
      return {
        success: true,
        message: response.data?.message || "Course removed successfully",
        data: response.data
      };
    } catch (error: any) {
      console.error("CourseAssignmentService: Error removing course:", error);
      
      let errorMessage = 'An error occurred while removing the course. Please try again.';
      
      if (error.response) {
        // Server responded with error status
        console.error('CourseAssignmentService: Response error:', error.response.data);
        console.error('CourseAssignmentService: Response status:', error.response.status);
        
        if (error.response.status === 401) {
          errorMessage = "Authentication failed. Please log in again.";
        } else if (error.response.status === 403) {
          errorMessage = "Access denied. You don't have permission to remove courses.";
        } else if (error.response.status === 404) {
          errorMessage = "Course removal endpoint not found. Please contact support.";
        } else if (error.response.status === 400) {
          errorMessage = error.response.data?.message || "Invalid data provided. Please check your selection.";
        } else {
          errorMessage = error.response.data?.message || 
                       error.response.data?.error || 
                       `Server error (${error.response.status}). Please try again.`;
        }
      } else if (error.request) {
        // Request was made but no response received
        console.error('CourseAssignmentService: No response received:', error.request);
        errorMessage = 'Network error. Please check your connection and try again.';
      } else {
        // Something else happened
        console.error('CourseAssignmentService: Request setup error:', error.message);
        errorMessage = error.message || errorMessage;
      }
      
      return {
        success: false,
        message: errorMessage
      };
    }
  }
}

export default new CourseAssignmentService(); 