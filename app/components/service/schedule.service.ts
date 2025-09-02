import axiosInstance from "../config/axiosInstance";
import { Schedule } from "../../types/schedule";

/**
 * API response type for schedule endpoints
 * @typedef {Object} ScheduleApiResponse
 * @property {boolean} status - Success status
 * @property {Schedule|Schedule[]} schedules - Single schedule or array of schedules
 */

class ScheduleService {
  /**
   * Get all schedules
   * @returns {Promise<{status: boolean, schedules: Schedule[]}>}
   */
  async getAllSchedules() {
    try {
      // Check if we have a token
      const token = localStorage.getItem('token');
      if (!token) {
        return {
          status: false,
          message: "Authentication required. Please log in again.",
          schedules: []
        };
      }
      
      const response = await axiosInstance.get("/schedules/v1");
      
      // Simply return the response data, let the component handle it
      return response.data;
    } catch (error: any) {
      if (error.response) {
        
        if (error.response.status === 401) {
          return { 
            status: false, 
            message: "Authentication failed. Please log in again.",
            schedules: []
          };
        } else if (error.response.status === 403) {
          return { 
            status: false, 
            message: "Access denied. You don't have permission to view schedules.",
            schedules: []
          };
        } else {
          return { 
            status: false, 
            message: error.response.data?.message || "Error fetching schedules",
            schedules: []
          };
        }
      }
      throw error;
    }
  }

  /**
   * Get schedule by ID
   * @param {string} id - Schedule ID
   * @returns {Promise<{status: boolean, schedule: Schedule}>}
   */
  async getScheduleById(id: string) {
    try {
      
      try {
        // First try the direct endpoint
        const response = await axiosInstance.get(`/schedules/v1/${id}`);
        return response.data;
      } catch (directError) {
        
        // If the direct endpoint fails, use fallback method
        const allResponse = await this.getAllSchedules();
        
        // Handle different response formats
        let schedules = [];
        
        if (allResponse.schedules && Array.isArray(allResponse.schedules)) {
          schedules = allResponse.schedules;
        } else if (Array.isArray(allResponse)) {
          schedules = allResponse;
        } else if (allResponse.data && Array.isArray(allResponse.data)) {
          schedules = allResponse.data;
        }
        
        // Find the schedule with matching ID
        const foundSchedule = schedules.find((schedule: any) => schedule._id === id);
        
        if (foundSchedule) {
          return { status: true, schedule: foundSchedule };
        }
        
        // If we couldn't find it, return a not found error
        return { status: false, message: `Schedule not found with ID: ${id}` };
      }
    } catch (error: any) {
      
      if (error.response) {
        return { 
          status: false, 
          message: error.response.data?.message || `Error fetching schedule with ID: ${id}`
        };
      }
      
      throw error;
    }
  }

  /**
   * Get schedules by course ID
   * @param {string} courseId - Course ID
   * @returns {Promise<{status: boolean, schedules: Schedule[]}>}
   */
  async getSchedulesByCourseId(courseId: string) {
    try {
      // Try to get all schedules and filter by courseId
      const allResponse = await this.getAllSchedules();
      
      let schedules = [];
      if (allResponse.schedules && Array.isArray(allResponse.schedules)) {
        schedules = allResponse.schedules;
      } else if (Array.isArray(allResponse)) {
        schedules = allResponse;
      } else if (allResponse.data && Array.isArray(allResponse.data)) {
        schedules = allResponse.data;
      }
      
      // Filter by courseId
      const filteredSchedules = schedules.filter(
        (schedule: any) => schedule.courseId === courseId
      );
      
      return { status: true, schedules: filteredSchedules };
    } catch (error: any) {
      if (error.response) {
        return { status: false, message: error.response.data?.message || "Error fetching schedules" };
      }
      throw error;
    }
  }

