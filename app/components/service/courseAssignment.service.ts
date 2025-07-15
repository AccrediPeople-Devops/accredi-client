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
}

export default new CourseAssignmentService(); 