  /**
   * Create a new schedule
   * @param {ScheduleFormData} data - Schedule data
   * @returns {Promise<{status: boolean, schedule: Schedule}>}
   */
  async createSchedule(data: any) {
    try {
      const response = await axiosInstance.post("/schedules/v1", data);
      
      // Format the response if needed
      if (response.data && !response.data.status && response.data._id) {
        return { status: true, schedule: response.data };
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
   * Update an existing schedule
   * @param {string} id - Schedule ID
   * @param {Partial<ScheduleFormData>} data - Updated schedule data
   * @returns {Promise<{status: boolean, schedule: Schedule}>}
   */
  async updateSchedule(id: string, data: any) {
    try {
      
      const response = await axiosInstance.put(`/schedules/v1/${id}`, data);
      
      // Format the response if needed
      if (response.data) {
        // Check if we got a standard response format
        if (response.data.schedule && response.data.status === true) {
          return response.data;
        }
        
        // Check if we got a direct object response with the correct ID
        if (response.data._id === id) {
          return { status: true, schedule: response.data };
        }
        
        // Check if the response is in a nested data property
        if (response.data.data && response.data.data._id === id) {
          return { status: true, schedule: response.data.data };
        }
        
        // If we can't determine a specific pattern but got a response object,
        // return it and let the component handle it
        return { status: true, schedule: response.data };
      }
      
      // If the response is empty, try to fetch the updated schedule
      return await this.getScheduleById(id);
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
   * Delete a schedule
   * @param {string} id - Schedule ID
   * @returns {Promise<{status: boolean, message: string}>}
   */
  async deleteSchedule(id: string) {
    try {
      const response = await axiosInstance.delete(`/schedules/v1/${id}`);
      
      // Format the response consistently
      if (response.data) {
        if (response.data.status) {
          return response.data;
        } else if (response.data._id) {
          // If we get back the schedule object directly
          return { status: true, message: "Schedule deleted successfully", schedule: response.data };
        } else {
          // Generic success response
          return { status: true, message: "Schedule deleted successfully" };
        }
      }
      
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return { 
          status: false, 
          message: error.response.data?.message || "Error deleting schedule"
        };
      }
      throw error;
    }
  }

  /**
   * Toggle schedule active status
   * @param {string} id - Schedule ID
   * @param {boolean} isActive - New active status
   * @returns {Promise<{status: boolean, schedule: Schedule}>}
   */
  async updateScheduleStatus(id: string, isActive: boolean) {
    try {
      const response = await axiosInstance.put(`/schedules/v1/${id}/active`, {
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
   * Restore a deleted schedule
   * @param {string} id - Schedule ID
   * @returns {Promise<{status: boolean, schedule: Schedule}>}
   */
  async restoreSchedule(id: string) {
    try {
      
      // Try different endpoint format (with and without hyphen)
      try {
        const response = await axiosInstance.put(`/schedules/v1/${id}/undo-delete`);
        
        // Format the response consistently regardless of the backend format
        if (response.data) {
          if (response.data.status && response.data.schedule) {
            return response.data;
          } else if (response.data._id) {
            return { status: true, schedule: response.data };
          } else {
            return { status: true, message: "Schedule restored successfully" };
          }
        }
        
        return response.data;
      } catch (primaryError: any) {
        
        // Try alternative endpoint without hyphen (undodelete)
        try {
          const altResponse = await axiosInstance.put(`/schedules/v1/${id}/undodelete`);
          
          if (altResponse.data) {
            if (altResponse.data.status && altResponse.data.schedule) {
              return altResponse.data;
            } else if (altResponse.data._id) {
              return { status: true, schedule: altResponse.data };
            } else {
              return { status: true, message: "Schedule restored successfully" };
            }
          }
          
          return altResponse.data;
        } catch (secondaryError: any) {
          throw primaryError; // Throw the original error
        }
      }
    } catch (error: any) {
      if (error.response) {
        return { 
          status: false, 
          message: error.response.data?.message || "Error restoring schedule"
        };
      }
      throw error;
    }
  }
}

export default new ScheduleService(); 